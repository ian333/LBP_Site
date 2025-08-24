#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const execAsync = promisify(exec);

const profiles = [
  'ianvaz18',
  'ricargorres', 
  'angelupv',
  'kikejd'
];

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const fileStream = fs.createWriteStream(filepath);
    await pipeline(Readable.fromWeb(response.body), fileStream);
    return true;
  } catch (error) {
    console.error(`Error descargando imagen: ${error.message}`);
    return false;
  }
}

async function getInstagramData(username) {
  console.log(`\n📱 Obteniendo datos de @${username}...`);
  
  const outputDir = path.join('public/team', username, 'photos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Intentar obtener el HTML de la página
    const curlCommand = `curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" "https://www.instagram.com/${username}/"`;
    
    const { stdout } = await execAsync(curlCommand, { maxBuffer: 10 * 1024 * 1024 });
    
    // Buscar datos JSON en el HTML
    const jsonMatch = stdout.match(/window\._sharedData\s*=\s*({.+?});/);
    
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        const user = data?.entry_data?.ProfilePage?.[0]?.graphql?.user;
        
        if (user) {
          console.log(`✅ Encontrado: ${user.full_name || username}`);
          console.log(`   Followers: ${user.edge_followed_by?.count || 'N/A'}`);
          console.log(`   Posts: ${user.edge_owner_to_timeline_media?.count || 'N/A'}`);
          
          // Extraer posts
          const posts = user.edge_owner_to_timeline_media?.edges || [];
          console.log(`   Procesando ${posts.length} posts...`);
          
          for (let i = 0; i < Math.min(posts.length, 12); i++) {
            const post = posts[i].node;
            const imageUrl = post.display_url || post.thumbnail_src;
            
            if (imageUrl) {
              const filename = `post_${i + 1}.jpg`;
              const filepath = path.join(outputDir, filename);
              
              console.log(`   📸 Descargando post ${i + 1}...`);
              const success = await downloadImage(imageUrl, filepath);
              
              if (success) {
                console.log(`   ✓ ${filename} guardado`);
              }
            }
          }
          
          // Guardar información del perfil
          const profileInfo = {
            username: user.username,
            full_name: user.full_name,
            biography: user.biography,
            followers: user.edge_followed_by?.count,
            following: user.edge_follow?.count,
            posts_count: user.edge_owner_to_timeline_media?.count,
            profile_pic: user.profile_pic_url_hd || user.profile_pic_url,
            posts: posts.slice(0, 12).map((p, i) => ({
              id: p.node.id,
              caption: p.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
              likes: p.node.edge_liked_by?.count || 0,
              comments: p.node.edge_media_to_comment?.count || 0,
              image: `/team/${username}/photos/post_${i + 1}.jpg`
            }))
          };
          
          fs.writeFileSync(
            path.join('public/team', username, 'profile.json'),
            JSON.stringify(profileInfo, null, 2)
          );
          
          return true;
        }
      } catch (parseError) {
        console.log(`⚠️ No se pudo parsear JSON para @${username}`);
      }
    }
    
    // Método alternativo: buscar URLs de imágenes directamente
    console.log('   Intentando método alternativo...');
    
    // Buscar todas las URLs de imágenes en el HTML
    const imageUrls = [];
    const imgRegex = /"display_url":"(https:\/\/[^"]+)"/g;
    let match;
    
    while ((match = imgRegex.exec(stdout)) !== null) {
      imageUrls.push(match[1].replace(/\\u0026/g, '&'));
    }
    
    if (imageUrls.length > 0) {
      console.log(`   Encontradas ${imageUrls.length} imágenes`);
      
      for (let i = 0; i < Math.min(imageUrls.length, 12); i++) {
        const filename = `post_${i + 1}.jpg`;
        const filepath = path.join(outputDir, filename);
        
        console.log(`   📸 Descargando imagen ${i + 1}...`);
        const success = await downloadImage(imageUrls[i], filepath);
        
        if (success) {
          console.log(`   ✓ ${filename} guardado`);
        }
      }
      
      return true;
    }
    
    console.log(`⚠️ No se pudieron obtener imágenes de @${username}`);
    return false;
    
  } catch (error) {
    console.error(`❌ Error con @${username}: ${error.message}`);
    return false;
  }
}

async function tryAlternativeMethod(username) {
  console.log(`\n🔄 Intentando método alternativo para @${username}...`);
  
  try {
    // Intentar con la API de Instagram (sin autenticación)
    const apiUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    
    const curlCommand = `curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -H "X-IG-App-ID: 936619743392459" "${apiUrl}"`;
    
    const { stdout } = await execAsync(curlCommand);
    const data = JSON.parse(stdout);
    
    if (data?.data?.user) {
      const user = data.data.user;
      console.log(`✅ Datos obtenidos via API para @${username}`);
      
      const outputDir = path.join('public/team', username, 'photos');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Descargar foto de perfil
      if (user.profile_pic_url_hd) {
        const profilePicPath = path.join(outputDir, 'profile.jpg');
        await downloadImage(user.profile_pic_url_hd, profilePicPath);
        console.log('   ✓ Foto de perfil descargada');
      }
      
      // Obtener posts si están disponibles
      const media = user.edge_owner_to_timeline_media?.edges || [];
      for (let i = 0; i < Math.min(media.length, 12); i++) {
        const post = media[i].node;
        if (post.display_url) {
          const filename = `post_${i + 1}.jpg`;
          const filepath = path.join(outputDir, filename);
          await downloadImage(post.display_url, filepath);
          console.log(`   ✓ Post ${i + 1} descargado`);
        }
      }
      
      return true;
    }
  } catch (error) {
    console.log(`⚠️ Método alternativo falló: ${error.message}`);
  }
  
  return false;
}

async function main() {
  console.log('🎬 Scraping de perfiles de Instagram del equipo...\n');
  console.log('⚠️ Nota: Instagram tiene protección anti-scraping.');
  console.log('   Algunos perfiles podrían no ser accesibles.\n');
  
  const results = [];
  
  for (const username of profiles) {
    let success = await getInstagramData(username);
    
    if (!success) {
      success = await tryAlternativeMethod(username);
    }
    
    results.push({ username, success });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN:');
  console.log('='.repeat(50));
  
  for (const result of results) {
    console.log(`${result.success ? '✅' : '❌'} @${result.username}`);
  }
  
  console.log('\n💡 Si algún perfil falló, puedes:');
  console.log('1. Usar un navegador para descargar manualmente');
  console.log('2. Usar herramientas especializadas como instaloader');
  console.log('3. Usar las imágenes de ejemplo que ya descargamos');
}

main().catch(console.error);
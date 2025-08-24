#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// Perfiles del equipo
const profiles = [
  { username: 'ianvaz18', name: 'Ian Vaz' },
  { username: 'ricargorres', name: 'Ricardo Gorres' },
  { username: 'angelupv', name: 'Angel UPV' },
  { username: 'kikejd', name: 'Kike JD' }
];

async function downloadInstagramProfile(username) {
  const outputDir = path.join('public/team', username, 'photos');
  
  console.log(`\n📱 Intentando obtener contenido de @${username}...`);
  
  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Nota: Instagram requiere autenticación para acceder a contenido
  // Vamos a usar una aproximación diferente
  console.log(`⚠️ Instagram requiere autenticación. Usando método alternativo...`);
  
  // Crear un archivo de información del perfil
  const profileInfo = {
    username: username,
    profileUrl: `https://instagram.com/${username}`,
    message: "Para obtener el contenido real, necesitas:",
    steps: [
      "1. Usar herramientas como instagram-scraper o instaloader",
      "2. O manualmente descargar las imágenes desde el navegador",
      "3. Colocarlas en la carpeta: " + outputDir
    ]
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'README.md'),
    `# Contenido de @${username}\n\n` +
    `Para obtener las imágenes reales:\n\n` +
    `## Opción 1: Usar instaloader (recomendado)\n` +
    `\`\`\`bash\n` +
    `pip install instaloader\n` +
    `instaloader --dirname-pattern="${outputDir}" --no-videos --no-metadata-json ${username}\n` +
    `\`\`\`\n\n` +
    `## Opción 2: Manual\n` +
    `1. Visita https://instagram.com/${username}\n` +
    `2. Descarga manualmente las imágenes\n` +
    `3. Colócalas en esta carpeta\n`
  );
  
  return profileInfo;
}

async function tryInstaloader() {
  try {
    // Verificar si instaloader está instalado
    await execAsync('which instaloader');
    return true;
  } catch {
    console.log('\n📦 Instaloader no está instalado.');
    console.log('Para instalar: pip install instaloader');
    return false;
  }
}

async function downloadWithInstaloader(username) {
  const outputDir = path.join('public/team', username, 'photos');
  
  try {
    console.log(`📥 Descargando posts de @${username} con instaloader...`);
    
    // Comando para descargar solo las últimas 12 fotos sin videos
    const command = `instaloader --fast-update --no-videos --no-video-thumbnails --no-metadata-json --no-compress-json --no-profile-pic --count=12 --dirname-pattern="${outputDir}" ${username}`;
    
    const { stdout, stderr } = await execAsync(command, { 
      timeout: 60000 // 1 minuto timeout
    });
    
    if (stderr && !stderr.includes('Login required')) {
      console.log(`⚠️ Advertencia: ${stderr}`);
    }
    
    console.log(`✅ Contenido de @${username} descargado`);
    return true;
  } catch (error) {
    console.log(`❌ Error descargando @${username}: ${error.message}`);
    if (error.message.includes('Login required')) {
      console.log('💡 Instagram requiere login para este perfil');
    }
    return false;
  }
}

async function main() {
  console.log('🎬 Descargando contenido REAL de Instagram del equipo Loyal Bliss...\n');
  
  // Verificar si tenemos instaloader
  const hasInstaloader = await tryInstaloader();
  
  if (hasInstaloader) {
    console.log('✅ Instaloader detectado. Intentando descargar contenido...\n');
    
    for (const profile of profiles) {
      const success = await downloadWithInstaloader(profile.username);
      if (!success) {
        await downloadInstagramProfile(profile.username);
      }
    }
  } else {
    console.log('\n📝 Creando estructura de carpetas y guías...');
    
    for (const profile of profiles) {
      await downloadInstagramProfile(profile.username);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📌 INSTRUCCIONES PARA OBTENER EL CONTENIDO REAL:');
    console.log('='.repeat(50));
    console.log('\n1. Instala instaloader:');
    console.log('   pip install instaloader\n');
    console.log('2. Ejecuta este comando para cada perfil:');
    
    for (const profile of profiles) {
      console.log(`   instaloader --count=12 --no-videos ${profile.username}`);
    }
    
    console.log('\n3. O descarga manualmente las imágenes desde el navegador');
    console.log('   y colócalas en las carpetas correspondientes en public/team/\n');
  }
  
  // Crear un script de descarga batch
  const batchScript = `#!/bin/bash
# Script para descargar contenido de Instagram del equipo

echo "📥 Descargando contenido del equipo Loyal Bliss..."

# Instalar instaloader si no está instalado
if ! command -v instaloader &> /dev/null; then
    echo "Instalando instaloader..."
    pip install instaloader
fi

# Descargar contenido de cada perfil
${profiles.map(p => `
echo "Descargando @${p.username}..."
instaloader \\
  --count=12 \\
  --no-videos \\
  --no-video-thumbnails \\
  --no-metadata-json \\
  --no-compress-json \\
  --dirname-pattern="public/team/${p.username}/photos" \\
  ${p.username}
`).join('\n')}

echo "✅ Descarga completada!"
`;

  fs.writeFileSync('download-instagram.sh', batchScript);
  fs.chmodSync('download-instagram.sh', '755');
  
  console.log('💾 Script de descarga creado: download-instagram.sh');
  console.log('   Ejecuta: ./download-instagram.sh\n');
}

main().catch(console.error);
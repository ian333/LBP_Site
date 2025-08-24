#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const TEMP_DIR = path.resolve('_media/original');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// MEGA PACK de imágenes cinematográficas adicionales
const MORE_IMAGES = [
  // Cinematográficas oscuras
  { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', name: 'dark-cinema-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82', name: 'dark-cinema-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0', name: 'dark-cinema-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65', name: 'dark-cinema-4.jpg' },
  
  // Neon y ciudad nocturna
  { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785', name: 'neon-city-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3', name: 'neon-city-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1579546928686-286c9fbde1ec', name: 'neon-city-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1550686041-366ad85a1355', name: 'neon-city-4.jpg' },
  
  // Fashion editorial
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b', name: 'fashion-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', name: 'fashion-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', name: 'fashion-4.jpg' },
  { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae', name: 'fashion-5.jpg' },
  
  // Retratos artísticos
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', name: 'portrait-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', name: 'portrait-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', name: 'portrait-4.jpg' },
  { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04', name: 'portrait-5.jpg' },
  
  // Abstracto y experimental
  { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', name: 'abstract-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1', name: 'abstract-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5', name: 'abstract-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d', name: 'abstract-4.jpg' },
  
  // Naturaleza cinematográfica
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b', name: 'nature-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7', name: 'nature-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', name: 'nature-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e', name: 'nature-4.jpg' },
  
  // Arquitectura moderna
  { url: 'https://images.unsplash.com/photo-1478860409698-8707f313ee8b', name: 'architecture-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2', name: 'architecture-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1448630360428-65456885c650', name: 'architecture-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625', name: 'architecture-4.jpg' },
  
  // Mood oscuro
  { url: 'https://images.unsplash.com/photo-1525824236856-8c0a31dfe3be', name: 'moody-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f', name: 'moody-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b', name: 'moody-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81', name: 'moody-4.jpg' },
  
  // Colores vibrantes
  { url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453', name: 'vibrant-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af', name: 'vibrant-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8', name: 'vibrant-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b', name: 'vibrant-4.jpg' }
];

async function downloadFile(url, destPath) {
  try {
    console.log(`📸 Descargando: ${path.basename(destPath)}...`);
    const finalUrl = `${url}?w=3840&q=85&fm=jpg&fit=max`;
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const fileStream = fs.createWriteStream(destPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);
    
    console.log(`✓ ${path.basename(destPath)} descargado`);
    return true;
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎬 Descargando MEGA PACK de imágenes para Loyal Bliss...\n');
  console.log(`📦 ${MORE_IMAGES.length} imágenes nuevas en camino...\n`);
  
  let downloaded = 0;
  for (const img of MORE_IMAGES) {
    const destPath = path.join(TEMP_DIR, img.name);
    if (!fs.existsSync(destPath)) {
      const success = await downloadFile(img.url, destPath);
      if (success) downloaded++;
    } else {
      console.log(`⏭ ${img.name} ya existe`);
    }
  }
  
  console.log(`\n✨ ¡${downloaded} imágenes nuevas descargadas!`);
  console.log('📁 Ubicación:', TEMP_DIR);
  console.log('\nAhora ejecuta: npm run gen:images');
}

main().catch(console.error);
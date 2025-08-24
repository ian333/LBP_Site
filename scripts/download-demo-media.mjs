#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const MEDIA_DIR = path.resolve('public/media/demo');
const TEMP_DIR = path.resolve('_media/original');

// Crear directorios
[MEDIA_DIR, TEMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Lista curada de imágenes cinematográficas de Unsplash (4K)
const DEMO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1', name: 'cinema-1.jpg', credit: 'Felix Mooneeram' },
  { url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26', name: 'cinema-2.jpg', credit: 'Jeremy Yap' },
  { url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4', name: 'cinema-3.jpg', credit: 'Jake Hills' },
  { url: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0', name: 'cinema-4.jpg', credit: 'Krists Luhaers' },
  { url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1', name: 'cinema-5.jpg', credit: 'Samuel Zeller' },
  { url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728', name: 'cinema-6.jpg', credit: 'Denise Jans' },
  { url: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f', name: 'ocean-1.jpg', credit: 'Cris Tagupa' },
  { url: 'https://images.unsplash.com/photo-1565206077212-4eb48d41f54b', name: 'neon-1.jpg', credit: 'Florian Klauer' },
  { url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814', name: 'portrait-1.jpg', credit: 'Christopher Campbell' },
  { url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368', name: 'fashion-1.jpg', credit: 'Tamara Bellis' }
];

// Videos de demostración (Pexels - enlaces directos)
const DEMO_VIDEOS = [
  { 
    url: 'https://www.pexels.com/download/video/3571264/',
    name: 'ocean-waves.mp4',
    credit: 'Pexels - Taryn Elliott'
  },
  { 
    url: 'https://www.pexels.com/download/video/857195/',
    name: 'city-lights.mp4',
    credit: 'Pexels - Pixabay'
  },
  { 
    url: 'https://www.pexels.com/download/video/2795405/',
    name: 'abstract-motion.mp4',
    credit: 'Pexels - Miguel Á. Padriñán'
  }
];

async function downloadFile(url, destPath) {
  try {
    console.log(`Descargando: ${path.basename(destPath)}...`);
    
    // Agregar parámetros para alta calidad en Unsplash
    const finalUrl = url.includes('unsplash.com') 
      ? `${url}?w=3840&q=85&fm=jpg&fit=max`
      : url;
    
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const fileStream = fs.createWriteStream(destPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);
    
    console.log(`✓ ${path.basename(destPath)} descargado`);
    return true;
  } catch (error) {
    console.error(`✗ Error descargando ${path.basename(destPath)}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎬 Descargando media de demostración para Loyal Bliss...\n');
  
  // Descargar imágenes
  console.log('📸 Descargando imágenes 4K...');
  for (const img of DEMO_IMAGES) {
    const destPath = path.join(TEMP_DIR, img.name);
    if (!fs.existsSync(destPath)) {
      await downloadFile(img.url, destPath);
    } else {
      console.log(`⏭ ${img.name} ya existe, saltando...`);
    }
  }
  
  // Descargar videos (opcional, son más pesados)
  console.log('\n🎥 Descargando videos de muestra...');
  console.log('(Nota: Los videos pueden tardar más en descargar)');
  
  for (const video of DEMO_VIDEOS) {
    const destPath = path.join(MEDIA_DIR, video.name);
    if (!fs.existsSync(destPath)) {
      await downloadFile(video.url, destPath);
    } else {
      console.log(`⏭ ${video.name} ya existe, saltando...`);
    }
  }
  
  // Crear archivo de créditos
  const credits = [
    '# Créditos de Media de Demostración\n',
    '## Imágenes (Unsplash License)',
    ...DEMO_IMAGES.map(img => `- ${img.name}: ${img.credit}`),
    '\n## Videos (Pexels License)',
    ...DEMO_VIDEOS.map(vid => `- ${vid.name}: ${vid.credit}`),
    '\n---',
    'Todas las imágenes y videos son de uso gratuito.',
    'Reemplázalos con tu contenido original.'
  ].join('\n');
  
  fs.writeFileSync(path.join(MEDIA_DIR, 'CREDITS.md'), credits);
  
  console.log('\n✨ ¡Media de demostración lista!');
  console.log(`📁 Imágenes en: ${TEMP_DIR}`);
  console.log(`📁 Videos en: ${MEDIA_DIR}`);
  console.log('\nAhora ejecuta: npm run gen:images');
}

main().catch(console.error);
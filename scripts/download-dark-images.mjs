#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const DARK_DIR = path.resolve('public/dark');

if (!fs.existsSync(DARK_DIR)) {
  fs.mkdirSync(DARK_DIR, { recursive: true });
}

// Imágenes dark cinematográficas específicas
const DARK_CINEMATIC_IMAGES = [
  // Noir/Dark atmosphere
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176', name: 'dark-cinema-noir-1.jpg', desc: 'Silhouette noir' },
  { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b', name: 'dark-studio-1.jpg', desc: 'Dark studio' },
  { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f', name: 'dark-moody-1.jpg', desc: 'Moody lighting' },
  { url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c873', name: 'dark-shadows-1.jpg', desc: 'Deep shadows' },
  
  // Behind the scenes dark
  { url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a', name: 'bts-dark-1.jpg', desc: 'BTS dark shoot' },
  { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', name: 'camera-dark-1.jpg', desc: 'Camera in shadows' },
  { url: 'https://images.unsplash.com/photo-1606933248051-5ce88adc6cf8', name: 'lighting-dark-1.jpg', desc: 'Dark lighting setup' },
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176', name: 'director-dark-1.jpg', desc: 'Director silhouette' },
  
  // Neon/cyberpunk vibes
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176', name: 'neon-dark-1.jpg', desc: 'Neon in darkness' },
  { url: 'https://images.unsplash.com/photo-1565438336185-61240e2d8fc3', name: 'neon-dark-2.jpg', desc: 'Cyberpunk mood' },
  { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', name: 'abstract-dark-1.jpg', desc: 'Dark abstract' },
  { url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1', name: 'smoke-dark-1.jpg', desc: 'Smoke and shadows' },
  
  // Equipment shots
  { url: 'https://images.unsplash.com/photo-1606933248051-5ce88adc6cf8', name: 'arri-dark-1.jpg', desc: 'ARRI in darkness' },
  { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', name: 'red-camera-dark.jpg', desc: 'RED camera' },
  { url: 'https://images.unsplash.com/photo-1559056199-5a47f60c5053', name: 'lens-dark-1.jpg', desc: 'Cinema lens' },
  { url: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea', name: 'gimbal-dark-1.jpg', desc: 'Gimbal shot' },
  
  // Atmospheric shots
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b', name: 'atmosphere-dark-1.jpg', desc: 'Dark atmosphere' },
  { url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7', name: 'fog-dark-1.jpg', desc: 'Fog and mystery' },
  { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', name: 'mountain-dark-1.jpg', desc: 'Dark landscape' },
  { url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e', name: 'urban-dark-1.jpg', desc: 'Urban darkness' },
  
  // Portraits dark/moody
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', name: 'portrait-dark-1.jpg', desc: 'Moody portrait' },
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', name: 'portrait-dark-2.jpg', desc: 'Dramatic lighting' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', name: 'portrait-dark-3.jpg', desc: 'Shadow play' },
  { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04', name: 'portrait-dark-4.jpg', desc: 'Low key portrait' },
  
  // Film grain/texture
  { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91', name: 'grain-dark-1.jpg', desc: 'Film grain texture' },
  { url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279', name: 'texture-dark-1.jpg', desc: 'Dark texture' },
  { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0', name: 'abstract-texture-1.jpg', desc: 'Abstract dark' },
  { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d', name: 'motion-dark-1.jpg', desc: 'Motion in dark' },
  
  // More atmospheric
  { url: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b', name: 'cinematic-dark-1.jpg', desc: 'Cinematic mood' },
  { url: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8', name: 'color-dark-1.jpg', desc: 'Color in darkness' },
  { url: 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af', name: 'vibrant-dark-1.jpg', desc: 'Vibrant dark' },
  { url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453', name: 'mood-dark-1.jpg', desc: 'Dark mood' }
];

async function downloadFile(url, destPath) {
  try {
    console.log(`🎬 Descargando: ${path.basename(destPath)}`);
    const finalUrl = url.includes('unsplash.com') 
      ? `${url}?w=4000&q=90&fm=jpg&fit=max&auto=format`
      : url;
    
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
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
  console.log('🎭 Descargando imágenes DARK cinematográficas...\n');
  console.log(`📦 ${DARK_CINEMATIC_IMAGES.length} imágenes dark en camino...\n`);
  
  let downloaded = 0;
  for (const img of DARK_CINEMATIC_IMAGES) {
    const destPath = path.join(DARK_DIR, img.name);
    if (!fs.existsSync(destPath)) {
      const success = await downloadFile(img.url, destPath);
      if (success) downloaded++;
    } else {
      console.log(`⏭ ${img.name} ya existe`);
    }
  }
  
  // Crear catálogo de imágenes dark
  const darkCatalog = DARK_CINEMATIC_IMAGES.map((img, index) => ({
    id: `dark-${index + 1}`,
    filename: img.name,
    path: `/dark/${img.name}`,
    description: img.desc,
    category: img.name.includes('neon') ? 'neon' :
              img.name.includes('portrait') ? 'portrait' :
              img.name.includes('bts') ? 'bts' :
              img.name.includes('camera') ? 'equipment' : 'atmospheric'
  }));
  
  fs.writeFileSync(
    path.join(DARK_DIR, 'catalog.json'),
    JSON.stringify(darkCatalog, null, 2)
  );
  
  console.log(`\n🎭 ¡${downloaded} imágenes DARK descargadas!`);
  console.log('📁 Ubicación:', DARK_DIR);
  console.log('📋 Catálogo creado: dark/catalog.json');
  console.log('\n🎨 Categorías disponibles:');
  console.log('  • Neon/Cyberpunk');
  console.log('  • Portraits Dark');
  console.log('  • Behind The Scenes');
  console.log('  • Equipment');
  console.log('  • Atmospheric');
}

main().catch(console.error);
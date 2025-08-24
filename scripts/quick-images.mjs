#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('_media/original');
const OUT_DIR = path.resolve('public/media/images');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function processImage(file) {
  const srcPath = path.join(SRC_DIR, file);
  const baseName = path.parse(file).name;
  
  try {
    console.log(`📸 ${file}`);
    const image = sharp(srcPath, { failOn: 'none' });
    
    // Solo generar cover (1200px) y thumb (400px) en WebP
    const coverPath = path.join(OUT_DIR, `${baseName}-cover.webp`);
    const thumbPath = path.join(OUT_DIR, `${baseName}-thumb.webp`);
    
    // Cover
    if (!fs.existsSync(coverPath)) {
      await image
        .clone()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(coverPath);
    }
    
    // Thumbnail
    if (!fs.existsSync(thumbPath)) {
      await image
        .clone()
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(thumbPath);
    }
    
    console.log(`✓ ${baseName} listo`);
    return true;
    
  } catch (error) {
    console.error(`✗ Error con ${file}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Generación rápida de imágenes (solo cover y thumb)...\n');
  
  const files = fs.readdirSync(SRC_DIR).filter(f => 
    /\.(jpe?g|png|webp|tiff?)$/i.test(f)
  );
  
  console.log(`Procesando ${files.length} imágenes...\n`);
  
  let processed = 0;
  for (const file of files) {
    const success = await processImage(file);
    if (success) processed++;
  }
  
  console.log(`\n✨ ${processed}/${files.length} imágenes procesadas`);
  console.log(`📁 Guardadas en: ${OUT_DIR}`);
}

main().catch(console.error);
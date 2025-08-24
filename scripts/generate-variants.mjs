#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('_media/original');
const OUT_DIR = path.resolve('public/media/images');
const SIZES = [400, 800, 1200, 1600, 2400];
const FORMATS = ['webp', 'avif'];

// Crear directorios
[SRC_DIR, OUT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function generatePlaceholder(imagePath) {
  const image = sharp(imagePath);
  const { data, info } = await image
    .resize(20, 20, { fit: 'inside' })
    .blur()
    .webp({ quality: 20 })
    .toBuffer({ resolveWithObject: true });
  
  return `data:image/webp;base64,${data.toString('base64')}`;
}

async function processImage(file) {
  const srcPath = path.join(SRC_DIR, file);
  const baseName = path.parse(file).name;
  
  try {
    console.log(`Procesando: ${file}`);
    const image = sharp(srcPath, { failOn: 'none' });
    const metadata = await image.metadata();
    
    // Generar placeholder
    const placeholder = await generatePlaceholder(srcPath);
    
    // Info para el catálogo
    const imageInfo = {
      id: baseName,
      original: file,
      width: metadata.width,
      height: metadata.height,
      orientation: metadata.width > metadata.height ? 'landscape' : 'portrait',
      placeholder,
      variants: {}
    };
    
    // Generar variantes para cada tamaño y formato
    for (const format of FORMATS) {
      imageInfo.variants[format] = {};
      
      for (const width of SIZES) {
        // No generar si el ancho es mayor que el original
        if (width > metadata.width) continue;
        
        const outputName = `${baseName}-${width}w.${format}`;
        const outputPath = path.join(OUT_DIR, outputName);
        
        // Configuración de calidad según formato
        const options = format === 'webp' 
          ? { quality: 82, effort: 4 }
          : { quality: 80, effort: 6 }; // AVIF
        
        await image
          .clone()
          .resize({ width, withoutEnlargement: true })
          .toFormat(format, options)
          .toFile(outputPath);
        
        imageInfo.variants[format][width] = `/media/images/${outputName}`;
      }
    }
    
    // Generar versión de portada (1200px WebP)
    const coverPath = path.join(OUT_DIR, `${baseName}-cover.webp`);
    await image
      .clone()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(coverPath);
    
    imageInfo.cover = `/media/images/${baseName}-cover.webp`;
    
    // Generar thumbnail (400px WebP)
    const thumbPath = path.join(OUT_DIR, `${baseName}-thumb.webp`);
    await image
      .clone()
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath);
    
    imageInfo.thumb = `/media/images/${baseName}-thumb.webp`;
    
    console.log(`✓ ${file} procesado (${metadata.width}x${metadata.height})`);
    return imageInfo;
    
  } catch (error) {
    console.error(`✗ Error procesando ${file}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🎨 Generando variantes de imágenes...\n');
  
  // Obtener lista de imágenes
  const files = fs.readdirSync(SRC_DIR).filter(f => 
    /\.(jpe?g|png|webp|tiff?)$/i.test(f)
  );
  
  if (files.length === 0) {
    console.log('⚠️ No se encontraron imágenes en', SRC_DIR);
    console.log('Primero ejecuta: npm run download:media');
    return;
  }
  
  console.log(`Encontradas ${files.length} imágenes\n`);
  
  // Procesar todas las imágenes
  const catalog = [];
  for (const file of files) {
    const info = await processImage(file);
    if (info) catalog.push(info);
  }
  
  // Guardar catálogo JSON
  const catalogPath = path.join(OUT_DIR, 'catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
  
  // Resumen
  console.log('\n📊 Resumen:');
  console.log(`✓ ${catalog.length} imágenes procesadas`);
  console.log(`✓ ${SIZES.length} tamaños generados por imagen`);
  console.log(`✓ ${FORMATS.length} formatos (WebP + AVIF)`);
  console.log(`✓ Catálogo guardado en: ${catalogPath}`);
  
  // Calcular tamaño total
  const totalSize = fs.readdirSync(OUT_DIR)
    .filter(f => f !== 'catalog.json')
    .reduce((acc, file) => {
      const stats = fs.statSync(path.join(OUT_DIR, file));
      return acc + stats.size;
    }, 0);
  
  console.log(`✓ Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n✨ ¡Variantes generadas con éxito!');
}

main().catch(console.error);
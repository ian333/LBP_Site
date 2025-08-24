# Loyal Bliss Productions 🎬

Portfolio cinematográfico ultra-rápido con Astro + React + Tailwind.

## 🚀 Setup Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Descargar media de demo (imágenes 4K + videos)
npm run download:media

# 3. Generar variantes optimizadas
npm run gen:images

# 4. Iniciar desarrollo
npm run dev
```

Abre http://localhost:4321

## 📁 Estructura

```
loyalbliss/
├── src/
│   ├── pages/          # Rutas (index, work, team, contact)
│   ├── components/     # React components (Hero, ProjectGrid)
│   ├── layouts/        # Base layout con meta tags
│   └── styles/         # CSS global
├── public/
│   └── media/          # Imágenes y videos
├── scripts/
│   ├── download-demo-media.mjs   # Descarga media de prueba
│   └── generate-variants.mjs     # Genera WebP/AVIF optimizados
└── _media/
    └── original/       # Tus imágenes originales van aquí
```

## 🎨 Personalización

### Cambiar colores (tailwind.config.mjs)
```js
colors: {
  coal: '#0a0a0a',    // Fondo
  bone: '#faf8f6',    // Texto
  gold: '#d4af37',    // Acento
  wine: '#722f37'     // Acento alternativo
}
```

### Agregar tus imágenes
1. Coloca JPG/PNG en `_media/original/`
2. Ejecuta `npm run gen:images`
3. Las variantes aparecen en `public/media/images/`

### WhatsApp
Cambia el número en todos los archivos:
- `src/pages/index.astro`
- `src/pages/contact.astro`
- `src/components/Hero.jsx`

## 🏗️ Build para producción

```bash
npm run build
npm run preview  # Test local del build
```

La carpeta `dist/` está lista para deploy.

## 🚀 Deploy

### Opción 1: Local (Raspberry Pi)
```bash
# En tu Raspberry con Nginx
scp -r dist/* pi@192.168.1.100:/var/www/loyalbliss
```

### Opción 2: Cloudflare Pages (gratis)
1. Push a GitHub
2. Conecta en Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`

## 📊 Performance

- Lighthouse Score: 95+
- First Load: < 1MB
- LCP: < 2s
- CLS: < 0.05

## 🎥 Media de Demo

Las imágenes vienen de Unsplash (licencia libre).
Los videos vienen de Pexels (licencia libre).
Ver créditos en `public/media/demo/CREDITS.md`

## 📝 Notas

- Las imágenes se sirven en WebP/AVIF con fallback
- El hero acepta video MP4 o imagen estática
- Grid con lazy loading automático
- Mobile-first responsive design

---

**Loyal Bliss Productions** - Cinematografía de alta gama
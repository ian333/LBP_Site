# 🎬 LOYAL BLISS - ¡Tu sitio está listo!

## ✅ Lo que ya tienes funcionando:

1. **Sitio corriendo en:** http://localhost:4321
2. **Páginas creadas:**
   - Home con hero cinematográfico
   - Portfolio con grid masonry
   - Equipo con bios
   - Contacto con WhatsApp

3. **Media de demo:** 10 imágenes 4K + 3 videos descargados
4. **Optimización:** Variantes WebP/AVIF generadas

## 🎯 Pasos inmediatos (tú):

### 1. Reemplazar el número de WhatsApp
Busca y reemplaza `5215512345678` con tu número real en:
- `src/pages/index.astro`
- `src/pages/contact.astro` 
- `src/components/Hero.jsx`

### 2. Agregar tus propias imágenes
```bash
# Coloca tus JPG/PNG en:
_media/original/

# Luego genera variantes:
npm run gen:images
```

### 3. Personalizar contenido
- Edita los proyectos en `src/pages/index.astro` (línea 8-60)
- Cambia el equipo en `src/pages/team.astro` (línea 5-30)
- Ajusta servicios y textos según tu estilo

## 🚀 Para lanzar online (Cloudflare):

### Paso 1: Crear cuenta Cloudflare
1. Ve a https://dash.cloudflare.com/sign-up
2. Usa tu email profesional
3. Plan gratuito es suficiente

### Paso 2: Comprar dominio
En Cloudflare Dashboard → Domain Registration
- `loyalbliss.productions` (~$12/año)
- `loyalbliss.pro` (~$10/año)
- `loyalbliss.studio` (~$15/año)

### Paso 3: Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/loyalbliss-site.git
git push -u origin main
```

### Paso 4: Conectar con Cloudflare Pages
1. Dashboard → Pages → Create Project
2. Connect to Git → Selecciona tu repo
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy!

## 💰 Costos estimados:
- Dominio: $1/mes
- Hosting: GRATIS (Cloudflare Pages)
- Total: ~$1-2/mes

## 🛠️ Comandos útiles:

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Generar más variantes de imágenes
npm run gen:images
```

## 📱 Responsive:
El sitio ya está optimizado para móvil, tablet y desktop.

## 🎨 Cambiar colores:
Edita `tailwind.config.mjs`:
```js
colors: {
  coal: '#0a0a0a',    // Fondo oscuro
  bone: '#faf8f6',    // Texto claro
  gold: '#d4af37',    // Dorado
  wine: '#722f37'     // Vino
}
```

## 🆘 ¿Necesitas ayuda?

### Si el sitio no carga:
```bash
# Mata el proceso y reinicia
ctrl+c
npm run dev
```

### Si las imágenes no aparecen:
```bash
# Regenera variantes
npm run gen:images
```

### Para agregar más páginas:
Crea archivos `.astro` en `src/pages/`

---

**¡Éxito con Loyal Bliss Productions! 🎬**

El sitio ya está corriendo localmente. 
Cuando estés listo para el mundo, sigue los pasos de Cloudflare arriba.
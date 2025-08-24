#!/bin/bash

# Instagram HD Downloader usando gallery-dl
# Herramienta profesional para descargar contenido en máxima calidad

echo "🎬 Instagram HD Downloader para Loyal Bliss"
echo "==========================================="
echo ""

# Verificar si gallery-dl está instalado
if ! command -v gallery-dl &> /dev/null; then
    echo "📦 Instalando gallery-dl..."
    pip install gallery-dl
fi

# Verificar si yt-dlp está instalado (alternativa)
if ! command -v yt-dlp &> /dev/null; then
    echo "📦 Instalando yt-dlp..."
    pip install yt-dlp
fi

# Función para descargar con gallery-dl
download_with_gallery_dl() {
    local username=$1
    local output_dir="public/team/${username}/hd"
    
    echo "📸 Descargando contenido HD de @${username}..."
    
    # Crear directorio
    mkdir -p "$output_dir"
    
    # Configuración para máxima calidad
    cat > gallery-dl-config.json << EOF
{
    "extractor": {
        "instagram": {
            "posts": true,
            "stories": false,
            "highlights": false,
            "tagged": false,
            "reels": true,
            "videos": true,
            "directory": ["${output_dir}"],
            "filename": "{num:>02}_{date:%Y%m%d}_{shortcode}.{extension}",
            "sleep-request": 1,
            "videos": true,
            "video-download": true
        }
    },
    "downloader": {
        "rate": "1M",
        "retries": 3,
        "timeout": 30
    }
}
EOF
    
    # Descargar con gallery-dl
    gallery-dl --config gallery-dl-config.json "https://instagram.com/${username}/" --range 1-20
}

# Función para descargar con yt-dlp (alternativa)
download_with_ytdlp() {
    local username=$1
    local output_dir="public/team/${username}/hd"
    
    echo "🎥 Intentando con yt-dlp para @${username}..."
    
    mkdir -p "$output_dir"
    
    # yt-dlp para posts individuales (necesitas las URLs)
    yt-dlp \
        --output "${output_dir}/%(title)s.%(ext)s" \
        --write-thumbnail \
        --convert-thumbnails jpg \
        --embed-metadata \
        --format "best[height<=4096]" \
        "https://instagram.com/${username}/"
}

# Función usando Instaloader (más confiable)
download_with_instaloader() {
    local username=$1
    local output_dir="public/team/${username}/hd"
    
    echo "📥 Descargando con Instaloader (máxima calidad)..."
    
    mkdir -p "$output_dir"
    
    # Instaloader con configuración para HD
    instaloader \
        --dirname-pattern="${output_dir}" \
        --filename-pattern="{date_utc:%Y%m%d_%H%M%S}_{shortcode}" \
        --no-compress-json \
        --no-metadata-json \
        --slide \
        --no-captions \
        --no-video-thumbnails \
        --fast-update \
        --count=20 \
        "${username}"
}

# Menú principal
echo "Selecciona el método de descarga:"
echo "1) gallery-dl (recomendado para HD)"
echo "2) yt-dlp (para videos)"
echo "3) instaloader (más estable)"
echo "4) Todos los métodos"
echo ""
read -p "Opción: " option

# Perfiles a descargar
profiles=("ianvaz18" "ricargorres" "angelupv" "kikejd")

case $option in
    1)
        for profile in "${profiles[@]}"; do
            download_with_gallery_dl "$profile"
        done
        ;;
    2)
        for profile in "${profiles[@]}"; do
            download_with_ytdlp "$profile"
        done
        ;;
    3)
        for profile in "${profiles[@]}"; do
            download_with_instaloader "$profile"
        done
        ;;
    4)
        for profile in "${profiles[@]}"; do
            echo "========================================="
            echo "Descargando @${profile} con todos los métodos..."
            download_with_gallery_dl "$profile"
            download_with_instaloader "$profile"
        done
        ;;
    *)
        echo "Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "✅ Descarga completada!"
echo "📁 Contenido guardado en: public/team/[username]/hd/"

# Limpiar archivos temporales
rm -f gallery-dl-config.json

# Generar reporte
echo ""
echo "📊 Generando reporte..."
for profile in "${profiles[@]}"; do
    count=$(ls -1 "public/team/${profile}/hd" 2>/dev/null | wc -l)
    echo "  @${profile}: ${count} archivos"
done
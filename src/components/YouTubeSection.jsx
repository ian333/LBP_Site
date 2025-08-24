import React, { useState } from 'react';

export default function YouTubeSection() {
  const [selectedVideo, setSelectedVideo] = useState(0);
  
  // IDs de videos de ejemplo - reemplaza con los IDs reales de tu canal
  const videos = [
    {
      id: 'dQw4w9WgXcQ', // Reemplaza con ID real
      title: 'Nike: Unlimited Motion',
      client: 'Nike',
      description: 'Comercial cinematográfico para la campaña Unlimited'
    },
    {
      id: 'dQw4w9WgXcQ', // Reemplaza con ID real
      title: 'Vogue Fashion Film',
      client: 'Vogue México',
      description: 'Fashion film editorial para la edición de verano'
    },
    {
      id: 'dQw4w9WgXcQ', // Reemplaza con ID real
      title: 'Music Video: Neon Dreams',
      client: 'Artista Independiente',
      description: 'Videoclip con estética cyberpunk y neon'
    }
  ];
  
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-coal to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Nuestro Trabajo en Video</h2>
          <p className="text-bone/70 max-w-2xl mx-auto">
            Mira algunos de nuestros proyectos más destacados en nuestro canal de YouTube
          </p>
          <a 
            href="https://youtube.com/@LoyalBlissProductions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 text-gold hover:text-gold/80 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Ver canal completo
          </a>
        </div>
        
        {/* Video principal */}
        <div className="mb-8">
          <div className="aspect-video rounded-2xl overflow-hidden bg-white/5">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videos[selectedVideo].id}`}
              title={videos[selectedVideo].title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="mt-6">
            <h3 className="font-display text-2xl font-semibold mb-2">{videos[selectedVideo].title}</h3>
            <p className="text-gold mb-2">{videos[selectedVideo].client}</p>
            <p className="text-bone/70">{videos[selectedVideo].description}</p>
          </div>
        </div>
        
        {/* Lista de videos */}
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideo(index)}
              className={`group text-left bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all ${
                selectedVideo === index ? 'ring-2 ring-gold' : ''
              }`}
            >
              <div className="aspect-video relative">
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-1">{video.title}</h4>
                <p className="text-sm text-bone/60">{video.client}</p>
              </div>
            </button>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-bone/70 mb-4">¿Quieres ver más de nuestro trabajo?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://youtube.com/@LoyalBlissProductions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Suscríbete en YouTube
            </a>
            <a
              href="https://instagram.com/ianvaz18"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full font-medium transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
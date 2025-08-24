import React, { useEffect, useRef } from 'react';

export default function Hero({ videoSrc, imageSrc, title, subtitle }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay bloqueado, no pasa nada
      });
    }
  }, []);
  
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background media */}
      {videoSrc ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          muted
          loop
          playsInline
          poster={imageSrc}
        />
      ) : (
        <img
          src={imageSrc}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/50 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex items-end pb-24 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-wide mb-4 animate-fade-in">
            {title || 'LOYAL BLISS'}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-bone/80 max-w-2xl animate-slide-up">
              {subtitle}
            </p>
          )}
          
          {/* CTA */}
          <div className="mt-8 flex gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="/work"
              className="inline-flex items-center px-8 py-3 bg-gold text-coal font-semibold rounded-full hover:bg-gold/90 transition-all hover:scale-105"
            >
              Ver portfolio
            </a>
            <a
              href="https://wa.me/5215573633622?text=Hola,%20me%20interesa%20trabajar%20con%20Loyal%20Bliss"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border border-bone/20 rounded-full hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-bone/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
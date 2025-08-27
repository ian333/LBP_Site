import React, { useEffect, useRef, useState } from 'react';

export default function DarkHero() {
  const videoRef = useRef(null);
  const [textVisible, setTextVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Autoplay video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    
    // Text animation delay
    setTimeout(() => setTextVisible(true), 500);
    
    // Mouse tracking for parallax
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Multiple Video Layers for depth */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-110"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`,
            transition: 'transform 0.5s ease-out'
          }}
          src="/media/demo/ocean-waves.mp4"
          muted
          loop
          playsInline
        />
      </div>
      
      {/* Film Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      
      {/* Animated Lines Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-6">
        <div 
          className="max-w-5xl"
          style={{
            transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* Logo Animation */}
          <div className={`transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="relative inline-block">
              <span className="font-black text-7xl md:text-9xl lg:text-[12rem] tracking-tighter text-white block leading-none">
                LOYAL
              </span>
              <span className="font-black text-7xl md:text-9xl lg:text-[12rem] tracking-tighter block leading-none text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-gold animate-gradient">
                BLISS
              </span>
              
              {/* Glitch Effect */}
              <span className="absolute inset-0 font-black text-7xl md:text-9xl lg:text-[12rem] tracking-tighter text-red-500 opacity-0 animate-glitch-1">
                <span className="block leading-none">LOYAL</span>
                <span className="block leading-none">BLISS</span>
              </span>
              <span className="absolute inset-0 font-black text-7xl md:text-9xl lg:text-[12rem] tracking-tighter text-blue-500 opacity-0 animate-glitch-2">
                <span className="block leading-none">LOYAL</span>
                <span className="block leading-none">BLISS</span>
              </span>
            </h1>
          </div>
          
          {/* Tagline */}
          <div 
            className={`mt-8 transition-all duration-1000 delay-300 ${
              textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center gap-4 text-gray-400">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-gray-600" />
              <p className="text-sm md:text-base font-light tracking-[0.3em] uppercase">
                Cinematografía Sin Límites
              </p>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-gray-600" />
            </div>
          </div>
          
          {/* CTA Buttons with Hover Effects */}
          <div 
            className={`mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-500 ${
              textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <a
              href="/work"
              className="group relative px-10 py-4 overflow-hidden border-2 border-gold text-white font-bold tracking-wider uppercase transition-all hover:text-black"
            >
              <span className="relative z-10">Ver Portfolio</span>
              <div className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </a>
            
            <a
              href="https://wa.me/5215573633622"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-10 py-4 overflow-hidden bg-white text-black font-bold tracking-wider uppercase transition-all hover:text-white"
            >
              <span className="relative z-10">Contactar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-scroll" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 uppercase tracking-widest whitespace-nowrap">
            Scroll
          </div>
        </div>
      </div>
      
      {/* Corner Details */}
      <div className="absolute top-8 left-8 text-white/50 text-xs tracking-widest">
        <p>LOYAL BLISS</p>
        <p className="mt-1">PRODUCTIONS</p>
      </div>
      
      <div className="absolute top-8 right-8 text-white/50 text-xs tracking-widest text-right">
        <p>EST. 2016</p>
        <p className="mt-1">MÉXICO</p>
      </div>
      
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes glitch-1 {
          0%, 100% { opacity: 0; transform: translate(0); }
          20% { opacity: 0.5; transform: translate(2px, -2px); }
          21% { opacity: 0; }
        }
        
        @keyframes glitch-2 {
          0%, 100% { opacity: 0; transform: translate(0); }
          20% { opacity: 0.5; transform: translate(-2px, 2px); }
          21% { opacity: 0; }
        }
        
        @keyframes scroll {
          0%, 20%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(4px); opacity: 0.3; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-glitch-1 {
          animation: glitch-1 3s infinite;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 3s infinite;
          animation-delay: 0.1s;
        }
        
        .animate-scroll {
          animation: scroll 2s infinite;
        }
      `}</style>
    </section>
  );
}
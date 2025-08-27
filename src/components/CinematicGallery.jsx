import React, { useState, useEffect } from 'react';

export default function CinematicGallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const projects = [
    { id: 1, title: 'Nike: Shadows', category: 'commercial', image: '/team/ianvaz18/photos/post_1.jpg', year: '2024' },
    { id: 2, title: 'Vogue: Noir', category: 'fashion', image: '/team/ianvaz18/photos/post_2.jpg', year: '2024' },
    { id: 3, title: 'Mercedes Night', category: 'commercial', image: '/team/ricargorres/photos/post_1.jpg', year: '2024' },
    { id: 4, title: 'Spotify Sessions', category: 'music', image: '/team/ricargorres/photos/post_2.jpg', year: '2023' },
    { id: 5, title: 'Corona Beach', category: 'commercial', image: '/team/angelupv/photos/post_1.jpg', year: '2023' },
    { id: 6, title: 'Fashion Week', category: 'fashion', image: '/team/angelupv/photos/post_2.jpg', year: '2023' },
    { id: 7, title: 'Netflix Doc', category: 'documentary', image: '/team/kikejd/photos/post_1.jpg', year: '2024' },
    { id: 8, title: 'Music Video', category: 'music', image: '/team/kikejd/photos/post_2.jpg', year: '2023' },
    { id: 9, title: 'Dark Beauty', category: 'fashion', image: '/dark/portrait-dark-1.jpg', year: '2024' },
    { id: 10, title: 'Urban Nights', category: 'commercial', image: '/dark/urban-dark-1.jpg', year: '2024' },
    { id: 11, title: 'Neon Dreams', category: 'music', image: '/dark/color-dark-1.jpg', year: '2023' },
    { id: 12, title: 'Shadow Play', category: 'fashion', image: '/dark/portrait-dark-2.jpg', year: '2024' },
  ];
  
  const categories = [
    { id: 'all', label: 'TODO', count: projects.length },
    { id: 'commercial', label: 'COMMERCIAL', count: projects.filter(p => p.category === 'commercial').length },
    { id: 'fashion', label: 'FASHION', count: projects.filter(p => p.category === 'fashion').length },
    { id: 'music', label: 'MUSIC', count: projects.filter(p => p.category === 'music').length },
    { id: 'documentary', label: 'DOCUMENTARY', count: projects.filter(p => p.category === 'documentary').length }
  ];
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);
    
  return (
    <section className="bg-black min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h2 className="font-black text-6xl md:text-8xl text-white mb-8 tracking-tighter">
            PORTFOLIO
          </h2>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-8 border-b border-white/10 pb-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`group relative text-sm font-bold tracking-widest transition-all ${
                  filter === cat.id ? 'text-gold' : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {cat.label}
                  <span className="text-xs opacity-50">({cat.count})</span>
                </span>
                {filter === cat.id && (
                  <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative aspect-[4/5] overflow-hidden bg-black cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Image Container */}
              <div className="absolute inset-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  style={{
                    filter: hoveredIndex === index ? 'brightness(0.7)' : 'brightness(0.4)'
                  }}
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* Project Number */}
                <div className="absolute top-6 left-6">
                  <span className="text-white/30 text-xs font-bold tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Year Badge */}
                <div className="absolute top-6 right-6">
                  <span className="text-gold text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {project.year}
                  </span>
                </div>
                
                {/* Title and Category */}
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-gold text-xs font-bold tracking-widest mb-2 uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {project.category}
                  </p>
                  <h3 className="text-white text-2xl font-bold leading-tight">
                    {project.title}
                  </h3>
                </div>
                
                {/* View Project Link */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="inline-flex items-center text-white text-sm font-semibold">
                    Ver Proyecto
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
              
              {/* Play Icon for Videos */}
              {(project.category === 'commercial' || project.category === 'music') && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  <div className="w-16 h-16 border border-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Hover Border Effect */}
              <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="mt-16 text-center">
          <button className="group relative px-12 py-4 bg-transparent border border-white/20 text-white font-bold tracking-wider uppercase overflow-hidden transition-all hover:border-gold">
            <span className="relative z-10">Cargar Más</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-gold/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
}
import React, { useState, useEffect } from 'react';

const filters = [
  { id: 'all', label: 'Todo' },
  { id: 'commercial', label: 'Comercial' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'music', label: 'Music Video' },
  { id: 'editorial', label: 'Editorial' }
];

export default function ProjectGrid({ projects = [] }) {
  const [filter, setFilter] = useState('all');
  const [visibleProjects, setVisibleProjects] = useState(12);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === filter));
    }
    setVisibleProjects(12);
  }, [filter, projects]);
  
  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProjects(prev => prev + 12);
      setIsLoading(false);
    }, 300);
  };
  
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Portfolio</h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-gold text-coal'
                    : 'bg-white/5 hover:bg-white/10 text-bone/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.slice(0, visibleProjects).map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))}
        </div>
        
        {/* Load more */}
        {visibleProjects < filteredProjects.length && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full font-medium transition-all hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? 'Cargando...' : 'Ver más'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <a
      href={`/work/${project.slug}`}
      className="group relative overflow-hidden rounded-xl bg-white/5 aspect-[4/5] block animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Placeholder blur */}
      {project.placeholder && !imageLoaded && (
        <img
          src={project.placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
        />
      )}
      
      {/* Main image */}
      <img
        src={project.cover || project.thumb}
        alt={project.title}
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
        <h3 className="font-display text-xl font-semibold mb-1">{project.title}</h3>
        <p className="text-sm text-bone/70">{project.client || project.category}</p>
      </div>
      
      {/* Play icon for videos */}
      {project.hasVideo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </a>
  );
}
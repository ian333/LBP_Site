#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

// Perfiles del equipo
const profiles = [
  { username: 'ianvaz18', name: 'Ian Vaz', role: 'Director' },
  { username: 'ricargorres', name: 'Ricardo Gorres', role: 'DP' },
  { username: 'angelupv', name: 'Angel UPV', role: 'Producer' },
  { username: 'kikejd', name: 'Kike JD', role: 'Editor' }
];

// URLs de ejemplo de posts cinematográficos (simulamos contenido profesional)
const cinematicContent = {
  ianvaz18: [
    { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4', name: 'proyecto-nike.jpg', caption: 'Nike Commercial BTS' },
    { url: 'https://images.unsplash.com/photo-1535016120720-40c646be5580', name: 'proyecto-corona.jpg', caption: 'Corona Beach Shoot' },
    { url: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0', name: 'proyecto-fashion.jpg', caption: 'Vogue Fashion Film' },
    { url: 'https://images.unsplash.com/photo-1493804714600-6edb1cd93080', name: 'proyecto-music.jpg', caption: 'Music Video Production' },
    { url: 'https://images.unsplash.com/photo-1579389083175-247ef703006f', name: 'proyecto-commercial.jpg', caption: 'Mercedes-Benz Ad' },
    { url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0', name: 'proyecto-netflix.jpg', caption: 'Netflix Documentary' }
  ],
  ricargorres: [
    { url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a', name: 'lighting-setup.jpg', caption: 'Lighting Setup for Commercial' },
    { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', name: 'camera-rig.jpg', caption: 'RED Camera Rig' },
    { url: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea', name: 'cinematography.jpg', caption: 'Anamorphic Look' },
    { url: 'https://images.unsplash.com/photo-1559056199-5a47f60c5053', name: 'bts-shoot.jpg', caption: 'Behind The Scenes' },
    { url: 'https://images.unsplash.com/photo-1606933248051-5ce88adc6cf8', name: 'arri-alexa.jpg', caption: 'ARRI Alexa Setup' },
    { url: 'https://images.unsplash.com/photo-1611532736579-6b16e2786cfd', name: 'color-grading.jpg', caption: 'Color Grading Session' }
  ],
  angelupv: [
    { url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47', name: 'production-planning.jpg', caption: 'Production Planning' },
    { url: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef', name: 'location-scout.jpg', caption: 'Location Scouting' },
    { url: 'https://images.unsplash.com/photo-1526948531399-320e7e40f0ca', name: 'crew-meeting.jpg', caption: 'Crew Meeting' },
    { url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1', name: 'set-design.jpg', caption: 'Set Design Process' },
    { url: 'https://images.unsplash.com/photo-1565438336185-61240e2d8fc3', name: 'call-sheet.jpg', caption: 'Production Call Sheet' },
    { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32', name: 'equipment.jpg', caption: 'Equipment Preparation' }
  ],
  kikejd: [
    { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b', name: 'editing-suite.jpg', caption: 'Editing Suite Setup' },
    { url: 'https://images.unsplash.com/photo-1526698905402-e13b1e0be5e0', name: 'color-correction.jpg', caption: 'Color Correction' },
    { url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', name: 'davinci-resolve.jpg', caption: 'DaVinci Resolve Workflow' },
    { url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d', name: 'post-production.jpg', caption: 'Post Production' },
    { url: 'https://images.unsplash.com/photo-1581092918484-8313ada2183a', name: 'timeline.jpg', caption: 'Timeline Editing' },
    { url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279', name: 'final-cut.jpg', caption: 'Final Cut Export' }
  ]
};

async function downloadFile(url, destPath) {
  try {
    console.log(`📸 Descargando: ${path.basename(destPath)}`);
    const finalUrl = url.includes('unsplash.com') 
      ? `${url}?w=2400&q=85&fm=jpg&fit=max`
      : url;
    
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const fileStream = fs.createWriteStream(destPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);
    
    console.log(`✓ ${path.basename(destPath)} descargado`);
    return true;
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    return false;
  }
}

async function createProfileInfo(username, name, role) {
  const profileData = {
    username,
    name,
    role,
    bio: `${role} en Loyal Bliss Productions`,
    posts: cinematicContent[username].map(post => ({
      image: `/team/${username}/photos/${post.name}`,
      caption: post.caption,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })),
    stats: {
      posts: Math.floor(Math.random() * 500) + 100,
      followers: Math.floor(Math.random() * 10000) + 5000,
      following: Math.floor(Math.random() * 1000) + 200
    }
  };
  
  const infoPath = path.join('public/team', username, 'info.json');
  fs.writeFileSync(infoPath, JSON.stringify(profileData, null, 2));
  console.log(`📝 Info creada para @${username}`);
}

async function downloadProfileContent(username) {
  const photos = cinematicContent[username];
  const photosDir = path.join('public/team', username, 'photos');
  
  console.log(`\n👤 Descargando contenido de @${username}...`);
  
  for (const photo of photos) {
    const destPath = path.join(photosDir, photo.name);
    if (!fs.existsSync(destPath)) {
      await downloadFile(photo.url, destPath);
    }
  }
}

async function main() {
  console.log('🎬 Descargando contenido del equipo Loyal Bliss...\n');
  
  // Descargar contenido para cada perfil
  for (const profile of profiles) {
    await downloadProfileContent(profile.username);
    await createProfileInfo(profile.username, profile.name, profile.role);
  }
  
  // Crear archivo de índice con todos los proyectos
  const allProjects = [];
  for (const [username, posts] of Object.entries(cinematicContent)) {
    posts.forEach((post, index) => {
      allProjects.push({
        id: `${username}-${index}`,
        username,
        image: `/team/${username}/photos/${post.name}`,
        caption: post.caption,
        type: post.caption.toLowerCase().includes('commercial') ? 'commercial' : 
              post.caption.toLowerCase().includes('fashion') ? 'fashion' :
              post.caption.toLowerCase().includes('music') ? 'music' : 'production'
      });
    });
  }
  
  fs.writeFileSync(
    'public/team/projects-index.json',
    JSON.stringify(allProjects, null, 2)
  );
  
  console.log('\n✨ Contenido del equipo descargado exitosamente!');
  console.log(`📁 Total de proyectos: ${allProjects.length}`);
  console.log('📍 Ubicación: public/team/');
}

main().catch(console.error);
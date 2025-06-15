
import type { Artist, Artwork, SubscriptionPlan } from '@/types';

export const mockArtworks: Artwork[] = [
  { id: 'art1', title: 'Sueños Entrelazados', imageUrl: 'https://placehold.co/600x400.png', artistId: 'artist1', artistName: 'Elena Rodriguez', price: 150, description: 'Un collage que explora la interconexión de los sueños y la realidad.', uploadDate: '2024-05-01', status: 'approved', dataAiHint: 'abstract collage' },
  { id: 'art2', title: 'Ciudad Fragmentada', imageUrl: 'https://placehold.co/600x450.png', artistId: 'artist1', artistName: 'Elena Rodriguez', price: 200, description: 'Representación de la vida urbana a través de fragmentos de revistas y texturas.', uploadDate: '2024-05-10', status: 'approved', dataAiHint: 'urban collage' },
  { id: 'art3', title: 'Naturaleza Viva', imageUrl: 'https://placehold.co/500x700.png', artistId: 'artist2', artistName: 'Carlos Gomez', price: 120, description: 'Collage vibrante con elementos orgánicos y colores terrosos.', uploadDate: '2024-04-20', status: 'approved', dataAiHint: 'nature collage' },
  { id: 'art4', title: 'Retrato Interior', imageUrl: 'https://placehold.co/400x600.png', artistId: 'artist2', artistName: 'Carlos Gomez', price: 180, description: 'Una mirada introspectiva a través de la superposición de imágenes y símbolos.', uploadDate: '2024-04-25', status: 'pending', dataAiHint: 'portrait collage' },
  { id: 'art5', title: 'Cosmos Onírico', imageUrl: 'https://placehold.co/700x500.png', artistId: 'artist3', artistName: 'Ana Silva', price: 250, description: 'Exploración del universo y los sueños mediante técnicas mixtas.', uploadDate: '2024-05-15', status: 'approved', dataAiHint: 'space collage' },
  { id: 'art6', title: 'Memorias Futuras', imageUrl: 'https://placehold.co/600x600.png', artistId: 'artist3', artistName: 'Ana Silva', description: 'Una pieza que juega con la nostalgia y las visiones del porvenir.', uploadDate: '2024-05-18', status: 'rejected', dataAiHint: 'vintage collage' },
];

export const mockArtists: Artist[] = [
  {
    id: 'artist1',
    name: 'Elena Rodriguez',
    country: 'Argentina',
    profileImageUrl: 'https://placehold.co/300x300.png',
    email: 'elena.rodriguez@example.com',
    socialMedia: { instagram: 'elena_art', facebook: 'elena.art.fb' },
    bio: 'Artista visual especializada en collage analógico y digital. Mi obra explora la feminidad y la naturaleza.',
    artworks: mockArtworks.filter(art => art.artistId === 'artist1'),
    dataAiHint: 'artist portrait',
    status: 'active',
  },
  {
    id: 'artist2',
    name: 'Carlos Gomez',
    country: 'México',
    profileImageUrl: 'https://placehold.co/300x300.png',
    email: 'carlos.gomez@example.com',
    socialMedia: { twitter: 'carlosg_collage' },
    bio: 'Apasionado por el collage surrealista, combino elementos vintage con técnicas modernas para crear mundos oníricos.',
    artworks: mockArtworks.filter(art => art.artistId === 'artist2'),
    dataAiHint: 'artist studio',
    status: 'active',
  },
  {
    id: 'artist3',
    name: 'Ana Silva',
    country: 'Brasil',
    profileImageUrl: 'https://placehold.co/300x300.png',
    email: 'ana.silva@example.com',
    bio: 'Collages que fusionan la cultura pop con la crítica social, utilizando colores vibrantes y mensajes directos.',
    artworks: mockArtworks.filter(art => art.artistId === 'artist3'),
    dataAiHint: 'woman artist',
    status: 'pending_approval',
  },
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan1',
    name: 'Artista Emergente',
    pricePerMonth: 5,
    photoLimit: 20,
    features: ['Hasta 20 obras en galería', 'Panel de control básico', 'Soporte por email']
  },
  {
    id: 'plan2',
    name: 'Artista Profesional',
    pricePerMonth: 10, // Changed from 25 to 10
    photoLimit: 40,
    features: ['Hasta 40 obras en galería', 'Panel de control avanzado', 'Prioridad en soporte', 'Promoción en newsletter']
  },
  {
    id: 'plan3',
    name: 'Galería Destacada',
    pricePerMonth: 50,
    photoLimit: 100,
    features: ['Obras ilimitadas', 'Panel de control completo', 'Soporte premium 24/7', 'Promoción destacada en portada y redes']
  }
];


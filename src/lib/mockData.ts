
import type { Artist, Artwork, SubscriptionPlan } from '@/types';

// Default data if nothing is in localStorage
const defaultMockArtworks: Artwork[] = [
  { id: 'art1', title: 'Sueños Entrelazados', imageUrl: 'https://placehold.co/600x400.png', artistId: 'artist1', artistName: 'Elena Rodriguez', price: 150, description: 'Un collage que explora la interconexión de los sueños y la realidad.', uploadDate: '2024-05-01', status: 'approved', dataAiHint: 'abstract collage' },
  { id: 'art2', title: 'Ciudad Fragmentada', imageUrl: 'https://placehold.co/600x450.png', artistId: 'artist1', artistName: 'Elena Rodriguez', price: 200, description: 'Representación de la vida urbana a través de fragmentos de revistas y texturas.', uploadDate: '2024-05-10', status: 'approved', dataAiHint: 'urban collage' },
  { id: 'art3', title: 'Naturaleza Viva', imageUrl: 'https://placehold.co/500x700.png', artistId: 'artist2', artistName: 'Carlos Gomez', price: 120, description: 'Collage vibrante con elementos orgánicos y colores terrosos.', uploadDate: '2024-04-20', status: 'approved', dataAiHint: 'nature collage' },
  { id: 'art4', title: 'Retrato Interior', imageUrl: 'https://placehold.co/400x600.png', artistId: 'artist2', artistName: 'Carlos Gomez', price: 180, description: 'Una mirada introspectiva a través de la superposición de imágenes y símbolos.', uploadDate: '2024-04-25', status: 'pending', dataAiHint: 'portrait collage' },
  { id: 'art5', title: 'Cosmos Onírico', imageUrl: 'https://placehold.co/700x500.png', artistId: 'artist3', artistName: 'Ana Silva', price: 250, description: 'Exploración del universo y los sueños mediante técnicas mixtas.', uploadDate: '2024-05-15', status: 'approved', dataAiHint: 'space collage' },
  { id: 'art6', title: 'Memorias Futuras', imageUrl: 'https://placehold.co/600x600.png', artistId: 'artist3', artistName: 'Ana Silva', description: 'Una pieza que juega con la nostalgia y las visiones del porvenir.', uploadDate: '2024-05-18', status: 'rejected', dataAiHint: 'vintage collage' },
];

const defaultMockArtists: Artist[] = [
  {
    id: 'artist1',
    name: 'Elena Rodriguez',
    country: 'Argentina',
    profileImageUrl: 'https://placehold.co/300x300.png',
    email: 'elena.rodriguez@example.com',
    socialMedia: { instagram: 'elena_art', facebook: 'elena.art.fb' },
    bio: 'Artista visual especializada en collage analógico y digital. Mi obra explora la feminidad y la naturaleza.',
    artworks: defaultMockArtworks.filter(art => art.artistId === 'artist1'),
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
    artworks: defaultMockArtworks.filter(art => art.artistId === 'artist2'),
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
    artworks: defaultMockArtworks.filter(art => art.artistId === 'artist3'),
    dataAiHint: 'woman artist',
    status: 'pending_approval', 
  },
];

// Functions to load from localStorage
const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Functions to save to localStorage
const saveToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
};

// Internal state variables
let _mockArtworks: Artwork[] = loadFromLocalStorage<Artwork[]>('mockArtworksData', defaultMockArtworks);
let _mockArtists: Artist[] = loadFromLocalStorage<Artist[]>('mockArtistsData', defaultMockArtists);

// Exported getter functions
export const getMockArtworks = (): Artwork[] => _mockArtworks;
export const getMockArtists = (): Artist[] => _mockArtists;

// Function to re-synchronize artist names in artworks and artwork lists in artists
const reSyncData = () => {
  // Ensure artworks within each artist object are correctly filtered from the main _mockArtworks list
  _mockArtists = _mockArtists.map(artist => ({
    ...artist,
    artworks: _mockArtworks.filter(artwork => artwork.artistId === artist.id)
  }));
  // Ensure artistName in artworks is correct based on the current artist name
  _mockArtworks = _mockArtworks.map(artwork => {
    const artist = _mockArtists.find(a => a.id === artwork.artistId);
    return {
      ...artwork,
      artistName: artist ? artist.name : 'Artista Desconocido'
    };
  });
};

// Initial sync and save if loaded from defaults
if (typeof window !== 'undefined') {
  const artworksFromStorage = window.localStorage.getItem('mockArtworksData');
  const artistsFromStorage = window.localStorage.getItem('mockArtistsData');
  
  // _mockArtworks and _mockArtists are already initialized by loadFromLocalStorage.
  // If localStorage was empty, they were initialized with defaultMockArtworks/defaultMockArtists.

  reSyncData(); // This will sync artist.artworks and artwork.artistName based on current _mockArtists and _mockArtworks

  // Save back to localStorage. This ensures that if defaults were used, they get saved.
  // It also ensures that any reSyncData changes (like populating artist.artworks) are persisted.
  saveToLocalStorage('mockArtistsData', _mockArtists);
  saveToLocalStorage('mockArtworksData', _mockArtworks);
}

// Helper functions to update and save, ensuring data consistency
export const updateAndSaveArtists = (updatedArtists: Artist[]) => {
  _mockArtists = [...updatedArtists]; 
  reSyncData(); 
  saveToLocalStorage('mockArtistsData', _mockArtists);
  saveToLocalStorage('mockArtworksData', _mockArtworks); 
};

export const updateAndSaveArtworks = (updatedArtworks: Artwork[]) => {
  _mockArtworks = [...updatedArtworks]; 
  reSyncData(); 
  saveToLocalStorage('mockArtworksData', _mockArtworks);
  saveToLocalStorage('mockArtistsData', _mockArtists); 
};

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan1',
    name: 'Básico',
    pricePerMonth: 6,
    photoLimit: 20,
    features: ['Hasta 20 obras en galería', 'Panel de control', 'Soporte por email']
  },
  {
    id: 'plan2',
    name: 'Avanzado',
    pricePerMonth: 10,
    photoLimit: 40,
    features: ['Hasta 40 obras en galería', 'Panel de control', 'Soporte por Chatbot', 'Promoción en newsletter']
  },
  {
    id: 'plan3',
    name: 'Priority',
    pricePerMonth: 25,
    photoLimit: 100,
    features: ['Hasta 100 fotos en galería', 'Panel de control', 'Soporte por Chatbot', 'Promoción en newsletter', 'Uso de la App de Collage']
  }
];

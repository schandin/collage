
import type { Artist, Artwork, SubscriptionPlan, SubscriptionRecord, NewsletterSubscription } from '@/types';

// Default data if nothing is in localStorage
const defaultMockArtworks: Artwork[] = [
  { id: 'art1', title: 'Sueños Entrelazados', imageUrl: 'https://placehold.co/600x400.png', artistId: 'artist1', artistName: 'Elena Rodriguez', price: 150, description: 'Un collage que explora la interconexión de los sueños y la realidad.', uploadDate: '2024-05-01', status: 'approved', dataAiHint: 'abstract collage', size: '50x70 cm', technique: 'Collage analógico y digital' },
  { id: 'art2', title: 'Ciudad Fragmentada', imageUrl: 'https://placehold.co/600x450.png', artistId: 'artist1', artistName: 'Elena Rodriguez', price: 200, description: 'Representación de la vida urbana a través de fragmentos de revistas y texturas.', uploadDate: '2024-05-10', status: 'approved', dataAiHint: 'urban collage', size: '60x45 cm', technique: 'Collage sobre madera' },
  { id: 'art3', title: 'Naturaleza Viva', imageUrl: 'https://placehold.co/500x700.png', artistId: 'artist2', artistName: 'Carlos Gomez', price: 120, description: 'Collage vibrante con elementos orgánicos y colores terrosos.', uploadDate: '2024-04-20', status: 'approved', dataAiHint: 'nature collage', technique: 'Técnica mixta' },
  { id: 'art4', title: 'Retrato Interior', imageUrl: 'https://placehold.co/400x600.png', artistId: 'artist2', artistName: 'Carlos Gomez', price: 180, description: 'Una mirada introspectiva a través de la superposición de imágenes y símbolos.', uploadDate: '2024-04-25', status: 'pending', dataAiHint: 'portrait collage', size: '30x40 cm' },
  { id: 'art5', title: 'Cosmos Onírico', imageUrl: 'https://placehold.co/700x500.png', artistId: 'artist3', artistName: 'Ana Silva', price: 250, description: 'Exploración del universo y los sueños mediante técnicas mixtas.', uploadDate: '2024-05-15', status: 'approved', dataAiHint: 'space collage', technique: 'Acrílico y collage' },
  { id: 'art6', title: 'Memorias Futuras', imageUrl: 'https://placehold.co/600x600.png', artistId: 'artist3', artistName: 'Ana Silva', description: 'Una pieza que juega con la nostalgia y las visiones del porvenir.', uploadDate: '2024-05-18', status: 'rejected', dataAiHint: 'vintage collage' },
];

const defaultMockArtists: Artist[] = [
  {
    id: 'artist1',
    name: 'Elena Rodriguez',
    country: 'Argentina',
    profileImageUrl: 'https://placehold.co/300x300.png',
    email: 'elena.rodriguez@example.com',
    password: 'password123',
    socialMedia: { instagram: 'elena_art', facebook: 'elena.art.fb' },
    bio: 'Artista visual especializada en collage analógico y digital. Mi obra explora la feminidad y la naturaleza.',
    artworks: [], 
    dataAiHint: 'artist portrait',
    status: 'active',
    subscriptionPlanId: 'plan2', 
    registrationDate: new Date(2024, 0, 15).toISOString(), // Jan 15, 2024
  },
  {
    id: 'artist2',
    name: 'Carlos Gomez',
    country: 'México',
    profileImageUrl: 'https://placehold.co/300x300.png',
    email: 'carlos.gomez@example.com',
    password: 'password123',
    socialMedia: { twitter: 'carlosg_collage' },
    bio: 'Apasionado por el collage surrealista, combino elementos vintage con técnicas modernas para crear mundos oníricos.',
    artworks: [], 
    dataAiHint: 'artist studio',
    status: 'active',
    subscriptionPlanId: 'plan2', 
    registrationDate: new Date(2024, 1, 20).toISOString(), // Feb 20, 2024
  },
  {
    id: 'artist3',
    name: 'Ana Silva',
    country: 'Brasil',
    profileImageUrl: 'https://placehold.co/300x300.png',
    email: 'ana.silva@example.com',
    password: 'password123',
    bio: 'Collages que fusionan la cultura pop con la crítica social, utilizando colores vibrantes y mensajes directos.',
    artworks: [], 
    dataAiHint: 'woman artist',
    status: 'pending_approval',
    subscriptionPlanId: 'plan1', 
    registrationDate: new Date(2024, 2, 10).toISOString(), // Mar 10, 2024
  },
];

const defaultMockSubscriptionRecords: SubscriptionRecord[] = [];
const defaultMockNewsletterSubscriptions: NewsletterSubscription[] = [];

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
let _mockArtworksGlobal: Artwork[] = loadFromLocalStorage<Artwork[]>('mockArtworksData', defaultMockArtworks);
let _mockArtistsGlobal: Artist[] = loadFromLocalStorage<Artist[]>('mockArtistsData', defaultMockArtists);
let _mockSubscriptionRecordsGlobal: SubscriptionRecord[] = loadFromLocalStorage<SubscriptionRecord[]>('mockSubscriptionRecordsData', defaultMockSubscriptionRecords);
let _mockNewsletterSubscriptionsGlobal: NewsletterSubscription[] = loadFromLocalStorage<NewsletterSubscription[]>('mockNewsletterSubscriptionsData', defaultMockNewsletterSubscriptions);


// Exported getter functions
export const getMockArtworks = (): Artwork[] => JSON.parse(JSON.stringify(_mockArtworksGlobal));
export const getMockArtists = (): Artist[] => JSON.parse(JSON.stringify(_mockArtistsGlobal));
export const getMockSubscriptionRecords = (): SubscriptionRecord[] => JSON.parse(JSON.stringify(_mockSubscriptionRecordsGlobal));
export const getMockNewsletterSubscriptions = (): NewsletterSubscription[] => JSON.parse(JSON.stringify(_mockNewsletterSubscriptionsGlobal));


const reSyncData = () => {
   _mockArtistsGlobal = _mockArtistsGlobal.map(artist => ({
    ...artist,
    artworks: _mockArtworksGlobal.filter(artwork => artwork.artistId === artist.id)
  }));
  _mockArtworksGlobal = _mockArtworksGlobal.map(artwork => {
    const artist = _mockArtistsGlobal.find(a => a.id === artwork.artistId);
    return {
      ...artwork,
      artistName: artist ? artist.name : 'Artista Desconocido'
    };
  });
};


if (typeof window !== 'undefined') {
  const artworksFromStorage = window.localStorage.getItem('mockArtworksData');
  const artistsFromStorage = window.localStorage.getItem('mockArtistsData');
  const subscriptionRecordsFromStorage = window.localStorage.getItem('mockSubscriptionRecordsData');
  const newsletterSubscriptionsFromStorage = window.localStorage.getItem('mockNewsletterSubscriptionsData');

  if (!artworksFromStorage) {
    saveToLocalStorage('mockArtworksData', defaultMockArtworks);
    _mockArtworksGlobal = defaultMockArtworks;
  }
  if (!artistsFromStorage) {
    saveToLocalStorage('mockArtistsData', defaultMockArtists);
    _mockArtistsGlobal = defaultMockArtists;
  }
  if (!subscriptionRecordsFromStorage) {
    saveToLocalStorage('mockSubscriptionRecordsData', defaultMockSubscriptionRecords);
    _mockSubscriptionRecordsGlobal = defaultMockSubscriptionRecords;
  }
  if (!newsletterSubscriptionsFromStorage) {
    saveToLocalStorage('mockNewsletterSubscriptionsData', defaultMockNewsletterSubscriptions);
    _mockNewsletterSubscriptionsGlobal = defaultMockNewsletterSubscriptions;
  }
  reSyncData(); 
}

export const updateAndSaveArtists = (updatedArtists: Artist[]) => {
  _mockArtistsGlobal = [...updatedArtists]; 
  reSyncData(); 
  saveToLocalStorage('mockArtistsData', _mockArtistsGlobal); 
  // No need to save artworks here unless artist name change affects them, which reSyncData handles before save.
};

export const updateAndSaveArtworks = (updatedArtworks: Artwork[]) => {
  _mockArtworksGlobal = [...updatedArtworks]; 
  reSyncData(); 
  saveToLocalStorage('mockArtworksData', _mockArtworksGlobal); 
  // No need to save artists here unless artwork count affects them, which reSyncData handles before save.
};


export const addSubscriptionRecord = (newRecord: SubscriptionRecord) => {
  _mockSubscriptionRecordsGlobal = [..._mockSubscriptionRecordsGlobal, newRecord];
  saveToLocalStorage('mockSubscriptionRecordsData', _mockSubscriptionRecordsGlobal);
};

export const addNewsletterSubscription = (newSubscription: NewsletterSubscription) => {
  _mockNewsletterSubscriptionsGlobal = [..._mockNewsletterSubscriptionsGlobal, newSubscription];
  saveToLocalStorage('mockNewsletterSubscriptionsData', _mockNewsletterSubscriptionsGlobal);
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

// Function to permanently delete an artist and their artworks
export const permanentlyDeleteArtistAndArtworks = (artistId: string) => {
  _mockArtworksGlobal = _mockArtworksGlobal.filter(artwork => artwork.artistId !== artistId);
  _mockArtistsGlobal = _mockArtistsGlobal.filter(artist => artist.id !== artistId);
  
  saveToLocalStorage('mockArtworksData', _mockArtworksGlobal);
  saveToLocalStorage('mockArtistsData', _mockArtistsGlobal);
};


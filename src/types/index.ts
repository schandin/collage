
export interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  artistId: string;
  artistName: string;
  price?: number;
  description?: string;
  uploadDate?: string;
  status?: 'pending' | 'approved' | 'rejected';
  dataAiHint?: string;
}

export interface Artist {
  id: string;
  name: string;
  country: string;
  profileImageUrl: string;
  email: string;
  password?: string; // Added password field
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  bio?: string;
  artworks: Artwork[];
  dataAiHint?: string;
  status?: 'active' | 'pending_approval' | 'blocked';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  pricePerMonth: number;
  photoLimit: number;
  features: string[];
}


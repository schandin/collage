
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
  size?: string; 
  technique?: string; 
}

export interface Artist {
  id: string;
  name: string;
  country: string;
  profileImageUrl: string;
  email: string;
  password?: string; 
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  bio?: string;
  artworks: Artwork[];
  dataAiHint?: string;
  status?: 'active' | 'pending_approval' | 'blocked' | 'profile_incomplete' | 'deleted';
  subscriptionPlanId?: string; 
  registrationDate?: string; // ISO date string
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  pricePerMonth: number;
  photoLimit: number;
  features: string[];
}

export interface SubscriptionRecord {
  id: string;
  artistId: string;
  artistEmail: string;
  planId: string;
  planName: string;
  paymentMethod: string; 
  subscriptionDate: string; 
  status: 'Confirmado' | 'Pendiente'; 
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscriptionDate: string; // ISO date string
}


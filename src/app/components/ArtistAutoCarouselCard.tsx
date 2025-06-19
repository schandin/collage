
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import type { Artist, Artwork } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronRight, Palette, User } from 'lucide-react';

interface CarouselItem {
  type: 'profile' | 'artwork';
  id: string;
  url: string;
  title?: string;
  dataAiHint?: string;
  artworkData?: Artwork;
}

interface ArtistAutoCarouselCardProps {
  artist: Artist;
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
  priority?: boolean;
  intervalMs?: number; // New prop for custom interval duration
}

export default function ArtistAutoCarouselCard({
  artist,
  artworks,
  onArtworkClick,
  priority = false,
  intervalMs,
}: ArtistAutoCarouselCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayItems, setDisplayItems] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const items: CarouselItem[] = [
      {
        type: 'profile',
        id: `profile-${artist.id}`,
        url: artist.profileImageUrl || 'https://placehold.co/300x300.png',
        title: artist.name,
        dataAiHint: artist.dataAiHint || 'artist portrait'
      },
      ...artworks.map(art => ({
        type: 'artwork' as const,
        id: art.id,
        url: art.imageUrl,
        title: art.title,
        dataAiHint: art.dataAiHint || 'artwork',
        artworkData: art,
      }))
    ];
    setDisplayItems(items);
    setCurrentIndex(0);
  }, [artist, artworks]);

  useEffect(() => {
    if (displayItems.length <= 1) return;

    const actualInterval = intervalMs ?? 3500; // Default to 3.5 seconds if not provided

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % displayItems.length);
    }, actualInterval);

    return () => clearInterval(intervalId);
  }, [displayItems.length, intervalMs]); // Add intervalMs to dependency array

  const handleImageClick = useCallback(() => {
    const currentItem = displayItems[currentIndex];
    if (currentItem?.type === 'artwork' && currentItem.artworkData) {
      onArtworkClick(currentItem.artworkData);
    }
  }, [currentIndex, displayItems, onArtworkClick]);

  if (!artist) {
    return <div className="p-4 border rounded-lg h-80 bg-muted/30 flex items-center justify-center text-muted-foreground">Artista no disponible</div>;
  }

  const currentItem = displayItems[currentIndex];

  if (!currentItem) {
     return (
        <div className="flex flex-col items-center justify-between p-4 border rounded-lg shadow-lg h-96 bg-card">
            <div className="flex flex-col items-center justify-center flex-grow text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-base font-semibold text-foreground">{artist.name}</p>
                <p className="text-xs text-muted-foreground">Preparando galería...</p>
            </div>
            <div className="w-full pt-4 mt-auto border-t">
                <Button variant="outline" asChild className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Link href={`/artistas/${artist.id}`}>
                    Ver Perfil <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                </Button>
            </div>
        </div>
    );
  }


  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-xl bg-card">
      <div
        className="relative w-full aspect-square group"
        onClick={handleImageClick}
        role="button"
        tabIndex={currentItem.type === 'artwork' ? 0 : -1}
        aria-label={`Ver ${currentItem.type === 'profile' ? 'perfil de' : 'obra'} ${currentItem.title}`}
      >
        {displayItems.map((item, index) => (
          <Image
            key={item.id}
            src={item.url}
            alt={item.title || `Imagen ${index + 1} de ${artist.name}`}
            fill
            style={{ objectFit: 'cover' }}
            className={`transition-opacity duration-700 ease-in-out absolute inset-0 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            data-ai-hint={item.dataAiHint}
            priority={index === 0}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 p-2 text-sm font-semibold text-white truncate transition-opacity duration-300 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:opacity-100">
          {currentItem.type === 'profile' ? artist.name : currentItem.title}
          {currentItem.type === 'artwork' && <span className="block text-xs font-normal">{artist.name}</span>}
        </div>
      </div>
      <div className="p-4 mt-auto border-t">
        <Button variant="outline" asChild className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href="/artistas">
            Explorar Galerías <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ArtworkFullscreenModal from '@/app/components/ArtworkFullscreenModal';
import { mockArtists, mockArtworks } from '@/lib/mockData';
import type { Artist as ArtistType, Artwork as ArtworkType } from '@/types';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ArtistProfilePage() {
  const routeParams = useParams(); // Use the hook
  // routeParams can be null initially, or an object like { id: "value" }
  const artistId = typeof routeParams?.id === 'string' ? routeParams.id : null;

  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [artistArtworks, setArtistArtworks] = useState<ArtworkType[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial loading state

  useEffect(() => {
    setIsLoading(true); // Start loading when artistId changes or on initial mount
    if (artistId) {
      const foundArtist = mockArtists.find(a => a.id === artistId);
      if (foundArtist) {
        setArtist(foundArtist);
        const artworks = mockArtworks.filter(art => art.artistId === artistId && art.status === 'approved');
        setArtistArtworks(artworks);
      } else {
        setArtist(null); 
        setArtistArtworks([]);
      }
    } else {
        // If artistId is null (e.g. params not ready or invalid route)
        setArtist(null); 
        setArtistArtworks([]);
    }
    setIsLoading(false); // Finish loading
  }, [artistId]);

  const handleOpenModal = (artwork: ArtworkType) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  if (isLoading) { // Covers initial load and when artistId changes
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <p>Cargando perfil del artista...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!artist) { // If not loading and artist is still null (means artistId was invalid or not found)
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-headline text-destructive">Artista no encontrado</h1>
          <p className="text-muted-foreground mt-4">El perfil de artista que buscas no existe o no está disponible.</p>
          <Button asChild className="mt-8">
            <Link href="/artistas">Ver todos los artistas</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If artist is found
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Artist Details & Artworks */}
          <div className="md:col-span-2 space-y-10">
            <section>
              <h1 className="text-4xl lg:text-5xl font-headline text-primary mb-2">{artist.name}</h1>
              <div className="flex items-center text-muted-foreground text-lg mb-6">
                <MapPin className="w-5 h-5 mr-2 text-accent" />
                {artist.country}
              </div>
              {artist.bio && (
                <p className="text-foreground text-base leading-relaxed whitespace-pre-line">
                  {artist.bio}
                </p>
              )}
            </section>

            <section>
              <h2 className="text-3xl font-headline text-primary mb-6">Obras Destacadas</h2>
              {artistArtworks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {artistArtworks.slice(0, 20).map((artwork) => (
                    <button
                      key={artwork.id}
                      onClick={() => handleOpenModal(artwork)}
                      className="aspect-square relative block w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
                      aria-label={`Ver obra ${artwork.title}`}
                    >
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={artwork.dataAiHint || "artwork thumbnail"}
                      />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                        <p className="text-white text-xs text-center line-clamp-2">{artwork.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                 <Card className="border-dashed border-2">
                    <CardContent className="p-10 text-center">
                    <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" /> {/* Re-using MapPin as generic placeholder */}
                    <p className="text-muted-foreground">Este artista aún no ha publicado obras aprobadas.</p>
                    </CardContent>
                </Card>
              )}
            </section>
          </div>

          {/* Right Column: Artist Profile Image */}
          <aside className="md:col-span-1">
            <div className="sticky top-24"> {/* Sticky position for profile image card */}
              <Card className="shadow-xl overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-square relative w-full">
                    <Image
                      src={artist.profileImageUrl}
                      alt={artist.name}
                      layout="fill"
                      objectFit="cover"
                      className="bg-muted"
                      data-ai-hint={artist.dataAiHint || "artist portrait"}
                    />
                  </div>
                </CardHeader>
              </Card>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <ArtworkFullscreenModal artwork={selectedArtwork} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}


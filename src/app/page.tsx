
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ArtworkFullscreenModal from '@/app/components/ArtworkFullscreenModal';
import ArtistAutoCarouselCard from '@/app/components/ArtistAutoCarouselCard';
import { Button } from '@/components/ui/button';
import { getMockArtworks, getMockArtists } from '@/lib/mockData';
import type { Artist as ArtistType, Artwork as ArtworkType } from '@/types';
import { Palette, Users, Star, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface ArtistWithArtworks {
  artist: ArtistType;
  artworks: ArtworkType[];
}

export default function Home() {
  const [priorityArtistsData, setPriorityArtistsData] = useState<ArtistWithArtworks[]>([]);
  const [advancedArtistsData, setAdvancedArtistsData] = useState<ArtistWithArtworks[]>([]);
  
  const [selectedArtworkForModal, setSelectedArtworkForModal] = useState<ArtworkType | null>(null);
  const [selectedArtistForModal, setSelectedArtistForModal] = useState<ArtistType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const allArtists = getMockArtists();
    const allArtworks = getMockArtworks();

    // Priority Artists (plan3) - up to 4
    const priorityPlanId = 'plan3';
    const activePriorityArtists = allArtists.filter(
      artist => artist.status === 'active' && artist.subscriptionPlanId === priorityPlanId
    ).slice(0, 4);

    const prepPriorityData = activePriorityArtists.map(artist => {
      const artworks = allArtworks.filter(
        art => art.artistId === artist.id && art.status === 'approved'
      ); // All approved artworks
      return { artist, artworks };
    });
    setPriorityArtistsData(prepPriorityData);

    // Advanced Artists (plan2) - up to 6
    const advancedPlanId = 'plan2';
    const activeAdvancedArtists = allArtists.filter(
      artist => artist.status === 'active' && artist.subscriptionPlanId === advancedPlanId
    ).slice(0, 6);
    
    const prepAdvancedData = activeAdvancedArtists.map(artist => {
      const artworks = allArtworks.filter(
        art => art.artistId === artist.id && art.status === 'approved'
      ).slice(0, 5); // Max 5 artworks
      return { artist, artworks };
    });
    setAdvancedArtistsData(prepAdvancedData);

  }, []);

  const handleOpenModal = useCallback((artwork: ArtworkType) => {
    setSelectedArtworkForModal(artwork);
    const artist = getMockArtists().find(a => a.id === artwork.artistId);
    setSelectedArtistForModal(artist || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedArtworkForModal(null);
    setSelectedArtistForModal(null);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-headline text-primary mb-6 leading-tight">
              Descubre el Arte del Collage
            </h1>
            <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-10">
              Explora una vibrante colección de obras de artistas talentosos. Conéctate, inspírate y encuentra tu próxima pieza favorita.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
                <Link href="/artistas">Explorar Galerías</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/5 shadow-lg">
                <Link href="/suscripciones">Para Artistas</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Priority Artists Carousel Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-primary mb-12 text-center flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 mr-3 text-purple-500" /> {/* Icon for Priority */}
              Artistas Destacados
            </h2>
            {priorityArtistsData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {priorityArtistsData.map(({ artist, artworks }) => (
                  <ArtistAutoCarouselCard
                    key={artist.id}
                    artist={artist}
                    artworks={artworks}
                    onArtworkClick={handleOpenModal}
                    priority={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-background">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Aún no hay artistas Priority para mostrar. ¡Vuelve pronto!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Advanced Artists Carousel Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-primary text-center mb-12 flex items-center justify-center">
              <Star className="w-10 h-10 mr-3 text-yellow-500" /> {/* Icon for Advanced */}
              Galería de Artistas
            </h2>
            {advancedArtistsData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> {/* Up to 6, so 3 per row on medium+ */}
                {advancedArtistsData.map(({ artist, artworks }) => (
                  <ArtistAutoCarouselCard
                    key={artist.id}
                    artist={artist}
                    artworks={artworks}
                    onArtworkClick={handleOpenModal}
                    priority={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
                <Palette className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Aún no hay artistas con plan Avanzado para mostrar aquí.
                </p>
              </div>
            )}
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-headline mb-6">¿Eres Artista de Collage?</h2>
            <p className="text-lg max-w-xl mx-auto mb-8">
              Únete a nuestra comunidad, comparte tu arte con el mundo y conecta con coleccionistas y aficionados.
            </p>
            <Button size="lg" variant="secondary" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
              <Link href="/suscripciones">Únete a Collage Conexión</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <ArtworkFullscreenModal
        artwork={selectedArtworkForModal}
        artistEmail={selectedArtistForModal?.email}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}


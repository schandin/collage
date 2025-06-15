
"use client";

import React, { useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ArtworkFullscreenModal from '@/app/components/ArtworkFullscreenModal';
import ArtistCard from '@/app/components/ArtistCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockArtworks, mockArtists } from '@/lib/mockData';
import type { Artist as ArtistType, Artwork as ArtworkType } from '@/types';
import { Search, ChevronRight, Palette, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const featuredArtists = mockArtists.filter(art => art.status === 'active').slice(0, 4);
  // Removed featuredArtworks direct usage here, will be filtered per artist

  const [selectedArtworkForModal, setSelectedArtworkForModal] = useState<ArtworkType | null>(null);
  const [selectedArtistForModal, setSelectedArtistForModal] = useState<ArtistType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (artwork: ArtworkType) => {
    setSelectedArtworkForModal(artwork);
    const artist = mockArtists.find(a => a.id === artwork.artistId);
    setSelectedArtistForModal(artist || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArtworkForModal(null);
    setSelectedArtistForModal(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="absolute inset-0 opacity-50">
             {/* Consider adding a subtle background collage image here if desired */}
          </div>
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

        {/* Galerías Destacadas de Nuestros Artistas Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-primary mb-12 text-center">
              Galerías Destacadas de Nuestros Artistas
            </h2>
            <div className="space-y-12">
              {featuredArtists.map((artist) => {
                const artistArtworks = mockArtworks.filter(
                  (art) => art.artistId === artist.id && art.status === 'approved'
                ).slice(0, 10);

                if (artistArtworks.length === 0 && artist.status !== 'active') return null; 

                return (
                  <div key={artist.id}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                      <h3 className="text-3xl font-headline text-primary">{artist.name}</h3>
                      <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground self-start sm:self-center">
                        <Link href={`/artistas/${artist.id}`}>
                          Ver Perfil Completo <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    {artistArtworks.length > 0 ? (
                      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-1 px-1 scrollbar-thin scrollbar-thumb-accent/70 scrollbar-track-accent/20 rounded-lg">
                        {artistArtworks.map((artwork) => (
                          <button
                            key={artwork.id}
                            onClick={() => handleOpenModal(artwork)}
                            className="aspect-square relative block w-48 h-48 md:w-56 md:h-56 flex-shrink-0 overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
                            aria-label={`Ver obra ${artwork.title}`}
                          >
                            <Image
                              src={artwork.imageUrl}
                              alt={artwork.title}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-500 ease-in-out group-hover:scale-110"
                              data-ai-hint={artwork.dataAiHint || "artist artwork"}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                              <p className="text-white text-sm font-semibold truncate">{artwork.title}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                          <Palette className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">Este artista aún no tiene obras públicas para mostrar aquí.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Busca Artistas Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-primary text-center mb-10">Busca Artistas</h2>
            <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 mb-12">
              <Input type="text" placeholder="Nombre del artista" className="flex-grow text-base" aria-label="Nombre del artista" />
              <Input type="text" placeholder="País" className="flex-grow text-base" aria-label="País del artista" />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-base">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </form>
            
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-headline text-primary flex items-center">
                <Users className="w-7 h-7 mr-3 text-accent" />
                Artistas Talentosos
              </h3>
              <Button variant="link" asChild className="text-accent hover:text-accent/80">
                <Link href="/artistas">
                  <span className="flex items-center">
                    Ver Todos <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredArtists.map((artist) => ( // Re-using featuredArtists for this section, which is fine.
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action for Artists */}
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

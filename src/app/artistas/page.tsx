
"use client";

import React from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ArtistCard from '@/app/components/ArtistCard';
import { getMockArtists } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users } from 'lucide-react';

export default function ArtistasPage() {
  const allArtists = getMockArtists();
  const artists = allArtists.filter(a => a.status === 'active');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="mb-12">
          <h1 className="text-5xl font-headline text-primary mb-6 text-center flex items-center justify-center">
            <Users className="w-12 h-12 mr-4 text-accent" />
            Nuestros Artistas
          </h1>
          <p className="text-lg text-foreground text-center max-w-2xl mx-auto mb-8">
            Descubre la diversidad y talento de los artistas que forman parte de Collage Conexión.
          </p>
          <form className="max-w-lg mx-auto flex gap-3 mb-10">
            <Input type="text" placeholder="Buscar por nombre..." className="flex-grow text-base" aria-label="Buscar artista por nombre"/>
            <Input type="text" placeholder="País..." className="w-1/3 text-base" aria-label="Buscar artista por país"/>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4 mr-2"/>Buscar
            </Button>
          </form>
        </section>

        {artists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-xl">No hay artistas para mostrar en este momento.</p>
        )}
        
      </main>
      <Footer />
    </div>
  );
}

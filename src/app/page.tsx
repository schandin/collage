
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import NewsletterForm from '@/app/components/NewsletterForm';
import ArtworkCard from '@/app/components/ArtworkCard';
import ArtistCard from '@/app/components/ArtistCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockArtworks, mockArtists } from '@/lib/mockData';
import { Search, ChevronRight, Palette, Users } from 'lucide-react'; // Palette still needed for other sections if any, removed ChevronLeft as it's not used
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const featuredArtworks = mockArtworks.filter(art => art.status === 'approved').slice(0, 5);
  const featuredArtists = mockArtists.filter(art => art.status === 'active').slice(0, 4);

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

        {/* Obras Destacadas Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-headline text-primary"> {/* Removed Palette Icon */}
                Obras Destacadas
              </h2>
              <Button variant="default" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 text-sm">
                <Link href="/obras">
                  <span className="flex items-center">
                    Ver Todas <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredArtworks.slice(0,4).map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
             {/* Simple horizontal scroll for more artworks */}
            {featuredArtworks.length > 4 && (
              <div className="mt-10">
                <h3 className="text-2xl font-headline text-primary mb-4">Más para explorar</h3>
                <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-primary/10">
                  {featuredArtworks.slice(4).map((artwork) => (
                    <div key={artwork.id} className="min-w-[280px] md:min-w-[320px]">
                      <ArtworkCard artwork={artwork} />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              {featuredArtists.map((artist) => (
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
    </div>
  );
}

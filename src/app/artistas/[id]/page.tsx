import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ArtworkCard from '@/app/components/ArtworkCard';
import { mockArtists, mockArtworks } from '@/lib/mockData';
import Image from 'next/image';
import { Mail, Instagram, Facebook, Twitter, MapPin, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export async function generateStaticParams() {
  return mockArtists.map((artist) => ({
    id: artist.id,
  }));
}

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const artist = mockArtists.find(a => a.id === params.id);
  const artistArtworks = mockArtworks.filter(art => art.artistId === params.id && art.status === 'approved');

  if (!artist) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Artist Info Column */}
          <div className="md:col-span-1 space-y-6">
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
              <CardContent className="p-6">
                <h1 className="text-4xl font-headline text-primary mb-2">{artist.name}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-accent" />
                  {artist.country}
                </div>
                
                {artist.bio && <p className="text-foreground text-sm mb-6">{artist.bio}</p>}

                <Separator className="my-6" />

                <h2 className="text-xl font-headline text-primary mb-3">Contacto</h2>
                <a href={`mailto:${artist.email}`} className="flex items-center text-accent hover:underline mb-4 text-sm">
                  <Mail className="w-5 h-5 mr-2" />
                  {artist.email}
                </a>

                {artist.socialMedia && (
                  <div className="space-y-2">
                    {artist.socialMedia.instagram && (
                      <a href={`https://instagram.com/${artist.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-accent text-sm">
                        <Instagram className="w-5 h-5 mr-2" /> @{artist.socialMedia.instagram}
                      </a>
                    )}
                    {artist.socialMedia.facebook && (
                      <a href={`https://facebook.com/${artist.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-accent text-sm">
                        <Facebook className="w-5 h-5 mr-2" /> Facebook
                      </a>
                    )}
                    {artist.socialMedia.twitter && (
                      <a href={`https://twitter.com/${artist.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-accent text-sm">
                        <Twitter className="w-5 h-5 mr-2" /> @{artist.socialMedia.twitter}
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Artworks Gallery Column */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-headline text-primary mb-8 flex items-center">
              <Palette className="w-7 h-7 mr-3 text-accent" />
              Galería de Obras
            </h2>
            {artistArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {artistArtworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="p-10 text-center">
                  <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Este artista aún no ha publicado obras aprobadas.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

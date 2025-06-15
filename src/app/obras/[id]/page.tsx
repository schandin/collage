import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { mockArtworks, mockArtists } from '@/lib/mockData';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Palette, UserCircle, DollarSign, ShoppingCart, MessageSquare } from 'lucide-react';

export async function generateStaticParams() {
  return mockArtworks.map((artwork) => ({
    id: artwork.id,
  }));
}

export default function ArtworkDetailPage({ params }: { params: { id: string } }) {
  const artwork = mockArtworks.find(art => art.id === params.id);
  const artist = artwork ? mockArtists.find(a => a.id === artwork.artistId) : null;

  if (!artwork || !artist) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-headline text-destructive">Obra no encontrada</h1>
          <p className="text-muted-foreground mt-4">La obra de arte que buscas no existe o no está disponible.</p>
          <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
            <Link href="/">Volver al inicio</Link>
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
        <Button variant="outline" asChild className="mb-8">
          <Link href={artist ? `/artistas/${artist.id}` : "/artistas"}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la galería del artista
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Artwork Image */}
          <Card className="shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[4/3] relative w-full bg-muted">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  layout="fill"
                  objectFit="contain" // Use 'contain' to see the whole artwork
                  data-ai-hint={artwork.dataAiHint || "detailed art"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Artwork Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl font-headline text-primary">{artwork.title}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Por <Link href={`/artistas/${artist.id}`} className="text-accent hover:underline">{artist.name}</Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {artwork.description && (
                  <p className="text-foreground mb-6 text-base leading-relaxed">{artwork.description}</p>
                )}
                
                <div className="flex items-center text-2xl font-semibold text-primary mb-6">
                  <DollarSign className="w-7 h-7 mr-2 text-accent" />
                  {artwork.price ? `$${artwork.price}` : 'Consultar precio'}
                </div>

                <div className="space-y-3">
                   <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                     <ShoppingCart className="w-5 h-5 mr-2" />
                     {artwork.price ? 'Añadir al Carrito' : 'Consultar Disponibilidad'}
                   </Button>
                   <Button variant="outline" size="lg" className="w-full">
                     <MessageSquare className="w-5 h-5 mr-2" />
                     Contactar al Artista
                   </Button>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-headline text-primary mb-3">Detalles Adicionales</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li><span className="font-medium text-foreground">Artista:</span> {artist.name}</li>
                        <li><span className="font-medium text-foreground">País:</span> {artist.country}</li>
                        <li><span className="font-medium text-foreground">Subido:</span> {artwork.uploadDate ? new Date(artwork.uploadDate).toLocaleDateString() : 'N/A'}</li>
                        {/* Add more details like dimensions, materials if available */}
                    </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Related Artworks (Optional) */}
        {/* This would require fetching more artworks, possibly by the same artist or similar style */}
      </main>
      <Footer />
    </div>
  );
}

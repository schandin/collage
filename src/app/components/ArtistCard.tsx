
import Image from 'next/image';
import Link from 'next/link';
import type { Artist } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, User } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <div className="aspect-square w-full relative">
          <Image
            src={artist.profileImageUrl}
            alt={artist.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={artist.dataAiHint || "artist portrait"}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1 truncate" title={artist.name}>{artist.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-1 text-accent" />
          {artist.country}
        </div>
        {artist.bio && <p className="text-xs text-muted-foreground line-clamp-3">{artist.bio}</p>}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button variant="default" asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/artistas/${artist.id}`}>
            <User className="w-4 h-4 mr-2" />
            Ver Perfil
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

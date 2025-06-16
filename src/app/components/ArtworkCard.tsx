
import Image from 'next/image';
import Link from 'next/link';
import type { Artwork } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Eye } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative w-full">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={artwork.dataAiHint || "collage art"}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 truncate" title={artwork.title}>{artwork.title}</CardTitle>
        <Link href={`/artistas/${artwork.artistId}`} className="text-sm text-muted-foreground hover:text-accent transition-colors">
          Por {artwork.artistName}
        </Link>
        {artwork.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{artwork.description}</p>}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        {artwork.price ? (
          <span className="text-lg font-semibold text-primary flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            {artwork.price}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Consultar precio</span>
        )}
        <Button variant="outline" size="sm" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href={`/obras/${artwork.id}`}> 
            <Eye className="w-4 h-4 mr-1" /> Ver Obra
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

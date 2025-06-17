
"use client";

import type { Artwork } from '@/types';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DollarSign, Ruler, Brush } from 'lucide-react';

interface ArtworkFullscreenModalProps {
  artwork: Artwork | null;
  artistEmail?: string; 
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtworkFullscreenModal({ artwork, artistEmail, isOpen, onClose }: ArtworkFullscreenModalProps) {
  if (!artwork) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl w-[90vw] h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl lg:text-3xl font-headline text-primary">
            {artwork.artistName}: {artwork.title}
          </DialogTitle>
          {artistEmail && (
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              Para comprar, contácteme: <a href={`mailto:${artistEmail}`} className="text-accent hover:underline">{artistEmail}</a>
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="relative flex-grow my-4 overflow-hidden">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            style={{ objectFit: "contain" }}
            data-ai-hint={artwork.dataAiHint || "detailed art"}
            className="rounded-md"
          />
        </div>
        <div className="flex-shrink-0 space-y-2 text-sm sm:text-base">
          {artwork.description && (
            <p className="text-muted-foreground leading-relaxed">{artwork.description}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {artwork.size && (
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-2 text-accent shrink-0" />
                <span className="font-medium text-foreground">Tamaño:</span>&nbsp;
                <span className="text-muted-foreground">{artwork.size}</span>
              </div>
            )}
            {artwork.technique && (
              <div className="flex items-center">
                <Brush className="w-4 h-4 mr-2 text-accent shrink-0" />
                <span className="font-medium text-foreground">Técnica:</span>&nbsp;
                <span className="text-muted-foreground">{artwork.technique}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-xl lg:text-2xl font-semibold text-primary pt-2">
            <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-accent" />
            {artwork.price ? `$${artwork.price}` : 'Consultar precio'}
          </div>
          {artwork.uploadDate && (
             <p className="text-xs text-muted-foreground">
                Subido: {new Date(artwork.uploadDate).toLocaleDateString()}
             </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client"; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Edit3, UserCircle, Scissors, DollarSign, Trash2, Eye, Save, Loader2 } from 'lucide-react'; // Changed Palette to Scissors, Added Loader2
import Image from 'next/image';
import type { Artwork } from '@/types';
import { mockArtworks } from '@/lib/mockData'; // Using existing mock artworks for artist panel

// Mock artist's artworks for this panel
const artistOwnedArtworks = mockArtworks.filter(art => art.artistId === 'artist1').slice(0, 3);


export default function PanelArtistaPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [artworks, setArtworks] = useState<Artwork[]>(artistOwnedArtworks);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isArtistAuthenticated');
    if (authStatus !== 'true') {
      router.push('/artistas/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);


  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    // In a real app, you might navigate to an edit form or open a modal
    // For this example, we'll switch to the "Subir/Editar Obra" tab and prefill.
    // This requires more complex state management, so for now, just log.
    console.log("Editing artwork:", artwork.title);
    // Programmatically switch tab
    const tabTrigger = document.querySelector<HTMLButtonElement>('button[data-state="inactive"][value="subir-obra"]');
    tabTrigger?.click();
    // alert(`Editando: ${artwork.title}. Funcionalidad de edición detallada por implementar.`);
  };

  const handleDelete = (artworkId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta obra?")) {
      setArtworks(currentArtworks => currentArtworks.filter(art => art.id !== artworkId));
      // API call to delete artwork
      console.log("Deleted artwork:", artworkId);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Image uploaded:", file.name);
      // Handle file upload logic here
      alert(`Imagen ${file.name} seleccionada. Funcionalidad de subida por implementar.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This path should ideally not be reached if redirection works properly
    // but serves as a fallback.
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Redirigiendo a inicio de sesión...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-headline text-primary">Panel de Artista</h1>
          <Button variant="outline" onClick={() => { localStorage.removeItem('isArtistAuthenticated'); router.push('/');}}>
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="mis-obras" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            <TabsTrigger value="mis-obras" className="py-3"><Scissors className="w-5 h-5 mr-2" />Mis Obras</TabsTrigger> {/* Changed Palette to Scissors */}
            <TabsTrigger value="subir-obra" className="py-3"><UploadCloud className="w-5 h-5 mr-2" />Subir/Editar Obra</TabsTrigger>
            <TabsTrigger value="mi-perfil" className="py-3"><UserCircle className="w-5 h-5 mr-2" />Mi Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="mis-obras">
            <Card>
              <CardHeader>
                <CardTitle>Gestiona Tus Obras</CardTitle>
                <CardDescription>Visualiza, edita o elimina las obras de tu galería.</CardDescription>
              </CardHeader>
              <CardContent>
                {artworks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artworks.map((artwork) => (
                      <Card key={artwork.id} className="overflow-hidden group">
                        <div className="relative aspect-[4/3]">
                          <Image src={artwork.imageUrl} alt={artwork.title} layout="fill" objectFit="cover" data-ai-hint={artwork.dataAiHint || "collage art"} />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(artwork)} className="bg-background/80 hover:bg-background">
                              <Edit3 className="w-4 h-4 mr-1" /> Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(artwork.id)} className="bg-destructive/80 hover:bg-destructive">
                              <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold truncate" title={artwork.title}>{artwork.title}</h3>
                          <p className="text-xs text-muted-foreground">Precio: ${artwork.price || 'N/A'}</p>
                           <p className={`text-xs ${artwork.status === 'approved' ? 'text-green-600' : artwork.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                            Estado: {artwork.status}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No tienes obras subidas aún. ¡Empieza añadiendo tu arte!</p>
                )}
              </CardContent>
               <CardFooter>
                <Button onClick={() => document.querySelector<HTMLButtonElement>('button[data-state="inactive"][value="subir-obra"]')?.click()} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  <UploadCloud className="w-4 h-4 mr-2" /> Subir Nueva Obra
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="subir-obra">
            <Card>
              <CardHeader>
                <CardTitle>{editingArtwork ? "Editar Obra" : "Subir Nueva Obra"}</CardTitle>
                <CardDescription>
                  {editingArtwork ? `Modifica los detalles de "${editingArtwork.title}".` : "Añade una nueva pieza a tu colección para que el mundo la vea."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="artwork-image" className="text-base">Imagen de la Obra</Label>
                  <Input id="artwork-image" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                  {editingArtwork?.imageUrl && (
                    <div className="mt-2 w-32 h-32 relative border rounded">
                      <Image src={editingArtwork.imageUrl} alt="Preview" layout="fill" objectFit="cover" className="rounded" data-ai-hint={editingArtwork.dataAiHint || "artwork preview"}/>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="artwork-title" className="text-base">Título</Label>
                  <Input id="artwork-title" placeholder="Ej: Paisaje Onírico" defaultValue={editingArtwork?.title} className="mt-1 text-base" />
                </div>
                <div>
                  <Label htmlFor="artwork-description" className="text-base">Descripción</Label>
                  <Textarea id="artwork-description" placeholder="Describe tu obra, técnicas, inspiración..." defaultValue={editingArtwork?.description} className="mt-1 text-base" rows={4}/>
                </div>
                <div>
                  <Label htmlFor="artwork-price" className="text-base">Precio (USD)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="artwork-price" type="number" placeholder="Ej: 150" defaultValue={editingArtwork?.price} className="pl-10 text-base" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  <Save className="w-4 h-4 mr-2" /> {editingArtwork ? "Guardar Cambios" : "Subir Obra"}
                </Button>
                 {editingArtwork && (
                  <Button variant="outline" onClick={() => setEditingArtwork(null)} className="ml-2">
                    Cancelar Edición
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="mi-perfil">
            <Card>
              <CardHeader>
                <CardTitle>Actualiza tu Perfil</CardTitle>
                <CardDescription>Mantén tu información de contacto y personal al día.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="profile-image" className="text-base">Foto de Perfil</Label>
                  <Input id="profile-image" type="file" accept="image/*" className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                <div>
                  <Label htmlFor="artist-name" className="text-base">Nombre de Artista</Label>
                  <Input id="artist-name" placeholder="Tu nombre artístico" defaultValue="Elena Rodriguez" className="mt-1 text-base" />
                </div>
                 <div>
                  <Label htmlFor="artist-country" className="text-base">País</Label>
                  <Input id="artist-country" placeholder="País de residencia" defaultValue="Argentina" className="mt-1 text-base" />
                </div>
                <div>
                  <Label htmlFor="artist-bio" className="text-base">Biografía Corta</Label>
                  <Textarea id="artist-bio" placeholder="Cuéntanos sobre ti y tu arte..." defaultValue="Artista visual especializada en collage..." className="mt-1 text-base" rows={4}/>
                </div>
                <div>
                  <Label htmlFor="artist-email" className="text-base">Email de Contacto</Label>
                  <Input id="artist-email" type="email" placeholder="tu@email.com" defaultValue="elena.rodriguez@example.com" className="mt-1 text-base" />
                </div>
                <div>
                  <Label htmlFor="artist-instagram" className="text-base">Instagram (usuario)</Label>
                  <Input id="artist-instagram" placeholder="ej: tu_usuario_insta" defaultValue="elena_art" className="mt-1 text-base" />
                </div>
                 <div>
                  <Label htmlFor="artist-facebook" className="text-base">Facebook (URL perfil/página)</Label>
                  <Input id="artist-facebook" placeholder="ej: https://facebook.com/tuperfil" defaultValue="elena.art.fb" className="mt-1 text-base" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

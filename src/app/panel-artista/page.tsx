
"use client"; 

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Edit3, UserCircle, Scissors, DollarSign, Trash2, Eye, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { Artwork, Artist } from '@/types';
import { mockArtworks, mockArtists } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function PanelArtistaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(null);
  
  // Artist's own artworks
  const [artistArtworks, setArtistArtworks] = useState<Artwork[]>([]);
  
  // For editing existing artwork or uploading new
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [artworkForm, setArtworkForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    price: '',
    dataAiHint: '',
  });

  // For artist profile
  const [profileForm, setProfileForm] = useState({
    name: '',
    country: '',
    bio: '',
    email: '',
    profileImageUrl: '',
    dataAiHint: '', // For profile image
    instagram: '',
    facebook: '',
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('isArtistAuthenticated');
    if (authStatus !== 'true') {
      router.push('/artistas/login');
      return;
    }
    setIsAuthenticated(true);

    let artistId = localStorage.getItem('currentArtistId');
    if (!artistId) {
      // Default to mock artist if no ID (e.g., direct login not through subscription)
      artistId = 'artist1'; 
      localStorage.setItem('currentArtistId', artistId);
    }
    setCurrentArtistId(artistId);
    
    // Load artist profile if exists
    const existingArtist = mockArtists.find(a => a.id === artistId);
    if (existingArtist) {
      setProfileForm({
        name: existingArtist.name,
        country: existingArtist.country,
        bio: existingArtist.bio || '',
        email: existingArtist.email,
        profileImageUrl: existingArtist.profileImageUrl,
        dataAiHint: existingArtist.dataAiHint || '',
        instagram: existingArtist.socialMedia?.instagram || '',
        facebook: existingArtist.socialMedia?.facebook || '',
      });
      setArtistArtworks(mockArtworks.filter(art => art.artistId === artistId));
    } else if (artistId.startsWith('newArtist-')) {
      // New artist, forms will be blank
       setArtistArtworks([]); // No artworks yet
    }
    
    setIsLoading(false);
  }, [router]);

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setArtworkForm({
      title: artwork.title,
      description: artwork.description || '',
      imageUrl: artwork.imageUrl,
      price: artwork.price?.toString() || '',
      dataAiHint: artwork.dataAiHint || '',
    });
    const tabTrigger = document.querySelector<HTMLButtonElement>('button[data-state="inactive"][value="subir-obra"]');
    tabTrigger?.click();
  };

  const handleDeleteArtwork = (artworkId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta obra?")) {
      // Remove from mockArtworks
      const artworkIndex = mockArtworks.findIndex(art => art.id === artworkId);
      if (artworkIndex > -1) {
        mockArtworks.splice(artworkIndex, 1);
      }
      // Update local state
      setArtistArtworks(current => current.filter(art => art.id !== artworkId));
      toast({ title: "Obra eliminada" });
    }
  };
  
  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm(prev => ({ ...prev, [e.target.id.replace('artist-', '')]: e.target.value }));
  };

  const handleArtworkFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setArtworkForm(prev => ({ ...prev, [e.target.id.replace('artwork-', '')]: e.target.value }));
  };

  const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentArtistId) return;

    let existingArtist = mockArtists.find(a => a.id === currentArtistId);
    if (existingArtist) { // Update existing
      existingArtist.name = profileForm.name;
      existingArtist.country = profileForm.country;
      existingArtist.bio = profileForm.bio;
      existingArtist.email = profileForm.email;
      existingArtist.profileImageUrl = profileForm.profileImageUrl;
      existingArtist.dataAiHint = profileForm.dataAiHint;
      existingArtist.socialMedia = {
        instagram: profileForm.instagram,
        facebook: profileForm.facebook,
      };
    } else { // Create new
      const newArtist: Artist = {
        id: currentArtistId,
        name: profileForm.name,
        country: profileForm.country,
        profileImageUrl: profileForm.profileImageUrl || 'https://placehold.co/300x300.png', // Default placeholder
        dataAiHint: profileForm.dataAiHint,
        email: profileForm.email,
        bio: profileForm.bio,
        artworks: [],
        socialMedia: {
          instagram: profileForm.instagram,
          facebook: profileForm.facebook,
        },
        status: 'pending_approval', // New artists start as pending
      };
      mockArtists.push(newArtist);
    }
    toast({ title: "Perfil guardado", description: "Tu información ha sido actualizada." });
  };

  const handleArtworkSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentArtistId) return;

    const artistProfile = mockArtists.find(a => a.id === currentArtistId);
    if (!artistProfile) {
        toast({ title: "Error", description: "Perfil de artista no encontrado. Guarda tu perfil primero.", variant: "destructive"});
        return;
    }

    if (editingArtwork) { // Update existing artwork
      const index = mockArtworks.findIndex(art => art.id === editingArtwork.id);
      if (index > -1) {
        mockArtworks[index] = {
          ...mockArtworks[index],
          title: artworkForm.title,
          description: artworkForm.description,
          imageUrl: artworkForm.imageUrl,
          price: parseFloat(artworkForm.price) || undefined,
          dataAiHint: artworkForm.dataAiHint,
          // status remains, admin handles approval
        };
        setArtistArtworks(prev => prev.map(art => art.id === editingArtwork.id ? mockArtworks[index] : art));
        toast({ title: "Obra actualizada" });
      }
    } else { // Upload new artwork
      const newArtwork: Artwork = {
        id: `art-${Date.now()}`,
        title: artworkForm.title,
        imageUrl: artworkForm.imageUrl || 'https://placehold.co/600x400.png', // Default placeholder
        artistId: currentArtistId,
        artistName: artistProfile.name, 
        price: parseFloat(artworkForm.price) || undefined,
        description: artworkForm.description,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        dataAiHint: artworkForm.dataAiHint,
      };
      mockArtworks.push(newArtwork);
      setArtistArtworks(prev => [...prev, newArtwork]);
      toast({ title: "Obra subida", description: "Tu obra está pendiente de revisión." });
    }
    
    setArtworkForm({ title: '', description: '', imageUrl: '', price: '', dataAiHint: '' });
    setEditingArtwork(null);
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
    return null; // Should be redirected by useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-headline text-primary">Panel de Artista</h1>
          <Button variant="outline" onClick={() => { 
            localStorage.removeItem('isArtistAuthenticated'); 
            localStorage.removeItem('currentArtistId'); 
            router.push('/');
          }}>
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="mis-obras" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            <TabsTrigger value="mis-obras" className="py-3"><Scissors className="w-5 h-5 mr-2" />Mis Obras</TabsTrigger>
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
                {artistArtworks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artistArtworks.map((artwork) => (
                      <Card key={artwork.id} className="overflow-hidden group">
                        <div className="relative aspect-[4/3]">
                          <Image src={artwork.imageUrl} alt={artwork.title} layout="fill" objectFit="cover" data-ai-hint={artwork.dataAiHint || "collage art"} />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditArtwork(artwork)} className="bg-background/80 hover:bg-background">
                              <Edit3 className="w-4 h-4 mr-1" /> Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteArtwork(artwork.id)} className="bg-destructive/80 hover:bg-destructive">
                              <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold truncate" title={artwork.title}>{artwork.title}</h3>
                          <p className="text-xs text-muted-foreground">Precio: ${artwork.price || 'N/A'}</p>
                           <p className={`text-xs font-medium ${artwork.status === 'approved' ? 'text-green-600' : artwork.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                            Estado: {artwork.status === 'approved' ? 'Aprobada' : artwork.status === 'pending' ? 'Pendiente' : 'Rechazada'}
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
                <Button onClick={() => { setEditingArtwork(null); setArtworkForm({ title: '', description: '', imageUrl: '', price: '', dataAiHint: '' }); document.querySelector<HTMLButtonElement>('button[data-state="inactive"][value="subir-obra"]')?.click();}} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  <UploadCloud className="w-4 h-4 mr-2" /> Subir Nueva Obra
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="subir-obra">
            <Card>
              <form onSubmit={handleArtworkSubmit}>
                <CardHeader>
                  <CardTitle>{editingArtwork ? "Editar Obra" : "Subir Nueva Obra"}</CardTitle>
                  <CardDescription>
                    {editingArtwork ? `Modifica los detalles de "${editingArtwork.title}".` : "Añade una nueva pieza a tu colección para que el mundo la vea."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="artwork-imageUrl" className="text-base">URL de la Imagen</Label>
                    <Input id="artwork-imageUrl" placeholder="https://placehold.co/600x400.png" value={artworkForm.imageUrl} onChange={handleArtworkFormChange} className="mt-1 text-base" required/>
                     {artworkForm.imageUrl && (
                        <div className="mt-2 w-32 h-32 relative border rounded">
                        <Image src={artworkForm.imageUrl} alt="Preview" layout="fill" objectFit="cover" className="rounded" data-ai-hint={artworkForm.dataAiHint || "artwork preview"}/>
                        </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="artwork-title" className="text-base">Título</Label>
                    <Input id="artwork-title" placeholder="Ej: Paisaje Onírico" value={artworkForm.title} onChange={handleArtworkFormChange} className="mt-1 text-base" required />
                  </div>
                  <div>
                    <Label htmlFor="artwork-description" className="text-base">Descripción</Label>
                    <Textarea id="artwork-description" placeholder="Describe tu obra, técnicas, inspiración..." value={artworkForm.description} onChange={handleArtworkFormChange} className="mt-1 text-base" rows={4}/>
                  </div>
                  <div>
                    <Label htmlFor="artwork-price" className="text-base">Precio (USD)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="artwork-price" type="number" placeholder="Ej: 150" value={artworkForm.price} onChange={handleArtworkFormChange} className="pl-10 text-base" />
                    </div>
                  </div>
                   <div>
                    <Label htmlFor="artwork-dataAiHint" className="text-base">Palabras clave para IA (ej: abstract nature)</Label>
                    <Input id="artwork-dataAiHint" placeholder="Dos palabras max." value={artworkForm.dataAiHint} onChange={handleArtworkFormChange} className="mt-1 text-base" />
                  </div>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  {editingArtwork && (
                    <Button variant="outline" type="button" onClick={() => { setEditingArtwork(null); setArtworkForm({ title: '', description: '', imageUrl: '', price: '', dataAiHint: '' });}}>
                      Cancelar Edición
                    </Button>
                  )}
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Save className="w-4 h-4 mr-2" /> {editingArtwork ? "Guardar Cambios" : "Subir Obra"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="mi-perfil">
            <Card>
              <form onSubmit={handleProfileSubmit}>
                <CardHeader>
                  <CardTitle>Actualiza tu Perfil</CardTitle>
                  <CardDescription>Mantén tu información de contacto y personal al día.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="artist-profileImageUrl" className="text-base">URL Foto de Perfil</Label>
                    <Input id="artist-profileImageUrl" placeholder="https://placehold.co/300x300.png" value={profileForm.profileImageUrl} onChange={handleProfileFormChange} className="mt-1 text-base" />
                     {profileForm.profileImageUrl && (
                        <div className="mt-2 w-32 h-32 relative border rounded">
                        <Image src={profileForm.profileImageUrl} alt="Preview" layout="fill" objectFit="cover" className="rounded" data-ai-hint={profileForm.dataAiHint || "artist portrait"}/>
                        </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="artist-dataAiHint" className="text-base">Palabras clave para IA (foto perfil)</Label>
                    <Input id="artist-dataAiHint" placeholder="Dos palabras max." value={profileForm.dataAiHint} onChange={handleProfileFormChange} className="mt-1 text-base" />
                  </div>
                  <div>
                    <Label htmlFor="artist-name" className="text-base">Nombre de Artista</Label>
                    <Input id="artist-name" placeholder="Tu nombre artístico" value={profileForm.name} onChange={handleProfileFormChange} className="mt-1 text-base" required/>
                  </div>
                  <div>
                    <Label htmlFor="artist-country" className="text-base">País</Label>
                    <Input id="artist-country" placeholder="País de residencia" value={profileForm.country} onChange={handleProfileFormChange} className="mt-1 text-base" required/>
                  </div>
                  <div>
                    <Label htmlFor="artist-bio" className="text-base">Biografía Corta</Label>
                    <Textarea id="artist-bio" placeholder="Cuéntanos sobre ti y tu arte..." value={profileForm.bio} onChange={handleProfileFormChange} className="mt-1 text-base" rows={4}/>
                  </div>
                  <div>
                    <Label htmlFor="artist-email" className="text-base">Email de Contacto</Label>
                    <Input id="artist-email" type="email" placeholder="tu@email.com" value={profileForm.email} onChange={handleProfileFormChange} className="mt-1 text-base" required/>
                  </div>
                  <div>
                    <Label htmlFor="artist-instagram" className="text-base">Instagram (usuario)</Label>
                    <Input id="artist-instagram" placeholder="ej: tu_usuario_insta" value={profileForm.instagram} onChange={handleProfileFormChange} className="mt-1 text-base" />
                  </div>
                  <div>
                    <Label htmlFor="artist-facebook" className="text-base">Facebook (URL perfil/página)</Label>
                    <Input id="artist-facebook" placeholder="ej: https://facebook.com/tuperfil" value={profileForm.facebook} onChange={handleProfileFormChange} className="mt-1 text-base" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
                    <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

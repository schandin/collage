
"use client"; 

import React, { useState, useEffect, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Edit3, UserCircle, Scissors, DollarSign, Trash2, Eye, Save, Loader2, ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import type { Artwork, Artist } from '@/types';
import { 
  mockArtworks as globalMockArtworks, 
  mockArtists as globalMockArtists,
  updateAndSaveArtists,
  updateAndSaveArtworks
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function PanelArtistaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(null);
  
  // Local state for artworks displayed for the current artist
  const [artistArtworks, setArtistArtworks] = useState<Artwork[]>([]);
  
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [artworkForm, setArtworkForm] = useState({
    title: '',
    description: '',
    imageUrl: '', 
    price: '',
    dataAiHint: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); 
  const [fileName, setFileName] = useState<string | null>(null);
  const [isImageProcessing, setIsImageProcessing] = useState(false);


  const [profileForm, setProfileForm] = useState({
    name: '',
    country: '',
    bio: '',
    email: '',
    profileImageUrl: '', 
    dataAiHint: '', 
    instagram: '',
    facebook: '',
  });
  
  const [profileSelectedFile, setProfileSelectedFile] = useState<File | null>(null);
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string | null>(null);
  const [isProfileImageProcessing, setIsProfileImageProcessing] = useState(false);


  useEffect(() => {
    const authStatus = localStorage.getItem('isArtistAuthenticated');
    if (authStatus !== 'true') {
      router.push('/artistas/login');
      setIsLoading(false);
      return;
    }
    setIsAuthenticated(true);

    let artistIdFromStorage = localStorage.getItem('currentArtistId');
    if (!artistIdFromStorage) {
      toast({
        title: "Error de Identificación",
        description: "No se pudo determinar tu ID de artista. Por favor, intenta iniciar sesión de nuevo.",
        variant: "destructive",
      });
      localStorage.removeItem('isArtistAuthenticated'); 
      router.push('/artistas/login');
      setIsLoading(false);
      return;
    }
    setCurrentArtistId(artistIdFromStorage);
    
    // Load from the global, localStorage-backed mockArtists
    const existingArtist = globalMockArtists.find(a => a.id === artistIdFromStorage);
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
      if (existingArtist.profileImageUrl) { 
          setProfileImagePreviewUrl(existingArtist.profileImageUrl);
      }
      // Load from the global, localStorage-backed mockArtworks for this artist
      setArtistArtworks(globalMockArtworks.filter(art => art.artistId === artistIdFromStorage));
    } else if (artistIdFromStorage.startsWith('newArtist-')) {
      // New artist, potentially no profile saved yet. Initialize form with empty/default values.
      setProfileForm({ name: '', country: '', bio: '', email: '', profileImageUrl: '', dataAiHint: '', instagram: '', facebook: '' });
      setArtistArtworks([]);
    }
    
    setIsLoading(false);
  }, [router, toast]);

  const resetArtworkForm = () => {
    setArtworkForm({ title: '', description: '', imageUrl: '', price: '', dataAiHint: '' });
    setEditingArtwork(null);
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setFileName(null);
    setIsImageProcessing(false);
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setArtworkForm({
      title: artwork.title,
      description: artwork.description || '',
      imageUrl: artwork.imageUrl, 
      price: artwork.price?.toString() || '',
      dataAiHint: artwork.dataAiHint || '',
    });
    // Reset file-specific states when starting an edit
    setSelectedFile(null); 
    setImagePreviewUrl(artwork.imageUrl); // Show current image
    setFileName(null); // No new file selected yet
    setIsImageProcessing(false);
    const tabTrigger = document.querySelector<HTMLButtonElement>('button[data-state="inactive"][value="subir-obra"]');
    tabTrigger?.click();
  };

  const handleDeleteArtwork = (artworkId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta obra?")) {
      const updatedGlobalArtworks = globalMockArtworks.filter(art => art.id !== artworkId);
      updateAndSaveArtworks(updatedGlobalArtworks);
      
      // Update local state for UI
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

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsImageProcessing(true);
      setSelectedFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreviewUrl(dataUrl); 
        setArtworkForm(prev => ({ ...prev, imageUrl: dataUrl })); 
        setIsImageProcessing(false);
      };
      reader.onerror = () => {
        toast({ title: "Error al leer archivo", description: "No se pudo procesar la imagen.", variant: "destructive" });
        setIsImageProcessing(false);
        setSelectedFile(null);
        setImagePreviewUrl(editingArtwork ? editingArtwork.imageUrl : null); // Revert to original if error
        setFileName(null);
        setArtworkForm(prev => ({...prev, imageUrl: editingArtwork ? editingArtwork.imageUrl : ''}));
      };
      reader.readAsDataURL(file);
    } else {
      toast({ title: "Archivo no válido", description: "Por favor, selecciona un archivo de imagen.", variant: "destructive" });
      setSelectedFile(null);
      setImagePreviewUrl(editingArtwork ? editingArtwork.imageUrl : null);
      setFileName(null);
      setArtworkForm(prev => ({...prev, imageUrl: editingArtwork ? editingArtwork.imageUrl : ''}));
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFileName(null);
    setIsImageProcessing(false); 
    if (editingArtwork) {
      // If editing, revert preview and form URL to the original artwork's image
      setImagePreviewUrl(editingArtwork.imageUrl);
      setArtworkForm(prev => ({...prev, imageUrl: editingArtwork.imageUrl}));
    } else {
      // If new artwork, clear preview and form URL
      setImagePreviewUrl(null);
      setArtworkForm(prev => ({...prev, imageUrl: ''}));
    }
  };

  const processProfileFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsProfileImageProcessing(true);
      setProfileSelectedFile(file);
      setProfileFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setProfileImagePreviewUrl(dataUrl); 
        setProfileForm(prev => ({ ...prev, profileImageUrl: dataUrl }));
        setIsProfileImageProcessing(false);
      };
      reader.onerror = () => {
        toast({ title: "Error al leer archivo de perfil", description: "No se pudo procesar la imagen de perfil.", variant: "destructive" });
        setIsProfileImageProcessing(false);
        setProfileSelectedFile(null);
        setProfileImagePreviewUrl(profileForm.profileImageUrl || null); // Revert to original if error
        setProfileFileName(null);
      };
      reader.readAsDataURL(file);
    } else {
      toast({ title: "Archivo de perfil no válido", description: "Por favor, selecciona un archivo de imagen.", variant: "destructive" });
      setProfileSelectedFile(null);
      setProfileImagePreviewUrl(profileForm.profileImageUrl || null);
      setProfileFileName(null);
      setIsProfileImageProcessing(false);
    }
  };

  const handleProfileFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processProfileFile(file);
    }
  };

  const handleProfileDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleProfileDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processProfileFile(file);
    }
  };
  
  const handleRemoveProfileImage = () => {
    setProfileSelectedFile(null);
    setProfileImagePreviewUrl(null); 
    setProfileFileName(null);
    setIsProfileImageProcessing(false);
    // When removing, we should clear the profileImageUrl in the form,
    // placeholder logic will apply on submit if it remains empty.
    setProfileForm(prev => ({ ...prev, profileImageUrl: '' })); 
  };


  const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentArtistId || isProfileImageProcessing) return;

    let finalProfileImageUrl = profileForm.profileImageUrl;
    const existingArtistForCheck = globalMockArtists.find(a => a.id === currentArtistId);

    if (!finalProfileImageUrl && !(existingArtistForCheck && existingArtistForCheck.profileImageUrl) && !profileSelectedFile) {
      // Only set placeholder if no new file is selected AND no previous image exists AND form field is empty
      finalProfileImageUrl = 'https://placehold.co/300x300.png'; 
    } else if (!finalProfileImageUrl && profileSelectedFile) {
      // This case should be covered by processProfileFile setting profileForm.profileImageUrl
      // but as a fallback, if profileImageUrl is somehow empty despite a file being selected,
      // it implies an error or an intermediate state. We should probably rely on profileImagePreviewUrl if available.
      finalProfileImageUrl = profileImagePreviewUrl || 'https://placehold.co/300x300.png';
    }


    let artistExists = false;
    const updatedGlobalArtistsList = globalMockArtists.map(a => {
      if (a.id === currentArtistId) {
        artistExists = true;
        return {
          ...a,
          name: profileForm.name,
          country: profileForm.country,
          bio: profileForm.bio,
          email: profileForm.email,
          profileImageUrl: finalProfileImageUrl,
          dataAiHint: profileForm.dataAiHint,
          socialMedia: {
            instagram: profileForm.instagram,
            facebook: profileForm.facebook,
          },
          status: a.status || 'pending_approval', // Preserve existing status or default to pending
        };
      }
      return a;
    });

    if (!artistExists) { 
      const newArtist: Artist = {
        id: currentArtistId,
        name: profileForm.name,
        country: profileForm.country,
        profileImageUrl: finalProfileImageUrl,
        dataAiHint: profileForm.dataAiHint,
        email: profileForm.email,
        bio: profileForm.bio,
        artworks: [], 
        socialMedia: {
          instagram: profileForm.instagram,
          facebook: profileForm.facebook,
        },
        status: 'pending_approval', // New artists are pending approval
      };
      updatedGlobalArtistsList.push(newArtist);
    }
    updateAndSaveArtists(updatedGlobalArtistsList);
    toast({ title: "Perfil guardado", description: "Tu información ha sido actualizada. Si eres un nuevo artista o cambiaste tu foto, tu perfil pasará a revisión." });
  };

  const handleArtworkSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentArtistId || isImageProcessing) return;

    if (!artworkForm.title.trim()) {
      toast({ title: "Título requerido", description: "Por favor, asigna un título a tu obra.", variant: "destructive" });
      return;
    }
    
    const finalImageUrl = artworkForm.imageUrl || (editingArtwork ? editingArtwork.imageUrl : '');
    if (!finalImageUrl) {
      toast({ title: "Imagen requerida", description: "Por favor, sube una imagen para la obra.", variant: "destructive" });
      return;
    }
    
    const artistProfile = globalMockArtists.find(a => a.id === currentArtistId);
    if (!artistProfile) {
        toast({ 
          title: "Guarda tu perfil primero", 
          description: "Para subir obras, tu perfil de artista debe estar guardado. Ve a la pestaña 'Mi Perfil' y guarda tus datos.", 
          variant: "destructive"
        });
        return;
    }

    let updatedGlobalArtworksList;
    if (editingArtwork) { 
      let originalStatus = 'pending'; // Default if somehow not found
      const originalArtwork = globalMockArtworks.find(art => art.id === editingArtwork.id);
      if(originalArtwork) originalStatus = originalArtwork.status || 'pending';

      const imageChanged = artworkForm.imageUrl !== editingArtwork.imageUrl && selectedFile; 

      updatedGlobalArtworksList = globalMockArtworks.map(art => {
        if (art.id === editingArtwork.id) {
          return {
            ...art,
            title: artworkForm.title,
            description: artworkForm.description,
            imageUrl: finalImageUrl, 
            price: parseFloat(artworkForm.price) || undefined,
            dataAiHint: artworkForm.dataAiHint,
            status: (originalStatus === 'approved' && imageChanged) ? 'pending' : originalStatus,
          };
        }
        return art;
      });
      toast({ title: "Obra actualizada", description: imageChanged && originalStatus === 'approved' ? "Cambios guardados. La obra requerirá nueva aprobación por cambio de imagen." : "Cambios guardados." });
    } else { 
      const newArtwork: Artwork = {
        id: `art-${Date.now()}`,
        title: artworkForm.title,
        imageUrl: finalImageUrl, 
        artistId: currentArtistId,
        artistName: artistProfile.name, 
        price: parseFloat(artworkForm.price) || undefined,
        description: artworkForm.description,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending', 
        dataAiHint: artworkForm.dataAiHint,
      };
      updatedGlobalArtworksList = [...globalMockArtworks, newArtwork];
      toast({ title: "Obra subida", description: "Tu obra está pendiente de revisión." });
    }
    
    updateAndSaveArtworks(updatedGlobalArtworksList);
    // Update local state for UI to reflect changes immediately
    setArtistArtworks(globalMockArtworks.filter(art => art.artistId === currentArtistId));
    resetArtworkForm();
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
    return null; 
  }
  
  const currentImageToPreview = imagePreviewUrl || (editingArtwork && artworkForm.imageUrl && !selectedFile ? artworkForm.imageUrl : null);
  const currentProfileImageToPreview = profileImagePreviewUrl || (profileForm.profileImageUrl && !profileSelectedFile ? profileForm.profileImageUrl : null);


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
                <Button onClick={() => { resetArtworkForm(); document.querySelector<HTMLButtonElement>('button[data-state="inactive"][value="subir-obra"]')?.click();}} className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90">
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
                    {editingArtwork && selectedFile && <span className="block text-xs text-blue-600 mt-1">Has seleccionado una nueva imagen. Si la guardas, la obra podría requerir nueva aprobación.</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="artwork-file-upload" className="text-base mb-2 block">Imagen de la Obra</Label>
                    <div 
                      className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-1 text-center">
                        {!currentImageToPreview && !isImageProcessing && <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />}
                        {isImageProcessing && <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />}
                        <div className="flex text-sm text-muted-foreground justify-center">
                          <Label htmlFor="artwork-file-input" className={`relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary ${isImageProcessing ? 'pointer-events-none opacity-50' : ''}`}>
                            <span>{currentImageToPreview ? 'Cambiar imagen' : (isImageProcessing ? 'Procesando...' : 'Sube un archivo')}</span>
                            <input id="artwork-file-input" name="artwork-file-input" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} disabled={isImageProcessing} />
                          </Label>
                          {!currentImageToPreview && !isImageProcessing && <p className="pl-1">o arrastra y suelta</p>}
                        </div>
                        {!currentImageToPreview && !isImageProcessing && <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP</p>}
                         {fileName && !currentImageToPreview && !isImageProcessing && <p className="text-sm text-foreground pt-2">Archivo: {fileName}</p>}
                      </div>
                    </div>

                    {currentImageToPreview && (
                      <div className="mt-4 relative w-48 h-48 border rounded-md overflow-hidden mx-auto group">
                        <Image
                          src={currentImageToPreview}
                          alt="Previsualización de la obra"
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                          data-ai-hint={artworkForm.dataAiHint || "artwork preview"}
                        />
                        <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                            onClick={handleRemoveImage}
                            aria-label="Eliminar imagen"
                            disabled={isImageProcessing}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                         {fileName && <p className="text-xs text-center text-muted-foreground pt-1 truncate w-full px-1" title={fileName}>{fileName}</p>}
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
                    <Button variant="outline" type="button" onClick={resetArtworkForm} disabled={isImageProcessing}>
                      Cancelar Edición
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isImageProcessing || (!artworkForm.imageUrl && !editingArtwork && !selectedFile)} 
                  >
                    {isImageProcessing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingArtwork ? "Guardar Cambios" : "Subir Obra"}
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
                    <Label htmlFor="artist-profile-file-upload" className="text-base mb-2 block">Foto de Perfil</Label>
                    <div 
                      className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors"
                      onDragOver={handleProfileDragOver}
                      onDrop={handleProfileDrop}
                    >
                      <div className="space-y-1 text-center">
                        {!currentProfileImageToPreview && !isProfileImageProcessing && <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />}
                        {isProfileImageProcessing && <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />}
                        <div className="flex text-sm text-muted-foreground justify-center">
                          <Label htmlFor="artist-profile-file-input" className={`relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary ${isProfileImageProcessing ? 'pointer-events-none opacity-50' : ''}`}>
                            <span>{currentProfileImageToPreview ? 'Cambiar foto de perfil' : (isProfileImageProcessing ? 'Procesando...' : 'Sube un archivo')}</span>
                            <input id="artist-profile-file-input" name="artist-profile-file-input" type="file" className="sr-only" accept="image/*" onChange={handleProfileFileChange} disabled={isProfileImageProcessing} />
                          </Label>
                          {!currentProfileImageToPreview && !isProfileImageProcessing && <p className="pl-1">o arrastra y suelta</p>}
                        </div>
                        {!currentProfileImageToPreview && !isProfileImageProcessing && <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP</p>}
                         {profileFileName && !currentProfileImageToPreview && !isProfileImageProcessing && <p className="text-sm text-foreground pt-2">Archivo: {profileFileName}</p>}
                      </div>
                    </div>

                    {currentProfileImageToPreview && (
                      <div className="mt-4 relative w-32 h-32 border rounded-md overflow-hidden mx-auto group">
                        <Image
                          src={currentProfileImageToPreview}
                          alt="Previsualización foto de perfil"
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                          data-ai-hint={profileForm.dataAiHint || "artist portrait preview"}
                        />
                        <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                            onClick={handleRemoveProfileImage}
                            aria-label="Eliminar foto de perfil"
                            disabled={isProfileImageProcessing}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                         {profileFileName && <p className="text-xs text-center text-muted-foreground pt-1 truncate w-full px-1" title={profileFileName}>{profileFileName}</p>}
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
                  <Button type="submit" className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isProfileImageProcessing}>
                    {isProfileImageProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                     Guardar Cambios
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

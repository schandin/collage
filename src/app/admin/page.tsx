
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCheck, UserX, Eye, CheckCircle, XCircle, DollarSign, Users, Image as ImageIconLucide, ShieldCheck, 
  BadgeDollarSign, Star, CalendarDays, Receipt, Settings, Tag, FileText, MailCheck, UserMinus, RotateCcw, Trash2, Archive
} from 'lucide-react';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

import { 
  getMockArtists,
  getMockArtworks,
  getMockSubscriptionRecords,
  getMockNewsletterSubscriptions,
  updateAndSaveArtists,
  updateAndSaveArtworks,
  mockSubscriptionPlans,
  permanentlyDeleteArtistAndArtworks
} from '@/lib/mockData';
import type { Artist, Artwork, SubscriptionPlan, SubscriptionRecord, NewsletterSubscription } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [artistsForUI, setArtistsForUI] = useState<Artist[]>([]);
  const [deletedArtistsForUI, setDeletedArtistsForUI] = useState<Artist[]>([]);
  const [pendingArtworksForUI, setPendingArtworksForUI] = useState<Artwork[]>([]);
  const [subscriptionRecordsForUI, setSubscriptionRecordsForUI] = useState<SubscriptionRecord[]>([]);
  const [newsletterSubscriptionsForUI, setNewsletterSubscriptionsForUI] = useState<NewsletterSubscription[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [artistToDeletePermanentlyId, setArtistToDeletePermanentlyId] = useState<string | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    if (authStatus !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      refreshAllUIData();
    }
  }, [router]);

  const refreshAllUIData = () => {
    refreshArtistsUI();
    refreshArtworksUI();
    refreshSubscriptionRecordsUI();
    refreshNewsletterSubscriptionsUI();
  }

  const refreshArtistsUI = () => {
    const currentGlobalArtists = getMockArtists();
    setArtistsForUI(currentGlobalArtists.filter(a => a.status !== 'deleted').map(a => ({...a})));
    setDeletedArtistsForUI(currentGlobalArtists.filter(a => a.status === 'deleted').map(a => ({...a})));
  }

  const refreshArtworksUI = () => {
    const currentArtworksFromGlobal = getMockArtworks().map(art => ({...art}));
    setPendingArtworksForUI(currentArtworksFromGlobal.filter(art => art.status === 'pending'));
  };

  const refreshSubscriptionRecordsUI = () => {
    setSubscriptionRecordsForUI(getMockSubscriptionRecords().map(sr => ({...sr})));
  }

  const refreshNewsletterSubscriptionsUI = () => {
    setNewsletterSubscriptionsForUI(getMockNewsletterSubscriptions().map(ns => ({...ns})));
  }

  const handleApproveArtist = (artistId: string) => {
    const currentGlobalArtists = getMockArtists();
    const updatedGlobalArtists = currentGlobalArtists.map(a =>
      a.id === artistId ? { ...a, status: 'active' } : a
    );
    updateAndSaveArtists(updatedGlobalArtists);
    refreshArtistsUI();

    const approvedArtistName = updatedGlobalArtists.find(a => a.id === artistId)?.name || artistId;
    toast({ title: "Artista Aprobado", description: `El artista ${approvedArtistName} ahora está activo.` });
  };

  const handleBlockArtist = (artistId: string) => {
    const currentGlobalArtists = getMockArtists();
    const updatedGlobalArtists = currentGlobalArtists.map(a =>
      a.id === artistId ? { ...a, status: 'blocked' } : a
    );
    updateAndSaveArtists(updatedGlobalArtists);
    refreshArtistsUI();

    const blockedArtistName = updatedGlobalArtists.find(a => a.id === artistId)?.name || artistId;
    toast({ title: "Artista Bloqueado", description: `El artista ${blockedArtistName} ha sido bloqueado.`, variant: "destructive" });
  };

  const handleSoftDeleteArtist = (artistId: string) => {
    const currentGlobalArtists = getMockArtists();
    const updatedGlobalArtists = currentGlobalArtists.map(a =>
      a.id === artistId ? { ...a, status: 'deleted' } : a
    );
    updateAndSaveArtists(updatedGlobalArtists);
    refreshArtistsUI();
    const artistName = updatedGlobalArtists.find(a => a.id === artistId)?.name || artistId;
    toast({ title: "Artista Eliminado (Temporalmente)", description: `El artista ${artistName} ha sido movido a la lista de eliminados.`});
  };

  const handleRestoreArtist = (artistId: string) => {
    const currentGlobalArtists = getMockArtists();
    const updatedGlobalArtists = currentGlobalArtists.map(a =>
      a.id === artistId ? { ...a, status: 'pending_approval' } : a // Restore to pending approval
    );
    updateAndSaveArtists(updatedGlobalArtists);
    refreshArtistsUI();
    const artistName = updatedGlobalArtists.find(a => a.id === artistId)?.name || artistId;
    toast({ title: "Artista Restaurado", description: `El artista ${artistName} ha sido restaurado y está pendiente de aprobación.` });
  };

  const confirmPermanentDelete = () => {
    if (artistToDeletePermanentlyId) {
      const artistName = getMockArtists().find(a => a.id === artistToDeletePermanentlyId)?.name || artistToDeletePermanentlyId;
      permanentlyDeleteArtistAndArtworks(artistToDeletePermanentlyId);
      refreshAllUIData(); // Refresh all data as artworks might be affected
      toast({ title: "Artista Eliminado Permanentemente", description: `El artista ${artistName} y sus obras han sido eliminados.`, variant: "destructive" });
      setArtistToDeletePermanentlyId(null);
    }
  };
  
  const handleApproveArtwork = (artworkId: string) => {
    const currentGlobalArtworks = getMockArtworks();
    const updatedGlobalArtworks = currentGlobalArtworks.map(art =>
      art.id === artworkId ? { ...art, status: 'approved' } : art
    );
    updateAndSaveArtworks(updatedGlobalArtworks);
    refreshArtworksUI(); 

    const approvedArtworkTitle = updatedGlobalArtworks.find(art => art.id === artworkId)?.title || artworkId;
    toast({ title: "Obra Aprobada", description: `La obra ${approvedArtworkTitle} ha sido aprobada.` });
  };

  const handleRejectArtwork = (artworkId: string) => {
    const currentGlobalArtworks = getMockArtworks();
    const updatedGlobalArtworks = currentGlobalArtworks.map(art =>
      art.id === artworkId ? { ...art, status: 'rejected' } : art
    );
    updateAndSaveArtworks(updatedGlobalArtworks);
    refreshArtworksUI(); 
    
    const rejectedArtworkTitle = updatedGlobalArtworks.find(art => art.id === artworkId)?.title || artworkId;
    toast({ title: "Obra Rechazada", description: `La obra ${rejectedArtworkTitle} ha sido rechazada.`, variant: "destructive" });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Redirigiendo a inicio de sesión...</p>
      </div>
    );
  }

  const getPlanBadge = (planId?: string) => {
    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    if (!plan) return <Badge variant="outline" className="text-xs">Sin plan</Badge>;

    let icon = <BadgeDollarSign className="w-3 h-3 mr-1" />;
    let className = "bg-gray-200 text-gray-800 hover:bg-gray-300";

    if (plan.name.toLowerCase() === 'avanzado') {
      icon = <Star className="w-3 h-3 mr-1 text-yellow-500" />;
      className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-400";
    } else if (plan.name.toLowerCase() === 'priority') {
      icon = <ShieldCheck className="w-3 h-3 mr-1 text-purple-500" />;
      className = "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-400";
    } else if (plan.name.toLowerCase() === 'básico') {
       icon = <Users className="w-3 h-3 mr-1 text-blue-500" />;
       className = "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-400";
    }
    
    return (
      <Badge variant="outline" className={`text-xs ${className}`}>
        {icon}
        {plan.name}
      </Badge>
    );
  };
  
  const getStatusBadge = (status?: Artist['status']) => {
    let text = 'Desconocido';
    let className = 'bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200';

    switch (status) {
        case 'active':
            text = 'Activo';
            className = 'bg-green-100 text-green-800 border-green-400 hover:bg-green-200';
            break;
        case 'pending_approval':
            text = 'Pend. Aprob.';
            className = 'bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200';
            break;
        case 'profile_incomplete':
            text = 'Perfil Incomp.';
            className = 'bg-orange-100 text-orange-800 border-orange-400 hover:bg-orange-200';
            break;
        case 'blocked':
            text = 'Bloqueado';
            className = 'bg-red-100 text-red-800 border-red-400 hover:bg-red-200';
            break;
        case 'deleted':
            text = 'Eliminado';
            className = 'bg-slate-200 text-slate-800 border-slate-400 hover:bg-slate-300 line-through';
            break;
    }
    return <Badge variant="outline" className={className}>{text}</Badge>;
  };


  return (
    <AlertDialog open={!!artistToDeletePermanentlyId} onOpenChange={(open) => !open && setArtistToDeletePermanentlyId(null)}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-headline text-primary">Panel de Administración</h1>
            <Button variant="outline" onClick={() => { localStorage.removeItem('isAdminAuthenticated'); router.push('/admin/login');}}>
              Cerrar Sesión
            </Button>
          </div>

          <Tabs defaultValue="manage-artists" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-2 mb-6">
              <TabsTrigger value="manage-artists" className="py-3"><Users className="w-5 h-5 mr-2" />Gestionar Artistas</TabsTrigger>
              <TabsTrigger value="moderate-content" className="py-3"><ImageIconLucide className="w-5 h-5 mr-2" />Moderar Obras</TabsTrigger>
              <TabsTrigger value="verify-payments" className="py-3"><DollarSign className="w-5 h-5 mr-2" />Verificar Pagos</TabsTrigger>
              <TabsTrigger value="newsletter-subscribers" className="py-3"><MailCheck className="w-5 h-5 mr-2" />Suscriptores Newsletter</TabsTrigger>
              <TabsTrigger value="deleted-artists" className="py-3"><Archive className="w-5 h-5 mr-2" />Artistas Eliminados</TabsTrigger>
              <TabsTrigger value="site-settings" className="py-3"><Settings className="w-5 h-5 mr-2" />Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="manage-artists">
              <Card>
                <CardHeader>
                  <CardTitle>Artistas Registrados</CardTitle>
                  <CardDescription>Administra los perfiles de artistas, aprueba o bloquea según sea necesario.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Nombre</TableHead>
                        <TableHead>País</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Fecha Adhesión</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {artistsForUI.map((artist) => (
                        <TableRow key={artist.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Image
                                src={artist.profileImageUrl || 'https://placehold.co/32x32.png'}
                                alt={artist.name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover aspect-square"
                                data-ai-hint="artist avatar"
                              />
                              <span className="truncate" title={artist.name}>{artist.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{artist.country}</TableCell>
                          <TableCell className="truncate" title={artist.email}>{artist.email}</TableCell>
                          <TableCell>
                            {getPlanBadge(artist.subscriptionPlanId)}
                          </TableCell>
                          <TableCell>
                            {artist.registrationDate ? new Date(artist.registrationDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(artist.status)}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" title="Ver Perfil" onClick={() => router.push(`/artistas/${artist.id}`)}><Eye className="w-4 h-4" /></Button>
                            {artist.status !== 'active' && artist.status !== 'blocked' && artist.status !== 'deleted' &&
                              <Button variant="ghost" size="icon" title="Aprobar" onClick={() => handleApproveArtist(artist.id)} className="text-green-600 hover:text-green-700"><UserCheck className="w-4 h-4" /></Button>}
                            {artist.status !== 'blocked' && artist.status !== 'deleted' &&
                              <Button variant="ghost" size="icon" title="Bloquear" onClick={() => handleBlockArtist(artist.id)} className="text-red-600 hover:text-red-700"><UserX className="w-4 h-4" /></Button>}
                            {artist.status !== 'deleted' && 
                              <Button variant="ghost" size="icon" title="Eliminar (Temporal)" onClick={() => handleSoftDeleteArtist(artist.id)} className="text-orange-600 hover:text-orange-700"><UserMinus className="w-4 h-4" /></Button>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="moderate-content">
              <Card>
                <CardHeader>
                  <CardTitle>Obras Pendientes de Moderación</CardTitle>
                  <CardDescription>Revisa y aprueba o rechaza las obras subidas por los artistas.</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingArtworksForUI.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingArtworksForUI.map((artwork) => (
                      <Card key={artwork.id} className="overflow-hidden">
                         <div className="relative aspect-[4/3] w-full">
                           <Image src={artwork.imageUrl} alt={artwork.title} fill style={{ objectFit: "cover" }} data-ai-hint={artwork.dataAiHint || "pending art"} />
                         </div>
                         <CardContent className="p-4">
                           <h3 className="font-semibold text-lg mb-1 truncate" title={artwork.title}>{artwork.title}</h3>
                           <p className="text-sm text-muted-foreground mb-1">Artista: {artwork.artistName}</p>
                           <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{artwork.description}</p>
                         </CardContent>
                         <CardFooter className="flex justify-end gap-2 p-4 border-t">
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApproveArtwork(artwork.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleRejectArtwork(artwork.id)}>
                              <XCircle className="w-4 h-4 mr-1" /> Rechazar
                            </Button>
                         </CardFooter>
                      </Card>
                    ))}
                  </div>
                   ) : (
                    <p className="text-center text-muted-foreground py-10">No hay obras pendientes de moderación.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verify-payments">
              <Card>
                <CardHeader>
                  <CardTitle>Registros de Suscripciones</CardTitle>
                  <CardDescription>Visualiza los pagos de suscripciones (simulados) registrados en la plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                  {subscriptionRecordsForUI.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email del Artista</TableHead>
                          <TableHead>Plan Suscrito</TableHead>
                          <TableHead>Método de Pago</TableHead>
                          <TableHead>Fecha de Suscripción</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptionRecordsForUI.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium truncate" title={record.artistEmail}>{record.artistEmail}</TableCell>
                            <TableCell>{record.planName}</TableCell>
                            <TableCell>{record.paymentMethod}</TableCell>
                            <TableCell>{new Date(record.subscriptionDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                               <Badge variant={record.status === 'Confirmado' ? 'default' : 'secondary'}
                                 className={record.status === 'Confirmado' ? 'bg-green-100 text-green-800 border-green-400' : 'bg-yellow-100 text-yellow-800 border-yellow-400'}
                               >
                                <Receipt className="w-3 h-3 mr-1.5"/>
                                {record.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="mt-4 border-2 border-dashed border-border rounded-lg p-10 text-center">
                      <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aún no hay registros de suscripciones.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="newsletter-subscribers">
              <Card>
                <CardHeader>
                  <CardTitle>Suscriptores del Newsletter</CardTitle>
                  <CardDescription>Lista de usuarios que se han suscrito al newsletter.</CardDescription>
                </CardHeader>
                <CardContent>
                  {newsletterSubscriptionsForUI.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email del Suscriptor</TableHead>
                          <TableHead>Fecha de Suscripción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newsletterSubscriptionsForUI.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium truncate" title={sub.email}>{sub.email}</TableCell>
                            <TableCell>{new Date(sub.subscriptionDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="mt-4 border-2 border-dashed border-border rounded-lg p-10 text-center">
                      <MailCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aún no hay suscriptores al newsletter.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deleted-artists">
              <Card>
                <CardHeader>
                  <CardTitle>Artistas Eliminados (Temporalmente)</CardTitle>
                  <CardDescription>Artistas que han sido marcados para eliminación. Pueden ser restaurados o eliminados permanentemente.</CardDescription>
                </CardHeader>
                <CardContent>
                  {deletedArtistsForUI.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Nombre</TableHead>
                          <TableHead>País</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Fecha Adhesión</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deletedArtistsForUI.map((artist) => (
                          <TableRow key={artist.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={artist.profileImageUrl || 'https://placehold.co/32x32.png'}
                                  alt={artist.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full object-cover aspect-square"
                                  data-ai-hint="artist avatar"
                                />
                                <span className="truncate" title={artist.name}>{artist.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{artist.country}</TableCell>
                            <TableCell className="truncate" title={artist.email}>{artist.email}</TableCell>
                            <TableCell>{getPlanBadge(artist.subscriptionPlanId)}</TableCell>
                            <TableCell>{artist.registrationDate ? new Date(artist.registrationDate).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" title="Restaurar Artista" onClick={() => handleRestoreArtist(artist.id)} className="text-green-600 hover:text-green-700"><RotateCcw className="w-4 h-4" /></Button>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="Eliminar Permanentemente" onClick={() => setArtistToDeletePermanentlyId(artist.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                              </AlertDialogTrigger>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="mt-4 border-2 border-dashed border-border rounded-lg p-10 text-center">
                      <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No hay artistas eliminados temporalmente.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="site-settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Sitio</CardTitle>
                  <CardDescription>Ajustes generales de la plataforma.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center"><Tag className="w-5 h-5 mr-2 text-accent"/>Gestión de Categorías de Arte</h3>
                    <p className="text-muted-foreground mb-3">Define y administra las categorías que los artistas pueden usar para sus obras.</p>
                    <Button variant="outline">Administrar Categorías</Button>
                     <div className="mt-3 text-xs text-muted-foreground">
                      (Funcionalidad por implementar)
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center"><Star className="w-5 h-5 mr-2 text-accent"/>Contenido Destacado</h3>
                    <p className="text-muted-foreground mb-3">Selecciona artistas u obras específicas para destacar en la página principal.</p>
                    <Button variant="outline">Gestionar Destacados</Button>
                     <div className="mt-3 text-xs text-muted-foreground">
                      (Funcionalidad por implementar)
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-accent"/>Documentos Legales</h3>
                    <p className="text-muted-foreground mb-3">Actualiza los enlaces a los Términos y Condiciones y la Política de Privacidad.</p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">Editar Términos y Condiciones</Button>
                      <Button variant="outline" size="sm" className="ml-2">Editar Política de Privacidad</Button>
                    </div>
                     <div className="mt-3 text-xs text-muted-foreground">
                      (Funcionalidad por implementar: actualmente los enlaces están en el Footer)
                    </div>
                  </div>
                   <div className="mt-6 border-t pt-6 text-center">
                      <Settings className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">Más opciones de configuración se añadirán aquí a medida que la plataforma crezca.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al artista y todas sus obras asociadas de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setArtistToDeletePermanentlyId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPermanentDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Sí, eliminar permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}


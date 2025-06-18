
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, UserX, Eye, CheckCircle, XCircle, DollarSign, Users, Image as ImageIconLucide, ShieldCheck, BadgeDollarSign, Star, CalendarDays, Receipt } from 'lucide-react';
import { 
  getMockArtists,
  getMockArtworks,
  getMockSubscriptionRecords,
  updateAndSaveArtists,
  updateAndSaveArtworks,
  mockSubscriptionPlans 
} from '@/lib/mockData';
import type { Artist, Artwork, SubscriptionPlan, SubscriptionRecord } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [artistsForUI, setArtistsForUI] = useState<Artist[]>([]);
  const [pendingArtworksForUI, setPendingArtworksForUI] = useState<Artwork[]>([]);
  const [subscriptionRecordsForUI, setSubscriptionRecordsForUI] = useState<SubscriptionRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  }

  const refreshArtistsUI = () => {
    setArtistsForUI(getMockArtists().map(a => ({...a})));
  }

  const refreshArtworksUI = () => {
    const currentArtworksFromGlobal = getMockArtworks().map(art => ({...art}));
    setPendingArtworksForUI(currentArtworksFromGlobal.filter(art => art.status === 'pending'));
  };

  const refreshSubscriptionRecordsUI = () => {
    setSubscriptionRecordsForUI(getMockSubscriptionRecords().map(sr => ({...sr})));
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

  return (
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <TabsTrigger value="manage-artists" className="py-3"><Users className="w-5 h-5 mr-2" />Gestionar Artistas</TabsTrigger>
            <TabsTrigger value="moderate-content" className="py-3"><ImageIconLucide className="w-5 h-5 mr-2" />Moderar Obras</TabsTrigger>
            <TabsTrigger value="verify-payments" className="py-3"><DollarSign className="w-5 h-5 mr-2" />Verificar Pagos</TabsTrigger>
            <TabsTrigger value="site-settings" className="py-3"><ShieldCheck className="w-5 h-5 mr-2" />Configuración</TabsTrigger>
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
                              src={artist.profileImageUrl || 'https://placehold.co/40x40.png'}
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
                          <Badge variant={artist.status === 'active' ? 'default' : artist.status === 'pending_approval' ? 'secondary' : artist.status === 'profile_incomplete' ? 'secondary' : 'destructive'}
                           className={
                             artist.status === 'active' ? 'bg-green-100 text-green-800 border-green-400 hover:bg-green-200' 
                             : (artist.status === 'pending_approval' || artist.status === 'profile_incomplete') ? 'bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200' 
                             : 'bg-red-100 text-red-800 border-red-400 hover:bg-red-200'
                            }
                          >
                            {artist.status === 'active' ? 'Activo' 
                             : artist.status === 'pending_approval' ? 'Pendiente Aprob.'
                             : artist.status === 'profile_incomplete' ? 'Perfil Incomp.'
                             : 'Bloqueado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" title="Ver Perfil" onClick={() => router.push(`/artistas/${artist.id}`)}><Eye className="w-4 h-4" /></Button>
                          {artist.status !== 'active' && 
                            <Button variant="ghost" size="icon" title="Aprobar" onClick={() => handleApproveArtist(artist.id)} className="text-green-600 hover:text-green-700"><UserCheck className="w-4 h-4" /></Button>}
                          {artist.status !== 'blocked' && 
                            <Button variant="ghost" size="icon" title="Bloquear" onClick={() => handleBlockArtist(artist.id)} className="text-red-600 hover:text-red-700"><UserX className="w-4 h-4" /></Button>}
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
          
          <TabsContent value="site-settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
                <CardDescription>Ajustes generales de la plataforma (funcionalidad por implementar).</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Aquí se podrían configurar aspectos como categorías de arte, términos de servicio, etc.</p>
                 <div className="mt-4 border-2 border-dashed border-border rounded-lg p-10 text-center">
                    <ShieldCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">La configuración del sitio aún no está implementada.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

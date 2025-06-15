"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, UserX, Edit, Trash2, ShieldCheck, Search, Eye, CheckCircle, XCircle, DollarSign, Users, Image as ImageIcon } from 'lucide-react';
import { mockArtists, mockArtworks } from '@/lib/mockData';
import type { Artist, Artwork } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>(mockArtists);
  const [artworks, setArtworks] = useState<Artwork[]>(mockArtworks);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simple mock authentication check
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    if (authStatus !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleApproveArtist = (artistId: string) => {
    setArtists(prev => prev.map(a => a.id === artistId ? { ...a, status: 'active' } : a));
    console.log(`Artist ${artistId} approved.`);
  };

  const handleBlockArtist = (artistId: string) => {
    setArtists(prev => prev.map(a => a.id === artistId ? { ...a, status: 'blocked' } : a));
    console.log(`Artist ${artistId} blocked.`);
  };
  
  const handleApproveArtwork = (artworkId: string) => {
    setArtworks(prev => prev.map(art => art.id === artworkId ? { ...art, status: 'approved' } : art));
    console.log(`Artwork ${artworkId} approved.`);
  };

  const handleRejectArtwork = (artworkId: string) => {
     setArtworks(prev => prev.map(art => art.id === artworkId ? { ...art, status: 'rejected' } : art));
    console.log(`Artwork ${artworkId} rejected.`);
  };


  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Redirigiendo a inicio de sesión...</p>
      </div>
    );
  }

  const pendingArtworks = artworks.filter(art => art.status === 'pending');

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
            <TabsTrigger value="moderate-content" className="py-3"><ImageIcon className="w-5 h-5 mr-2" />Moderar Obras</TabsTrigger>
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artists.map((artist) => (
                      <TableRow key={artist.id}>
                        <TableCell className="font-medium">{artist.name}</TableCell>
                        <TableCell>{artist.country}</TableCell>
                        <TableCell>{artist.email}</TableCell>
                        <TableCell>
                          <Badge variant={artist.status === 'active' ? 'default' : artist.status === 'pending_approval' ? 'secondary' : 'destructive'}
                           className={artist.status === 'active' ? 'bg-green-500 text-white' : artist.status === 'pending_approval' ? 'bg-yellow-500 text-black' : ''}
                          >
                            {artist.status === 'active' ? 'Activo' : artist.status === 'pending_approval' ? 'Pendiente' : 'Bloqueado'}
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
                {pendingArtworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingArtworks.map((artwork) => (
                    <Card key={artwork.id} className="overflow-hidden">
                       <div className="relative aspect-[4/3] w-full">
                         <Image src={artwork.imageUrl} alt={artwork.title} layout="fill" objectFit="cover" data-ai-hint={artwork.dataAiHint || "pending art"} />
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
                <CardTitle>Verificación de Pagos</CardTitle>
                <CardDescription>Esta sección es para verificar los pagos de suscripciones (funcionalidad por implementar).</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Aquí se mostraría una lista de transacciones y estados de pago...</p>
                <div className="mt-4 border-2 border-dashed border-border rounded-lg p-10 text-center">
                    <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">La gestión de pagos aún no está implementada.</p>
                </div>
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

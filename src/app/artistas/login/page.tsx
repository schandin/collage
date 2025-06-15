"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserCircle } from 'lucide-react';

// Mock credentials for artist
const ARTIST_EMAIL = "artista@example.com";
const ARTIST_PASSWORD = "password123";

export default function ArtistLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Replace with actual authentication logic
    if (email === ARTIST_EMAIL && password === ARTIST_PASSWORD) {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Redirigiendo a tu panel de artista...",
      });
      localStorage.setItem('isArtistAuthenticated', 'true');
      router.push('/panel-artista');
    } else {
      setError('Email o contraseña incorrectos.');
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <UserCircle className="w-16 h-16 mx-auto text-primary mb-4" />
            <CardTitle className="text-3xl font-headline">Acceso de Artista</CardTitle>
            <CardDescription>Introduce tus credenciales para acceder a tu panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="text-base"
                />
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base">
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

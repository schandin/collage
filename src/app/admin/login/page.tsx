
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, ShieldAlert, Eye, EyeOff } from 'lucide-react';

// Mock credentials
const ADMIN_USERNAME = "collage.ar";
const ADMIN_PASSWORD = "schandin@gmail.com"; 

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Redirigiendo al panel de administración...",
      });
      localStorage.setItem('isAdminAuthenticated', 'true'); 
      router.push('/admin');
    } else {
      setError('Nombre de usuario o contraseña incorrectos.');
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
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <ShieldAlert className="w-16 h-16 mx-auto text-primary mb-4" />
            <CardTitle className="text-3xl font-headline">Acceso de Administrador</CardTitle>
            <CardDescription>Introduce tus credenciales para acceder al panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="collage.ar"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="text-base pr-10" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base">
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 pt-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-accent transition-colors">
              ¿Perdiste tu contraseña?
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-accent transition-colors">
              ¿No recuerdas tu usuario?
            </Link>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

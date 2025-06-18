
"use client";

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockSubscriptionPlans, getMockArtists, updateAndSaveArtists, addSubscriptionRecord } from '@/lib/mockData';
import type { SubscriptionPlan, Artist, SubscriptionRecord } from '@/types';
import { CreditCard, CheckCircle, ArrowLeft, Loader2, RefreshCw, Landmark, CircleDollarSign, Gift, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null | undefined>(undefined); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const planIdFromParams = typeof params?.planId === 'string' ? params.planId : null;

  useEffect(() => {
    setIsLoading(true); 

    if (!planIdFromParams) {
      toast({
        title: "Error de Ruta",
        description: "No se pudo identificar el plan de suscripción. Serás redirigido.",
        variant: "destructive",
      });
      router.push('/suscripciones');
      return; 
    }

    const foundPlan = mockSubscriptionPlans.find(p => p.id === planIdFromParams);

    if (!foundPlan) { 
      toast({
        title: "Plan no encontrado",
        description: "El plan de suscripción seleccionado no es válido. Serás redirigido.",
        variant: "destructive",
      });
      router.push('/suscripciones');
      return; 
    }
    
    setSelectedPlan(foundPlan); 
    setIsLoading(false);

  }, [planIdFromParams, router, toast]);

  const handlePaymentConfirmation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    if (!selectedPlan) return;

    if (!email || !email.includes('@')) {
      setFormError("Por favor, introduce un email válido.");
      toast({ title: "Error de Formulario", description: "Por favor, introduce un email válido.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      toast({ title: "Error de Formulario", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      toast({ title: "Error de Formulario", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }

    const artists = getMockArtists();
    if (artists.find(artist => artist.email === email)) {
      setFormError("Este email ya está registrado. Por favor, usa otro o inicia sesión.");
      toast({ title: "Email ya registrado", description: "Este email ya está en uso.", variant: "destructive" });
      return;
    }

    const newArtistId = `artist-${Date.now()}`;
    const newArtist: Artist = {
      id: newArtistId,
      name: '', 
      country: '', 
      profileImageUrl: '', 
      email: email,
      password: password,
      artworks: [],
      status: 'profile_incomplete',
      subscriptionPlanId: selectedPlan.id,
      bio: '',
      dataAiHint: '',
      registrationDate: new Date().toISOString(),
    };

    const currentArtists = getMockArtists();
    updateAndSaveArtists([...currentArtists, newArtist]);
    
    const newSubscriptionRecord: SubscriptionRecord = {
      id: `subrecord-${Date.now()}`,
      artistId: newArtistId,
      artistEmail: email,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      paymentMethod: "Tarjeta (Simulada)", // Placeholder for simulated payment
      subscriptionDate: new Date().toISOString(),
      status: 'Confirmado',
    };
    addSubscriptionRecord(newSubscriptionRecord);
    
    localStorage.setItem('isArtistAuthenticated', 'true');
    localStorage.setItem('currentArtistId', newArtistId);
    
    toast({
      title: "¡Pre-registro exitoso!",
      description: "Tu suscripción ha sido procesada. Redirigiendo para completar tu perfil...",
    });
    router.push('/panel-artista');
  };

  if (isLoading || selectedPlan === undefined) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center flex-col">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p>Cargando detalles del plan...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedPlan) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center flex-col">
          <CardTitle className="text-2xl font-headline text-destructive mb-4">Plan no encontrado</CardTitle>
          <p className="text-muted-foreground mb-6">El plan de suscripción que buscas no existe o no es válido.</p>
          <Button asChild variant="outline">
            <Link href="/suscripciones">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Planes
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
        <div className="w-full max-w-lg">
           <Button variant="outline" asChild className="mb-6">
            <Link href="/suscripciones">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Planes
            </Link>
          </Button>
          <Card className="shadow-2xl">
            <form onSubmit={handlePaymentConfirmation}>
              <CardHeader className="text-center">
                <CircleDollarSign className="w-16 h-16 mx-auto text-primary mb-4" />
                <CardTitle className="text-3xl font-headline">Confirmar Suscripción</CardTitle>
                <CardDescription>Estás a punto de suscribirte al plan: <span className="font-semibold text-accent">{selectedPlan.name}</span>.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-muted/30 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold text-primary mb-3">Detalles del Plan: {selectedPlan.name}</h3>
                  <p className="text-3xl font-bold text-accent">${selectedPlan.pricePerMonth} <span className="text-sm text-muted-foreground">/mes</span></p>
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4 flex items-center">
                    <RefreshCw className="w-3 h-3 mr-1.5 text-blue-500"/> Siempre podrás cambiarte de plan si lo requieres.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-primary">Crea tu Cuenta de Artista</h4>
                  <div>
                    <Label htmlFor="email">Email de Usuario</Label>
                    <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="pl-10 text-base"
                        />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Contraseña (mín. 6 caracteres)</Label>
                     <div className="relative mt-1">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="pl-10 text-base pr-10"
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
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative mt-1">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="pl-10 text-base pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    </div>
                  </div>
                   {formError && <p className="text-sm text-destructive text-center">{formError}</p>}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary mb-3 mt-6">Métodos de Pago (Simulado)</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" type="button">
                      <CreditCard className="w-5 h-5 mr-3 text-blue-500"/> Tarjeta de Crédito / Débito
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" type="button">
                      <CreditCard className="w-5 h-5 mr-3 text-sky-600"/> PayPal
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" type="button">
                      <Landmark className="w-5 h-5 mr-3 text-green-600"/> Transferencia Bancaria
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-base py-3 h-auto relative group" type="button">
                      <Gift className="w-5 h-5 mr-3 text-red-500"/> Apóyanos en Patreon 
                      <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full group-hover:bg-accent/80">Beneficios Extra</span>
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  Esta es una simulación de pago. Al confirmar, se creará tu cuenta y se activará tu acceso para completar tu perfil de artista.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Pago y Completar Perfil
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


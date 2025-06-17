
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockSubscriptionPlans } from '@/lib/mockData';
import type { SubscriptionPlan } from '@/types';
import { CreditCard, CheckCircle, ArrowLeft, Loader2, RefreshCw, Landmark, CircleDollarSign, Gift } from 'lucide-react'; // Added new icons

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null | undefined>(undefined); 

  useEffect(() => {
    if (params === null) {
      setIsLoading(true); 
      setSelectedPlan(undefined); 
      return;
    }

    const currentPlanId = typeof params.planId === 'string' ? params.planId : '';
    const foundPlan = mockSubscriptionPlans.find(p => p.id === currentPlanId);

    if (currentPlanId && !foundPlan) { 
      toast({
        title: "Plan no encontrado",
        description: "El plan de suscripción seleccionado no es válido.",
        variant: "destructive",
      });
      router.push('/suscripciones');
      return; 
    }
    
    setSelectedPlan(foundPlan || null); 
    setIsLoading(false);

  }, [params, router, toast]);

  const handlePaymentConfirmation = () => {
    if (!selectedPlan) return;

    localStorage.setItem('isArtistAuthenticated', 'true');
    const newArtistId = `newArtist-${Date.now()}`;
    localStorage.setItem('currentArtistId', newArtistId);
    localStorage.setItem('pendingSubscriptionPlanId', selectedPlan.id); // Save selected plan ID
    
    toast({
      title: "¡Pago Confirmado!",
      description: "Tu suscripción ha sido activada. Redirigiendo al panel de artista para completar tu perfil...",
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

              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Métodos de Pago (Simulado)</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                    <CreditCard className="w-5 h-5 mr-3 text-blue-500"/> Tarjeta de Crédito / Débito
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                    {/* Using CreditCard as a stand-in for PayPal icon */}
                    <CreditCard className="w-5 h-5 mr-3 text-sky-600"/> PayPal
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                    <Landmark className="w-5 h-5 mr-3 text-green-600"/> Transferencia Bancaria
                  </Button>
                   <Button variant="outline" className="w-full justify-start text-base py-3 h-auto relative group">
                    <Gift className="w-5 h-5 mr-3 text-red-500"/> Apóyanos en Patreon 
                    <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full group-hover:bg-accent/80">Beneficios Extra</span>
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Esta es una simulación de pago. Al confirmar, se activará tu acceso para completar tu perfil de artista.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePaymentConfirmation} 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmar Pago y Completar Perfil
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    
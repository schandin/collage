
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
import { CreditCard, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  // undefined: not yet processed, null: processed but not found, SubscriptionPlan: found
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null | undefined>(undefined); 

  useEffect(() => {
    if (params === null) {
      setIsLoading(true); // Params not yet loaded
      setSelectedPlan(undefined); // Reset selected plan state
      return;
    }

    const currentPlanId = typeof params.planId === 'string' ? params.planId : '';
    const foundPlan = mockSubscriptionPlans.find(p => p.id === currentPlanId);

    if (currentPlanId && !foundPlan) { // Plan ID was provided in URL, but plan not found in mockData
      toast({
        title: "Plan no encontrado",
        description: "El plan de suscripción seleccionado no es válido.",
        variant: "destructive",
      });
      router.push('/suscripciones');
      // No need to set loading/plan state here as navigation will occur
      return; 
    }
    
    setSelectedPlan(foundPlan || null); // Set to found plan, or null if currentPlanId was empty or no match
    setIsLoading(false);

  }, [params, router, toast]);

  const handlePaymentConfirmation = () => {
    localStorage.setItem('isArtistAuthenticated', 'true');
    const newArtistId = `newArtist-${Date.now()}`;
    localStorage.setItem('currentArtistId', newArtistId);
    
    toast({
      title: "¡Pago Confirmado!",
      description: "Tu suscripción ha sido activada. Redirigiendo al panel de artista...",
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

  if (!selectedPlan) { // Params loaded, plan lookup done, but no plan found (e.g. invalid planId in URL or planId was empty)
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
              <CreditCard className="w-16 h-16 mx-auto text-primary mb-4" />
              <CardTitle className="text-3xl font-headline">Confirmar Suscripción</CardTitle>
              <CardDescription>Estás a punto de suscribirte al plan: <span className="font-semibold text-accent">{selectedPlan.name}</span>.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-semibold text-primary mb-3">Detalles del Plan: {selectedPlan.name}</h3>
                <p className="text-3xl font-bold text-accent">${selectedPlan.pricePerMonth} <span className="text-sm text-muted-foreground">/mes</span></p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Esta es una simulación de pago. Al confirmar, se activará tu acceso al panel de artista.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePaymentConfirmation} 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-base"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmar Pago y Acceder al Panel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

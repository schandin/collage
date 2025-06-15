
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { mockSubscriptionPlans } from '@/lib/mockData';
import type { SubscriptionPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const getPlanDescription = (planName: string) => {
    const lowerPlanName = planName.toLowerCase();
    if (lowerPlanName === 'básico') {
      return "Ideal para comenzar";
    }
    if (lowerPlanName === 'avanzado') {
        return "Ideal para profesionales";
    }
    if (lowerPlanName === 'priority') {
        return "Manejo de redes";
    }
    return `Ideal para ${lowerPlanName}`;
  }

  return (
    <Card className={`flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 ${plan.name.includes("Priority") || plan.name.includes("Avanzado") ? 'border-primary border-2' : ''}`}>
      <CardHeader className="p-6 bg-muted/30">
        <CardTitle className="text-3xl font-headline text-primary text-center">{plan.name}</CardTitle>
        <CardDescription className="text-center text-muted-foreground text-sm">{getPlanDescription(plan.name)}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="text-center mb-6">
          <span className="text-5xl font-bold text-accent">${plan.pricePerMonth}</span>
          <span className="text-muted-foreground">/mes</span>
        </div>
        <p className="text-sm text-center text-muted-foreground mb-6">Hasta {plan.photoLimit} fotos en tu galería.</p>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 border-t">
        <Button 
          asChild
          size="lg" 
          className={`w-full ${plan.name.includes("Priority") || plan.name.includes("Avanzado") ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90'}`}
        >
          <Link href={`/pago/${plan.id}`}>Suscribirse a {plan.name}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SuscripcionesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-headline text-primary mb-6 flex items-center justify-center">
            <Zap className="w-12 h-12 mr-4 text-accent" />
            Impulsa Tu Arte
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Elige el plan perfecto para compartir tus collages con el mundo, gestionar tu galería y conectar con una audiencia apasionada.
          </p>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mockSubscriptionPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        
        <section className="mt-20 text-center bg-card p-10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-headline text-primary mb-4">¿Tienes Preguntas?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Nuestro equipo está listo para ayudarte. Contáctanos para más información sobre nuestros planes y cómo podemos ayudarte a crecer.
          </p>
          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            Contactar soporte
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

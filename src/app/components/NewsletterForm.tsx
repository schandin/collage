
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { addNewsletterSubscription } from '@/lib/mockData';
import type { NewsletterSubscription } from '@/types';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      });
      return;
    }
    
    const newSubscription: NewsletterSubscription = {
      id: `nlsub-${Date.now()}`,
      email: email,
      subscriptionDate: new Date().toISOString(),
    };
    addNewsletterSubscription(newSubscription);
    
    toast({
      title: "¡Gracias por suscribirte!",
      description: "Recibirás nuestras novedades pronto.",
    });
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <div className="relative flex-grow">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 py-3 text-base"
          aria-label="Correo electrónico para newsletter"
        />
      </div>
      <Button type="submit" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground py-3">
        Suscribirme
      </Button>
    </form>
  );
}

import NewsletterForm from './NewsletterForm';
import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-headline text-primary mb-4">Suscríbete a Nuestro Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Recibe novedades semanales, descubre nuevos artistas y accede a contenido exclusivo directamente en tu bandeja de entrada.
            </p>
            <NewsletterForm />
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-lg font-headline text-primary mb-3">Síguenos</h4>
            <div className="flex justify-center md:justify-end space-x-4 mb-6">
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-accent transition-colors">
                <Instagram size={24} />
              </Link>
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-accent transition-colors">
                <Facebook size={24} />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter size={24} />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Collage Conexión. Todos los derechos reservados.
            </p>
            <div className="mt-2 text-sm">
              <Link href="/terminos" className="text-muted-foreground hover:text-accent transition-colors">
                Términos y Condiciones
              </Link>
              {' | '}
              <Link href="/privacidad" className="text-muted-foreground hover:text-accent transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

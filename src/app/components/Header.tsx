"use client";
import Link from 'next/link';
import { Scissors, Palette, UserCircle, ShieldCheck, Briefcase, Menu, X } from 'lucide-react'; // Changed Leaf to Scissors
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import React, { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Inicio', icon: <Palette className="w-4 h-4" /> },
  { href: '/artistas', label: 'Artistas', icon: <UserCircle className="w-4 h-4" /> },
  { href: '/suscripciones', label: 'Suscripciones', icon: <Briefcase className="w-4 h-4" /> },
  { href: '/panel-artista', label: 'Panel Artista', icon: <Palette className="w-4 h-4" /> },
  { href: '/admin/login', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline text-primary hover:text-primary/80 transition-colors">
          <Scissors className="w-8 h-8 text-accent" /> {/* Changed Leaf to Scissors */}
          Collage Conexión
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link href={link.href} className="flex items-center gap-1 text-sm">
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card p-4">
              <div className="flex justify-between items-center mb-6">
                 <Link href="/" className="flex items-center gap-2 text-xl font-headline text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    <Scissors className="w-7 h-7 text-accent" /> {/* Changed Leaf to Scissors */}
                    Collage Conexión
                  </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Cerrar menú</span>
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/10 text-foreground font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

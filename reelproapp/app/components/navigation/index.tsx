"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusSquare, Heart, UserCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event for landing page transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show navigation on auth pages
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  // Check if we're on the landing page
  const isLandingPage = pathname === '/';
  
  // Navigation items
  const navItems = [
    { name: 'Home', href: '/feed', icon: <Home className="h-6 w-6" /> },
    { name: 'Discover', href: '/discover', icon: <Compass className="h-6 w-6" /> },
    { name: 'Upload', href: '/upload', icon: <PlusSquare className="h-6 w-6" /> },
    { name: 'Activity', href: '/activity', icon: <Heart className="h-6 w-6" /> },
    { name: 'Profile', href: '/profile', icon: <UserCircle className="h-6 w-6" /> },
  ];

  return (
    <>
      {/* Top Navigation - visible on all pages */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isLandingPage 
            ? isScrolled 
              ? "bg-background/80 backdrop-blur-md border-b border-border/50" 
              : "bg-transparent" 
            : "bg-background/80 backdrop-blur-md border-b border-border/50"
        )}
      >
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              ReelsPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth buttons on landing page */}
          {isLandingPage && (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="rounded-full">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="rounded-full">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors",
                      pathname === item.href 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                
                {isLandingPage && (
                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                    <Link href="/auth/login" className="w-full">
                      <Button variant="outline" className="w-full rounded-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="w-full">
                      <Button className="w-full rounded-full">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Bottom Navigation - visible only on feed/app pages on mobile */}
      {!isLandingPage && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-border/50">
          <div className="flex justify-between px-2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-3 px-5 text-xs font-medium",
                  pathname === item.href 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Page padding for fixed header */}
      <div className={cn(
        "w-full", 
        isLandingPage ? "h-0" : "h-16"
      )} />
      
      {/* Page padding for bottom nav on mobile */}
      {!isLandingPage && <div className="md:hidden h-16" />}
    </>
  );
}
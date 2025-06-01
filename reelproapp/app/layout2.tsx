"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>
      
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Background gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>
      
      <footer className="py-4 px-4 text-center text-sm text-muted-foreground border-t border-border/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Help</Link>
          <span>&copy; {new Date().getFullYear()} ReelsPro</span>
        </div>
      </footer>
    </div>
  );
}
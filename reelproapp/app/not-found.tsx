"use client";

import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Home, Film } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center mb-8">
          <div className="relative">
            <Film className="h-24 w-24 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground font-bold">
              404
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The reel you're looking for has gone missing.
        </p>
        
        <div className="space-y-3">
          <Link href="/feed">
            <Button className="rounded-full px-8 py-6 h-12">
              <Film className="mr-2 h-5 w-5" />
              Explore Reels
            </Button>
          </Link>
          
          <div className="block">
            <Link href="/">
              <Button variant="outline" className="rounded-full px-8 py-6 h-12">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
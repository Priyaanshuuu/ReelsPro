import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ArrowRight, Film, Heart, MessageCircle, Share2 } from 'lucide-react';
import HeroSection from '@/app/components/landing/hero-section';
import FeatureSection from '@/app/components/landing/feature-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90">
      <HeroSection />
      <FeatureSection />
      
      {/* App Preview Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Experience the Future of Video Sharing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seamlessly scroll through content that matters to you, engage with creators, and share your own story.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* App Preview Cards */}
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-card/30 backdrop-blur-sm group">
            <div className="aspect-[9/16] bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <Film className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-all duration-300" />
            </div>
            <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <Heart className="w-6 h-6 text-primary" />
              </button>
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <MessageCircle className="w-6 h-6 text-primary" />
              </button>
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <Share2 className="w-6 h-6 text-primary" />
              </button>
            </div>
            <div className="p-4 absolute bottom-0 w-full bg-gradient-to-t from-background/90 to-transparent">
              <p className="font-medium text-foreground">@username</p>
              <p className="text-sm text-muted-foreground">Check out this amazing video! #reelspro #viral</p>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-card/30 backdrop-blur-sm group">
            <div className="aspect-[9/16] bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
              <Film className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-all duration-300" />
            </div>
            <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <Heart className="w-6 h-6 text-primary" />
              </button>
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <MessageCircle className="w-6 h-6 text-primary" />
              </button>
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <Share2 className="w-6 h-6 text-primary" />
              </button>
            </div>
            <div className="p-4 absolute bottom-0 w-full bg-gradient-to-t from-background/90 to-transparent">
              <p className="font-medium text-foreground">@creator</p>
              <p className="text-sm text-muted-foreground">Living my best life! #reelspro #trending</p>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-card/30 backdrop-blur-sm group hidden lg:block">
            <div className="aspect-[9/16] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
              <Film className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-all duration-300" />
            </div>
            <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <Heart className="w-6 h-6 text-primary" />
              </button>
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <MessageCircle className="w-6 h-6 text-primary" />
              </button>
              <button className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all">
                <Share2 className="w-6 h-6 text-primary" />
              </button>
            </div>
            <div className="p-4 absolute bottom-0 w-full bg-gradient-to-t from-background/90 to-transparent">
              <p className="font-medium text-foreground">@videographer</p>
              <p className="text-sm text-muted-foreground">The perfect sunset #reelspro #nature</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/auth/signup">
            <Button className="rounded-full px-8 py-6 text-lg font-medium bg-primary hover:bg-primary/90">
              Join ReelsPro Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border/60 bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">ReelsPro</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition">About</Link>
              <Link href="#" className="hover:text-foreground transition">Terms</Link>
              <Link href="#" className="hover:text-foreground transition">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition">Help Center</Link>
              <Link href="#" className="hover:text-foreground transition">Creators</Link>
              <Link href="#" className="hover:text-foreground transition">Community</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ReelsPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
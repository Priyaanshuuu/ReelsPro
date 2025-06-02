import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ArrowRight, Film, Heart, MessageCircle, Share2 } from 'lucide-react';
import HeroSection from '@/app/components/landing/hero-section';
import FeatureSection from '@/app/components/landing/feature-section';

const previewData = [
  {
    username: '@username',
    caption: 'Check out this amazing video! #reelspro #viral',
    gradient: 'from-blue-500/20 to-purple-600/20',
  },
  {
    username: '@creator',
    caption: 'Living my best life! #reelspro #trending',
    gradient: 'from-purple-500/20 to-pink-600/20',
  },
  {
    username: '@videographer',
    caption: 'The perfect sunset #reelspro #nature',
    gradient: 'from-cyan-500/20 to-blue-600/20',
    hideOnMobile: true,
  },
];

interface PreviewCardProps {
  username: string;
  caption: string;
  gradient: string;
  hideOnMobile?: boolean;
}

function PreviewCard({ username, caption, gradient, hideOnMobile = false }: PreviewCardProps) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-card/30 backdrop-blur-sm group ${
        hideOnMobile ? 'hidden lg:block' : ''
      }`}
    >
      <div className={`aspect-[9/16] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Film className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-all duration-300" />
      </div>
      <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
        {[Heart, MessageCircle, Share2].map((Icon, idx) => (
          <button
            key={idx}
            className="p-3 bg-background/70 rounded-full hover:bg-primary/20 transition-all"
          >
            <Icon className="w-6 h-6 text-primary" />
          </button>
        ))}
      </div>
      <div className="p-4 absolute bottom-0 w-full bg-gradient-to-t from-background/90 to-transparent">
        <p className="font-medium text-foreground">{username}</p>
        <p className="text-sm text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90">
      <HeroSection />
      <FeatureSection />

      {/* App Preview Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Experience the Future of Video Sharing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seamlessly scroll through content that matters to you, engage with creators, and share your own story.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewData.map((data, index) => (
            <PreviewCard key={index} {...data} />
          ))}
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
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4 md:mb-0">
              ReelsPro
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {['About', 'Terms', 'Privacy', 'Help Center', 'Creators', 'Community'].map((item) => (
                <Link key={item} href="#" className="hover:text-foreground transition">
                  {item}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ReelsPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

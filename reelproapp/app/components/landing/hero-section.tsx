import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 px-4 overflow-hidden bg-black">
      {/* Subtle background animation on pure black */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-purple-500/5 to-black z-0"></div>

      {/* Glowing background blobs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-30"></div>

      {/* Glowing pulse dots */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`absolute rounded-full opacity-10 animate-pulse ${
            i % 2 === 0 ? "bg-blue-400" : "bg-purple-400"
          } ${[
            "top-1/4 right-1/4 w-4 h-4",
            "bottom-1/3 left-1/5 w-6 h-6",
            "top-2/3 right-1/3 w-3 h-3",
            "bottom-1/4 right-1/6 w-5 h-5",
            "top-1/2 left-1/3 w-4 h-4"
          ][i]}`}
          style={{
            animationDuration: `${4 + i * 0.5}s`
          }}
        ></div>
      ))}

      {/* Main content */}
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text leading-tight">
            Share Your World In Motion
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Create, discover and share captivating video content with a global community of creators.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/auth/signup">
            <Button className="rounded-full px-8 py-6 text-lg font-medium bg-blue-600 hover:bg-blue-500 w-full sm:w-auto hover:cursor-pointer">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/feed">
            <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-medium w-full sm:w-auto border-black/20 text-black hover:bg-black/10 hover:text-white hover:cursor-pointer">
              Explore Reels
            </Button>
          </Link>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-400/80"></span>
            Join millions of creators already using ReelsPro
          </p>
        </div>
      </div>
    </section>
  );
}

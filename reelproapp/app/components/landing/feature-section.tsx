import { Sparkles, Film, Share2, UserCircle, Upload, Palette } from 'lucide-react';

export default function FeatureSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Why Choose ReelsPro</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Experience the Next Generation of Video Sharing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Designed for creators who want to make an impact with short-form videos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Film className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Immersive Video Feed</h3>
            <p className="text-muted-foreground">
              Enjoy a seamless, fullscreen video experience with intelligent content recommendations tailored to your interests.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Share2 className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
            <p className="text-muted-foreground">
              Share your favorite reels instantly across all major platforms with just a few taps.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
              <UserCircle className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Profiles</h3>
            <p className="text-muted-foreground">
              Customize your profile to showcase your unique style and organize your content collections.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seamless Uploads</h3>
            <p className="text-muted-foreground">
              Upload videos in seconds with our streamlined process, add captions, and select the perfect thumbnail.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Trends</h3>
            <p className="text-muted-foreground">
              Stay ahead with our trending section featuring the hottest content and creators of the moment.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stunning Visuals</h3>
            <p className="text-muted-foreground">
              Experience beautiful design with our dark theme and vibrant accents that make your content pop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
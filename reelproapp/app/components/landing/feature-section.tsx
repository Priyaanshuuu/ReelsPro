import { Sparkles, Film, Share2, UserCircle, Upload, Palette } from 'lucide-react';

export default function FeatureSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-4">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>Why Choose ReelsPro</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience the Next Generation of Video Sharing</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Designed for creators who want to make an impact with short-form videos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card */}
          {[
            {
              icon: <Film className="h-6 w-6 text-blue-400" />,
              title: "Immersive Video Feed",
              desc: "Enjoy a seamless, fullscreen video experience with intelligent content recommendations tailored to your interests.",
              bg: "bg-blue-400/10"
            },
            {
              icon: <Share2 className="h-6 w-6 text-purple-400" />,
              title: "Easy Sharing",
              desc: "Share your favorite reels instantly across all major platforms with just a few taps.",
              bg: "bg-purple-400/10"
            },
            {
              icon: <UserCircle className="h-6 w-6 text-cyan-400" />,
              title: "Personalized Profiles",
              desc: "Customize your profile to showcase your unique style and organize your content collections.",
              bg: "bg-cyan-400/10"
            },
            {
              icon: <Upload className="h-6 w-6 text-pink-400" />,
              title: "Seamless Uploads",
              desc: "Upload videos in seconds with our streamlined process, add captions, and select the perfect thumbnail.",
              bg: "bg-pink-400/10"
            },
            {
              icon: <Sparkles className="h-6 w-6 text-yellow-400" />,
              title: "Discover Trends",
              desc: "Stay ahead with our trending section featuring the hottest content and creators of the moment.",
              bg: "bg-yellow-400/10"
            },
            {
              icon: <Palette className="h-6 w-6 text-green-400" />,
              title: "Stunning Visuals",
              desc: "Experience beautiful design with our dark theme and vibrant accents that make your content pop.",
              bg: "bg-green-400/10"
            }
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md hover:shadow-xl hover:shadow-white/5 hover:border-white/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

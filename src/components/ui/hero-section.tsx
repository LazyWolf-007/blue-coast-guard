import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Users, TreePine, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Ocean Gradient */}
      <div className="absolute inset-0 bg-ocean-gradient ocean-wave" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Hero Badge */}
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
            <TreePine className="h-4 w-4" />
            India's First Blue Carbon MRV Registry
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Restoring India's
            <span className="block gradient-text">Coastal Ecosystems</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Blockchain-powered transparency for mangrove restoration, empowering communities 
            and creating verifiable environmental impact across 7,500km of coastline.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="group">
              Start Contributing
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              Explore Projects
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
            <div className="glass rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">127</div>
              <div className="text-sm text-white/80 flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3" />
                Active Projects
              </div>
            </div>
            <div className="glass rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">2.4k</div>
              <div className="text-sm text-white/80 flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                Community Members
              </div>
            </div>
            <div className="glass rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">89k</div>
              <div className="text-sm text-white/80 flex items-center justify-center gap-1">
                <TreePine className="h-3 w-3" />
                Trees Planted
              </div>
            </div>
            <div className="glass rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">1.2k</div>
              <div className="text-sm text-white/80 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Tons CO₂ Sequestered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce-gentle" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl float" />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-lg animate-bounce-gentle" style={{ animationDelay: "1s" }} />
    </section>
  );
};

export default HeroSection;
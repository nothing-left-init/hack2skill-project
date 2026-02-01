import { Link } from "wouter";
import { Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20"></div>
      <div className="hero-pattern absolute inset-0"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              <span className="text-primary">Crafted</span> with Heart,<br/>
              <span className="text-secondary">Shared</span> with the World
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover authentic handmade treasures from talented artisans worldwide. Every piece tells a story, preserves tradition, and supports communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition" data-testid="button-explore-crafts">
                  <Compass className="mr-2 h-5 w-5" />
                  Explore Crafts
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground smooth-transition"
                data-testid="button-support-artisan"
              >
                <Heart className="mr-2 h-5 w-5" />
                Support an Artisan
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Artisan hands shaping clay pottery" 
              className="rounded-2xl shadow-2xl w-full floating-animation"
            />
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Heart className="text-accent-foreground text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold" data-testid="text-customer-count">10,000+</p>
                  <p className="text-xs text-muted-foreground">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import HeroSection from "@/components/hero-section";
import FeaturedArtisans from "@/components/featured-artisans";
import ProductGrid from "@/components/product-grid";
import AiStoryGenerator from "@/components/ai-story-generator";
import CommunityStories from "@/components/community-stories";
import SmartRecommendations from "@/components/smart-recommendations";
import { Heart, Users, DollarSign, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const stats = [
    { icon: Users, value: "2,847", label: "Supported Artisans" },
    { icon: Award, value: "67", label: "Countries Represented" },
    { icon: DollarSign, value: "$2.4M", label: "Earned by Artisans" },
    { icon: Heart, value: "156", label: "Preserved Traditions" },
  ];

  return (
    <>
      <HeroSection />
      <FeaturedArtisans />
      <ProductGrid />
      <AiStoryGenerator />
      <CommunityStories />
      <SmartRecommendations />
      
      {/* Impact Section */}
      <section className="py-20 story-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">Crafting a Better World</h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Every purchase supports traditional craftsmanship, empowers local communities, and preserves cultural heritage for future generations.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-2" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {stat.value}
                    </div>
                    <p className="text-white/80 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Diverse group of artisans collaborating on traditional crafts" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-12 text-center border-0">
            <CardContent className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">Start Your Artisan Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're an artisan ready to share your craft or someone who appreciates authentic handmade beauty, join our growing community today.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition" data-testid="button-tell-story">
                  Tell Your Story
                </Button>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 smooth-transition" data-testid="button-shop-now">
                  Shop Now
                </Button>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 smooth-transition" data-testid="button-support-artisan-cta">
                  Support an Artisan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </>
  );
}

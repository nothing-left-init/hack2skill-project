import { useQuery } from "@tanstack/react-query";
import { Star, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function SmartRecommendations() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/featured"],
    queryFn: api.getFeaturedProducts,
  });

  // Mock recommendation profile data
  const profile = {
    mediterraneanStyle: 85,
    ecoFriendlyFocus: 92,
    traditionalTechniques: 78,
  };

  // Mock recommended products (would be actual recommendations in real app)
  const recommendedProducts = products?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">Crafted Just for You</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI learns your preferences and cultural interests to recommend crafts that resonate with your style and values.
          </p>
        </div>

        <Card className="shadow-xl border border-border p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-4">Personalized for You</h3>
              <p className="text-muted-foreground mb-6">
                Based on your interest in <span className="text-primary font-medium">Mediterranean ceramics</span> and{" "}
                <span className="text-accent font-medium">sustainable crafts</span>, we've curated these special recommendations:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="text-primary h-4 w-4" />
                  <span className="font-medium">95% match</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">Greek Olive Wood Bowls</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="text-primary h-4 w-4" />
                  <span className="font-medium">92% match</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">Moroccan Ceramic Tagines</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="text-primary h-4 w-4" />
                  <span className="font-medium">89% match</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">Italian Terra Cotta Planters</span>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-6">
              <h4 className="text-lg font-semibold mb-4 text-center">Preference Profile</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Mediterranean Style</span>
                    <span data-testid="text-mediterranean-percentage">{profile.mediterraneanStyle}%</span>
                  </div>
                  <Progress value={profile.mediterraneanStyle} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Eco-Friendly Focus</span>
                    <span data-testid="text-eco-friendly-percentage">{profile.ecoFriendlyFocus}%</span>
                  </div>
                  <Progress value={profile.ecoFriendlyFocus} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Traditional Techniques</span>
                    <span data-testid="text-traditional-percentage">{profile.traditionalTechniques}%</span>
                  </div>
                  <Progress value={profile.traditionalTechniques} className="w-full" />
                </div>
              </div>
            </Card>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border border-border group hover:shadow-lg smooth-transition" data-testid={`card-recommendation-${product.id}`}>
              <img 
                src={product.images?.[0] || "/placeholder-product.jpg"} 
                alt={product.name} 
                className="w-full h-32 object-cover group-hover:scale-105 smooth-transition"
              />
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-1 line-clamp-1" data-testid={`text-recommendation-name-${product.id}`}>
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">by Artisan</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold" data-testid={`text-recommendation-price-${product.id}`}>
                    ${product.price}
                  </span>
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span data-testid={`text-recommendation-rating-${product.id}`}>
                      {product.rating || "4.8"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/App";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "all", label: "All" },
  { id: "ceramics", label: "Ceramics" },
  { id: "textiles", label: "Textiles" },
  { id: "jewelry", label: "Jewelry" },
  { id: "woodwork", label: "Woodwork" },
];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/featured"],
    queryFn: api.getFeaturedProducts,
  });

  const { data: artisans } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: api.getArtisans,
  });

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      toast({ title: "Removed from wishlist" });
    } else {
      newWishlist.add(productId);
      toast({ title: "Added to wishlist" });
    }
    setWishlist(newWishlist);
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(productId);
    toast({ title: `${productName} added to cart` });
  };

  const filteredProducts = products?.filter((product: any) => 
    selectedCategory === "all" || product.category === selectedCategory
  ) || [];

  const getArtisanName = (artisanId: string) => {
    return artisans?.find((a: any) => a.id === artisanId)?.name || "Unknown Artisan";
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-20" />
              ))}
            </div>
          </div>
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">Handcrafted Treasures</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Each piece is unique, carrying the soul and skill of its creator. Browse our curated collection of authentic handmade crafts.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }
                data-testid={`button-filter-${category.id}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border border-border group" data-testid={`card-product-${product.id}`}>
              <div className="relative">
                <img 
                  src={product.images?.[0] || "/placeholder-product.jpg"} 
                  alt={product.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 smooth-transition"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  data-testid={`button-wishlist-${product.id}`}
                >
                  <Heart 
                    className={`h-4 w-4 ${wishlist.has(product.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                  />
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold" data-testid={`text-product-name-${product.id}`}>
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`text-product-artisan-${product.id}`}>
                  by {getArtisanName(product.artisanId)}
                </p>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2" data-testid={`text-product-description-${product.id}`}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                      ${product.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground" data-testid={`text-product-rating-${product.id}`}>
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleAddToCart(product.id, product.name)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition"
                    data-testid={`button-add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 smooth-transition" data-testid="button-shop-all">
            Shop All Products
          </Button>
        </div>
      </div>
    </section>
  );
}

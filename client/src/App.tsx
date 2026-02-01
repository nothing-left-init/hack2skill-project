import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, useContext, useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import ArtisanProfile from "@/pages/artisan-profile";
import AiStorytelling from "@/pages/ai-storytelling";
import Community from "@/pages/community";
import Demo from "@/pages/demo";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DemoModeBanner from "@/components/demo-banner";
import ShoppingCart from "@/components/shopping-cart";
import { CartContextType, CartItemWithProduct } from "@/types";
import { api } from "@/lib/api";

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error("useCart must be used within CartProvider - this might be a timing issue during development");
    // Return default values to prevent crashes during development
    return {
      items: [],
      addToCart: () => {},
      updateQuantity: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      total: 0,
      itemCount: 0,
      isOpen: false,
      setIsOpen: () => {},
    };
  }
  return context;
};

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const sessionId = "guest-session"; // In a real app, this would be from auth

  const loadCart = async () => {
    try {
      const cartItems = await api.getCartItems(sessionId);
      // Transform cart items to include product details
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item: any) => {
          const product = await api.getProduct(item.productId);
          const artisan = await api.getArtisan(product.artisanId);
          return {
            ...item,
            product: {
              ...product,
              artisanName: artisan.name,
            },
          };
        })
      );
      setItems(itemsWithProducts);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      await api.addToCart({ sessionId, productId, quantity: 1 });
      loadCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.updateCartItem(itemId, quantity);
      loadCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.removeFromCart(itemId);
      loadCart(); // Refresh cart
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart(sessionId);
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/marketplace" component={Marketplace} />
          <Route path="/demo" component={Demo} />
        <Route path="/artisans/:id" component={ArtisanProfile} />
        <Route path="/ai-storytelling" component={AiStorytelling} />
        <Route path="/community" component={Community} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
      <ShoppingCart />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoModeBanner />
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

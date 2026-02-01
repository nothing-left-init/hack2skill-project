import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/App";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/marketplace", label: "Discover" },
    { href: "/artisans", label: "Artisans" },
    { href: "/community", label: "Stories" },
    { href: "/ai-storytelling", label: "AI Tools" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" data-testid="link-home">
              <h1 className="text-xl font-serif font-bold text-primary hover:text-primary/80 smooth-transition">
                Artisan Collective
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase()}`}>
                <span className={`text-foreground hover:text-primary smooth-transition ${
                  location === item.href ? 'text-primary font-medium' : ''
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" data-testid="button-search" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(true)}
              data-testid="button-cart"
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="text-cart-count">
                  {itemCount}
                </span>
              )}
            </Button>
            
            <Button className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-join-artisan">
              Join as Artisan
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 mt-6">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.label.toLowerCase()}`}
                    >
                      <span className={`text-lg font-medium text-foreground hover:text-primary smooth-transition ${
                        location === item.href ? 'text-primary' : ''
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6" data-testid="mobile-button-join-artisan">
                    Join as Artisan
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

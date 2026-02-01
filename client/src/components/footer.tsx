import { Link } from "wouter";
import { Facebook, Instagram, Youtube, PinIcon as Pinterest } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Discover",
      links: [
        { label: "All Artisans", href: "/marketplace" },
        { label: "Marketplace", href: "/marketplace" },
        { label: "New Arrivals", href: "/marketplace?sort=newest" },
        { label: "Gift Collections", href: "/marketplace?category=gifts" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Stories & Blog", href: "/community" },
        { label: "Cultural Heritage", href: "/community?category=heritage" },
        { label: "Artisan Interviews", href: "/community?category=interviews" },
        { label: "Events", href: "/community?category=events" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns", href: "/returns" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Pinterest, label: "Pinterest", href: "#" },
    { icon: Youtube, label: "YouTube", href: "#" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" data-testid="link-footer-home">
              <h3 className="text-xl font-serif font-bold mb-6 hover:text-secondary-foreground/80 smooth-transition">
                Artisan Collective
              </h3>
            </Link>
            <p className="text-secondary-foreground/80 mb-6">
              Connecting authentic craftsmanship with appreciative hearts worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-secondary-foreground/60 hover:text-secondary-foreground smooth-transition"
                  data-testid={`button-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-secondary-foreground/80">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <span className="hover:text-secondary-foreground smooth-transition">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-foreground/60 text-sm" data-testid="text-copyright">
              © {currentYear} Artisan Collective. Crafted with love for authentic artisanship.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-secondary-foreground/60">
              <Link href="/privacy" data-testid="link-privacy">
                <span className="hover:text-secondary-foreground smooth-transition">Privacy Policy</span>
              </Link>
              <Link href="/terms" data-testid="link-terms">
                <span className="hover:text-secondary-foreground smooth-transition">Terms of Service</span>
              </Link>
              <Link href="/cookies" data-testid="link-cookies">
                <span className="hover:text-secondary-foreground smooth-transition">Cookie Policy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

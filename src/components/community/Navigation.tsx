import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Briefcase, 
  Search, 
  Users, 
  Heart, 
  Calendar,
  MessageSquare,
  Leaf,
  Menu,
  X,
  Recycle,
  UtensilsCrossed
} from "lucide-react";

const navigationItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: Briefcase, label: "Jobs", href: "#jobs" },
  { icon: Search, label: "Lost & Found", href: "#lost-found" },
  { icon: UtensilsCrossed, label: "Food Resources", href: "#food-resources" },
  { icon: Calendar, label: "Events", href: "#events" },
  { icon: MessageSquare, label: "Social Good", href: "#social-good" },
  { icon: Leaf, label: "Green Hub", href: "#green-hub" },
  { icon: Recycle, label: "Waste Management", href: "#waste-management" },
  { icon: Heart, label: "Health & Safety", href: "#health-safety" },
];

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Community Connect Hub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:bg-accent/50"
                onClick={() => {
                  const element = document.querySelector(item.href);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            ))}
            <Button
              variant="default"
              size="sm"
              onClick={() => window.location.href = '/auth'}
              className="ml-4"
            >
              Login / Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <Card className="md:hidden absolute top-16 left-4 right-4 bg-card shadow-medium border">
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start space-x-3"
                  onClick={() => {
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              ))}
              <Button
                variant="default"
                className="w-full mt-2"
                onClick={() => {
                  window.location.href = '/auth';
                  setIsMenuOpen(false);
                }}
              >
                Login / Sign Up
              </Button>
            </div>
          </Card>
        )}
      </div>
    </nav>
  );
};
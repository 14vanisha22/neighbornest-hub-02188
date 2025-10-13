import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Briefcase, Heart, Leaf } from "lucide-react";
import heroImage from "@/assets/community-hero.jpg";

const stats = [
  { icon: Users, label: "Active Members", value: "2,500+" },
  { icon: Briefcase, label: "Jobs Posted", value: "350+" },
  { icon: Heart, label: "Items Shared", value: "1,200+" },
  { icon: Leaf, label: "Green Actions", value: "800+" },
];

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image - extends to cover entire page */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="text-foreground">Building</span>{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Smarter
              </span>{" "}
              <span className="text-foreground">Communities</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Your one-stop digital platform connecting neighbors, sharing resources, 
              and creating sustainable communities together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="hero" 
                size="xl"
                className="group"
                onClick={() => window.location.href = '/auth'}
              >
                Join Our Community
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  const element = document.querySelector('#jobs');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground text-center">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
import { Navigation } from "@/components/community/Navigation";
import { HeroSection } from "@/components/community/HeroSection";
import { JobsSection } from "@/components/community/JobsSection";
import { LostFoundSection } from "@/components/community/LostFoundSection";
import { FoodResourcesSection } from "@/components/community/FoodResourcesSection";
import { EventsSection } from "@/components/community/EventsSection";
import { SocialGoodSection } from "@/components/community/SocialGoodSection";
import { GreenHubSection } from "@/components/community/GreenHubSection";
import { WasteManagementSection } from "@/components/community/WasteManagementSection";
import { HealthSafetySection } from "@/components/community/HealthSafetySection";
import { CommunityStats } from "@/components/community/CommunityStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <JobsSection />
        <LostFoundSection />
        <FoodResourcesSection />
        <EventsSection />
        <SocialGoodSection />
        <GreenHubSection />
        <WasteManagementSection />
        <HealthSafetySection />
        <CommunityStats />
      </main>
    </div>
  );
};

export default Index;

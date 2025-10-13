import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, Calendar, MapPin, Users, BookOpen, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { DriveRegistrationDialog } from "./DriveRegistrationDialog";

interface Drive {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  registration_link: string | null;
  category: string;
  participants_count: number;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  views_count: number;
  media_link: string | null;
}

export const GreenHubSection = () => {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [registrationDialog, setRegistrationDialog] = useState<{ open: boolean; drive: Drive | null }>({
    open: false,
    drive: null,
  });

  useEffect(() => {
    fetchDrives();
    fetchCampaigns();
  }, []);

  const fetchDrives = async () => {
    const { data } = await supabase
      .from("drives")
      .select("*")
      .eq("status", "active")
      .order("date", { ascending: true })
      .limit(6);
    if (data) setDrives(data);
  };

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data) setCampaigns(data);
  };

  return (
    <section id="green-hub" className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
            <Leaf className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Green Community Hub</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join environmental initiatives and learn sustainable practices for a greener future
          </p>
        </div>

        {/* Tree Plantation & Cleanup Drives */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-success" />
            Upcoming Drives & Events
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drives.map((drive) => (
              <Card key={drive.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{drive.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {drive.participants_count}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{drive.title}</CardTitle>
                  <CardDescription>{drive.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(drive.date), "PPP 'at' p")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {drive.location}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Organized by:</span> {drive.organizer}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setRegistrationDialog({ open: true, drive })}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Eco-Awareness Campaigns */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-success" />
            Eco-Awareness Campaigns
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">
                    {campaign.category}
                  </Badge>
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 line-clamp-3">{campaign.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {campaign.views_count} views
                    </div>
                    <Button variant="ghost" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {registrationDialog.drive && (
          <DriveRegistrationDialog
            open={registrationDialog.open}
            onOpenChange={(open) => setRegistrationDialog({ open, drive: null })}
            drive={registrationDialog.drive}
          />
        )}
      </div>
    </section>
  );
};

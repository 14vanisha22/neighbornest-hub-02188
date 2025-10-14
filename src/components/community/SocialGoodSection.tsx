import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, TrendingUp, Award, MessageSquare, Target } from "lucide-react";

export const SocialGoodSection = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    fetchOrganizations();
    fetchLeaderboard();
    fetchPolls();
  }, []);

  const fetchOrganizations = async () => {
    const { data } = await supabase
      .from("social_organizations")
      .select("*")
      .limit(6);
    if (data) setOrganizations(data);
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, points")
      .eq("show_on_leaderboard", true)
      .order("points", { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  };

  const fetchPolls = async () => {
    const { data } = await supabase
      .from("polls")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setPolls(data);
  };

  const getOrgTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      orphanage: Heart,
      "old age home": Users,
      "blood donation": Heart,
      ngo: Target,
    };
    const Icon = icons[type.toLowerCase()] || Heart;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <section id="social-good" className="py-20 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Social Good Hub
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Make a difference in your community through volunteering, donations, and civic engagement
          </p>
        </div>

        <Tabs defaultValue="organizations" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="projects">Impact Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {getOrgTypeIcon(org.type)}
                      <Badge variant="outline">{org.type}</Badge>
                      {org.verified && <Badge>Verified</Badge>}
                    </div>
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground line-clamp-3">{org.description}</p>
                    <p className="text-sm"><strong>Location:</strong> {org.location}</p>
                    {org.contact_phone && (
                      <p className="text-sm"><strong>Contact:</strong> {org.contact_phone}</p>
                    )}
                    <div className="flex gap-2">
                      <Button className="flex-1">Volunteer</Button>
                      {org.donation_link && (
                        <Button variant="outline" className="flex-1">Donate</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-500" : "bg-muted"
                        }`}>
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{user.display_name || "Anonymous"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-bold">{user.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="polls" className="space-y-6">
            <div className="grid gap-6">
              {polls.map((poll) => (
                <Card key={poll.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <Badge>{poll.category}</Badge>
                    </div>
                    <CardTitle>{poll.title}</CardTitle>
                    {poll.description && (
                      <p className="text-muted-foreground">{poll.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(JSON.parse(poll.options) || []).map((option: any, index: number) => (
                      <Button key={index} variant="outline" className="w-full justify-start">
                        {option.text || option}
                      </Button>
                    ))}
                    <p className="text-sm text-muted-foreground text-center">
                      {poll.total_votes} votes
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="surveys">
            <Card>
              <CardHeader>
                <CardTitle>Community Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Surveys feature coming soon. Help gather community opinions on important issues.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems">
            <Card>
              <CardHeader>
                <CardTitle>Problem Reports & Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Report local problems and track their resolution status.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Impact Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Join ongoing community improvement projects and make a real impact.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

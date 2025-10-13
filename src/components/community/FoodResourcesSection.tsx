import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Apple, Clock, MapPin, Phone, Users, Utensils, Heart, Sparkles, TrendingUp, Building2 } from "lucide-react";
import { format } from "date-fns";
import { FoodDonationDialog } from "./FoodDonationDialog";
import { FoodRequestDialog } from "./FoodRequestDialog";

interface FoodDonation {
  id: string;
  donor_name: string;
  donor_type: string;
  food_type: string;
  quantity: string;
  expiry_time: string;
  pickup_location: string;
  contact_phone: string;
  status: string;
  created_at: string;
}

interface FoodRequest {
  id: string;
  organization_name: string;
  organization_type: string;
  food_type_needed: string;
  quantity_needed: string;
  pickup_location: string;
  contact_phone: string;
  urgency: string;
  status: string;
  created_at: string;
}

interface CommunityKitchen {
  id: string;
  name: string;
  location: string;
  timings: string;
  meal_types: string[];
  food_type: string;
  contact_phone: string;
  is_free: boolean;
  price_range: string;
  rating: number;
  total_reviews: number;
}

interface FoodBank {
  id: string;
  name: string;
  organization_type: string;
  location: string;
  address: string;
  contact_phone: string;
  timings: string;
  services: string[];
  is_partner: boolean;
}

export const FoodResourcesSection = () => {
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [kitchens, setKitchens] = useState<CommunityKitchen[]>([]);
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  useEffect(() => {
    fetchDonations();
    fetchRequests();
    fetchKitchens();
    fetchFoodBanks();
  }, []);

  const fetchDonations = async () => {
    const { data } = await supabase
      .from("food_donations")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data) setDonations(data);
  };

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("food_requests")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data) setRequests(data);
  };

  const fetchKitchens = async () => {
    const { data } = await supabase
      .from("community_kitchens")
      .select("*")
      .eq("status", "active")
      .order("rating", { ascending: false })
      .limit(6);
    if (data) setKitchens(data);
  };

  const fetchFoodBanks = async () => {
    const { data } = await supabase
      .from("food_banks")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6);
    if (data) setFoodBanks(data);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <section id="food-resources" className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <Apple className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Food Resources Hub</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect to reduce food waste, feed those in need, and build a hunger-free community
          </p>
        </div>

        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="donations">Donations & Requests</TabsTrigger>
            <TabsTrigger value="kitchens">Community Kitchens</TabsTrigger>
            <TabsTrigger value="banks">Food Banks</TabsTrigger>
            <TabsTrigger value="impact">Impact & Tips</TabsTrigger>
          </TabsList>

          {/* Donations & Requests Tab */}
          <TabsContent value="donations" className="space-y-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={() => setDonationDialogOpen(true)}>
                <Heart className="w-4 h-4 mr-2" />
                Donate Food
              </Button>
              <Button size="lg" variant="outline" onClick={() => setRequestDialogOpen(true)}>
                <Users className="w-4 h-4 mr-2" />
                Request Food
              </Button>
            </div>

            {/* Available Donations */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-destructive" />
                Available Donations
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map((donation) => (
                  <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{donation.donor_type}</Badge>
                        <Badge variant="outline">
                          {donation.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{donation.food_type}</CardTitle>
                      <CardDescription>{donation.donor_name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Utensils className="w-4 h-4 mr-2" />
                        <span className="font-medium">Quantity:</span>&nbsp;{donation.quantity}
                      </div>
                      <div className="flex items-center text-sm text-destructive">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-medium">Best before:</span>&nbsp;
                        {format(new Date(donation.expiry_time), "PPp")}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {donation.pickup_location}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2" />
                        {donation.contact_phone}
                      </div>
                      <Button className="w-full" size="sm">
                        Contact Donor
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {donations.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No donations available. Be the first to donate!
                </p>
              )}
            </div>

            {/* Active Requests */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Food Requests
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{request.organization_type}</Badge>
                        <Badge variant={getUrgencyColor(request.urgency)}>
                          {request.urgency} urgency
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{request.organization_name}</CardTitle>
                      <CardDescription>Needs: {request.food_type_needed}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Utensils className="w-4 h-4 mr-2" />
                        <span className="font-medium">Quantity:</span>&nbsp;{request.quantity_needed}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {request.pickup_location}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2" />
                        {request.contact_phone}
                      </div>
                      <Button className="w-full" size="sm" variant="outline">
                        Fulfill Request
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {requests.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No active requests at the moment.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Community Kitchens Tab */}
          <TabsContent value="kitchens" className="space-y-8">
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Find community kitchens serving free or affordable meals in your area
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kitchens.map((kitchen) => (
                <Card key={kitchen.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      {kitchen.is_free ? (
                        <Badge variant="default">Free Meals</Badge>
                      ) : (
                        <Badge variant="secondary">{kitchen.price_range}</Badge>
                      )}
                      <div className="flex items-center text-sm">
                        <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                        {kitchen.rating.toFixed(1)} ({kitchen.total_reviews})
                      </div>
                    </div>
                    <CardTitle className="text-xl">{kitchen.name}</CardTitle>
                    <CardDescription>{kitchen.food_type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {kitchen.timings}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {kitchen.meal_types?.map((meal) => (
                        <Badge key={meal} variant="outline" className="text-xs">
                          {meal}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {kitchen.location}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2" />
                      {kitchen.contact_phone}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        Get Directions
                      </Button>
                      <Button className="flex-1" size="sm" variant="outline">
                        Volunteer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {kitchens.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No community kitchens listed yet.
              </p>
            )}
          </TabsContent>

          {/* Food Banks Tab */}
          <TabsContent value="banks" className="space-y-8">
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Access food banks and distribution centers for groceries and essentials
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodBanks.map((bank) => (
                <Card key={bank.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{bank.organization_type}</Badge>
                      {bank.is_partner && (
                        <Badge variant="default">Partner</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{bank.name}</CardTitle>
                    <CardDescription>{bank.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {bank.timings}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {bank.services?.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {bank.location}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2" />
                      {bank.contact_phone}
                    </div>
                    <Button className="w-full" size="sm">
                      View Inventory & Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {foodBanks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No food banks listed yet.
              </p>
            )}
          </TabsContent>

          {/* Impact & Tips Tab */}
          <TabsContent value="impact" className="space-y-8">
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Learn sustainable practices and track your community impact
              </p>
            </div>

            {/* Impact Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    Meals Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-success">1,234</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This month through donations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    People Fed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">856</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Through community kitchens
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    Active Donors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-accent">89</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Restaurants & individuals
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Food Waste Tips */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Food Waste Prevention Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Smart Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Store fruits and vegetables separately</li>
                      <li>• Use airtight containers for leftovers</li>
                      <li>• Label and date food items</li>
                      <li>• Keep your refrigerator at 40°F or below</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="w-5 h-5" />
                      Meal Planning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Plan weekly meals before shopping</li>
                      <li>• Buy only what you need</li>
                      <li>• Use the FIFO method (First In, First Out)</li>
                      <li>• Repurpose leftovers creatively</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <FoodDonationDialog 
          open={donationDialogOpen} 
          onOpenChange={setDonationDialogOpen}
        />
        <FoodRequestDialog 
          open={requestDialogOpen} 
          onOpenChange={setRequestDialogOpen}
        />
      </div>
    </section>
  );
};

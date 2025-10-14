import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  Recycle, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Trophy,
  Trash2,
  Droplets,
  ShoppingBag
} from "lucide-react";

// --- SECURITY FIX: STRENGTHENING INPUT VALIDATION ---

const commonString = z.string().trim().min(1).max(500);

const pickupSchema = z.object({
  address: commonString.min(10, "Address must be at least 10 characters").max(500, "Address is too long"),
  waste_type: z.enum(['wet', 'dry', 'hazardous', 'e-waste'], { required_error: "Please select a waste type" }),
  preferred_date: z.string().refine((date) => new Date(date) > new Date(), "Preferred date must be in the future"),
  notes: z.string().max(1000, "Notes are too long").optional()
});

const recyclableSchema = z.object({
  item_name: z.string().trim().min(2, "Item name must be at least 2 characters").max(100, "Item name is too long"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
  quantity: z.string().trim().min(1, "Quantity is required").max(50, "Quantity description is too long"),
  price: z.string().regex(/^\d*$/, "Price must be a number").optional().or(z.literal('')),
  contact_info: z.string().regex(/^[0-9+\-\s()]{10,20}$|^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid phone number or email")
});

const reportSchema = z.object({
  // Explicitly allow standard address characters, preventing dangerous scripts/code.
  location: z.string()
    .trim()
    .min(10, "Location must be at least 10 characters")
    .max(500, "Location is too long")
    .regex(/^[a-zA-Z0-9\s.,'#\-\/]+$/, "Location contains invalid characters."), // Security improvement
  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long")
});

export const WasteManagementSection = () => {
  const { toast } = useToast();
  const [pickupForm, setPickupForm] = useState({
    address: "",
    waste_type: "",
    preferred_date: "",
    notes: ""
  });

  const [recyclableForm, setRecyclableForm] = useState({
    item_name: "",
    description: "",
    quantity: "",
    price: "",
    contact_info: ""
  });

  const [reportForm, setReportForm] = useState({
    location: "",
    description: ""
  });

  const handlePickupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = pickupSchema.safeParse(pickupForm);
    if (!validation.success) {
      toast({ 
        title: "Validation Error", 
        description: validation.error.errors[0].message,
        variant: "destructive" 
      });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Please login to schedule a pickup", variant: "destructive" });
      return;
    }

    // Supabase is generally secure against SQL injection due to prepared statements,
    // but client-side validation prevents malformed data entry.
    const { error } = await supabase.from("pickups").insert({
      user_id: user.id,
      address: validation.data.address,
      waste_type: validation.data.waste_type,
      preferred_date: validation.data.preferred_date,
      notes: validation.data.notes || ""
    });

    if (error) {
      toast({ title: "Error scheduling pickup", variant: "destructive" });
    } else {
      toast({ title: "Pickup scheduled successfully!" });
      setPickupForm({ address: "", waste_type: "", preferred_date: "", notes: "" });
    }
  };

  const handleRecyclableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = recyclableSchema.safeParse(recyclableForm);
    if (!validation.success) {
      toast({ 
        title: "Validation Error", 
        description: validation.error.errors[0].message,
        variant: "destructive" 
      });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Please login to list an item", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("recyclables").insert({
      user_id: user.id,
      item_name: validation.data.item_name,
      description: validation.data.description,
      quantity: validation.data.quantity,
      price: validation.data.price ? parseInt(validation.data.price) : null,
      contact_info: validation.data.contact_info
    });

    if (error) {
      toast({ title: "Error listing item", variant: "destructive" });
    } else {
      toast({ title: "Item listed successfully!" });
      setRecyclableForm({ item_name: "", description: "", quantity: "", price: "", contact_info: "" });
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = reportSchema.safeParse(reportForm);
    if (!validation.success) {
      toast({ 
        title: "Validation Error", 
        description: validation.error.errors[0].message,
        variant: "destructive" 
      });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({ title: "Please login to submit a report", variant: "destructive" });
      return;
    }

    // Use the validated and trimmed data from Zod
    const { error } = await supabase.from("dumping_reports").insert({
      user_id: user.id,
      location: validation.data.location,
      description: validation.data.description
    });

    if (error) {
      toast({ title: "Error submitting report", variant: "destructive" });
    } else {
      toast({ title: "Report submitted successfully!" });
      setReportForm({ location: "", description: "" });
    }
  };

  return (
    <section id="waste-management" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
            <Recycle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Waste Management</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage waste responsibly, recycle effectively, and contribute to a cleaner community
          </p>
        </div>

        <Tabs defaultValue="pickup" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="pickup">Pickup</TabsTrigger>
            <TabsTrigger value="segregation">Segregation</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Waste Pickup Scheduling */}
          <TabsContent value="pickup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Schedule Waste Pickup
                </CardTitle>
                <CardDescription>
                  Request a pickup for your recyclable or general waste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePickupSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="address">Pickup Address</Label>
                    <Input
                      id="address"
                      value={pickupForm.address}
                      onChange={(e) => setPickupForm({ ...pickupForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="waste_type">Waste Type</Label>
                    <Select
                      value={pickupForm.waste_type}
                      onValueChange={(value) => setPickupForm({ ...pickupForm, waste_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wet">Wet Waste</SelectItem>
                        <SelectItem value="dry">Dry Waste</SelectItem>
                        <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                        <SelectItem value="e-waste">E-Waste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="preferred_date">Preferred Date</Label>
                    <Input
                      id="preferred_date"
                      type="datetime-local"
                      value={pickupForm.preferred_date}
                      onChange={(e) => setPickupForm({ ...pickupForm, preferred_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={pickupForm.notes}
                      onChange={(e) => setPickupForm({ ...pickupForm, notes: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">Schedule Pickup</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segregation Awareness */}
          <TabsContent value="segregation">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                    <Droplets className="w-6 h-6 text-green-500" />
                  </div>
                  <CardTitle>Wet Waste</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Biodegradable kitchen waste that can be composted</p>
                  <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                    <li>Fruit & vegetable peels</li>
                    <li>Food leftovers</li>
                    <li>Tea bags & coffee grounds</li>
                    <li>Garden waste</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                    <Recycle className="w-6 h-6 text-blue-500" />
                  </div>
                  <CardTitle>Dry Waste</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Recyclable materials that can be reprocessed</p>
                  <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                    <li>Paper & cardboard</li>
                    <li>Plastic bottles & containers</li>
                    <li>Glass bottles</li>
                    <li>Metal cans</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <CardTitle>Hazardous Waste</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Requires special handling and disposal</p>
                  <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                    <li>Batteries</li>
                    <li>Electronics</li>
                    <li>Medical waste</li>
                    <li>Chemical containers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recycling Marketplace */}
          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  List Recyclable Item
                </CardTitle>
                <CardDescription>
                  Trade or donate recyclable materials with community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecyclableSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="item_name">Item Name</Label>
                    <Input
                      id="item_name"
                      value={recyclableForm.item_name}
                      onChange={(e) => setRecyclableForm({ ...recyclableForm, item_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={recyclableForm.description}
                      onChange={(e) => setRecyclableForm({ ...recyclableForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        value={recyclableForm.quantity}
                        onChange={(e) => setRecyclableForm({ ...recyclableForm, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (Optional)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={recyclableForm.price}
                        onChange={(e) => setRecyclableForm({ ...recyclableForm, price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact_info">Contact Information</Label>
                    <Input
                      id="contact_info"
                      value={recyclableForm.contact_info}
                      onChange={(e) => setRecyclableForm({ ...recyclableForm, contact_info: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">List Item</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Illegal Dumping Reports */}
          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Report Illegal Dumping
                </CardTitle>
                <CardDescription>
                  Help keep our community clean by reporting illegal waste disposal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={reportForm.location}
                      onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                      placeholder="Enter address or landmark"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="report_description">Description</Label>
                    <Textarea
                      id="report_description"
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      placeholder="Describe the illegal dumping incident"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Report</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Leaderboard */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Eco Warriors Leaderboard
                </CardTitle>
                <CardDescription>
                  Top contributors making a difference in our community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Sarah Johnson", points: 1250, badge: "🏆" },
                    { rank: 2, name: "Mike Chen", points: 980, badge: "🥈" },
                    { rank: 3, name: "Emma Davis", points: 875, badge: "🥉" },
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{user.badge}</span>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">Rank #{user.rank}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {user.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

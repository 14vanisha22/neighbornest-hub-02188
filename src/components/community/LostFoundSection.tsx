import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ReportLostItemDialog } from "./ReportLostItemDialog";
import { ReportFoundItemDialog } from "./ReportFoundItemDialog";
import { format } from "date-fns";
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Camera,
  Heart
} from "lucide-react";

interface LostFoundItem {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  contact_phone: string;
  status: string;
  category: string;
  image_url: string | null;
  created_at: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "pets":
      return "bg-community-orange/20 text-community-orange";
    case "electronics":
      return "bg-community-blue/20 text-community-blue";
    case "documents":
      return "bg-destructive/20 text-destructive";
    case "valuables":
      return "bg-accent/20 text-accent";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export const LostFoundSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [foundDialogOpen, setFoundDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("lost_found_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "lost" && item.type === "lost") ||
                      (activeTab === "found" && item.type === "found");
    
    return matchesSearch && matchesTab;
  });

  return (
    <section id="lost-found" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Lost & Found Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help reunite community members with their lost belongings and pets
          </p>
        </div>

        {/* Search and Post Actions */}
        <Card className="mb-8 shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search lost or found items..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  className="flex-1 md:flex-none"
                  onClick={() => setLostDialogOpen(true)}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Lost Item
                </Button>
                <Button 
                  variant="success" 
                  className="flex-1 md:flex-none"
                  onClick={() => setFoundDialogOpen(true)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Report Found Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Lost/Found */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
            <TabsTrigger value="found">Found</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className={`shadow-soft hover:shadow-medium transition-all duration-300 ${
                  item.status === "resolved" ? "opacity-75" : "hover:scale-[1.02]"
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={item.type === "lost" ? "destructive" : "default"}
                            className={item.type === "found" ? "bg-success text-success-foreground" : ""}
                          >
                            {item.type === "lost" ? "Lost" : "Found"}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={getCategoryColor(item.category)}
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      {item.status === "resolved" && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Image */}
                      <div className="w-full h-48 bg-muted rounded-md overflow-hidden">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground">{item.description}</p>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(item.created_at), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{item.contact_phone}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Contact
                        </Button>
                        {item.status === "active" && (
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredItems.length === 0 && (
          <Card className="p-12 text-center shadow-soft">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or browse different categories.</p>
            <div className="flex gap-2 justify-center">
              <Button variant="destructive" onClick={() => setLostDialogOpen(true)}>
                <AlertCircle className="w-4 h-4 mr-2" />
                Report Lost Item
              </Button>
              <Button variant="success" onClick={() => setFoundDialogOpen(true)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Report Found Item
              </Button>
            </div>
          </Card>
        )}

        <ReportLostItemDialog
          open={lostDialogOpen}
          onOpenChange={setLostDialogOpen}
          onSuccess={fetchItems}
        />

        <ReportFoundItemDialog
          open={foundDialogOpen}
          onOpenChange={setFoundDialogOpen}
          onSuccess={fetchItems}
        />
      </div>
    </section>
  );
};
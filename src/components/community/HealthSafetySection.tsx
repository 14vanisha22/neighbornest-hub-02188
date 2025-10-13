import { Phone, MapPin, Pill, AlertCircle, Map } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { MedicalCentersMap } from "./MedicalCentersMap";
import { EnhancedCallButton } from "./EnhancedCallButton";

export const HealthSafetySection = () => {
  const [medicineSearch, setMedicineSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const { data: emergencyContacts } = useQuery({
    queryKey: ["emergency-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: medicalCenters } = useQuery({
    queryKey: ["medical-centers", selectedType],
    queryFn: async () => {
      let query = supabase
        .from("medical_centers")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (selectedType !== "all") {
        query = query.eq("type", selectedType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: medicines } = useQuery({
    queryKey: ["medicines", medicineSearch],
    queryFn: async () => {
      let query = supabase
        .from("medicine_inventory")
        .select("*")
        .order("pharmacy_name", { ascending: true });
      
      if (medicineSearch) {
        query = query.ilike("medicine_name", `%${medicineSearch}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="health-safety" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Health & Safety
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access emergency contacts, find nearby medical facilities, and check medicine availability
          </p>
        </div>

        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="emergency">🚨 Emergency</TabsTrigger>
            <TabsTrigger value="clinics">🏥 Clinics & Doctors</TabsTrigger>
            <TabsTrigger value="medicines">💊 Medicines</TabsTrigger>
          </TabsList>

          <TabsContent value="emergency">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyContacts?.map((contact) => (
                <Card key={contact.id} className="hover:shadow-lg transition-shadow border-red-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/10 rounded-lg">
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <Badge variant="destructive" className="mt-1">{contact.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{contact.description}</p>
                    <a href={`tel:${contact.phone_number}`}>
                      <Button className="w-full" variant="default">
                        <Phone className="w-4 h-4 mr-2" />
                        Call {contact.phone_number}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clinics">
            <div className="mb-6 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={selectedType === "all" ? "default" : "outline"}
                  onClick={() => setSelectedType("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedType === "hospital" ? "default" : "outline"}
                  onClick={() => setSelectedType("hospital")}
                >
                  Hospitals
                </Button>
                <Button
                  variant={selectedType === "clinic" ? "default" : "outline"}
                  onClick={() => setSelectedType("clinic")}
                >
                  Clinics
                </Button>
                <Button
                  variant={selectedType === "doctor" ? "default" : "outline"}
                  onClick={() => setSelectedType("doctor")}
                >
                  Doctors
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  size="sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  List View
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  onClick={() => setViewMode("map")}
                  size="sm"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map View
                </Button>
              </div>
            </div>

            {viewMode === "map" ? (
              <MedicalCentersMap centers={medicalCenters || []} />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {medicalCenters?.map((center) => (
                  <Card key={center.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{center.name}</CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {center.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{center.address}</span>
                      </div>
                      {center.specialization && (
                        <div className="text-sm">
                          <span className="font-semibold">Specialization:</span>{" "}
                          <span className="text-muted-foreground">{center.specialization}</span>
                        </div>
                      )}
                      {center.timings && (
                        <div className="text-sm">
                          <span className="font-semibold">Timings:</span>{" "}
                          <span className="text-muted-foreground">{center.timings}</span>
                        </div>
                      )}
                      <EnhancedCallButton 
                        center={center} 
                        isEmergency={center.type === 'hospital'}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="medicines">
            <div className="mb-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for medicine..."
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  className="flex-1"
                />
                <Button>Search</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines?.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Pill className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.medicine_name}</CardTitle>
                          <Badge
                            variant={item.stock_status === "in_stock" ? "default" : "destructive"}
                            className="mt-1"
                          >
                            {item.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm">{item.pharmacy_name}</p>
                      <div className="flex items-start gap-2 text-sm mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{item.address}</span>
                      </div>
                    </div>
                    <a href={`tel:${item.contact}`}>
                      <Button className="w-full" size="sm" disabled={item.stock_status !== "in_stock"}>
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Pharmacy
                      </Button>
                    </a>
                    {item.latitude && item.longitude && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full" size="sm" variant="outline">
                          <MapPin className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EventsSection = () => {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .order("event_date", { ascending: true })
      .limit(6);

    if (!error && data) {
      setEvents(data);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cultural: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      educational: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      social: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
      sports: "bg-green-500/10 text-green-700 dark:text-green-400",
      health: "bg-red-500/10 text-red-700 dark:text-red-400",
    };
    return colors[category] || "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  };

  return (
    <section id="events" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Community Events
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join cultural, educational, and social events happening in your community
          </p>
        </div>

        <div className="mb-8 text-right">
          <Button onClick={() => navigate("/auth")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {event.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.event_date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.rsvp_count} attending</span>
                  </div>
                </div>
                <Button className="w-full">RSVP to Event</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No upcoming events</p>
            <Button onClick={() => navigate("/auth")}>
              <Plus className="mr-2 h-4 w-4" />
              Create the first event
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

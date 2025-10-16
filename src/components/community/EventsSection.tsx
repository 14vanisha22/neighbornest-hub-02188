import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus, Heart, Star, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface EventRSVP {
  event_id: string;
  rsvp_type: 'going' | 'interested';
}

export const EventsSection = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [userRSVPs, setUserRSVPs] = useState<Set<string>>(new Set());
  const [userRSVPTypes, setUserRSVPTypes] = useState<Map<string, 'going' | 'interested'>>(new Map());
  const [userVolunteers, setUserVolunteers] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchUserRSVPs();
    fetchUserVolunteers();
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

  const fetchUserRSVPs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("event_rsvps")
      .select("event_id, rsvp_type")
      .eq("user_id", user.id);

    if (!error && data) {
      setUserRSVPs(new Set(data.map((r: EventRSVP) => r.event_id)));
      setUserRSVPTypes(new Map(data.map((r: EventRSVP) => [r.event_id, r.rsvp_type])));
    }
  };

  const fetchUserVolunteers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("event_volunteers")
      .select("event_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setUserVolunteers(new Set(data.map((v: any) => v.event_id)));
    }
  };

  const handleRSVP = async (eventId: string, type: 'going' | 'interested') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const currentRSVP = userRSVPTypes.get(eventId);
    
    if (currentRSVP === type) {
      // Remove RSVP if clicking same button again
      const { error } = await supabase
        .from("event_rsvps")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (!error) {
        setUserRSVPs(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        setUserRSVPTypes(prev => {
          const newMap = new Map(prev);
          newMap.delete(eventId);
          return newMap;
        });
        toast({ title: "RSVP removed" });
        fetchEvents();
      }
    } else {
      // Add or update RSVP
      const { error } = await supabase
        .from("event_rsvps")
        .upsert({
          event_id: eventId,
          user_id: user.id,
          rsvp_type: type
        }, {
          onConflict: 'event_id,user_id'
        });

      if (!error) {
        setUserRSVPs(prev => new Set([...prev, eventId]));
        setUserRSVPTypes(prev => new Map([...prev, [eventId, type]]));
        toast({ 
          title: type === 'going' ? "Marked as Going!" : "Marked as Interested!",
          description: "You can change this anytime"
        });
        fetchEvents();
      }
    }
  };

  const handleVolunteer = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    if (userVolunteers.has(eventId)) {
      // Remove volunteer
      const { error } = await supabase
        .from("event_volunteers")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (!error) {
        setUserVolunteers(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        toast({ title: "Volunteer registration removed" });
        fetchEvents();
      }
    } else {
      // Add volunteer
      const { error } = await supabase
        .from("event_volunteers")
        .insert({
          event_id: eventId,
          user_id: user.id
        });

      if (!error) {
        setUserVolunteers(prev => new Set([...prev, eventId]));
        toast({ 
          title: "Volunteer registered!",
          description: "Thank you for volunteering!"
        });
        fetchEvents();
      } else {
        toast({
          title: "Already registered",
          description: "You're already volunteering for this event",
          variant: "destructive"
        });
      }
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
                  {event.volunteer_spots && (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                      <span>{event.volunteers_joined}/{event.volunteer_spots} volunteers</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={userRSVPTypes.get(event.id) === 'going' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRSVP(event.id, 'going')}
                    className="flex-1"
                  >
                    <Heart className={`h-4 w-4 mr-1 ${userRSVPTypes.get(event.id) === 'going' ? 'fill-current' : ''}`} />
                    Going
                  </Button>
                  <Button
                    variant={userRSVPTypes.get(event.id) === 'interested' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRSVP(event.id, 'interested')}
                    className="flex-1"
                  >
                    <Star className={`h-4 w-4 mr-1 ${userRSVPTypes.get(event.id) === 'interested' ? 'fill-current' : ''}`} />
                    Interested
                  </Button>
                </div>

                {event.volunteer_spots && (
                  <Button
                    variant={userVolunteers.has(event.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVolunteer(event.id)}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {userVolunteers.has(event.id) ? "Volunteering ✓" : "Volunteer"}
                  </Button>
                )}
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

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DriveRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drive: {
    id: string;
    title: string;
    date: string;
    location: string;
    organizer: string;
  };
}

export const DriveRegistrationDialog = ({ open, onOpenChange, drive }: DriveRegistrationDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    age_group: "",
    gender: "",
    number_of_participants: 1,
    volunteer_role: "",
    availability: "",
    tshirt_size: "",
    terms_accepted: false,
    photo_consent: false,
    liability_accepted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms_accepted || !formData.photo_consent || !formData.liability_accepted) {
      toast({
        title: "Please accept all agreements",
        description: "You must accept the terms, photo consent, and liability waiver to register.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for this event.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("drive_registrations").insert({
      drive_id: drive.id,
      user_id: user.id,
      ...formData,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successfully registered!",
        description: `You're registered for ${drive.title}`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {drive.title}</DialogTitle>
          <DialogDescription>
            Fill out this form to register for the event on {new Date(drive.date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age_group">Age Group</Label>
                <Select value={formData.age_group} onValueChange={(value) => setFormData({ ...formData, age_group: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-18">Under 18</SelectItem>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="26-35">26-35</SelectItem>
                    <SelectItem value="36-50">36-50</SelectItem>
                    <SelectItem value="51-plus">51+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Participation Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Participation Preferences</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participants">Number of Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  value={formData.number_of_participants}
                  onChange={(e) => setFormData({ ...formData, number_of_participants: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volunteer_role">Volunteer Role Preference</Label>
                <Select value={formData.volunteer_role} onValueChange={(value) => setFormData({ ...formData, volunteer_role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanup-crew">Cleanup Crew</SelectItem>
                    <SelectItem value="tree-planter">Tree Planter</SelectItem>
                    <SelectItem value="organizer-support">Organizer Support</SelectItem>
                    <SelectItem value="photographer">Photographer</SelectItem>
                    <SelectItem value="any">Any Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-event">Full Event</SelectItem>
                    <SelectItem value="morning-only">Morning Only</SelectItem>
                    <SelectItem value="afternoon-only">Afternoon Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tshirt_size">T-shirt Size</Label>
                <Select value={formData.tshirt_size} onValueChange={(value) => setFormData({ ...formData, tshirt_size: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="xxl">XXL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Event Details (Read-only) */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg">Event Details</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Event:</span> {drive.title}</div>
              <div><span className="font-medium">Date:</span> {new Date(drive.date).toLocaleString()}</div>
              <div><span className="font-medium">Location:</span> {drive.location}</div>
              <div><span className="font-medium">Organizer:</span> {drive.organizer}</div>
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Agreements *</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms_accepted}
                  onCheckedChange={(checked) => setFormData({ ...formData, terms_accepted: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I accept the terms and conditions and agree to follow event guidelines and safety protocols.
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="photo"
                  checked={formData.photo_consent}
                  onCheckedChange={(checked) => setFormData({ ...formData, photo_consent: checked as boolean })}
                />
                <Label htmlFor="photo" className="text-sm leading-relaxed cursor-pointer">
                  I consent to being photographed or recorded during the event for promotional purposes.
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="liability"
                  checked={formData.liability_accepted}
                  onCheckedChange={(checked) => setFormData({ ...formData, liability_accepted: checked as boolean })}
                />
                <Label htmlFor="liability" className="text-sm leading-relaxed cursor-pointer">
                  I acknowledge the risks involved and release the organizers from any liability for injuries or losses during the event.
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register for Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

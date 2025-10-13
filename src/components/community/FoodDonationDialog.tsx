import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface FoodDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FoodDonationDialog = ({ open, onOpenChange }: FoodDonationDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: "",
    donor_type: "",
    food_type: "",
    quantity: "",
    expiry_time: "",
    pickup_location: "",
    contact_phone: "",
    contact_email: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to donate food.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("food_donations").insert({
      donor_id: user.id,
      ...formData,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Donation failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank you for donating!",
        description: "Your food donation has been listed. Someone will contact you soon.",
      });
      onOpenChange(false);
      setFormData({
        donor_name: "",
        donor_type: "",
        food_type: "",
        quantity: "",
        expiry_time: "",
        pickup_location: "",
        contact_phone: "",
        contact_email: "",
        notes: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Donate Food</DialogTitle>
          <DialogDescription>
            Help reduce food waste and feed those in need by donating surplus food
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="donor_name">Your Name / Organization *</Label>
              <Input
                id="donor_name"
                required
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor_type">Donor Type *</Label>
              <Select required value={formData.donor_type} onValueChange={(value) => setFormData({ ...formData, donor_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="event">Event Organizer</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="grocery">Grocery Store</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="food_type">Type of Food *</Label>
              <Input
                id="food_type"
                required
                placeholder="e.g., Cooked meals, Fresh fruits, Packaged food"
                value={formData.food_type}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                required
                placeholder="e.g., 50 meals, 10 kg"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_time">Best Before / Expiry Time *</Label>
              <Input
                id="expiry_time"
                type="datetime-local"
                required
                value={formData.expiry_time}
                onChange={(e) => setFormData({ ...formData, expiry_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone *</Label>
              <Input
                id="contact_phone"
                type="tel"
                required
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pickup_location">Pickup Location *</Label>
              <Input
                id="pickup_location"
                required
                placeholder="Full address with landmarks"
                value={formData.pickup_location}
                onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Storage instructions, special requirements, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Donation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

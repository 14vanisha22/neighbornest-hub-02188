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

interface FoodRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FoodRequestDialog = ({ open, onOpenChange }: FoodRequestDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: "",
    organization_type: "",
    food_type_needed: "",
    quantity_needed: "",
    pickup_location: "",
    contact_phone: "",
    contact_email: "",
    urgency: "medium",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to request food.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("food_requests").insert({
      requester_id: user.id,
      ...formData,
      status: "active",
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request submitted!",
        description: "Your food request has been posted. Donors will be notified.",
      });
      onOpenChange(false);
      setFormData({
        organization_name: "",
        organization_type: "",
        food_type_needed: "",
        quantity_needed: "",
        pickup_location: "",
        contact_phone: "",
        contact_email: "",
        urgency: "medium",
        notes: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Food</DialogTitle>
          <DialogDescription>
            Submit a request for food donations for your organization or community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization Name *</Label>
              <Input
                id="organization_name"
                required
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization_type">Organization Type *</Label>
              <Select required value={formData.organization_type} onValueChange={(value) => setFormData({ ...formData, organization_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                  <SelectItem value="family">Family in Need</SelectItem>
                  <SelectItem value="community-center">Community Center</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="food_type_needed">Type of Food Needed *</Label>
              <Input
                id="food_type_needed"
                required
                placeholder="e.g., Cooked meals, Groceries, Fresh produce"
                value={formData.food_type_needed}
                onChange={(e) => setFormData({ ...formData, food_type_needed: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity_needed">Quantity Needed *</Label>
              <Input
                id="quantity_needed"
                required
                placeholder="e.g., 100 meals, 20 kg rice"
                value={formData.quantity_needed}
                onChange={(e) => setFormData({ ...formData, quantity_needed: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select required value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Within a week</SelectItem>
                  <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
                  <SelectItem value="high">High - Urgent (Today)</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="pickup_location">Delivery/Pickup Location *</Label>
              <Input
                id="pickup_location"
                required
                placeholder="Full address where food can be delivered"
                value={formData.pickup_location}
                onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Additional Information</Label>
              <Textarea
                id="notes"
                placeholder="Number of people to feed, dietary restrictions, storage capacity, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

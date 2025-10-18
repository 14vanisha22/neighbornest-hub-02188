import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";

const kitchenSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  location: z.string().min(5, "Please provide a valid location"),
  address: z.string().min(10, "Please provide a complete address"),
  contact_phone: z.string().regex(/^[0-9+\-\s()]{10,20}$/, "Invalid phone number"),
  timings: z.string().min(5, "Please provide timings"),
  food_type: z.string().min(2, "Please specify food type"),
  description: z.string().max(500, "Description too long").optional(),
  price_range: z.string().optional(),
});

interface AddKitchenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddKitchenDialog = ({ open, onOpenChange, onSuccess }: AddKitchenDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    contact_phone: "",
    timings: "",
    food_type: "",
    description: "",
    price_range: "",
    is_free: true,
    meal_types: [] as string[],
  });

  const mealOptions = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const handleMealTypeToggle = (meal: string) => {
    setFormData(prev => ({
      ...prev,
      meal_types: prev.meal_types.includes(meal)
        ? prev.meal_types.filter(m => m !== meal)
        : [...prev.meal_types, meal]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = kitchenSchema.safeParse(formData);
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
      toast({
        title: "Authentication required",
        description: "Please login to add a kitchen",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('community_kitchens').insert({
        name: formData.name,
        location: formData.location,
        address: formData.address,
        contact_phone: formData.contact_phone,
        timings: formData.timings,
        food_type: formData.food_type,
        description: formData.description || null,
        is_free: formData.is_free,
        price_range: formData.is_free ? null : formData.price_range,
        meal_types: formData.meal_types.length > 0 ? formData.meal_types : null,
        status: 'active', // Admins can approve later
        rating: 0,
        total_reviews: 0
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Kitchen added successfully. It will be reviewed by admins."
      });

      setFormData({
        name: "",
        location: "",
        address: "",
        contact_phone: "",
        timings: "",
        food_type: "",
        description: "",
        price_range: "",
        is_free: true,
        meal_types: [],
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Community Kitchen</DialogTitle>
          <DialogDescription>
            Help others find community kitchens by adding one to our directory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Kitchen Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sai Annapurna Kitchen"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone *</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+91 9876543210"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/Area *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Dwaraka Nagar, Vizag"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address with landmarks"
              rows={2}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timings">Timings *</Label>
              <Input
                id="timings"
                value={formData.timings}
                onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                placeholder="7 AM - 9 PM"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="food_type">Food Type *</Label>
              <Input
                id="food_type"
                value={formData.food_type}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                placeholder="Vegetarian, Non-veg, etc."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Meals Served</Label>
            <div className="flex flex-wrap gap-3">
              {mealOptions.map((meal) => (
                <div key={meal} className="flex items-center space-x-2">
                  <Checkbox
                    id={meal}
                    checked={formData.meal_types.includes(meal)}
                    onCheckedChange={() => handleMealTypeToggle(meal)}
                  />
                  <label htmlFor={meal} className="text-sm cursor-pointer">
                    {meal}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_free"
                checked={formData.is_free}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked as boolean })}
              />
              <label htmlFor="is_free" className="text-sm font-medium cursor-pointer">
                Provides free meals
              </label>
            </div>
          </div>

          {!formData.is_free && (
            <div className="space-y-2">
              <Label htmlFor="price_range">Price Range</Label>
              <Input
                id="price_range"
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                placeholder="₹20-50 per meal"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional information about the kitchen..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.description.length}/500
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Kitchen
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
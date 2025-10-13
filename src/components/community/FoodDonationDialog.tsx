import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  donor_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  donor_type: z.enum(['individual', 'restaurant', 'event', 'hotel', 'grocery', 'other']),
  food_type: z.string().trim().min(3, "Food type must be at least 3 characters").max(200, "Food type must be less than 200 characters"),
  quantity: z.string().trim().min(1, "Quantity is required").max(50, "Quantity must be less than 50 characters"),
  expiry_time: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Expiry time must be in the future"
  }),
  pickup_location: z.string().trim().min(10, "Location must be at least 10 characters").max(500, "Location must be less than 500 characters"),
  contact_phone: z.string().regex(/^[0-9+\-\s()]{10,20}$/, "Please enter a valid phone number"),
  contact_email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface FoodDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FoodDonationDialog = ({ open, onOpenChange }: FoodDonationDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donor_name: "",
      donor_type: "individual",
      food_type: "",
      quantity: "",
      expiry_time: "",
      pickup_location: "",
      contact_phone: "",
      contact_email: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
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
      ...data,
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
      form.reset();
      onOpenChange(false);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="donor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name / Organization *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="donor_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="event">Event Organizer</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="grocery">Grocery Store</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="food_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Food *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Cooked meals, Fresh fruits, Packaged food" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 50 meals, 10 kg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best Before / Expiry Time *</FormLabel>
                    <FormControl>
                      <Input {...field} type="datetime-local" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone *</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pickup_location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Pickup Location *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full address with landmarks" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Storage instructions, special requirements, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Donation
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  organization_name: z.string().trim().min(2, "Organization name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  organization_type: z.enum(['ngo', 'shelter', 'family', 'community-center', 'school', 'other']),
  food_type_needed: z.string().trim().min(3, "Food type must be at least 3 characters").max(200, "Food type must be less than 200 characters"),
  quantity_needed: z.string().trim().min(1, "Quantity is required").max(50, "Quantity must be less than 50 characters"),
  urgency: z.enum(['low', 'medium', 'high']),
  pickup_location: z.string().trim().min(10, "Location must be at least 10 characters").max(500, "Location must be less than 500 characters"),
  contact_phone: z.string().regex(/^[0-9+\-\s()]{10,20}$/, "Please enter a valid phone number"),
  contact_email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface FoodRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FoodRequestDialog = ({ open, onOpenChange }: FoodRequestDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_name: "",
      organization_type: "ngo",
      food_type_needed: "",
      quantity_needed: "",
      urgency: "medium",
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
        description: "Please sign in to request food.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("food_requests").insert([{
      requester_id: user.id,
      organization_name: data.organization_name,
      organization_type: data.organization_type,
      food_type_needed: data.food_type_needed,
      quantity_needed: data.quantity_needed,
      urgency: data.urgency,
      pickup_location: data.pickup_location,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email || "",
      notes: data.notes || "",
      status: "active",
    }]);

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
      form.reset();
      onOpenChange(false);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="organization_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="shelter">Shelter</SelectItem>
                        <SelectItem value="family">Family in Need</SelectItem>
                        <SelectItem value="community-center">Community Center</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="food_type_needed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Food Needed *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Cooked meals, Groceries, Fresh produce" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity_needed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Needed *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 100 meals, 20 kg rice" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Within a week</SelectItem>
                        <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
                        <SelectItem value="high">High - Urgent (Today)</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormLabel>Delivery/Pickup Location *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full address where food can be delivered" />
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
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Number of people to feed, dietary restrictions, storage capacity, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

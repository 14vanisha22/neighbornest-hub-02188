import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().regex(/^[0-9+\-\s()]{10,20}$/, "Please enter a valid phone number"),
  age_group: z.enum(['under-18', '18-25', '26-35', '36-50', '51-plus']).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  number_of_participants: z.coerce.number().int().min(1, "At least 1 participant required").max(50, "Maximum 50 participants"),
  volunteer_role: z.string().max(200).optional(),
  availability: z.string().max(500).optional(),
  tshirt_size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
  terms_accepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  photo_consent: z.boolean().refine(val => val === true, "You must provide photo consent"),
  liability_accepted: z.boolean().refine(val => val === true, "You must accept the liability waiver")
});

type FormData = z.infer<typeof formSchema>;

export const DriveRegistrationDialog = ({ open, onOpenChange, drive }: DriveRegistrationDialogProps) => {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      number_of_participants: 1,
      volunteer_role: "",
      availability: "",
      terms_accepted: false,
      photo_consent: false,
      liability_accepted: false
    }
  });

  const onSubmit = async (data: FormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for this event.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("drive_registrations").insert({
      drive_id: drive.id,
      user_id: user.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      age_group: data.age_group,
      gender: data.gender,
      number_of_participants: data.number_of_participants,
      volunteer_role: data.volunteer_role,
      availability: data.availability,
      tshirt_size: data.tshirt_size,
      terms_accepted: data.terms_accepted,
      photo_consent: data.photo_consent,
      liability_accepted: data.liability_accepted
    });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Successfully registered!",
      description: `You're registered for ${drive.title}`,
    });

    form.reset();
    onOpenChange(false);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 (555) 123-4567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="under-18">Under 18</SelectItem>
                          <SelectItem value="18-25">18-25</SelectItem>
                          <SelectItem value="26-35">26-35</SelectItem>
                          <SelectItem value="36-50">36-50</SelectItem>
                          <SelectItem value="51-plus">51+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Participation Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Participation Preferences</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="number_of_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Participants</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="volunteer_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volunteer Role Preference</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cleanup-crew">Cleanup Crew</SelectItem>
                          <SelectItem value="tree-planter">Tree Planter</SelectItem>
                          <SelectItem value="organizer-support">Organizer Support</SelectItem>
                          <SelectItem value="photographer">Photographer</SelectItem>
                          <SelectItem value="any">Any Role</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-event">Full Event</SelectItem>
                          <SelectItem value="morning-only">Morning Only</SelectItem>
                          <SelectItem value="afternoon-only">Afternoon Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tshirt_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T-shirt Size</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="terms_accepted"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm leading-relaxed cursor-pointer">
                          I accept the terms and conditions and agree to follow event guidelines and safety protocols.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo_consent"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm leading-relaxed cursor-pointer">
                          I consent to being photographed or recorded during the event for promotional purposes.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="liability_accepted"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm leading-relaxed cursor-pointer">
                          I acknowledge the risks involved and release the organizers from any liability for injuries or losses during the event.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register for Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

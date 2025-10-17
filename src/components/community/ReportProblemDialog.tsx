import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ReportProblemDialog({ onProblemReported }: { onProblemReported: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Waste Management",
    "Pollution",
    "Infrastructure",
    "Safety",
    "Health",
    "Other",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category || !location.trim()) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report a problem",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    let imageUrl = null;

    // Upload image if provided
    if (imageFile) {
      const fileName = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("lost-found-items")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast({
          title: "Upload failed",
          description: "Could not upload image",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("lost-found-items")
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { error } = await supabase
      .from("problem_reports")
      .insert({
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        image_url: imageUrl,
        reported_by: user.id,
      });

    setIsSubmitting(false);

    if (error) {
      console.error("Error reporting problem:", error);
      toast({
        title: "Error",
        description: "Failed to submit problem report",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Problem reported",
      description: "Your report has been submitted to the community",
    });

    setOpen(false);
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setImageFile(null);
    onProblemReported();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report a Community Problem</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="problem-title">Problem Title *</Label>
            <Input
              id="problem-title"
              placeholder="Illegal dumping on street"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="problem-category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="problem-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="problem-location">Location *</Label>
            <Input
              id="problem-location"
              placeholder="Street name or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="problem-description">Description *</Label>
            <Textarea
              id="problem-description"
              placeholder="Describe the problem in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="problem-image">Upload Image (optional)</Label>
            <div className="mt-2">
              <label
                htmlFor="problem-image"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
              >
                <Upload className="h-5 w-5" />
                <span className="text-sm">
                  {imageFile ? imageFile.name : "Choose an image"}
                </span>
              </label>
              <input
                id="problem-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

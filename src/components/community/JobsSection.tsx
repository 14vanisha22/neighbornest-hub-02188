import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  Wrench,
  GraduationCap,
  Heart,
  Plus,
  Bookmark,
  BookmarkCheck
} from "lucide-react";

// Mock data for jobs and services
const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Local Tech Startup",
    type: "Full-time",
    location: "Downtown",
    salary: "$60,000 - $80,000",
    category: "skilled",
    urgency: "medium",
    postedDate: "2 days ago",
    description: "Looking for a React developer to join our growing team.",
    tags: ["React", "TypeScript", "Remote Friendly"],
    experience: "2-4 years of professional experience in frontend development",
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      "Strong proficiency in React and TypeScript",
      "Experience with modern web development tools and practices",
      "Excellent problem-solving and communication skills"
    ],
    responsibilities: [
      "Build and maintain responsive web applications using React",
      "Collaborate with designers and backend developers",
      "Write clean, maintainable code with proper documentation",
      "Participate in code reviews and team meetings",
      "Stay updated with latest frontend technologies"
    ],
    benefits: ["Health insurance", "Flexible working hours", "Remote work option", "Professional development budget"],
    contactEmail: "careers@techstartup.com",
    contactPhone: "(555) 123-4567",
    verified: true,
    expiresAt: "December 31, 2025"
  },
  {
    id: 2,
    title: "Plumbing Services",
    company: "Mike's Plumbing",
    type: "Service",
    location: "All Areas",
    salary: "$50/hour",
    category: "unskilled",
    urgency: "high",
    postedDate: "1 day ago",
    description: "Emergency and regular plumbing services available 24/7. Licensed and insured professional with 15 years of experience.",
    tags: ["Emergency", "Licensed", "Insured"],
    experience: "15+ years in residential and commercial plumbing",
    qualifications: [
      "Licensed Master Plumber",
      "Fully insured and bonded",
      "Background checked",
      "Emergency response certified"
    ],
    responsibilities: [
      "Fix leaks, clogs, and drainage issues",
      "Install and repair water heaters",
      "Replace fixtures and pipes",
      "Emergency 24/7 service availability",
      "Provide maintenance recommendations"
    ],
    benefits: ["Free estimates", "Same-day service", "1-year warranty on all work", "Senior citizen discounts"],
    contactEmail: "mike@mikesplumbing.com",
    contactPhone: "(555) 987-6543",
    verified: true
  },
  {
    id: 3,
    title: "Math Tutor",
    company: "Community Learning Center",
    type: "Part-time",
    location: "North Side",
    salary: "$25/hour",
    category: "skilled",
    urgency: "low",
    postedDate: "3 days ago",
    description: "Helping high school students with mathematics. We provide a supportive learning environment with personalized attention.",
    tags: ["Education", "Flexible Hours", "Experienced"],
    experience: "Minimum 1 year of tutoring or teaching experience",
    qualifications: [
      "Bachelor's degree in Mathematics or Education",
      "Strong understanding of high school math curriculum",
      "Excellent communication and patience",
      "Ability to explain complex concepts simply"
    ],
    responsibilities: [
      "Provide one-on-one or small group tutoring",
      "Help students with homework and test preparation",
      "Track and report student progress",
      "Adapt teaching methods to individual learning styles",
      "Maintain a positive learning environment"
    ],
    benefits: ["Flexible scheduling", "Professional development opportunities", "Rewarding work environment"],
    contactEmail: "tutoring@communitylearning.org",
    contactPhone: "(555) 456-7890",
    verified: false
  },
  {
    id: 4,
    title: "Dog Walking",
    company: "Sarah's Pet Care",
    type: "Service",
    location: "Central Park Area",
    salary: "$20/walk",
    category: "unskilled",
    urgency: "medium",
    postedDate: "1 day ago",
    description: "Reliable dog walking services for busy pet owners. Professional, caring, and experienced with all breeds.",
    tags: ["Pet Care", "Daily", "Trustworthy"],
    experience: "3+ years of professional dog walking and pet care",
    qualifications: [
      "Pet First Aid certified",
      "Comfortable with all dog sizes and breeds",
      "Reliable and punctual",
      "Background checked and insured"
    ],
    responsibilities: [
      "Daily walks tailored to your dog's needs",
      "Regular updates with photos",
      "Basic obedience reinforcement",
      "Fresh water and treats provided",
      "Emergency contact available"
    ],
    benefits: ["Flexible scheduling", "GPS tracking", "Satisfaction guaranteed", "Package deals available"],
    contactEmail: "sarah@sarahspetcare.com",
    contactPhone: "(555) 321-9876",
    verified: true
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "skilled":
      return <GraduationCap className="w-4 h-4" />;
    case "unskilled":
      return <Wrench className="w-4 h-4" />;
    default:
      return <Briefcase className="w-4 h-4" />;
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

export const JobsSection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<typeof jobsData[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);

      if (data) {
        setSavedJobs(new Set(data.map(item => Number(item.job_id))));
      }
    };

    fetchSavedJobs();
  }, []);

  const handleSaveJob = async (jobId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save jobs",
        variant: "destructive"
      });
      return;
    }

    const isSaved = savedJobs.has(jobId);

    try {
      if (isSaved) {
        // Unsave job
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', String(jobId));
        
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });

        toast({ title: "Job removed from saved jobs" });
      } else {
        // Save job
        await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: String(jobId)
          });

        setSavedJobs(prev => new Set(prev).add(jobId));
        toast({ title: "Job saved successfully!" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="jobs" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Jobs & Services Directory
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with local opportunities and service providers in your community
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-soft">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or services..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="skilled">Skilled Professional</SelectItem>
                  <SelectItem value="unskilled">General Services</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="north">North Side</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="community" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Post Job/Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base">{job.company}</CardDescription>
                  </div>
                  <Badge variant={getUrgencyColor(job.urgency) as any}>
                    {job.urgency} priority
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(job.category)}
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveJob(job.id)}
                        className="px-2"
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="p-12 text-center shadow-soft">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or post a new opportunity.</p>
          </Card>
        )}
      </div>

      <JobDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        job={selectedJob}
        onApply={() => {
          setIsDialogOpen(false);
          setIsApplicationDialogOpen(true);
        }}
      />

      {selectedJob && (
        <JobApplicationDialog
          open={isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}
    </section>
  );
};
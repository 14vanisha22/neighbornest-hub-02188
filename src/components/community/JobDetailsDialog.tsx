import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  Wrench,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  category: string;
  urgency: string;
  postedDate: string;
  description: string;
  tags: string[];
  experience?: string;
  qualifications?: string[];
  responsibilities?: string[];
  benefits?: string[];
  contactEmail?: string;
  contactPhone?: string;
  verified?: boolean;
  expiresAt?: string;
}

interface JobDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onApply?: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "skilled":
      return <GraduationCap className="w-5 h-5" />;
    case "unskilled":
      return <Wrench className="w-5 h-5" />;
    default:
      return <Briefcase className="w-5 h-5" />;
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

export const JobDetailsDialog = ({ open, onOpenChange, job, onApply }: JobDetailsDialogProps) => {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{job.title}</DialogTitle>
              <DialogDescription className="text-base">
                {job.company}
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              {job.verified && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </Badge>
              )}
              <Badge variant={getUrgencyColor(job.urgency) as any}>
                {job.urgency} priority
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {getCategoryIcon(job.category)}
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium">{job.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Salary</p>
                <p className="text-sm font-medium">{job.salary}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Posted</p>
                <p className="text-sm font-medium">{job.postedDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Experience Required */}
          {job.experience && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Experience Required
                </h3>
                <p className="text-muted-foreground">{job.experience}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Qualifications</h3>
                <ul className="space-y-2">
                  {job.qualifications.map((qual, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Skills & Tags */}
          {job.tags && job.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills & Requirements</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Expiry Date */}
          {job.expiresAt && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Application deadline: {job.expiresAt}</span>
              </div>
            </>
          )}

          {/* Contact Information */}
          {(job.contactEmail || job.contactPhone) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {job.contactEmail && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Email:</span> {job.contactEmail}
                    </p>
                  )}
                  {job.contactPhone && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Phone:</span> {job.contactPhone}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" size="lg" onClick={onApply}>
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

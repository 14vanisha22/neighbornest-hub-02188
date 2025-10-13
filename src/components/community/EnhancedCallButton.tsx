import { useState } from "react";
import { Phone, Download, MapPin, Clock, Mail, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MedicalCenter {
  id: string;
  name: string;
  address: string;
  type: string;
  contact: string;
  timings?: string;
  specialization?: string;
  latitude?: number;
  longitude?: number;
}

interface EnhancedCallButtonProps {
  center: MedicalCenter;
  isEmergency?: boolean;
}

export const EnhancedCallButton = ({ center, isEmergency = false }: EnhancedCallButtonProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  const isOpenNow = () => {
    if (!center.timings) return null;
    
    const timings = center.timings.toLowerCase();
    if (timings.includes('24') || timings.includes('24x7') || timings.includes('24/7')) {
      return true;
    }

    // Parse time ranges like "9 AM - 9 PM" or "Mon-Sat: 9 AM - 8 PM"
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

    // Check if closed on Sunday
    if (timings.includes('mon-sat') && currentDay === 0) {
      return false;
    }

    // Extract time ranges
    const timeMatch = timings.match(/(\d+)\s*(am|pm)?\s*-\s*(\d+)\s*(am|pm)/i);
    if (timeMatch) {
      let openHour = parseInt(timeMatch[1]);
      let closeHour = parseInt(timeMatch[3]);
      
      if (timeMatch[2]?.toLowerCase() === 'pm' && openHour !== 12) openHour += 12;
      if (timeMatch[4]?.toLowerCase() === 'pm' && closeHour !== 12) closeHour += 12;
      
      return currentHour >= openHour && currentHour < closeHour;
    }

    return null;
  };

  const handleCall = async () => {
    setShowConfirmDialog(false);
    
    // Log call history if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await (supabase as any)
          .from('call_history')
          .insert({
            user_id: user.id,
            medical_center_id: center.id,
            medical_center_name: center.name,
            phone_number: center.contact,
            call_type: isEmergency ? 'emergency' : 'regular'
          });
      } catch (error) {
        console.error('Error logging call:', error);
      }
    }

    // Open phone dialer
    window.location.href = `tel:${center.contact}`;
    
    toast({
      title: "Opening Dialer",
      description: `Calling ${center.name}...`,
    });
  };

  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${center.name}
ORG:${center.type}
TEL;TYPE=WORK,VOICE:${center.contact}
ADR;TYPE=WORK:;;${center.address};;;;
NOTE:${center.specialization || ''}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${center.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Contact Saved",
      description: `${center.name} contact downloaded`,
    });
  };

  const openStatus = isOpenNow();

  return (
    <>
      <div className="flex gap-2">
        {/* Main Call Button */}
        <Button
          onClick={() => isEmergency ? handleCall() : setShowConfirmDialog(true)}
          className={`flex-1 ${isEmergency ? 'bg-red-600 hover:bg-red-700' : ''}`}
          size="sm"
        >
          <Phone className="w-4 h-4 mr-2" />
          {isEmergency ? 'Emergency Call' : 'Call'}
        </Button>

        {/* Details Button */}
        <Button
          onClick={() => setShowDetailsDialog(true)}
          variant="outline"
          size="sm"
        >
          <AlertCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Call Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Call</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Do you want to call {center.name}?</p>
              <div className="text-sm font-medium text-foreground">
                📞 {center.contact}
              </div>
              {openStatus !== null && (
                <Badge variant={openStatus ? "default" : "destructive"}>
                  {openStatus ? "🟢 Open Now" : "🔴 Closed"}
                </Badge>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCall}>
              Call Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contact Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{center.name}</DialogTitle>
            <DialogDescription>
              <Badge variant="secondary" className="mt-2">
                {center.type}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Availability Status */}
            {openStatus !== null && (
              <div className="flex items-center gap-2">
                <Badge variant={openStatus ? "default" : "destructive"}>
                  {openStatus ? "🟢 Open Now" : "🔴 Closed"}
                </Badge>
              </div>
            )}

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Phone</p>
                <p className="text-sm text-muted-foreground">{center.contact}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Address</p>
                <p className="text-sm text-muted-foreground">{center.address}</p>
              </div>
            </div>

            {/* Timings */}
            {center.timings && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Timings</p>
                  <p className="text-sm text-muted-foreground">{center.timings}</p>
                </div>
              </div>
            )}

            {/* Specialization */}
            {center.specialization && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Specialization</p>
                  <p className="text-sm text-muted-foreground">{center.specialization}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleCall}
              className="w-full"
              variant={isEmergency ? "destructive" : "default"}
            >
              <Phone className="w-4 h-4 mr-2" />
              {isEmergency ? 'Emergency Call' : 'Call Now'}
            </Button>
            
            {center.latitude && center.longitude && (
              <Button
                onClick={() => {
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`;
                  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                }}
                variant="outline"
                className="w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            )}
            
            <Button
              onClick={downloadVCard}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Save Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
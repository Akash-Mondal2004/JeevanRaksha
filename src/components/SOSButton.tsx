import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Phone, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ChatWindow from "./ChatWindow";
import { VictimChatList } from '@/components/VictimChatList';
interface SOSButtonProps {
  emergencyType: string;
}

const SOSButton = ({ emergencyType }: SOSButtonProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [description, setDescription] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [alertId, setAlertId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSOSPress = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send emergency alerts",
        variant: "destructive",
      });
      return;
    }

    if (!emergencyType) {
      toast({
        title: "Select Emergency Type",
        description: "Please select the type of emergency before sending SOS",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendSOSAlert(latitude, longitude);
        },
        () => {
          sendSOSAlert(null, null);
        }
      );
    } else {
      sendSOSAlert(null, null);
    }
  };

  const sendSOSAlert = async (lat: number | null, lng: number | null) => {
    if (!user) return;

    try {
      setIsActivated(true);
      
      const location = lat && lng ? { lat, lng } : null;
      
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert({
          user_id: user.id,
          emergency_type: emergencyType,
          description: description || `${emergencyType} emergency alert`,
          location,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAlertId(data.id);
      setShowChat(true);

      toast({
        title: "🚨 SOS Alert Sent!",
        description: `${emergencyType} emergency alert sent to nearby volunteers.`,
      });

      if (data?.id) {
        const { data: volunteerData } = await supabase.rpc('assign_volunteer_to_alert', {
          alert_id: data.id
        });

        console.log("Volunteer assignment result:", volunteerData);
      }

      let count = 5;
      setCountdown(count);
      
      const countdownInterval = setInterval(() => {
        count--;
        setCountdown(count);
        
        if (count === 0) {
          clearInterval(countdownInterval);
          toast({
            title: "✅ Help is On the Way!",
            description: "Volunteer assigned. Estimated arrival: 12 minutes",
          });
        }
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsActivated(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!isActivated && (
        <div className="w-full max-w-md space-y-4">
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            placeholder="Describe your emergency situation..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      )}

      <Button
        size="lg"
        className={`w-32 h-32 rounded-full text-white font-bold text-xl shadow-2xl transition-all duration-300 ${
          isActivated
            ? "bg-green-500 hover:bg-green-600 animate-pulse"
            : "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transform hover:scale-105"
        }`}
        onClick={handleSOSPress}
        disabled={isActivated || isSubmitting}
      >
        {isActivated ? (
          <div className="flex flex-col items-center">
            <Phone className="h-8 w-8 mb-2" />
            <span className="text-sm">SENT</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <span>SOS</span>
          </div>
        )}
      </Button>

      {countdown > 0 && (
        <div className="text-center">
          <p className="text-blue-700 font-semibold">Connecting to volunteers...</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-blue-600">{countdown}s</span>
          </div>
        </div>
      )}

      {isActivated && (
      <VictimChatList 
        userId={user.id} 
        alertId={alertId} 
      />
    )}

      {isActivated && countdown === 0 && (
        <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Volunteer Assigned</span>
          </div>
          <p className="text-green-700 text-sm">
            Help is on the way! Stay safe and keep your phone nearby.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 border-green-300 text-green-700 hover:bg-green-50"
            onClick={() => {
              setIsActivated(false);
              setCountdown(0);
              setShowChat(false);
            }}
          >
            Cancel Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
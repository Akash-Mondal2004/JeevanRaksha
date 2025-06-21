import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Emergency {
  id: string;
  emergency_type: string;
  description: string;
  created_at: string;
  status: string;
  location?: { lat: number; lng: number };
}

const ActiveEmergencies = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveEmergencies();
    subscribeToEmergencies();
  }, []);

  const fetchActiveEmergencies = async () => {
    const { data } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data) setEmergencies(data);
  };

  const subscribeToEmergencies = () => {
    const channel = supabase
      .channel('emergency_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'emergency_alerts' 
        }, 
        () => {
          fetchActiveEmergencies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAcceptMission = async (emergency: Emergency) => {
    if (!user) return;

    try {
      // Update emergency status
      const { error: updateError } = await supabase
        .from('emergency_alerts')
        .update({ 
          status: 'in_progress',
          volunteer_id: user.id 
        })
        .eq('id', emergency.id);

      if (updateError) throw updateError;

      // Create volunteer assignment
      const { error: assignError } = await supabase
        .from('volunteer_assignments')
        .insert({
          alert_id: emergency.id,
          volunteer_id: user.id,
          status: 'in_progress'
        });

      if (assignError) throw assignError;

      toast({
        title: "Mission Accepted",
        description: "The emergency has been added to your missions.",
      });

      // Refresh the list
      fetchActiveEmergencies();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept mission. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {emergencies.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No active emergencies at the moment
          </CardContent>
        </Card>
      ) : (
        emergencies.map((emergency) => (
          <Card key={emergency.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {emergency.emergency_type}
                    <Badge className="ml-2" variant="secondary">
                      {emergency.status}
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {emergency.description}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => handleAcceptMission(emergency)}
                className="w-full"
              >
                Accept Mission
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ActiveEmergencies;
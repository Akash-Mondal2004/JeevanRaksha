import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ChatWindow from "@/components/ChatWindow";

interface Mission {
  id: string;
  emergency_type: string;
  description: string;
  status: string;
  created_at: string;
}

const MyMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMyMissions();
      subscribeTomissions();
    }
  }, [user]);

  const fetchMyMissions = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('volunteer_id', user.id)
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false });

    if (data) setMissions(data);
  };

  const subscribeTomissions = () => {
    const channel = supabase
      .channel('mission_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'emergency_alerts',
          filter: `volunteer_id=eq.${user?.id}`
        }, 
        () => {
          fetchMyMissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCompleteMission = async (missionId: string) => {
    try {
      const { error } = await supabase
        .from('emergency_alerts')
        .update({ status: 'completed' })
        .eq('id', missionId);

      if (error) throw error;

      toast({
        title: "Mission Completed",
        description: "Thank you for your service!",
      });

      fetchMyMissions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete mission",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {missions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No active missions at the moment
          </CardContent>
        </Card>
      ) : (
        missions.map((mission) => (
          <Card key={mission.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {mission.emergency_type}
                    <Badge className="ml-2" variant="secondary">
                      In Progress
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {mission.description}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedChat(mission.id)}
                >
                  Open Chat
                </Button>
                <Button 
                  onClick={() => handleCompleteMission(mission.id)}
                >
                  Complete Mission
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {selectedChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-0">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Chat</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedChat(null)}
                >
                  Close
                </Button>
              </div>
              <ChatWindow 
                alertId={selectedChat}
                userId={user?.id || ''}
                onClose={() => setSelectedChat(null)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyMissions;
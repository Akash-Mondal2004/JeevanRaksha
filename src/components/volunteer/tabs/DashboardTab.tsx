import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Star, Trophy, Flame, MapPin, Clock, User, Phone, MessageCircle, Info, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface DashboardTabProps {
  volunteerData: {
    level: string;
    levelNumber: number;
    rating: number;
    missionsCompleted: number;
    currentStreak: number;
  };
  isAvailable: boolean;
}

interface EmergencyAlert {
  id: string;
  emergency_type: string;
  description: string;
  location: any;
  created_at: string;
  user_profile: {
    full_name: string | null;
    phone: string | null;
  } | null;
}

const DashboardTab = ({ volunteerData, isAvailable }: DashboardTabProps) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveAlerts();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('emergency-alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'emergency_alerts' },
        (payload) => {
          console.log('New alert:', payload);
          fetchActiveAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActiveAlerts = async () => {
    try {
      // First, get the emergency alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('emergency_alerts')
        .select(`
          id,
          emergency_type,
          description,
          location,
          created_at,
          user_id
        `)
        .eq('status', 'active')
        .is('volunteer_id', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (alertsError) {
        console.error('Error fetching alerts:', alertsError);
        return;
      }

      if (!alertsData || alertsData.length === 0) {
        setAlerts([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(alertsData.map(alert => alert.user_id))];

      // Fetch user profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profiles if there's an error
      }

      // Combine alerts with profile data
      const transformedData = alertsData.map(alert => ({
        ...alert,
        user_profile: profilesData?.find(profile => profile.id === alert.user_id) || null
      }));

      setAlerts(transformedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptMission = async (alertId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('emergency_alerts')
        .update({ 
          volunteer_id: user.id,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) {
        console.error('Error accepting mission:', error);
        toast({
          title: "Error",
          description: "Failed to accept mission. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Mission Accepted!",
        description: "You've successfully accepted this emergency mission.",
      });

      // Refresh alerts
      fetchActiveAlerts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getPriorityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'medical': return 'bg-red-500';
      case 'food-water': return 'bg-blue-500';
      case 'shelter': return 'bg-green-500';
      case 'evacuation': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-xs">Total</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-900">{volunteerData.missionsCompleted}</p>
              <p className="text-sm text-gray-600 font-medium">Missions</p>
              <p className="text-xs text-green-600 font-medium">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <Badge variant="outline" className="text-xs">Avg</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-900">{volunteerData.rating}/5</p>
              <p className="text-sm text-gray-600 font-medium">Rating</p>
              <p className="text-xs text-green-600 font-medium">Success</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="outline" className="text-xs">Level</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-900">{volunteerData.level}</p>
              <p className="text-sm text-gray-600 font-medium">Level {volunteerData.levelNumber}</p>
              <p className="text-xs text-blue-600 font-medium">Rank</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Flame className="h-5 w-5 text-red-600" />
              </div>
              <Badge variant="outline" className="text-xs">Days</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-900">{volunteerData.currentStreak}</p>
              <p className="text-sm text-gray-600 font-medium">Streak</p>
              <p className="text-xs text-green-600 font-medium">Active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Status Panel */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Availability Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Available for Missions</h3>
              <p className="text-sm text-gray-600">Toggle your availability status</p>
            </div>
            <Switch 
              checked={isAvailable} 
              className="scale-125"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Your location: Kolkata, West Bengal</p>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Location services enabled</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Response Radius: 5 km
              </label>
              <Slider defaultValue={[5]} max={50} step={1} className="w-full" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Preferred Mission Types:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="medical" defaultChecked />
                  <label htmlFor="medical" className="text-sm">Medical</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="food" defaultChecked />
                  <label htmlFor="food" className="text-sm">Food</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="shelter" />
                  <label htmlFor="shelter" className="text-sm">Shelter</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="evacuation" />
                  <label htmlFor="evacuation" className="text-sm">Evacuation</label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Nearby Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900">Active Emergency Requests</h2>
          <Badge className="bg-red-100 text-red-700 border-red-200">
            {alerts.length} Active Alerts
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading emergency requests...</p>
          </div>
        ) : alerts.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Target className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Requests</h3>
              <p className="text-gray-500">All emergency requests have been handled. Great work!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${getPriorityColor(alert.emergency_type)} rounded-full animate-pulse`}></div>
                        <div>
                          <h3 className="font-bold text-lg text-blue-900">
                            URGENT - {alert.emergency_type.toUpperCase()} EMERGENCY
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {getTimeAgo(alert.created_at)}
                            </span>
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {alert.user_profile?.full_name || 'Anonymous User'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">"{alert.description}"</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => acceptMission(alert.id)}
                      >
                        ✅ Accept Mission
                      </Button>
                      {alert.user_profile?.phone && (
                        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      )}
                      <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                      <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Info className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;

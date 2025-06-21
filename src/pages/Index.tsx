import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Phone, Users, Shield, Heart, AlertTriangle, Cloud, Bell } from "lucide-react";
import SOSButton from "@/components/SOSButton";
import EmergencyTypeSelector from "@/components/EmergencyTypeSelector";
import DisasterAlerts from "@/components/DisasterAlerts";
import MapComponent from "@/components/MapComponent";
import VolunteerRegistration from "@/components/VolunteerRegistration";
import StatsDisplay from "@/components/StatsDisplay";
import VolunteerDashboard from "@/components/volunteer/VolunteerDashboard";
import { useAuth } from "@/hooks/useAuth";
import ChatBot from '@/components/chat/ChatBot';
const Index = () => {
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string>("");
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Fetch user profile to determine user type
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAuthNavigation = () => {
    navigate("/auth");
  };

  const handleLogout = async () => {
    await signOut();
    setUserProfile(null);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-blue-600">Loading Jevan Raksha...</p>
        </div>
      </div>
    );
  }

  // If user is logged in as volunteer, show volunteer dashboard
  if (user && userProfile && userProfile.user_type === 'volunteer') {
    return <VolunteerDashboard user={{ ...user, ...userProfile }} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Jevan Raksha</h1>
                <p className="text-xs text-blue-600">Disaster Relief Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                System Online
              </Badge>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-700">
                    Welcome, {userProfile?.full_name || user.email}!
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAuthNavigation}
                    className="hover:bg-blue-50"
                  >
                    Login / Register
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVolunteerForm(true)}
                    className="hover:bg-blue-50"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Join as Volunteer
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Emergency SOS */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4">
              Help is Just a
              <span className="text-red-600 block">Tap Away</span>
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto mb-8">
              Connect instantly with volunteers, NGOs, and emergency services during disasters. 
              Your safety is our priority.
            </p>
            
            {/* Emergency Type Selection */}
            <div className="mb-8">
              <EmergencyTypeSelector 
                selectedType={selectedEmergencyType}
                onTypeSelect={setSelectedEmergencyType}
              />
            </div>

            {/* SOS Button */}
            <SOSButton emergencyType={selectedEmergencyType} />

            {!user && (
              <div className="mt-8">
                <Button
                  onClick={handleAuthNavigation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  Get Started - Login or Register
                </Button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <StatsDisplay />
        </div>
      </section>

      {/* Disaster Alerts Dashboard */}
      <section className="py-8 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Live Disaster Alerts</h3>
              <p className="text-blue-600">Real-time weather and emergency updates</p>
            </div>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              <Bell className="h-4 w-4 mr-1" />
              3 Active Alerts
            </Badge>
          </div>
          <DisasterAlerts />
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Real-Time Crisis Map</h3>
            <p className="text-blue-600 max-w-2xl mx-auto">
              Track active emergencies, volunteer locations, and relief efforts in real-time
            </p>
          </div>
          <MapComponent 
            userId={user?.id ?? ""}
            userType={userProfile?.user_type ?? ""}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">How Jevan Raksha Helps</h3>
            <p className="text-blue-600 max-w-2xl mx-auto">
              Advanced technology meets humanitarian aid for faster, more effective disaster response
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-blue-900">Instant SOS</CardTitle>
                <CardDescription>
                  One-tap emergency alerts with GPS location sharing to nearby volunteers and agencies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">AI Route Optimization</CardTitle>
                <CardDescription>
                  Smart routing algorithms help volunteers reach multiple emergency locations efficiently
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-blue-900">Blockchain Transparency</CardTitle>
                <CardDescription>
                  Track aid distribution with complete transparency using blockchain technology
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-blue-900">Weather Prediction</CardTitle>
                <CardDescription>
                  Advanced AI models predict disasters and send early warnings to vulnerable areas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-blue-900">Volunteer Network</CardTitle>
                <CardDescription>
                  Connect with verified volunteers and coordinate relief efforts through gamified engagement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle className="text-blue-900">Multilingual Support</CardTitle>
                <CardDescription>
                  Voice input and output in Bengali, Hindi, English, and regional languages
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Be Part of the Solution</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of volunteers making a difference during disasters. Every second counts, every action matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
              onClick={() => setShowVolunteerForm(true)}
            >
              <Users className="h-5 w-5 mr-2" />
              Register as Volunteer
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3"
            >
              <Shield className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jevan Raksha</span>
            </div>
            <p className="text-blue-300 mb-4">
              Connecting communities in crisis with hope and help
            </p>
            <div className="flex justify-center space-x-4 text-sm text-blue-400">
              <span>Emergency: 112</span>
              <span>•</span>
              <span>Fire: 101</span>
              <span>•</span>
              <span>Police: 100</span>
              <span>•</span>
              <span>Medical: 108</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Volunteer Registration Modal */}
      {showVolunteerForm && (
        <VolunteerRegistration onClose={() => setShowVolunteerForm(false)} />
      )}
      <ChatBot/>
    </div>
  );
};

export default Index;

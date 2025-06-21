
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings, LogOut, MapPin, Users, Trophy, BookOpen, Home, Map, ClipboardList, Users2, Camera } from "lucide-react";
import DashboardTab from "./tabs/DashboardTab";
import MapViewTab from "./tabs/MapViewTab";
import MyMissionsTab from "./tabs/MyMissionsTab";
import AchievementsTab from "./tabs/AchievementsTab";
import CommunityTab from "./tabs/CommunityTab";
import TrainingTab from "./tabs/TrainingTab";

interface User {
  name: string;
  email: string;
  type: 'volunteer' | 'user';
}

interface VolunteerDashboardProps {
  user: User;
  onLogout: () => void;
}

const VolunteerDashboard = ({ user, onLogout }: VolunteerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications] = useState(5);

  const volunteerData = {
    level: "Hero",
    levelNumber: 4,
    rating: 4.8,
    missionsCompleted: 47,
    currentStreak: 12,
    profilePhoto: "/placeholder.svg"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={volunteerData.profilePhoto} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-green-200"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isAvailable ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-blue-900">{user.name}</h1>
                  <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                    {volunteerData.level} (L{volunteerData.levelNumber})
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-blue-600">
                  <span className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      isAvailable ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    {isAvailable ? 'Available' : 'Offline'}
                  </span>
                  <span>⭐ {volunteerData.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`${isAvailable ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200'}`}
              >
                {isAvailable ? 'Go Offline' : 'Go Online'}
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map View</span>
            </TabsTrigger>
            <TabsTrigger value="missions" className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">My Missions</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <Users2 className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab volunteerData={volunteerData} isAvailable={isAvailable} />
          </TabsContent>

          <TabsContent value="map">
            <MapViewTab />
          </TabsContent>

          <TabsContent value="missions">
            <MyMissionsTab />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab volunteerData={volunteerData} />
          </TabsContent>

          <TabsContent value="community">
            <CommunityTab />
          </TabsContent>

          <TabsContent value="training">
            <TrainingTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

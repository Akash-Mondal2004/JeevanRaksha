
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Target, Clock, Users, Heart, Home, Star, Zap, Award } from "lucide-react";

interface AchievementsTabProps {
  volunteerData: {
    level: string;
    levelNumber: number;
    rating: number;
    missionsCompleted: number;
    currentStreak: number;
  };
}

const AchievementsTab = ({ volunteerData }: AchievementsTabProps) => {
  const badges = [
    { id: 1, name: "First Responder", icon: Medal, earned: true, description: "Complete your first mission", color: "text-blue-600 bg-blue-100" },
    { id: 2, name: "Week Warrior", icon: Zap, earned: true, description: "Active for 7 consecutive days", color: "text-orange-600 bg-orange-100" },
    { id: 3, name: "People's Hero", icon: Star, earned: true, description: "Receive 5-star rating", color: "text-yellow-600 bg-yellow-100" },
    { id: 4, name: "Quick Response", icon: Clock, earned: true, description: "Average response time under 10 minutes", color: "text-green-600 bg-green-100" },
    { id: 5, name: "Strength", icon: Target, earned: true, description: "Complete 25 missions", color: "text-purple-600 bg-purple-100" },
    { id: 6, name: "Sharpshooter", icon: Target, earned: true, description: "95% success rate", color: "text-red-600 bg-red-100" },
    { id: 7, name: "Shelter Builder", icon: Home, earned: false, description: "Help 10 families find shelter", color: "text-brown-600 bg-brown-100" },
    { id: 8, name: "Food Angel", icon: Heart, earned: false, description: "Distribute food to 50 people", color: "text-pink-600 bg-pink-100" },
    { id: 9, name: "5-Star Helper", icon: Star, earned: false, description: "Maintain 4.8+ rating for 30 days", color: "text-indigo-600 bg-indigo-100" },
    { id: 10, name: "Mission Master", icon: Trophy, earned: false, description: "Complete 50 missions", color: "text-amber-600 bg-amber-100" }
  ];

  const leaderboard = [
    { rank: 1, name: "Arjun Patel", missions: 89, rating: 4.9, badge: "🏆" },
    { rank: 2, name: "Priya Singh", missions: 76, rating: 4.9, badge: "🥈" },
    { rank: 3, name: "You", missions: 47, rating: 4.8, badge: "🥉", isUser: true },
    { rank: 4, name: "Raj Kumar", missions: 45, rating: 4.7, badge: "" },
    { rank: 5, name: "Sneha Roy", missions: 42, rating: 4.8, badge: "" },
    { rank: 6, name: "Amit Das", missions: 38, rating: 4.6, badge: "" },
    { rank: 7, name: "Ritu Sharma", missions: 35, rating: 4.9, badge: "" },
    { rank: 8, name: "Vikash Singh", missions: 33, rating: 4.5, badge: "" },
    { rank: 9, name: "Anjali Gupta", missions: 31, rating: 4.7, badge: "" },
    { rank: 10, name: "Rohit Jain", missions: 29, rating: 4.6, badge: "" }
  ];

  const nextBadge = badges.find(badge => !badge.earned);
  const earnedBadges = badges.filter(badge => badge.earned);

  return (
    <div className="space-y-6">
      {/* Volunteer Profile Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {volunteerData.levelNumber}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Volunteer Profile</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Join Date</p>
                  <p className="font-semibold">Mar 15, 2024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Days</p>
                  <p className="font-semibold">85 days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    {volunteerData.level} (L{volunteerData.levelNumber})
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{volunteerData.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${
                          i < Math.floor(volunteerData.rating) ? 'text-yellow-500' : 'text-gray-300'
                        }`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress to next level</span>
                  <span className="text-sm font-semibold">47/50 missions</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges & Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-600" />
            <span>Your Badges</span>
            <Badge variant="outline">{earnedBadges.length}/{badges.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    badge.earned 
                      ? 'border-yellow-200 bg-yellow-50 hover:scale-105' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    badge.earned ? badge.color : 'bg-gray-200 text-gray-400'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className={`text-sm font-semibold text-center mb-1 ${
                    badge.earned ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs text-center ${
                    badge.earned ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {nextBadge && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900">Next Badge: {nextBadge.name}</h4>
                    <p className="text-sm text-purple-700">{nextBadge.description}</p>
                    <p className="text-xs text-purple-600 mt-1">3 more missions needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span>Monthly Leaderboard</span>
            <Badge className="bg-blue-100 text-blue-700">Regional Ranking</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((volunteer) => (
              <div
                key={volunteer.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  volunteer.isUser 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                } transition-all duration-200`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    volunteer.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {volunteer.badge || volunteer.rank}
                  </div>
                  <div>
                    <p className={`font-semibold ${volunteer.isUser ? 'text-orange-800' : 'text-gray-900'}`}>
                      {volunteer.name}
                      {volunteer.isUser && <span className="ml-2 text-sm">(You)</span>}
                    </p>
                    <p className="text-sm text-gray-600">
                      {volunteer.missions} missions • ⭐ {volunteer.rating}
                    </p>
                  </div>
                </div>
                {volunteer.rank <= 3 && (
                  <Badge className={`${
                    volunteer.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    volunteer.rank === 2 ? 'bg-gray-100 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    Top {volunteer.rank}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Statistics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-green-600" />
            <span>Your Impact Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">{volunteerData.missionsCompleted}</div>
              <div className="text-sm text-gray-600">Total Missions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">134</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">94%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">12 mins</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">285 km</div>
              <div className="text-sm text-gray-600">Total Distance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">89</div>
              <div className="text-sm text-gray-600">Hours Volunteered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">45</div>
              <div className="text-sm text-gray-600">Supplies Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">23</div>
              <div className="text-sm text-gray-600">Families Helped</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/60 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">📈 This Month Performance</h4>
            <p className="text-sm text-green-700">
              8 missions completed • 4.9★ average rating • #3 rank in your region
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsTab;

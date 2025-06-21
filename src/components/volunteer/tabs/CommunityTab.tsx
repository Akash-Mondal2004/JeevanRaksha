
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Users, MessageCircle, Megaphone, Heart, MapPin, Clock, Star, Send } from "lucide-react";

const CommunityTab = () => {
  const nearbyVolunteers = [
    { id: 1, name: "Arjun Patel", distance: "1.2 km", status: "online", rating: 4.9, missions: 89, specialization: "Medical", lastActive: "Active now" },
    { id: 2, name: "Priya Singh", distance: "2.8 km", status: "online", rating: 4.9, missions: 76, specialization: "Food Distribution", lastActive: "2 mins ago" },
    { id: 3, name: "Raj Kumar", distance: "3.5 km", status: "offline", rating: 4.7, missions: 45, specialization: "Shelter", lastActive: "1 hour ago" },
    { id: 4, name: "Sneha Roy", distance: "4.1 km", status: "busy", rating: 4.8, missions: 42, specialization: "Medical", lastActive: "On mission" },
  ];

  const chatGroups = [
    { id: 1, name: "Kolkata Medical Response", members: 24, lastMessage: "New emergency at Salt Lake", time: "2 mins ago", unread: 3 },
    { id: 2, name: "Food Distribution Network", members: 18, lastMessage: "Distribution at 3 PM today", time: "15 mins ago", unread: 0 },
    { id: 3, name: "Shelter Coordination", members: 12, lastMessage: "Need volunteers for setup", time: "1 hour ago", unread: 1 },
    { id: 4, name: "Emergency Response HQ", members: 45, lastMessage: "Weather alert issued", time: "3 hours ago", unread: 0 },
  ];

  const announcements = [
    { id: 1, title: "New Training Module Available", content: "Advanced First Aid certification now available. Complete by month end.", time: "1 hour ago", important: true },
    { id: 2, title: "Weather Alert: Heavy Rainfall Expected", content: "Prepare for potential flood response missions this weekend.", time: "3 hours ago", important: true },
    { id: 3, title: "Monthly Volunteer Meet", content: "Join us this Saturday at Community Center for monthly gathering.", time: "1 day ago", important: false },
  ];

  const experienceSharing = [
    { id: 1, author: "Arjun Patel", time: "2 hours ago", content: "Just completed a challenging medical emergency. Remember to always carry basic first aid supplies. Quick thinking saved a life today! 🙏", likes: 12, comments: 4 },
    { id: 2, author: "Priya Singh", time: "1 day ago", content: "Food distribution was successful today. We managed to serve 200+ families. Teamwork makes all the difference!", likes: 18, comments: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* Nearby Active Volunteers */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Nearby Active Volunteers</span>
            <Badge className="bg-green-100 text-green-700">
              {nearbyVolunteers.filter(v => v.status === 'online').length} Online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyVolunteers.map((volunteer) => (
              <div key={volunteer.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <img src="/placeholder.svg" alt={volunteer.name} className="w-12 h-12 rounded-full" />
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    volunteer.status === 'online' ? 'bg-green-500' :
                    volunteer.status === 'busy' ? 'bg-orange-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{volunteer.name}</h4>
                    <span className="text-sm text-gray-500">{volunteer.distance}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {volunteer.rating}
                    </span>
                    <span>{volunteer.missions} missions</span>
                    <Badge variant="outline" className="text-xs">
                      {volunteer.specialization}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{volunteer.lastActive}</p>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Groups */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <span>Team Coordination Groups</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chatGroups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{group.name}</h4>
                    <p className="text-sm text-gray-600">{group.lastMessage}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{group.members} members</span>
                      <span>{group.time}</span>
                    </div>
                  </div>
                </div>
                {group.unread > 0 && (
                  <Badge className="bg-red-500 text-white rounded-full w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {group.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Megaphone className="h-6 w-6 text-orange-600" />
            <span>Announcements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`p-4 rounded-lg border-l-4 ${
                announcement.important ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{announcement.title}</h4>
                    <p className="text-sm text-gray-700">{announcement.content}</p>
                  </div>
                  {announcement.important && (
                    <Badge className="bg-red-100 text-red-700 ml-2">
                      Important
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">{announcement.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience Sharing Forum */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-600" />
            <span>Experience Sharing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* New Post Input */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <img src="/placeholder.svg" alt="Your avatar" className="w-10 h-10 rounded-full" />
              </Avatar>
              <div className="flex-1">
                <Input placeholder="Share your experience or tips with fellow volunteers..." className="mb-3" />
                <div className="flex justify-end">
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {experienceSharing.map((post) => (
              <div key={post.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <img src="/placeholder.svg" alt={post.author} className="w-10 h-10 rounded-full" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-gray-900">{post.author}</h5>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityTab;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, Phone, AlertTriangle, Heart, Home, Users, Search, Filter } from "lucide-react";

const MapViewTab = () => {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  const mockRequests = [
    { id: 1, lat: 30, lng: 20, type: "medical", priority: "high", title: "Medical Emergency", location: "Sector 5, Salt Lake", distance: "2.3km", requester: "Rajesh Kumar", phone: "+91 98765 43210", description: "Elderly person with chest pain", timeAgo: "5 mins ago" },
    { id: 2, lat: 50, lng: 40, type: "food", priority: "medium", title: "Food Distribution", location: "Howrah Station", distance: "4.7km", requester: "Priya Sharma", phone: "+91 87654 32109", description: "Family needs food supplies", timeAgo: "12 mins ago" },
    { id: 3, lat: 70, lng: 60, type: "shelter", priority: "low", title: "Shelter Assistance", location: "Jadavpur Area", distance: "6.1km", requester: "Amit Das", phone: "+91 76543 21098", description: "Temporary shelter needed", timeAgo: "25 mins ago" },
  ];

  const volunteers = [
    { id: 1, lat: 40, lng: 30, name: "Volunteer Team A", count: 5 },
    { id: 2, lat: 60, lng: 50, name: "Volunteer Team B", count: 3 },
  ];

  const getMarkerColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-500', ring: 'bg-red-500' };
      case 'medium': return { bg: 'bg-orange-500', ring: 'bg-orange-500' };
      case 'low': return { bg: 'bg-yellow-500', ring: 'bg-yellow-500' };
      default: return { bg: 'bg-gray-500', ring: 'bg-gray-500' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return <Heart className="h-3 w-3 text-white" />;
      case 'food': return <Home className="h-3 w-3 text-white" />;
      case 'shelter': return <Home className="h-3 w-3 text-white" />;
      default: return <AlertTriangle className="h-3 w-3 text-white" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Map Controls & Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search location or landmark..." className="col-span-1" />
            
            <Select defaultValue="all-types">
              <SelectTrigger>
                <SelectValue placeholder="Request Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="shelter">Shelter</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-priority">
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-priority">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-distance">
              <SelectTrigger>
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-distance">All Distance</SelectItem>
                <SelectItem value="0-5">0-5km</SelectItem>
                <SelectItem value="5-10">5-10km</SelectItem>
                <SelectItem value="10-25">10-25km</SelectItem>
                <SelectItem value="25+">25km+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
            {/* Map background with grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gray-300 bg-opacity-50" 
                   style={{
                     backgroundImage: `
                       linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                     `,
                     backgroundSize: '20px 20px'
                   }}>
              </div>
            </div>

            {/* Your location marker */}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}>
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
                <div className="w-8 h-8 bg-blue-600 opacity-30 rounded-full absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 animate-ping"></div>
              </div>
            </div>

            {/* Emergency request markers */}
            {mockRequests.map((request) => {
              const colors = getMarkerColor(request.priority);
              return (
                <div
                  key={`request-${request.id}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${request.lng}%`,
                    top: `${request.lat}%`,
                  }}
                  onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                >
                  <div className={`w-6 h-6 ${colors.bg} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                    {getTypeIcon(request.type)}
                  </div>
                  <div className={`w-12 h-12 ${colors.ring} opacity-30 rounded-full absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 animate-ping`}></div>
                </div>
              );
            })}

            {/* Volunteer markers */}
            {volunteers.map((volunteer) => (
              <div
                key={`volunteer-${volunteer.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${volunteer.lng}%`,
                  top: `${volunteer.lat}%`,
                }}
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Users className="h-3 w-3 text-white" />
                </div>
              </div>
            ))}

            {/* Map Legend */}
            <Card className="absolute bottom-4 left-4 p-3 bg-white/90 backdrop-blur-sm">
              <div className="flex flex-col space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Priority Emergency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Medium Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Low Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <Users className="h-2 w-2 text-white" />
                  </div>
                  <span>Volunteer Teams</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Your Location</span>
                </div>
              </div>
            </Card>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white">
                <span className="text-lg font-bold text-gray-600">+</span>
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white">
                <span className="text-lg font-bold text-gray-600">-</span>
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white">
                <Filter className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Center overlay when no selection */}
            {!selectedRequest && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-blue-600/50">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">Interactive Crisis Map</p>
                  <p className="text-xs">Click on markers for details</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Request Details */}
      {selectedRequest && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-red-600">🚨 SELECTED REQUEST DETAILS</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const request = mockRequests.find(r => r.id === selectedRequest);
              if (!request) return null;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold capitalize">{request.type} Emergency</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priority</p>
                      <Badge className={`capitalize ${
                        request.priority === 'high' ? 'bg-red-100 text-red-700' :
                        request.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{request.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-semibold">{request.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requester</p>
                      <p className="font-semibold">{request.requester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-semibold">{request.timeAgo}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="bg-gray-50 p-3 rounded-lg text-sm">"{request.description}"</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      ✅ Accept Mission
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-600">
                      <Phone className="h-4 w-4 mr-2" />
                      Call {request.phone}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapViewTab;

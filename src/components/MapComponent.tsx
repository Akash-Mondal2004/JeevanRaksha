import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, AlertTriangle, Heart, Activity, Phone, MessageCircle } from "lucide-react";

// Mock data interfaces
interface EmergencyAlert {
  id: string;
  user_id: string;
  emergency_type: string;
  description: string;
  location: { lat: number; lng: number };
  status: string;
  created_at: string;
  updated_at: string;
  volunteer_id: string | null;
  profile?: {
    full_name: string;
    phone: string;
  };
}

interface UserLocation {
  id: string;
  user_id: string;
  user_type: 'volunteer' | 'victim';
  location: { lat: number; lng: number };
  last_updated: string;
  is_active: boolean;
  emergency_id?: string | null;
  profile?: {
    full_name: string;
    phone: string;
  };
}

interface MapComponentProps {
  userId: string;
  userType: 'volunteer' | 'victim';
  emergencyId?: string;
}

export default function MapComponent({ userId = 'user-123', userType = 'volunteer', emergencyId }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 22.5726, lng: 88.3639 });
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || mapLoaded) return;

      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        
        // Add Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          document.head.appendChild(link);
        }

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 500));

        // Initialize the map
        const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        leafletMapRef.current = map;
        setMapLoaded(true);

        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              setUserLocation(newLocation);
              map.setView([newLocation.lat, newLocation.lng], 13);
            },
            (error) => {
              console.log('Location access denied, using default location (Kolkata)');
            }
          );
        }

      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    initializeMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  // Generate mock data
  useEffect(() => {
    const generateMockAlerts = (): EmergencyAlert[] => {
      const alertTypes = ['medical', 'fire', 'accident', 'natural-disaster', 'crime'];
      return Array.from({ length: 5 }, (_, i) => {
        // Random location within 10km of current location
        const lat = userLocation.lat + (Math.random() - 0.5) * 0.1;
        const lng = userLocation.lng + (Math.random() - 0.5) * 0.1;
        
        return {
          id: `alert-${i}`,
          user_id: `user-${Math.floor(Math.random() * 100)}`,
          emergency_type: alertTypes[i % alertTypes.length],
          description: `Emergency situation #${i+1} - ${alertTypes[i % alertTypes.length]} emergency requiring immediate assistance`,
          location: { lat, lng },
          status: 'active',
          created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          volunteer_id: Math.random() > 0.8 ? `volunteer-${i}` : null,
          profile: {
            full_name: `Person ${i+1}`,
            phone: `+91 ${Math.floor(7000000000 + Math.random() * 1000000000)}`
          }
        };
      });
    };

    const generateMockUserLocations = (): UserLocation[] => {
      return Array.from({ length: 15 }, (_, i) => {
        // Random location within 15km of current location
        const lat = userLocation.lat + (Math.random() - 0.5) * 0.15;
        const lng = userLocation.lng + (Math.random() - 0.5) * 0.15;
        const userType = Math.random() > 0.3 ? 'volunteer' : 'victim';
        
        return {
          id: `loc-${i}`,
          user_id: `user-${Math.floor(Math.random() * 100)}`,
          user_type: userType,
          location: { lat, lng },
          last_updated: new Date().toISOString(),
          is_active: true,
          emergency_id: Math.random() > 0.7 ? `alert-${Math.floor(Math.random() * 5)}` : null,
          profile: {
            full_name: `${userType === 'volunteer' ? 'Volunteer' : 'Person'} ${i+1}`,
            phone: `+91 ${Math.floor(7000000000 + Math.random() * 1000000000)}`
          }
        };
      });
    };

    const mockAlerts = generateMockAlerts();
    const mockUserLocs = generateMockUserLocations();

    // Add current user to locations
    mockUserLocs.push({
      id: 'current-user',
      user_id: userId,
      user_type: userType,
      location: userLocation,
      last_updated: new Date().toISOString(),
      is_active: true,
      profile: {
        full_name: 'You',
        phone: ''
      }
    });

    setEmergencyAlerts(mockAlerts);
    setUserLocations(mockUserLocs);
  }, [userId, userType, userLocation]);

  // Update markers when data changes
  useEffect(() => {
    if (!leafletMapRef.current || !mapLoaded) return;

    const updateMarkers = async () => {
      const L = await import('leaflet');
      
      // Clear existing markers
      markersRef.current.forEach(marker => {
        leafletMapRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add emergency alert markers
      emergencyAlerts.forEach((alert) => {
        if (!alert.location) return;

        const getSeverityColor = (emergencyType: string, createdAt: string) => {
          const hoursSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
          
          if (emergencyType === 'medical' || hoursSinceCreated > 2) return '#ef4444';
          if (emergencyType === 'fire' || hoursSinceCreated > 1) return '#f97316';
          return '#eab308';
        };

        const color = getSeverityColor(alert.emergency_type, alert.created_at);
        
        const marker = L.circleMarker([alert.location.lat, alert.location.lng], {
          radius: alert.volunteer_id ? 8 : 12,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(leafletMapRef.current);

        // Add popup
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold text-sm capitalize mb-1">${alert.emergency_type}</h3>
            <p class="text-xs text-gray-600 mb-2">${alert.description}</p>
            ${alert.profile ? `
              <div class="text-xs text-gray-500 mb-2">
                <p><strong>Contact:</strong> ${alert.profile.full_name}</p>
                ${alert.profile.phone ? `<p><strong>Phone:</strong> ${alert.profile.phone}</p>` : ''}
              </div>
            ` : ''}
            <div class="text-xs ${alert.volunteer_id ? 'text-green-600' : 'text-red-600'}">
              ${alert.volunteer_id ? '✓ Volunteer assigned' : '⚠ Needs assistance'}
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('click', () => {
          setSelectedAlert(alert);
        });

        markersRef.current.push(marker);
      });

      // Add user location markers
      userLocations.forEach((userLoc) => {
        if (!userLoc.location) return;

        const isCurrentUser = userLoc.user_id === userId;
        const isVolunteer = userLoc.user_type === 'volunteer';
        
        let color = isCurrentUser ? '#8b5cf6' : (isVolunteer ? '#22c55e' : '#3b82f6');
        let radius = isCurrentUser ? 10 : 6;

        const marker = L.circleMarker([userLoc.location.lat, userLoc.location.lng], {
          radius: radius,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: isCurrentUser ? 1 : 0.7
        }).addTo(leafletMapRef.current);

        // Add popup for non-current users
        if (!isCurrentUser && userLoc.profile) {
          const popupContent = `
            <div class="p-2">
              <h3 class="font-semibold text-sm">${userLoc.profile.full_name}</h3>
              <p class="text-xs text-gray-600">${isVolunteer ? 'Volunteer' : 'Person'}</p>
              ${userLoc.profile.phone ? `<p class="text-xs text-gray-500">Phone: ${userLoc.profile.phone}</p>` : ''}
            </div>
          `;
          marker.bindPopup(popupContent);
        }

        markersRef.current.push(marker);
      });
    };

    updateMarkers();
  }, [emergencyAlerts, userLocations, mapLoaded, userId]);

  const handleAssignVolunteer = async (alertId: string) => {
    if (userType !== 'volunteer') return;
    
    setEmergencyAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              volunteer_id: userId, 
              status: 'in_progress',
              updated_at: new Date().toISOString()
            }
          : alert
      )
    );
    
    alert(`You've been assigned to emergency ${alertId}`);
  };

  const zoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const centerOnUser = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([userLocation.lat, userLocation.lng], 15);
    }
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map legend */}
      <Card className="absolute bottom-4 left-4 p-3 bg-white/90 backdrop-blur-sm max-w-xs">
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
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Volunteers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>People</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>You</span>
          </div>
        </div>
      </Card>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 bg-white shadow-md"
          onClick={zoomIn}
        >
          <span className="text-lg font-bold">+</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 bg-white shadow-md"
          onClick={zoomOut}
        >
          <span className="text-lg font-bold">-</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 bg-white shadow-md"
          onClick={centerOnUser}
          title="Center on your location"
        >
          <Activity className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected alert details */}
      {selectedAlert && (
        <Card className="absolute top-4 left-4 p-4 bg-white/95 backdrop-blur-sm max-w-sm shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm capitalize">{selectedAlert.emergency_type}</h3>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setSelectedAlert(null)}
            >
              ×
            </Button>
          </div>
          <p className="text-xs text-gray-600 mb-2">{selectedAlert.description}</p>
          {selectedAlert.profile && (
            <div className="text-xs text-gray-500 mb-2">
              <p>Contact: {selectedAlert.profile.full_name}</p>
              {selectedAlert.profile.phone && (
                <p>Phone: {selectedAlert.profile.phone}</p>
              )}
            </div>
          )}
          <div className="flex space-x-2">
            {userType === 'volunteer' && !selectedAlert.volunteer_id && (
              <Button
                size="sm"
                className="text-xs"
                onClick={() => handleAssignVolunteer(selectedAlert.id)}
              >
                <Heart className="h-3 w-3 mr-1" />
                Respond
              </Button>
            )}
            {selectedAlert.volunteer_id && (
              <div className="text-xs text-green-600 flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                Volunteer assigned
              </div>
            )}
            <Button size="sm" variant="outline" className="text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              Chat
            </Button>
          </div>
        </Card>
      )}

      {/* Status indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <Card className="px-3 py-1 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Crisis Response Map</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
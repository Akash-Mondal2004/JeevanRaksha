import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Cloud, MapPin, Clock, RefreshCw, Loader2 } from "lucide-react";

const DisasterAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Calculate distance between coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Request user location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationError('Unable to get your location');
          // Default to Kolkata coordinates as fallback
          setUserLocation({ lat: 22.5726, lng: 88.3639 });
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      // Default to Kolkata coordinates as fallback
      setUserLocation({ lat: 22.5726, lng: 88.3639 });
    }
  };
  const getDisasterIcon = (disasterType) => {
    const typeLower = disasterType?.toLowerCase() || '';
    if (typeLower.includes('earthquake')) return '🌍';
    if (typeLower.includes('flood')) return '🌊';
    if (typeLower.includes('fire') || typeLower.includes('heat')) return '🔥';
    if (typeLower.includes('storm') || typeLower.includes('cyclone') || 
        typeLower.includes('wind') || typeLower.includes('thunder')) return '🌀';
    if (typeLower.includes('volcano')) return '🌋';
    if (typeLower.includes('drought')) return '🏜️';
    if (typeLower.includes('landslide')) return '⛰️';
    if (typeLower.includes('tornado')) return '🌪️';
    if (typeLower.includes('snow') || typeLower.includes('avalanche') || 
        typeLower.includes('cold')) return '❄️';
    if (typeLower.includes('rain')) return '🌧️';
    return '⚠️';
  };

  // Get severity level
  const getSeverity = (severityLevel, severityColor) => {
    if (severityColor === 'red') return 'high';
    if (severityColor === 'orange') return 'medium';
    if (severityColor === 'yellow') return 'low';
    if (severityLevel?.toLowerCase().includes('likely')) return 'medium';
    return 'low';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    try {
      const date = new Date(dateString.replace('IST', ''));
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Fetch disaster data from Sachet NDMA API
  const fetchDisasterData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/alerts/cap_public_website/FetchAllAlertDetails');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the API data to match our component structure
      const transformedAlerts = data.map(alert => {
        // Parse centroid coordinates
        let lat = null;
        let lng = null;
        let distance = null;
        
        if (alert.centroid) {
          const [lngStr, latStr] = alert.centroid.split(',');
          lat = parseFloat(latStr);
          lng = parseFloat(lngStr);
          
          // Calculate distance if user location is available
          if (userLocation && !isNaN(lat) && !isNaN(lng)) {
            distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
          }
        }
        
        return {
          id: alert.identifier || Math.random().toString(36).substr(2, 9),
          type: alert.disaster_type || 'Unknown Disaster',
          severity: getSeverity(alert.severity_level, alert.severity_color),
          location: alert.area_description || 'Location not specified',
          description: alert.warning_message || alert.disaster_type || 'No description available',
          timestamp: formatDate(alert.effective_start_time),
          affected: alert.affected_population || 'Not specified',
          icon: getDisasterIcon(alert.disaster_type),
          severityColor: alert.severity_color,
          severityLevel: alert.severity_level,
          source: alert.alert_source || 'NDMA',
          coordinates: { lat, lng },
          distance: distance
        };
      });
      
      // Filter alerts within 200km radius if user location is available
      const filteredAlerts = userLocation 
        ? transformedAlerts.filter(alert => alert.distance !== null && alert.distance <= 200)
        : transformedAlerts;
      
      // Sort by distance (closest first)
      const sortedAlerts = filteredAlerts.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
      
      setAlerts(sortedAlerts);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching disaster data:', error);
      setError(error.message);
      // Fallback to sample data if API fails
      setAlerts([
        {
          id: 'fallback-1',
          type: "API Connection Error",
          severity: "medium",
          location: "System Status",
          description: "Unable to fetch live disaster data. Please check your connection or try again later.",
          timestamp: "Just now",
          affected: "N/A",
          icon: '🔌',
          source: 'System'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    // Request location first
    requestLocation();
  }, []);

  // Fetch disaster data when user location is available
  useEffect(() => {
    if (userLocation) {
      fetchDisasterData();
      
      // Auto-refresh every 5 minutes
      const interval = setInterval(fetchDisasterData, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-orange-100 text-orange-700 border-orange-200";
      case "low": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "low": return <Cloud className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {!userLocation ? 'Getting your location...' : 'Loading disaster alerts...'}
          </p>
        </div>
      </div>
    );
  }

  if (!userLocation && locationError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Location Access Required</h3>
          <p className="text-gray-600 mb-4">
            We need your location to show disaster alerts within 200km radius.
          </p>
          <button
            onClick={requestLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📍 Enable Location Access
          </button>
          {locationError && (
            <p className="text-red-600 text-sm mt-2">
              {locationError} - Using Kolkata as default location
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh button and status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Live Disaster Alerts</h2>
          <p className="text-gray-600 text-sm">
            {userLocation && (
              <span className="mr-4">
                📍 Location: {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}° 
                (200km radius)
              </span>
            )}
            {lastUpdated && `Last updated: ${lastUpdated}`}
            {error && <span className="text-red-600 ml-2">⚠️ {error}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={requestLocation}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <MapPin className="h-4 w-4" />
            📍 Location
          </button>
          <button
            onClick={fetchDisasterData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Alerts Grid */}
      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-green-700 mb-2">No Active Alerts</h3>
          <p className="text-gray-600">
            No disaster alerts within 200km of your location.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Monitoring radius: 200km • Location: {userLocation?.lat.toFixed(2)}°, {userLocation?.lng.toFixed(2)}°
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <Card key={alert.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {getSeverityIcon(alert.severity)}
                    <span className="ml-1 capitalize">{alert.severity} Risk</span>
                  </Badge>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.timestamp}
                  </div>
                </div>
                <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                  <span className="text-xl">{alert.icon}</span>
                  {alert.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-start text-blue-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium leading-tight">{alert.location}</span>
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                  {alert.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Source: {alert.source}
                  </span>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    Active
                  </Badge>
                </div>
                {alert.distance !== null && (
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    🎯 Distance: ~{alert.distance}km from your location
                  </div>
                )}
                {alert.affected && alert.affected !== 'Not specified' && (
                  <div className="mt-2 text-xs text-gray-500">
                    Affected: {alert.affected}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisasterAlerts;
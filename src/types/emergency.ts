export interface Message {
  id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  created_at: string;
}

export interface EmergencyAlert {
  id: string;
  user_id: string;
  emergency_type: string;
  description: string;
  location: { lat: number; lng: number } | null;
  status: 'active' | 'resolved';
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  created_at: string;
}

export interface EmergencyAlert {
  id: string;
  user_id: string;
  emergency_type: string;
  description: string;
  location: { lat: number; lng: number } | null;
  status: 'active' | 'resolved';
  created_at: string;
}

export interface VolunteerAssignment {
  id: string;
  alert_id: string;
  volunteer_id: string;
  status: 'assigned' | 'completed';
  created_at: string;
}
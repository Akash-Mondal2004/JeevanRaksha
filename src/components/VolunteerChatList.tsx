import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VolunteerChatListProps {
  userId: string;
}
// ...existing code...

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  alert_id: string;
  message: string;
  created_at: string;
  sender_profile?: {
    id: string;
    full_name: string | null;
    user_type: string;
  };
  receiver_profile?: {
    id: string;
    full_name: string | null;
    user_type: string;
  };
}
export const VolunteerChatList = ({ userId }: VolunteerChatListProps) => {
  const { chats, loading, error } = useChat(userId);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load chats: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Active Conversations</h3>
        {loading ? (
          <div className="text-center p-4">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No active conversations
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border"
              >
                <div>
                  <p className="font-medium">{chat.sender?.full_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">Emergency ID: {chat.alert_id}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => {
                    // Handle chat response
                    console.log('Responding to chat:', chat.id);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Respond
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
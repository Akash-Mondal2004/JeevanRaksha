import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VictimChatListProps {
  userId: string;
  alertId: string;
}

export const VictimChatList = ({ userId, alertId }: VictimChatListProps) => {
  const { chats, loading, error } = useChat(userId);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load conversations: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Active Conversations</h3>
      {loading ? (
        <div className="text-center p-4">Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No active conversations
        </div>
      ) : (
        <ScrollArea className="h-[200px]">
          {chats
            .filter(chat => chat.alert_id === alertId)
            .map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {typeof chat.sender === 'object' && chat.sender !== null
                      ? chat.sender.full_name
                      : typeof chat.sender === 'string'
                        ? chat.sender
                        : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.message}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </ScrollArea>
      )}
    </div>
  );
};
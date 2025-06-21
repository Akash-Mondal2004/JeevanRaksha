import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Mic } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Message } from '@/types/emergency';

interface ChatWindowProps {
  alertId: string;
  userId: string;
  volunteerId?: string;
  onClose?: () => void;
}

const ChatWindow = ({ alertId, userId, volunteerId, onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`chat-${alertId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `alert_id=eq.${alertId}`,
      }, 
      (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        scrollToBottom();
      })
      .subscribe();

    fetchMessages();
    return () => { supabase.removeChannel(channel); };
  }, [alertId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('alert_id', alertId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        alert_id: alertId,
        sender_id: userId,
        content: newMessage,
      });

    if (!error) {
      setNewMessage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `chat-media/${alertId}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        
        await supabase.from('messages').insert({
          alert_id: alertId,
          sender_id: userId,
          content: file.type.startsWith('image/') ? '📷 Image' : '📎 File',
          media_url: data.publicUrl,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col h-[500px] w-[350px] bg-white border rounded-lg shadow-lg">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold">Emergency Chat</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender_id === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
              {message.media_url && (
                <div className="mt-2">
                  {message.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={message.media_url}
                      alt="Shared media"
                      className="max-w-full rounded"
                    />
                  ) : (
                    <a
                      href={message.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View attachment
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isUploading}
          />
          
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,audio/*"
              disabled={isUploading}
            />
            <Paperclip className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </label>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsRecording(!isRecording)}
            disabled={isUploading}
          >
            <Mic className={`h-6 w-6 ${isRecording ? 'text-red-500' : 'text-gray-500'}`} />
          </Button>
          
          <Button size="icon" onClick={sendMessage} disabled={isUploading}>
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
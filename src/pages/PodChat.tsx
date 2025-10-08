import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const PodChat = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();
  const [message, setMessage] = useState('');

  const getPhaseColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };

  const phaseColor = getPhaseColor();

  // Mock messages
  const messages = [
    { sender: 'Sarah K.', message: 'Just finished my morning ritual! Who else?', time: '9:45 AM', isMe: false },
    { sender: 'You', message: 'Me! Feeling so good today ✨', time: '9:47 AM', isMe: true },
    { sender: 'Emma L.', message: 'On it! My skin feels amazing this week', time: '9:50 AM', isMe: false },
    { sender: 'Maya P.', message: "Can't wait to see our challenge results!", time: '10:02 AM', isMe: false },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, this would send the message
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/sisterhood')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-heading font-semibold">The Glow Getters</h1>
              <p className="text-xs text-muted-foreground">4 members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Challenge */}
      <div className="max-w-2xl mx-auto w-full px-6 py-4">
        <Card className="p-4 border-2" style={{ borderColor: phaseColor }}>
          <p className="text-sm font-medium text-foreground">
            Current Challenge: Complete your "Hydration Week" ritual
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Progress: 4/6 members completed today
          </p>
        </Card>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-4 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] space-y-1`}>
              {!msg.isMe && (
                <p className="text-xs font-semibold text-foreground px-3">{msg.sender}</p>
              )}
              <div
                className={`p-3 rounded-2xl ${
                  msg.isMe
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-accent text-foreground rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
              <p className="text-xs text-muted-foreground px-3">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full shrink-0"
              style={{ backgroundColor: phaseColor }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodChat;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Cpu, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TypingText } from '@/components/TypingText';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const MiChat = () => {
  const navigate = useNavigate();
  const { userData, getCurrentPhase, getCurrentDay, updateCustomRituals } = useUser();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const userName = userData.name || 'Investor';
      setMessages([{
        role: 'assistant',
        content: `${userName}, your portfolio is active. Current analysis shows stable conditions. How can I optimize your strategy today?`,
        isTyping: true,
      }]);
    }
  }, [userData.name, messages.length]);

  const handleTypingComplete = (index: number) => {
    setMessages(prev => prev.map((msg, i) =>
      i === index ? { ...msg, isTyping: false } : msg
    ));
  };

  const suggestedPrompts = [
    "Analyze my glucose impact today",
    "Recommend protocol for low sleep",
    "What's the ROI on my current shifts?"
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('aura-chat', {
        body: {
          message: input,
          checkIn: userData.checkIn,
          currentPhase: getCurrentPhase(),
          currentDay: getCurrentDay(),
        },
      });

      if (error) {
        console.error('Error calling m.i.:', error);
        toast({ title: "Error", description: "Failed to get response. Please try again.", variant: "destructive" });
        return;
      }

      let responseText = data.response;
      try {
        const parsed = JSON.parse(data.response);
        if (parsed.ritualUpdate) {
          updateCustomRituals(parsed.ritualUpdate.morning, parsed.ritualUpdate.evening, parsed.ritualUpdate.auraNote);
          responseText = parsed.message;
          toast({ title: "Protocol Updated", description: "m.i. has adjusted your deployment based on current data." });
        }
      } catch { /* not JSON */ }

      setMessages(prev => [...prev, { role: 'assistant', content: responseText, isTyping: true }]);
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/intelligence')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Cpu className="h-5 w-5 text-[hsl(var(--intel-glucose))]" />
            <div>
              <h1 className="text-lg font-heading font-semibold">m.i.</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Strategic Partner</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-[hsl(var(--intel-glucose))] text-white'
                : 'bg-muted text-foreground'
            }`}>
              <p className="text-sm">
                {message.role === 'assistant' && message.isTyping ? (
                  <TypingText text={message.content} onComplete={() => handleTypingComplete(index)} />
                ) : (
                  <span className="whitespace-pre-wrap">{message.content}</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {suggestedPrompts.map((prompt, i) => (
              <Button key={i} variant="outline" size="sm" onClick={() => setInput(prompt)} className="text-xs">
                {prompt}
              </Button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Query m.i...."
            disabled={isLoading}
            className="flex-1"
          />
          {input.trim() ? (
            <Button onClick={handleSend} disabled={isLoading} size="icon" className="shrink-0 bg-[hsl(var(--intel-glucose))] hover:bg-[hsl(var(--intel-glucose))]/90">
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => toast({ title: "Voice mode coming soon", description: "m.i. voice interface is in development." })} className="shrink-0">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MiChat;

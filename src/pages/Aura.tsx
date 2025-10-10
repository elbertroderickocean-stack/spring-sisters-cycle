import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Plus, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Aura = () => {
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message on first load
    if (messages.length === 0) {
      const userName = userData.name || 'beautiful';
      setMessages([
        {
          role: 'assistant',
          content: `Hello, ${userName}. I'm Aura, your personal guide to the world of Spring Sisters. Think of me as your wise older sister, always here to help. What's on your mind today?`
        }
      ]);
    }
  }, [userData.name, messages.length]);

  const suggestedPrompts = [
    "What's the best mask for me today?",
    "I have a big event tomorrow, help!",
    "Explain Ceramides to me like I'm 5"
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

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
          currentDay: getCurrentDay()
        }
      });

      if (error) {
        console.error('Error calling aura-chat:', error);
        if (error.message?.includes('429')) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again in a moment.",
            variant: "destructive"
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: "Payment required",
            description: "Please add credits to your Lovable AI workspace.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to get response from Aura. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      // Check if Aura is updating rituals
      let responseText = data.response;
      try {
        const parsedResponse = JSON.parse(data.response);
        if (parsedResponse.ritualUpdate) {
          updateCustomRituals(
            parsedResponse.ritualUpdate.morning,
            parsedResponse.ritualUpdate.evening,
            parsedResponse.ritualUpdate.auraNote
          );
          responseText = parsedResponse.message;
          toast({
            title: "Ritual Updated",
            description: "Aura has adjusted your daily rituals based on how you're feeling today.",
          });
        }
      } catch {
        // Response is not JSON, use as is
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSend:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/today')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">Aura</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedPrompt(prompt)}
                className="text-xs"
              >
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toast({
              title: "Attachments coming soon",
              description: "We're working on letting you share images with Aura!"
            })}
            className="shrink-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Aura anything..."
            disabled={isLoading}
            className="flex-1"
          />
          {input.trim() ? (
            <Button
              onClick={handleSend}
              disabled={isLoading}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast({
                title: "Voice mode is coming soon!",
                description: "Aura is still learning to recognize your beautiful voice."
              })}
              className="shrink-0"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Aura;

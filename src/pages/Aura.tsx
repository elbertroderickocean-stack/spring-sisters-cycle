import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Cpu, Plus, Mic } from 'lucide-react';
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

const Aura = () => {
  const navigate = useNavigate();
  const { userData, getCurrentPhase, getCurrentDay, updateCustomRituals } = useUser();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const userName = userData.name || t('aura.there');
      setMessages([{ role: 'assistant', content: t('aura.greeting', { name: userName }), isTyping: true }]);
    }
  }, [userData.name, messages.length, t]);

  const handleTypingComplete = (index: number) => {
    setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isTyping: false } : msg));
  };

  const suggestedPrompts = [
    t('aura.prompt_status'),
    t('aura.prompt_event'),
    t('aura.prompt_glucose'),
  ];

  const handleSuggestedPrompt = (prompt: string) => setInput(prompt);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('aura-chat', {
        body: { message: input, checkIn: userData.checkIn, currentPhase: getCurrentPhase(), currentDay: getCurrentDay() }
      });

      if (error) {
        console.error('Error calling aura-chat:', error);
        if (error.message?.includes('429')) {
          toast({ title: t('aura.rate_limit'), description: t('aura.rate_limit_desc'), variant: "destructive" });
        } else if (error.message?.includes('402')) {
          toast({ title: t('aura.payment'), description: t('aura.payment_desc'), variant: "destructive" });
        } else {
          toast({ title: t('aura.err_title'), description: t('aura.err_desc'), variant: "destructive" });
        }
        return;
      }

      let responseText = data.response;
      try {
        const parsedResponse = JSON.parse(data.response);
        if (parsedResponse.ritualUpdate) {
          updateCustomRituals(parsedResponse.ritualUpdate.morning, parsedResponse.ritualUpdate.evening, parsedResponse.ritualUpdate.auraNote);
          responseText = parsedResponse.message;
          toast({ title: t('aura.deployment_updated'), description: t('aura.deployment_updated_desc') });
        }
      } catch { /* not JSON */ }

      setMessages(prev => [...prev, { role: 'assistant', content: responseText, isTyping: true }]);
    } catch (error) {
      console.error('Error in handleSend:', error);
      toast({ title: t('aura.err_title'), description: t('aura.err_generic'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/today')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Cpu className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">m.i.</h1>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">{t('aura.subtitle')}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
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
            {suggestedPrompts.map((prompt, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => handleSuggestedPrompt(prompt)} className="text-xs">
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
          <Button variant="ghost" size="icon" onClick={() => toast({ title: t('aura.attach_soon'), description: t('aura.attach_soon_desc') })} className="shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={t('aura.placeholder')} disabled={isLoading} className="flex-1" />
          {input.trim() ? (
            <Button onClick={handleSend} disabled={isLoading} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => toast({ title: t('aura.voice_soon'), description: t('aura.voice_soon_desc') })} className="shrink-0">
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

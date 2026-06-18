import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import GiftLPModal from '@/components/GiftLPModal';

const PodChat = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const { t } = useTranslation();
  const phase = getCurrentPhase();
  const [message, setMessage] = useState('');
  const [selectedMember, setSelectedMember] = useState<{ name: string; avatar: string } | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const userBalance = 1250;

  const getPhaseColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };
  const phaseColor = getPhaseColor();

  const podMembers = [
    { name: 'Sarah K.', avatar: '👩' },
    { name: 'Emma L.', avatar: '👩‍🦰' },
    { name: 'Maya P.', avatar: '👩‍🦱' },
  ];

  const messages = [
    { sender: 'Sarah K.', message: t('pod_chat.msg_1'), time: '9:45 AM', isMe: false, avatar: '👩' },
    { sender: t('sisterhood.you'), message: t('pod_chat.msg_2'), time: '9:47 AM', isMe: true, avatar: '✨' },
    { sender: 'Emma L.', message: t('pod_chat.msg_3'), time: '9:50 AM', isMe: false, avatar: '👩‍🦰' },
    { sender: 'Maya P.', message: t('pod_chat.msg_4'), time: '10:02 AM', isMe: false, avatar: '👩‍🦱' },
  ];

  const handleMemberClick = (member: { name: string; avatar: string }) => setSelectedMember(member);
  const handleGiftLP = () => { if (selectedMember) { setSelectedMember(null); setShowGiftModal(true); } };
  const handleSend = () => { if (message.trim()) setMessage(''); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/sisterhood')} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-heading font-semibold">{t('pod_chat.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('pod_chat.members', { count: 4 })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-6 py-4">
        <Card className="p-4 border-2" style={{ borderColor: phaseColor }}>
          <p className="text-sm font-medium text-foreground">{t('pod_chat.challenge_label')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('pod_chat.challenge_progress')}</p>
        </Card>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-4 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2`}>
            {!msg.isMe && (
              <button onClick={() => handleMemberClick(podMembers.find(m => m.name === msg.sender)!)} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0 hover:bg-primary/20 transition-colors">
                {msg.avatar}
              </button>
            )}
            <div className="max-w-[75%] space-y-1">
              {!msg.isMe && <p className="text-xs font-semibold text-foreground px-3">{msg.sender}</p>}
              <div className={`p-3 rounded-2xl ${msg.isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-accent text-foreground rounded-bl-sm'}`}>
                <p className="text-sm">{msg.message}</p>
              </div>
              <p className="text-xs text-muted-foreground px-3">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex gap-2">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('pod_chat.placeholder')} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-1" />
            <Button onClick={handleSend} size="icon" className="rounded-full shrink-0" style={{ backgroundColor: phaseColor }}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="text-6xl text-center mb-4">{selectedMember?.avatar}</div>
            <DialogTitle className="text-2xl font-heading text-center">{selectedMember?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button onClick={handleGiftLP} className="w-full rounded-full" size="lg">
              <Gift className="h-4 w-4 mr-2" />
              {t('pod_chat.gift_ac')}
            </Button>
            <Button onClick={() => setSelectedMember(null)} variant="outline" className="w-full rounded-full">
              {t('pod_chat.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedMember && (
        <GiftLPModal isOpen={showGiftModal} onClose={() => { setShowGiftModal(false); setSelectedMember(null); }} recipientName={selectedMember.name} userBalance={userBalance} />
      )}
    </div>
  );
};

export default PodChat;

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Gift, Sparkles } from 'lucide-react';

interface GiftLPModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  userBalance: number;
}

const GiftLPModal: React.FC<GiftLPModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  userBalance,
}) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const lpAmount = parseInt(amount);
    
    if (!lpAmount || lpAmount <= 0) {
      alert('Please enter a valid amount of LP to gift.');
      return;
    }
    
    if (lpAmount > userBalance) {
      alert(`You only have ${userBalance} LP available.`);
      return;
    }
    
    // Show coming soon message
    alert('This feature is coming soon! Thank you for being a part of building our future.');
    onClose();
    setAmount('');
    setMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-6xl text-center mb-4">💝</div>
          <DialogTitle className="text-2xl font-heading text-center">Gift Legacy Points</DialogTitle>
          <DialogDescription className="text-center">
            Send LP to {recipientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* User Balance */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Your Available Balance</span>
            </div>
            <span className="text-2xl font-bold text-primary">{userBalance.toLocaleString()} LP</span>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-semibold">Amount of LP to Gift</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (e.g., 500)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={userBalance}
            />
            <p className="text-xs text-muted-foreground">
              Equivalent to ${((parseInt(amount) || 0) / 100).toFixed(2)}
            </p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message" className="font-semibold">Add a Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Thinking of you! 💚"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/200
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleSend}
            className="w-full rounded-full"
            size="lg"
            disabled={!amount || parseInt(amount) <= 0}
          >
            <Gift className="h-4 w-4 mr-2" />
            Send Gift
          </Button>
          <Button
            onClick={() => {
              onClose();
              setAmount('');
              setMessage('');
            }}
            variant="outline"
            className="w-full rounded-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftLPModal;

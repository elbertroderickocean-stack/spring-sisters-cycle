import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const RDPanel = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();
  const [selectedOption, setSelectedOption] = useState('');

  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };

  const phaseIconColor = getPhaseIconColor();

  const options = [
    'A Mineral Sunscreen SPF 30',
    'A Melting Cleansing Balm',
    'An Ultra-Light Aqua-Gel Cream',
  ];

  const handleVote = () => {
    if (!selectedOption) {
      toast.error('Please select an option');
      return;
    }
    toast.success('Vote cast! +25 AC earned');
    setTimeout(() => navigate('/sisterhood'), 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sisterhood')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-semibold">Vote on Future Assets</h1>
        </div>

        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading text-lg">Active Poll</CardTitle>
            </div>
            <CardDescription className="text-sm mt-3">
              What should we create next for The Constants™ line?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-[12px] border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOption(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm font-medium">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <Button onClick={handleVote} className="w-full rounded-full" style={{ backgroundColor: phaseIconColor }}>
              Cast Your Vote & Earn 25 AC
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-accent/50 border-none">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Your voice matters. We review all votes monthly and the winning product goes into development. You're not just a customer — you're a co-creator.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RDPanel;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const LegacyFundVote = () => {
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
    {
      name: 'Girls Who Code',
      description: 'Support STEM education for young women',
    },
    {
      name: 'EcoBeauty Innovations',
      description: 'Invest in a female-founded sustainable packaging startup',
    },
  ];

  const handleVote = () => {
    if (!selectedOption) {
      toast.error('Please select an initiative');
      return;
    }

    toast.success('Your vote has been recorded. Together, we make an impact!');
    setTimeout(() => navigate('/sisterhood'), 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/sisterhood')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-heading font-semibold">Vote on the Legacy Fund</h1>
        </div>

        {/* Info Section */}
        <Card className="shadow-lg" style={{ borderTop: `4px solid ${phaseIconColor}` }}>
          <CardContent className="pt-6">
            <p className="text-base text-foreground">
              This quarter, our 1% profit share amounts to{' '}
              <span className="font-bold" style={{ color: phaseIconColor }}>
                $12,500
              </span>
              . You decide where it goes.
            </p>
          </CardContent>
        </Card>

        {/* Active Vote Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading">This Quarter's Vote</CardTitle>
            </div>
            <CardDescription className="text-base mt-4">
              Which initiative should we support this quarter?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              <div className="space-y-4">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOption(option.name)}
                  >
                    <RadioGroupItem value={option.name} id={`option-${index}`} className="mt-1" />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="font-semibold">{option.name}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button
              onClick={handleVote}
              className="w-full"
              style={{ backgroundColor: phaseIconColor }}
            >
              Cast Your Vote & Make an Impact
            </Button>
          </CardContent>
        </Card>

        {/* Impact Info */}
        <Card className="bg-accent/50 border-none">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Every quarter, 1% of our profits goes to causes chosen by our community. Your vote shapes our collective legacy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegacyFundVote;

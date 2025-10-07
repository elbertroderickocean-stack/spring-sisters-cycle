import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';

const Details = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [ageRange, setAgeRange] = useState('');
  const [skinType, setSkinType] = useState('');

  const handleNext = () => {
    if (ageRange && skinType) {
      updateUserData({ ageRange, skinType });
      navigate('/inventory');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            A few final details for accuracy.
          </h2>
        </div>

        <div className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label className="text-base">Your age range</Label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="under-25">Under 25</SelectItem>
                <SelectItem value="25-34">25-34</SelectItem>
                <SelectItem value="35-44">35-44</SelectItem>
                <SelectItem value="45+">45+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Your baseline skin type (ignoring cycle changes)</Label>
            <Select value={skinType} onValueChange={setSkinType}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select your skin type" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="dry">Prone to dryness</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="oily">Prone to oiliness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!ageRange || !skinType}
            className="w-full mt-8 h-12 text-base rounded-full"
          >
            Show My Plan!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Details;

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';

interface WeeklyPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WeeklyPlanModal = ({ open, onOpenChange }: WeeklyPlanModalProps) => {
  const { userData, getCurrentDay } = useUser();

  const getHormonalWeeklyPlan = () => {
    const cycleLength = userData.cycleLength;
    const currentDay = getCurrentDay();
    const plan = [];
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    
    for (let offset = 0; offset < 7; offset++) {
      const futureDate = new Date(today.getTime() + offset * 24 * 60 * 60 * 1000);
      const dayOfWeek = futureDate.getDay();
      const cycleDayNumber = ((currentDay + offset - 1) % cycleLength) + 1;
      
      let phase;
      if (cycleDayNumber <= 7) {
        phase = 'Calm & Renew';
      } else if (cycleDayNumber <= Math.floor(cycleLength / 2)) {
        phase = 'Glow & Energize';
      } else {
        phase = 'Balance & Clarify';
      }
      
      plan.push({
        day: dayNames[dayOfWeek],
        phase
      });
    }
    
    return plan;
  };

  const getCellularTrainingPlan = () => {
    return [
      { day: 'Monday', phase: 'Recovery Night' },
      { day: 'Tuesday', phase: 'Recovery Night' },
      { day: 'Wednesday', phase: 'Exfoliation Night' },
      { day: 'Thursday', phase: 'Activation Night' },
      { day: 'Friday', phase: 'Recovery Night' },
      { day: 'Saturday', phase: 'Recovery Night' },
      { day: 'Sunday', phase: 'Flex Night' }
    ];
  };

  const weeklyPlan = userData.wiseBloomMode ? getCellularTrainingPlan() : getHormonalWeeklyPlan();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            {userData.wiseBloomMode ? 'Your 7-Day Training Rhythm' : 'Your Weekly Phase Plan'}
          </DialogTitle>
          <DialogDescription>
            {userData.wiseBloomMode 
              ? 'Your cellular training schedule for the week ahead.'
              : 'Your predicted hormonal phases for this week.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {weeklyPlan.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="font-medium">{item.day}</span>
              <span className="text-sm text-muted-foreground">{item.phase}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

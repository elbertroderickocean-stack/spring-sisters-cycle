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
  const { userData, getCurrentPhase } = useUser();

  const getHormonalWeeklyPlan = () => {
    const cycleLength = userData.cycleLength;
    const plan = [];
    
    for (let day = 1; day <= 7; day++) {
      let phase;
      if (day <= 7) {
        phase = 'Calm & Renew';
      } else if (day <= Math.floor(cycleLength / 2)) {
        phase = 'Glow & Energize';
      } else {
        phase = 'Balance & Clarify';
      }
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      const dayOfWeek = new Date(today.getTime() + (day - 1) * 24 * 60 * 60 * 1000).getDay();
      
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

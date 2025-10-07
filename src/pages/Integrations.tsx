import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';

const Integrations = () => {
  const navigate = useNavigate();

  const handleConnect = () => {
    // Placeholder for Google Calendar OAuth flow
    console.log('Google Calendar connection initiated');
    navigate('/today');
  };

  const handleSkip = () => {
    navigate('/today');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-lg w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/20 p-8 rounded-3xl">
                <Calendar className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-heading font-semibold text-foreground">
            Let's connect with your life.
          </h1>
          
          <p className="text-foreground/70 text-lg leading-relaxed">
            Spring Sisters becomes truly intelligent when it understands your lifestyle. Grant us permission to view your Google Calendar, and we can provide proactive advice for events like flights, late nights, or stressful meetings.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            size="lg"
            onClick={handleConnect}
            className="w-full h-12 text-base rounded-full"
          >
            Connect Google Calendar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            onClick={handleSkip}
            className="w-full h-12 text-base rounded-full"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;

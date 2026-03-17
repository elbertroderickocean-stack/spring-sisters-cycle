import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const PushNotification = () => {
  const navigate = useNavigate();

  const handleEnableNotifications = () => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
    navigate('/integrations');
  };

  const handleSkip = () => {
    navigate('/integrations');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-heading font-semibold text-foreground">
          Let m.i. manage in the background.
        </h1>

        {/* Body Text */}
        <p className="text-lg text-foreground/80 leading-relaxed">
          You focus on your day. meanwhile., our intelligent notifications keep your skin portfolio optimized—deploying the right protocol at the right time, so you never have to think about it.
        </p>

        {/* Buttons */}
        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleEnableNotifications}
            className="w-full"
            size="lg"
          >
            Enable Smart Notifications
          </Button>
          
          <Button 
            onClick={handleSkip}
            variant="ghost"
            className="w-full"
            size="lg"
          >
            Not Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PushNotification;

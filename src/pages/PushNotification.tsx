import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const PushNotification = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {});
    }
    navigate('/integrations');
  };

  const handleSkip = () => navigate('/integrations');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-semibold text-foreground">
          {t('push.title')}
        </h1>

        <p className="text-lg text-foreground/80 leading-relaxed">
          {t('push.body')}
        </p>

        <div className="space-y-4 pt-4">
          <Button onClick={handleEnableNotifications} className="w-full" size="lg">
            {t('push.enable')}
          </Button>
          <Button onClick={handleSkip} variant="ghost" className="w-full" size="lg">
            {t('push.not_now')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PushNotification;

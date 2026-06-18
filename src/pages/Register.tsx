import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { lovable } from '@/integrations/lovable/index';
import { toast } from 'sonner';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import { LanguageToggle } from '@/components/LanguageToggle';

const Register = () => {
  const navigate = useNavigate();
  const { updateUserData, enableDemoMode } = useUser();
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!name || !email || !password || isLoading) return;
    setIsLoading(true);
    const { error } = await signUp(email, password, name);
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      updateUserData({ name, email });
      toast.success(t('register.account_created'));
      navigate('/today');
    }
  };

  const handleGoogleSignup = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(t('login.google_failed'));
      return;
    }
    if (result.redirected) return;
    navigate('/today');
  };

  const handleAppleSignup = async () => {
    const result = await lovable.auth.signInWithOAuth('apple', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(t('login.apple_failed'));
      return;
    }
    if (result.redirected) return;
    navigate('/today');
  };

  const handleDemoMode = () => setShowDemoModal(true);

  const confirmDemoMode = () => {
    enableDemoMode();
    setShowDemoModal(false);
    navigate('/today');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={7} />
      <div className="absolute top-6 right-6 z-10">
        <LanguageToggle />
      </div>
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            {t('register.title')}
          </h2>
          <p className="text-foreground/70 text-lg">
            {t('register.subtitle')}
          </p>
        </div>

        <div className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">{t('register.name_label')}</Label>
            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="h-12 text-base" placeholder={t('register.name_placeholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">{t('common.email')}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 text-base" placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">{t('common.password')}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 text-base" placeholder="••••••••" />
          </div>

          <Button size="lg" onClick={handleCreateAccount} disabled={!name || !email || !password || isLoading} className="w-full mt-6 h-12 text-base rounded-lg">
            {isLoading ? t('register.creating') : t('register.create')}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t('common.or_continue_with')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-full" onClick={handleGoogleSignup}>{t('common.google')}</Button>
            <Button variant="outline" className="h-12 rounded-full" onClick={handleAppleSignup}>{t('common.apple')}</Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              {t('register.have_account')}{' '}
              <button onClick={() => navigate('/login')} className="text-primary hover:underline font-medium">{t('register.sign_in')}</button>
            </p>
          </div>

          <div className="text-center mt-2">
            <button onClick={handleDemoMode} className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
              {t('register.demo')}
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-center">{t('register.demo_title')}</DialogTitle>
            <DialogDescription className="text-center text-base pt-4">
              {t('register.demo_body_1')}<span className="font-semibold italic">{t('register.demo_body_personal')}</span>{t('register.demo_body_2')}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={confirmDemoMode} className="w-full h-12 rounded-full mt-4">{t('register.demo_confirm')}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;

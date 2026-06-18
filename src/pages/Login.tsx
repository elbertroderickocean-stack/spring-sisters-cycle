import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { lovable } from '@/integrations/lovable/index';
import { toast } from 'sonner';
import { MeanwhileLogo } from '@/components/MeanwhileLogo';
import { LanguageToggle } from '@/components/LanguageToggle';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/today');
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleAppleLogin = async () => {
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

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="absolute top-6 right-6 z-10">
        <LanguageToggle />
      </div>
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <MeanwhileLogo />
          <h2 className="text-3xl font-heading font-semibold text-foreground mt-6">
            {t('login.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>

        <div className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">{t('common.email')}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 text-base" placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">{t('common.password')}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 text-base" placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>

          <Button size="lg" onClick={handleLogin} disabled={!email || !password || isLoading} className="w-full h-12 text-base rounded-lg">
            {isLoading ? t('login.signing_in') : t('login.sign_in')}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t('common.or_continue_with')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-full" onClick={handleGoogleLogin}>{t('common.google')}</Button>
            <Button variant="outline" className="h-12 rounded-full" onClick={handleAppleLogin}>{t('common.apple')}</Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              {t('login.no_account')}{' '}
              <button onClick={() => navigate('/welcome')} className="text-primary hover:underline font-medium">{t('login.start_here')}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

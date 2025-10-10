import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';

const Register = () => {
  const navigate = useNavigate();
  const { updateUserData, enableDemoMode } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleCreateAccount = () => {
    if (name && email && password) {
      updateUserData({ name, email });
      navigate('/details');
    }
  };

  const handleDemoMode = () => {
    setShowDemoModal(true);
  };

  const confirmDemoMode = () => {
    enableDemoMode();
    setShowDemoModal(false);
    navigate('/today');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            Let's save your progress.
          </h2>
          <p className="text-foreground/70 text-lg">
            Create an account to save your personal calendar and unlock your path to ideal skin.
          </p>
        </div>

        <div className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
              placeholder="Jane Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              placeholder="jane@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base"
              placeholder="••••••••"
            />
          </div>

          <Button
            size="lg"
            onClick={handleCreateAccount}
            disabled={!name || !email || !password}
            className="w-full mt-6 h-12 text-base rounded-full"
          >
            Create Account
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-full">
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-full">
              Apple
            </Button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleDemoMode}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Исследовать в Демо-режиме
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-center">
              Добро пожаловать в Демо-режим!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-4">
              Сейчас вы увидите, как приложение работает для нашего демо-пользователя "Кейт". 
              Чтобы разблокировать ваш <span className="font-semibold italic">личный</span> ритм 
              и персональные рекомендации, пожалуйста, создайте аккаунт в любое время.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={confirmDemoMode}
            className="w-full h-12 rounded-full mt-4"
          >
            Я понимаю
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;

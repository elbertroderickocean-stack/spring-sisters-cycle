import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MeanwhileLogo } from '@/components/MeanwhileLogo';

interface HeaderBarProps {
  children?: React.ReactNode;
}

export const HeaderBar = ({ children }: HeaderBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-[hsl(var(--nav-bg))] backdrop-blur-[40px] border-b border-[hsl(var(--nav-border))]">
      <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex-1 flex items-center gap-3">
          <MeanwhileLogo size="sm" className="text-foreground cursor-pointer" />
          {children}
        </div>
        <div className="flex items-center gap-1 ml-4">
          <ThemeToggle />
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Profile"
          >
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

interface HeaderBarProps {
  children?: React.ReactNode;
}

export const HeaderBar = ({ children }: HeaderBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex-1">{children}</div>
        <button
          onClick={() => navigate('/profile')}
          className="ml-4 p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Profile"
        >
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

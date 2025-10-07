import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { PhaseType } from '@/contexts/UserContext';

const navItems = [
  { path: '/today', label: 'Today', icon: Home },
  { path: '/guide', label: 'Guide', icon: BookOpen },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/profile', label: 'Profile', icon: User },
];

const getPhaseColor = (phase: PhaseType): string => {
  switch (phase) {
    case 'calm':
      return 'hsl(200 25% 82%)';
    case 'glow':
      return 'hsl(30 100% 87%)';
    case 'balance':
      return 'hsl(120 15% 70%)';
    default:
      return 'hsl(var(--primary))';
  }
};

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors',
                  isActive 
                    ? '' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={isActive ? { color: getPhaseColor(phase) } : {}}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

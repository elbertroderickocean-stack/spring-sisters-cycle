import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface OnboardingBackButtonProps {
  to?: string;
  state?: any;
  onClick?: () => void;
}

const OnboardingBackButton: React.FC<OnboardingBackButtonProps> = ({ to, state, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to, { state });
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto mt-3"
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
};

export default OnboardingBackButton;

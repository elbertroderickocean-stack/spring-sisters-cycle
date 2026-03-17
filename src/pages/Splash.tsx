import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-5xl md:text-6xl font-heading font-light tracking-wider text-foreground animate-fade-in-slow lowercase">
        meanwhile.
      </h1>
    </div>
  );
};

export default Splash;

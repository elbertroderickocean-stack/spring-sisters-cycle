import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-6">
      <h1 className="text-5xl md:text-7xl font-heading font-light tracking-wider text-foreground animate-fade-in-slow lowercase">
        meanwhile.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground font-body tracking-widest uppercase animate-fade-in" style={{ animationDelay: '1s' }}>
        You live. Your skin upgrades.
      </p>
    </div>
  );
};

export default Splash;

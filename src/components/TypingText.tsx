import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  onComplete?: () => void;
  speed?: number; // words per minute
}

export const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  onComplete,
  speed = 225 // Default to 225 WPM for natural feel
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= text.length) {
      onComplete?.();
      return;
    }

    // Calculate delay based on WPM
    // Average word length is ~5 characters, so chars per minute = WPM * 5
    const charsPerMinute = speed * 5;
    const msPerChar = 60000 / charsPerMinute;
    
    // Add slight randomness for more natural feel (±20%)
    const randomness = 0.8 + Math.random() * 0.4;
    const delay = msPerChar * randomness;

    const timer = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, onComplete]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

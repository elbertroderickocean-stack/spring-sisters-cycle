import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  text: string;
  onComplete?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const skipToEnd = () => {
    if (!isComplete) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
    }
  };

  useEffect(() => {
    const words = text.split(' ');
    const firstFewWords = words.slice(0, 3).join(' ') + (words.length > 3 ? ' ' : '');
    const remainingText = words.slice(3).join(' ');
    
    let currentPos = 0;
    let currentDisplay = '';

    const typeInitialWords = () => {
      if (currentPos < firstFewWords.length) {
        currentDisplay += firstFewWords[currentPos];
        setDisplayedText(currentDisplay);
        currentPos++;
        
        // Slower character-by-character for first words (~200 WPM)
        const delay = 50 + Math.random() * 20;
        timerRef.current = setTimeout(typeInitialWords, delay);
      } else {
        // Switch to burst mode
        typeBursts();
      }
    };

    const typeBursts = () => {
      if (remainingText.length === 0) {
        setIsComplete(true);
        onComplete?.();
        return;
      }

      const remainingWords = remainingText.split(' ');
      let wordIndex = 0;

      const nextBurst = () => {
        if (wordIndex >= remainingWords.length) {
          setIsComplete(true);
          onComplete?.();
          return;
        }

        // Burst of 2-5 words
        const burstSize = Math.floor(Math.random() * 4) + 2;
        const burst = remainingWords.slice(wordIndex, wordIndex + burstSize).join(' ');
        currentDisplay += (currentDisplay ? ' ' : '') + burst;
        setDisplayedText(currentDisplay);
        
        wordIndex += burstSize;

        // Check if we just added punctuation for natural pause
        const lastChar = burst.trim().slice(-1);
        const isPunctuation = [',', '.', '!', '?', ';', ':'].includes(lastChar);
        const delay = isPunctuation ? 150 + Math.random() * 100 : 30 + Math.random() * 20;

        timerRef.current = setTimeout(nextBurst, delay);
      };

      nextBurst();
    };

    typeInitialWords();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [text, onComplete]);

  return (
    <span 
      className="whitespace-pre-wrap cursor-pointer" 
      onClick={skipToEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          skipToEnd();
        }
      }}
    >
      {displayedText}
    </span>
  );
};

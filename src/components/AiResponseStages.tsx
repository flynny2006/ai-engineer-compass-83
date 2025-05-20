
import React, { useState, useEffect } from 'react';
import { CircleLoading } from './ui/circle-loading';

interface AiResponseStagesProps {
  stage: 'idle' | 'thinking' | 'building' | 'complete';
  onComplete?: () => void;
}

const AiResponseStages: React.FC<AiResponseStagesProps> = ({ 
  stage, 
  onComplete 
}) => {
  const [animatedDots, setAnimatedDots] = useState('');
  
  // Animate the dots
  useEffect(() => {
    if (stage === 'idle' || stage === 'complete') return;
    
    const interval = setInterval(() => {
      setAnimatedDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [stage]);
  
  // Trigger onComplete callback when stage changes to complete
  useEffect(() => {
    if (stage === 'complete' && onComplete) {
      onComplete();
    }
  }, [stage, onComplete]);
  
  if (stage === 'idle' || stage === 'complete') return null;
  
  return (
    <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background/80 border border-border/50 mb-2 animate-fade-in">
      <CircleLoading className="h-4 w-4 animate-spin" />
      <span>
        {stage === 'thinking' ? `Thinking${animatedDots}` : `Building${animatedDots}`}
      </span>
    </div>
  );
};

export default AiResponseStages;

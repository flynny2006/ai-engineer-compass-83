
import React, { useState, useEffect } from 'react';

interface AiResponseStatusProps {
  isVisible: boolean;
  status: 'thinking' | 'building' | 'complete';
  onComplete?: () => void;
}

const AiResponseStatus: React.FC<AiResponseStatusProps> = ({ 
  isVisible, 
  status = 'thinking',
  onComplete 
}) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  const statusText = status === 'thinking' 
    ? `Thinking${dots}` 
    : status === 'building' 
    ? `Building${dots}`
    : 'Complete';
  
  return (
    <div className="flex items-center gap-2 p-3 text-sm">
      <div className="animate-spin h-4 w-4 rounded-full border-2 border-white/20 border-t-white"></div>
      <span>{statusText}</span>
    </div>
  );
};

export default AiResponseStatus;

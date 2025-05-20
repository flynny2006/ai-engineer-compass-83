
import React, { useState, useCallback } from 'react';
import { useAiResponse } from '@/hooks/use-ai-response';
import CreditsDisplay from './CreditsDisplay';

interface EditorWithAiResponseProps {
  creditsInfo: {
    amount: number;
    type: "daily" | "monthly";
  };
  onAiRequest: () => void;
  children: React.ReactNode;
}

/**
 * Wrapper component that adds AI response stages to the editor
 */
const EditorWithAiResponse: React.FC<EditorWithAiResponseProps> = ({
  creditsInfo,
  onAiRequest,
  children
}) => {
  const { stage, simulateResponse, reset } = useAiResponse();
  
  // Callback to handle AI requests
  const handleAiRequest = useCallback(async () => {
    // Check if user has enough credits
    if (creditsInfo.amount <= 0) {
      alert(`You're out of ${creditsInfo.type} credits!`);
      return;
    }
    
    // Start the AI response simulation
    await simulateResponse();
    
    // Call the parent onAiRequest callback (which handles credit deduction)
    onAiRequest();
    
    // Reset the AI response state after a delay
    setTimeout(reset, 1000);
  }, [creditsInfo, onAiRequest, simulateResponse, reset]);
  
  // Clone children with additional props related to AI response
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        aiResponseStage: stage,
        onAiRequest: handleAiRequest,
        creditsInfo
      });
    }
    return child;
  });
  
  return (
    <div className="relative w-full h-full">
      {childrenWithProps}
    </div>
  );
};

export default EditorWithAiResponse;

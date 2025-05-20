
import { useState, useCallback } from 'react';
import simulateAiResponse from '@/utils/aiResponseSimulator';

type ResponseStage = 'idle' | 'thinking' | 'building' | 'complete';

interface UseAiResponseResult {
  stage: ResponseStage;
  simulateResponse: (thinkingTime?: number, buildingTime?: number) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing AI response stages
 */
export const useAiResponse = (): UseAiResponseResult => {
  const [stage, setStage] = useState<ResponseStage>('idle');
  
  const reset = useCallback(() => {
    setStage('idle');
  }, []);
  
  const simulateResponse = useCallback(async (
    thinkingTime = 3000, 
    buildingTime = 4000
  ): Promise<void> => {
    // Only start a new simulation if we're idle
    if (stage === 'idle') {
      await simulateAiResponse(setStage, thinkingTime, buildingTime);
    }
    return Promise.resolve();
  }, [stage]);
  
  return { stage, simulateResponse, reset };
};

export default useAiResponse;

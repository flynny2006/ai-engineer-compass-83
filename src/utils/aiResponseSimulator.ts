
/**
 * AI Response Simulator
 * 
 * This utility simulates the different stages of an AI response process.
 */

type ResponseStage = 'idle' | 'thinking' | 'building' | 'complete';
type StageCallback = (stage: ResponseStage) => void;

export const simulateAiResponse = (
  callback: StageCallback,
  thinkingTime = 3000,
  buildingTime = 4000
): Promise<void> => {
  return new Promise((resolve) => {
    // Initial state: thinking
    callback('thinking');
    
    // After thinkingTime, change to building
    setTimeout(() => {
      callback('building');
      
      // After buildingTime, change to complete
      setTimeout(() => {
        callback('complete');
        resolve();
      }, buildingTime);
    }, thinkingTime);
  });
};

export default simulateAiResponse;

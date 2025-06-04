
import React from 'react';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export type StatusItem = {
  id: string;
  text: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
  timestamp: number;
};

interface GenerationStatusProps {
  items: StatusItem[];
  visible: boolean;
}

const GenerationStatus: React.FC<GenerationStatusProps> = ({ items, visible }) => {
  // Don't render anything - completely hide the generation status box
  return null;
};

export default GenerationStatus;

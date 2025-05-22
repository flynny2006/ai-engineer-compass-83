
import React from 'react';
import { CheckCircle2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

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
  if (!visible || items.length === 0) return null;
  
  // Only show the most recent items (last 3)
  const recentItems = [...items].slice(-3);
  
  return (
    <div className="fixed bottom-8 left-8 z-50 max-w-sm w-full bg-black/90 backdrop-blur-lg border border-white/15 rounded-lg p-3 shadow-lg animate-fade-in">
      <p className="text-xs text-white/70 mb-2 font-semibold">Generation Status</p>
      <div className="space-y-2">
        {recentItems.map((item) => (
          <div key={item.id} className="flex items-center text-sm text-white gap-2">
            {item.status === 'complete' && (
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            )}
            {item.status === 'loading' && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-400 animate-spin flex-shrink-0" />
                <div className="text-xs text-white/80 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
                </div>
              </div>
            )}
            {item.status === 'error' && (
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
            {item.status === 'pending' && (
              <div className="h-4 w-4 border-2 border-white/30 rounded-full flex-shrink-0" />
            )}
            <span className="truncate">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerationStatus;

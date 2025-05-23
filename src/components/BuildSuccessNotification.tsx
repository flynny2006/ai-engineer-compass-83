
import React from 'react';
import { CheckCircle2, Eye } from 'lucide-react';

interface BuildSuccessNotificationProps {
  visible: boolean;
  onClose?: () => void;
}

const BuildSuccessNotification: React.FC<BuildSuccessNotificationProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-8 right-8 z-50 max-w-sm w-full bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-lg border border-green-400/30 rounded-lg p-4 shadow-2xl animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm mb-1">
            BUILD SUCCESSFUL
          </h3>
          <p className="text-green-100 text-xs mb-2 opacity-90">
            The build was successful and got applied. Check the preview to see the Website in real-time.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-green-200 bg-green-600/30 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
              Level: Low
            </span>
            <Eye className="h-3 w-3 text-green-200" />
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-green-200 hover:text-white transition-colors ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default BuildSuccessNotification;

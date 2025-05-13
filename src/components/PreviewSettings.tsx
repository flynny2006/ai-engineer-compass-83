
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, RefreshCcw } from "lucide-react";

export interface PreviewSettingsProps {
  files: Array<{ name: string; content: string; type: string }>;
  mainFile: string;
  setMainFile: (filename: string) => void;
  onRefresh?: () => void;
}

const PreviewSettings: React.FC<PreviewSettingsProps> = ({ 
  files, 
  mainFile, 
  setMainFile, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        title="Refresh preview"
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="View preview in new tab"
        onClick={() => {
          // Create a blob with the current HTML content
          const htmlFile = files.find(f => f.name === mainFile);
          if (htmlFile) {
            const blob = new Blob([htmlFile.content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          }
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PreviewSettings;

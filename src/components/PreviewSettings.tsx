
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";

interface PreviewSettingsProps {
  files: Array<{ name: string; content: string; type: string }>;
  mainFile: string;
  setMainFile: (file: string) => void;
}

const PreviewSettings: React.FC<PreviewSettingsProps> = ({ 
  files, 
  mainFile, 
  setMainFile 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(mainFile);
  
  // Get all HTML files
  const htmlFiles = files.filter(file => file.name.endsWith('.html'));
  
  // Apply settings and close dialog
  const applySettings = () => {
    setMainFile(selectedFile);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Preview Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="mainFile" className="text-sm font-medium">Main File</label>
            <p className="text-xs text-muted-foreground">
              Select the file that will be displayed in the preview by default.
            </p>
            <Select
              value={selectedFile}
              onValueChange={setSelectedFile}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a file" />
              </SelectTrigger>
              <SelectContent>
                {htmlFiles.length > 0 ? (
                  htmlFiles.map(file => (
                    <SelectItem key={file.name} value={file.name}>
                      {file.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="index.html" disabled>
                    No HTML files available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={applySettings}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewSettings;

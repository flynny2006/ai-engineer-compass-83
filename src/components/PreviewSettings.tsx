
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();
  
  // Get all HTML files - add a null check for files
  const htmlFiles = files ? files.filter(file => file.name.endsWith('.html')) : [];
  
  // Apply settings and close dialog
  const applySettings = () => {
    setMainFile(selectedFile);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size={isMobile ? "icon" : "sm"}
          className={cn(
            "relative",
            isMobile && "h-9 w-9 rounded-md p-0"
          )}
        >
          <Eye className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Settings</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        isMobile && "w-[90vw] max-w-[90vw] p-4 rounded-lg"
      )}>
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

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronDown, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  // Handle file selection directly from dropdown
  const handleFileSelect = (fileName: string) => {
    setMainFile(fileName);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 text-xs font-medium py-1 px-2 h-8 bg-background/80 backdrop-blur-sm border border-border/50"
          >
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{mainFile}</span>
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {htmlFiles.length > 0 ? (
            htmlFiles.map(file => (
              <DropdownMenuItem 
                key={file.name} 
                onClick={() => handleFileSelect(file.name)}
                className="flex items-center justify-between"
              >
                {file.name}
                {file.name === mainFile && (
                  <Check className="h-3 w-3 ml-2" />
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              No HTML files available
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Keep the dialog for advanced settings */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size={isMobile ? "icon" : "sm"}
            className={cn(
              "relative",
              isMobile && "h-9 w-9 rounded-md p-0 hidden" // Hide this button as we're using the dropdown
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
    </>
  );
};

export default PreviewSettings;

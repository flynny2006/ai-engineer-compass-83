
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, RefreshCcw, Smartphone, Tablet, Monitor, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

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
  
  // New setting options
  const [deviceEmulation, setDeviceEmulation] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showBackground, setShowBackground] = useState(true);
  const [renderSpeed, setRenderSpeed] = useState("normal");
  
  // Get all HTML files
  const htmlFiles = files.filter(file => file.name.endsWith('.html'));
  
  // Apply settings and close dialog
  const applySettings = () => {
    setMainFile(selectedFile);
    
    // In a real implementation, the other settings would be applied to the preview
    // Here we're just setting up the UI for these settings
    
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Preview Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mainFile">Main File</Label>
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
              <p className="text-xs text-muted-foreground">
                Select the file that will be displayed in the preview
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoRefresh">Auto Refresh</Label>
                <p className="text-xs text-muted-foreground">Automatically refresh preview when code changes</p>
              </div>
              <Switch
                id="autoRefresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showBackground">Show Background</Label>
                <p className="text-xs text-muted-foreground">Display background color in preview</p>
              </div>
              <Switch
                id="showBackground"
                checked={showBackground}
                onCheckedChange={setShowBackground}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="display" className="space-y-4">
            <div className="space-y-2">
              <Label>Device Emulation</Label>
              <div className="flex justify-between space-x-2">
                <Button 
                  variant={deviceEmulation === "desktop" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setDeviceEmulation("desktop")}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
                <Button 
                  variant={deviceEmulation === "tablet" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setDeviceEmulation("tablet")}
                >
                  <Tablet className="h-4 w-4 mr-2" />
                  Tablet
                </Button>
                <Button 
                  variant={deviceEmulation === "mobile" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setDeviceEmulation("mobile")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="zoom">Zoom Level: {zoomLevel}%</Label>
              </div>
              <Slider
                id="zoom"
                min={50}
                max={150}
                step={5}
                value={[zoomLevel]}
                onValueChange={(value) => setZoomLevel(value[0])}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="renderSpeed">Render Speed</Label>
              <Select
                value={renderSpeed}
                onValueChange={setRenderSpeed}
              >
                <SelectTrigger id="renderSpeed">
                  <SelectValue placeholder="Select render speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Adjust rendering performance (affects preview speed)
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
                onClick={() => {
                  // Reset to defaults
                  setDeviceEmulation("desktop");
                  setAutoRefresh(true);
                  setZoomLevel(100);
                  setShowBackground(true);
                  setRenderSpeed("normal");
                }}
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Reset to Defaults
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
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

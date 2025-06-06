
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import RightPanelTabs from '@/components/RightPanelTabs';
import AIChatPanel from '@/components/AIChatPanel';
import CodeEditor from '@/components/CodeEditor';
import FileExplorerEnhanced from '@/components/FileExplorerEnhanced';
import PreviewSettings from '@/components/PreviewSettings';
import GenerationStatus from '@/components/GenerationStatus';
import NavigationControls from '@/components/NavigationControls';
import { useProjectFiles } from '@/hooks/use-project-files';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('preview');
  const [statusItems, setStatusItems] = useState([]);
  const { toast } = useToast();
  
  // Initialize with default files
  const initialFiles = [
    {
      name: 'index.html',
      content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Project</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>',
      type: 'html'
    }
  ];
  
  const {
    files,
    currentFile,
    setCurrentFile,
    mainPreviewFile,
    setMainPreviewFile,
    updateFileContent,
    handleFileUpload
  } = useProjectFiles(initialFiles);

  const handleFileCreate = (name: string, content: string = '') => {
    if (!name.trim()) {
      toast({
        title: "Invalid file name",
        description: "File name cannot be empty."
      });
      return;
    }

    const newFile = {
      name: name,
      content: content,
      type: name.split('.').pop() || 'txt'
    };

    // Add to files array
    const updatedFiles = [...files, newFile];
    // This would need to be handled by the useProjectFiles hook
    // For now, we'll use handleFileUpload
    handleFileUpload(newFile);
  };

  const handleFileDelete = (fileName: string) => {
    // This functionality would need to be added to useProjectFiles hook
    console.log('Delete file:', fileName);
  };

  const handleFileUpdate = (fileName: string, newContent: string) => {
    updateFileContent(fileName, newContent);
  };

  const handleFileUploadWrapper = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleFileUpload({
          name: file.name,
          content: content,
          type: file.type
        });
      };
      reader.readAsText(file);
    });
  };

  const handleProjectDownload = () => {
    // This functionality would need to be implemented
    console.log('Download project');
  };

  const addStatusItem = (text: string, status: 'pending' | 'loading' | 'complete' | 'error') => {
    const newItem = {
      id: uuidv4(),
      text: text,
      status: status,
      timestamp: Date.now()
    };
    setStatusItems(prevItems => [...prevItems, newItem]);
  };

  const updateStatusItem = (id: string, status: 'pending' | 'loading' | 'complete' | 'error') => {
    setStatusItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: status } : item
      )
    );
  };

  const removeStatusItem = (id: string) => {
    setStatusItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Get current file object
  const getCurrentFileObject = () => {
    return files.find(file => file.name === currentFile);
  };

  // Create preview URL (simplified)
  const previewUrl = `data:text/html,${encodeURIComponent(
    files.find(file => file.name === mainPreviewFile)?.content || 
    files.find(file => file.name.endsWith('.html'))?.content ||
    '<html><body><h1>No preview available</h1></body></html>'
  )}`;

  const renderRightPanelContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 border-b border-border bg-background">
              <h3 className="text-sm font-medium text-foreground">Preview</h3>
              <PreviewSettings
                files={files}
                mainFile={mainPreviewFile}
                setMainFile={setMainPreviewFile}
              />
            </div>
            <div className="flex-1 bg-white">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          </div>
        );
      case 'explorer':
        return (
          <div className="flex flex-col h-full">
            <div className="p-2 border-b border-border bg-background">
              <h3 className="text-sm font-medium text-foreground">File Explorer</h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <FileExplorerEnhanced
                files={files.map(file => ({
                  id: file.name,
                  name: file.name,
                  content: file.content,
                  lastModified: new Date().toISOString()
                }))}
                currentFile={getCurrentFileObject() ? {
                  id: currentFile,
                  name: currentFile,
                  content: getCurrentFileObject()?.content || '',
                  lastModified: new Date().toISOString()
                } : null}
                onFileSelect={(file) => setCurrentFile(file.name)}
                onCreateFile={handleFileCreate}
                onDeleteFile={handleFileDelete}
                onUploadFiles={handleFileUploadWrapper}
                onDownloadProject={handleProjectDownload}
              />
            </div>
          </div>
        );
      case 'editor':
        return (
          <div className="flex flex-col h-full">
            <div className="p-2 border-b border-border bg-background">
              <h3 className="text-sm font-medium text-foreground">
                {currentFile ? `Editing: ${currentFile}` : 'Code Editor'}
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={getCurrentFileObject()?.content || ''}
                onChange={(newContent) => handleFileUpdate(currentFile, newContent)}
                language={currentFile?.split('.').pop() || 'html'}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <NavigationControls />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - AI Chat */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <AIChatPanel />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Tabbed Interface */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="flex flex-col h-full">
              <RightPanelTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="flex-1 overflow-hidden">
                {renderRightPanelContent()}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <GenerationStatus items={statusItems} visible={statusItems.length > 0} />
    </div>
  );
};

export default Index;

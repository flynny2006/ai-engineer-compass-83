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
  
  const {
    files,
    currentFile,
    setCurrentFile,
    createFile,
    updateFile,
    deleteFile,
    mainFile,
    setMainFile,
    uploadFiles,
    downloadProject,
    previewUrl
  } = useProjectFiles();

  const handleFileCreate = (name: string, content: string = '') => {
    if (!name.trim()) {
      toast({
        title: "Invalid file name",
        description: "File name cannot be empty."
      });
      return;
    }

    const newFile = {
      id: uuidv4(),
      name: name,
      content: content,
      lastModified: new Date().toISOString()
    };

    createFile(newFile);
  };

  const handleFileDelete = (fileId: string) => {
    deleteFile(fileId);
  };

  const handleFileUpdate = (fileId: string, newContent: string) => {
    updateFile(fileId, newContent);
  };

  const handleFileUpload = (acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles);
  };

  const handleProjectDownload = () => {
    downloadProject();
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

  const renderRightPanelContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 border-b border-border bg-background">
              <h3 className="text-sm font-medium text-foreground">Preview</h3>
              <PreviewSettings
                files={files}
                mainFile={mainFile}
                setMainFile={setMainFile}
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
                files={files}
                currentFile={currentFile}
                onFileSelect={setCurrentFile}
                onCreateFile={createFile}
                onDeleteFile={deleteFile}
                onUploadFiles={uploadFiles}
                onDownloadProject={downloadProject}
              />
            </div>
          </div>
        );
      case 'editor':
        return (
          <div className="flex flex-col h-full">
            <div className="p-2 border-b border-border bg-background">
              <h3 className="text-sm font-medium text-foreground">
                {currentFile ? `Editing: ${currentFile.name}` : 'Code Editor'}
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                file={currentFile}
                onChange={updateFile}
                files={files}
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

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
import { StatusItem } from '@/components/GenerationStatus';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

type TabType = 'preview' | 'explorer' | 'editor';

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
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

  const handleFileSelect = (file: any) => {
    setCurrentFile(file);
  };

  const handleCreateFile = (name: string, type: string) => {
    const newFile = {
      id: uuidv4(),
      name,
      content: '',
      type,
    };
    createFile(newFile);
    setCurrentFile(newFile);
  };

  const handleUpdateFile = (fileId: string, content: string) => {
    updateFile(fileId, content);
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId);
  };

  const handleSetMainFile = (file: string) => {
    setMainFile(file);
  };

  const handleUploadFiles = (files: File[]) => {
    uploadFiles(files);
  };

  const handleDownloadProject = () => {
    downloadProject();
  };

  const addStatusItem = (text: string, status: 'pending' | 'loading' | 'complete' | 'error') => {
    const newItem = {
      id: uuidv4(),
      text,
      status,
      timestamp: Date.now(),
    };
    setStatusItems((prev) => [...prev, newItem]);
  };

  const updateStatusItem = (id: string, status: 'pending' | 'loading' | 'complete' | 'error') => {
    setStatusItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const removeStatusItem = (id: string) => {
    setStatusItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearStatusItems = () => {
    setStatusItems([]);
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
    <div className="w-full h-screen bg-background">
      <NavigationControls />
      <GenerationStatus items={statusItems} visible={false} />
      
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        {/* Left Panel - AI Chat */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <AIChatPanel />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Panel - Tabbed Content */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="flex flex-col h-full">
            <RightPanelTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 overflow-hidden">
              {renderRightPanelContent()}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;

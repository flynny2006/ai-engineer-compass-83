import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor';
import FileExplorerEnhanced from '@/components/FileExplorerEnhanced';
import PreviewSettings from '@/components/PreviewSettings';
import GenerationStatus from '@/components/GenerationStatus';
import NavigationControls from '@/components/NavigationControls';
import { useProjectFiles } from '@/hooks/use-project-files';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [activeLeftTab, setActiveLeftTab] = useState('explorer');
  const [rightPanelView, setRightPanelView] = useState('preview'); // New state for right panel
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
    previewUrl,
    handleFileUpload 
  } = useProjectFiles();

  const handleFileSelect = (file) => {
    setCurrentFile(file);
  };

  const handleCreateFile = (name, type) => {
    const newFile = {
      id: Date.now().toString(),
      name,
      content: '',
      type
    };
    createFile(newFile);
    setCurrentFile(newFile);
  };

  const handleUpdateFile = (fileId, content) => {
    updateFile(fileId, content);
  };

  const handleDeleteFile = (fileId) => {
    deleteFile(fileId);
  };

  const handleSetMainFile = (file) => {
    setMainFile(file);
  };

  const handleUploadFiles = (files) => {
    uploadFiles(files);
  };

  const handleDownloadProject = () => {
    downloadProject();
  };

  const addStatusItem = (text, status) => {
    const newItem = {
      id: Date.now().toString(),
      text,
      status,
      timestamp: Date.now()
    };
    setStatusItems(prev => [...prev, newItem]);
  };

  const updateStatusItem = (id, status) => {
    setStatusItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const removeStatusItem = (id) => {
    setStatusItems(prev => prev.filter(item => item.id !== id));
  };

  const clearStatusItems = () => {
    setStatusItems([]);
  };

  const renderLeftPanelContent = () => {
    switch(activeLeftTab) {
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

  const renderRightPanelContent = () => {
    if (rightPanelView === 'preview') {
      return (
        <div className="flex flex-col h-full">
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
    } else {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 p-4 bg-background">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">AI Chat</h3>
              <p>Chat functionality will be implemented here</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-screen bg-background">
      <NavigationControls />
      
      <div className="h-[calc(100vh-60px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - File Explorer/Editor */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="flex flex-col h-full">
              {/* Left Panel Tabs */}
              <div className="flex border-b border-border bg-background">
                <Button
                  variant={activeLeftTab === 'explorer' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveLeftTab('explorer')}
                  className="rounded-none flex-1"
                >
                  Explorer
                </Button>
                <Button
                  variant={activeLeftTab === 'editor' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveLeftTab('editor')}
                  className="rounded-none flex-1"
                >
                  Editor
                </Button>
              </div>
              
              {/* Left Panel Content */}
              <div className="flex-1 overflow-hidden">
                {renderLeftPanelContent()}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Preview/Chat */}
          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="flex flex-col h-full">
              {/* Right Panel Header with Switcher */}
              <div className="flex items-center justify-between p-2 border-b border-border bg-background">
                <div className="flex items-center gap-2">
                  {rightPanelView === 'preview' && (
                    <PreviewSettings
                      files={files}
                      mainFile={mainFile}
                      setMainFile={setMainFile}
                    />
                  )}
                </div>
                
                {/* View Switcher */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={rightPanelView === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelView('preview')}
                    className="rounded-none px-4"
                  >
                    Preview
                  </Button>
                  <Button
                    variant={rightPanelView === 'chat' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelView('chat')}
                    className="rounded-none px-4"
                  >
                    Chat
                  </Button>
                </div>
              </div>
              
              {/* Right Panel Content */}
              <div className="flex-1 overflow-hidden">
                {renderRightPanelContent()}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Items */}
      {statusItems.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <GenerationStatus
            items={statusItems}
            onUpdateItem={updateStatusItem}
            onRemoveItem={removeStatusItem}
            onClearAll={clearStatusItems}
          />
        </div>
      )}
    </div>
  );
};

export default Index;

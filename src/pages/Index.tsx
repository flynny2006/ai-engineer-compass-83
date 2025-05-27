import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import CodeEditor from '@/components/CodeEditor';
import FileExplorerEnhanced from '@/components/FileExplorerEnhanced';
import ModernPromptInput from '@/components/ModernPromptInput';
import PreviewSettings from '@/components/PreviewSettings';
import { useProjectFiles, FileType } from '@/hooks/use-project-files';
import { toast } from '@/hooks/use-toast';
import { CornerDownLeft, MessageSquare, Terminal, PanelLeftOpen, PanelRightOpen, Play, Save, UploadCloud, Share2, Settings2, Moon, Sun, Expand, Minimize, CodeIcon, Eye, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProjectConsole from '@/components/ProjectConsole';
import GenerationStatus from '@/components/GenerationStatus';
import { useTheme } from '@/hooks/use-theme';
import { createClientComponentClient } from '@supabase/auth-helpers-react';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';

const getSupabase = () => {
  return createClientComponentClient();
};

const fetchFilesFromSupabase = async (projectId: string): Promise<FileType[]> => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.error("Error fetching files from Supabase:", error);
      return [];
    }

    if (data) {
      return data.map(file => ({
        name: file.name,
        content: file.content,
        type: file.type || 'text', 
        path: file.name, 
        isFolder: file.type === 'folder', 
        children: file.type === 'folder' ? [] : undefined, 
      }));
    }

    return [];
  } catch (error) {
    console.error("Unexpected error fetching files:", error);
    return [];
  }
};

const saveFileToSupabase = async (projectId: string, file: FileType) => {
  try {
    const supabase = getSupabase();
    const fileToSave = {
      project_id: projectId,
      name: file.path, 
      content: file.isFolder ? '' : file.content || '', 
      type: file.type || (file.isFolder ? 'folder' : 'text'), 
    };
    console.log("Attempting to save to Supabase:", fileToSave);
    const { data, error } = await supabase
      .from('project_files')
      .upsert(fileToSave, { onConflict: 'project_id, name' });

    if (error) {
      console.error("Error saving file to Supabase:", error);
    } else {
      console.log("File saved to Supabase:", file.name);
    }
  } catch (error) {
    console.error("Unexpected error saving file:", error);
  }
};

const deleteFileFromSupabase = async (projectId: string, fileName: string) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('project_files')
      .delete()
      .eq('project_id', projectId)
      .eq('name', fileName);

    if (error) {
      console.error("Error deleting file from Supabase:", error);
    } else {
      console.log("File deleted from Supabase:", fileName);
    }
  } catch (error) {
    console.error("Unexpected error deleting file:", error);
  }
};

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);

  const [files, setFiles] = useState<FileType[]>([]);
  const [currentFile, setCurrentFile] = useState<FileType | null>(null);
  const [isLoadingFilesState, setIsLoadingFilesState] = useState(true);
  const [hasUnsavedChangesState, setHasUnsavedChangesState] = useState(false);
  const tempFinalCodeRef = useRef<string | null>(null);

  const updateFileContent = (filePath: string, newCode: string) => {
    setFiles(prevFiles =>
      prevFiles.map(f => (f.path === filePath ? { ...f, content: newCode } : f))
    );
    if (currentFile?.path === filePath) {
      setCurrentFile(prev => prev ? { ...prev, content: newCode } : null);
    }
    setHasUnsavedChangesState(true);
  };

  const addFile = (name: string, content: string, type: string, parentPath?: string) => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    const newFile: FileType = { name, content, type, path, isFolder: false };
    setFiles(prevFiles => [...prevFiles, newFile]);
    setCurrentFile(newFile);
    setHasUnsavedChangesState(true);
    return newFile;
  };
  
  const addDirectory = (name: string, parentPath?: string) => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    const newDir: FileType = { name, content: '', type: 'folder', path, isFolder: true, children: [] };
    setFiles(prevFiles => [...prevFiles, newDir]);
    setHasUnsavedChangesState(true);
    return newDir;
  };

  const deleteFile = (filePath: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.path !== filePath && !f.path?.startsWith(`${filePath}/`)));
    if (currentFile?.path === filePath) {
      setCurrentFile(null);
    }
    setHasUnsavedChangesState(true);
    if (projectId) deleteFileFromSupabase(projectId, filePath);
  };
  
  const renameFile = (oldPath: string, newName: string) => {
    setFiles(prevFiles =>
      prevFiles.map(f => {
        if (f.path === oldPath) {
          const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + newName;
          return { ...f, name: newName, path: newPath };
        }
        return f;
      })
    );
    if (currentFile?.path === oldPath) {
       const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + newName;
       setCurrentFile(prev => prev ? { ...prev, name: newName, path: newPath } : null);
    }
    setHasUnsavedChangesState(true);
  };

  const saveAllFilesToStorage = async () => {
    if (!projectId) return;
    console.log("Saving all files to Supabase for project:", projectId);
    for (const file of files) {
      await saveFileToSupabase(projectId, file);
    }
    setHasUnsavedChangesState(false);
    toast({ title: "Project Saved", description: "All changes have been saved." });
  };

  const [iframeKey, setIframeKey] = useState(Date.now());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'chat' | 'console'>('chat');
  const { theme, setTheme } = useTheme();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    if (id) {
      setProjectId(id);
      setIsLoadingFilesState(true);
      fetchFilesFromSupabase(id)
        .then(dbFiles => {
          setFiles(dbFiles);
          if (dbFiles.length > 0) {
            const initialFile = dbFiles.find(f => f.name === 'index.html' && !f.isFolder) || dbFiles.find(f => !f.isFolder);
            setCurrentFile(initialFile || null);
          } else {
            setCurrentFile(null);
          }
        })
        .catch(err => console.error("Failed to load files for project", id, err))
        .finally(() => setIsLoadingFilesState(false));
    } else {
      const currentProjectId = localStorage.getItem("current_project_id");
      if (currentProjectId) {
        navigate(`/project?id=${currentProjectId}`, { replace: true });
        // useEffect will re-run with new location.search
      } else {
        toast({ title: "Error", description: "No project ID found. Redirecting to home.", variant: "destructive" });
        navigate('/');
      }
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChangesState) {
        event.preventDefault();
        event.returnValue = ''; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChangesState]);

  const handleCodeGeneration = async (prompt: string, currentCode?: string, currentFilePath?: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newCode = `// Generated code for: ${prompt}\n${currentCode || ''}\nconsole.log('AI generated update at ${new Date().toLocaleTimeString()}');`;
      if (currentFilePath && files.find(f => f.path === currentFilePath)) {
        updateFileContent(currentFilePath, newCode);
         toast({ title: "Code Updated", description: `${currentFilePath} updated by AI.` });
      } else if (currentFile) {
        updateFileContent(currentFile.path, newCode);
        toast({ title: "Code Updated", description: `${currentFile.name} updated by AI.` });
      } else {
         addFile("ai-generated.js", newCode, "javascript");
         toast({ title: "New File Added", description: `ai-generated.js created by AI.` });
      }
      setIframeKey(Date.now()); 
      setIsGenerating(false);
    }, 2000);
  };
  
  const handleRefreshPreview = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      saveAllFilesToStorage(); 
      iframeRef.current.contentWindow.location.reload();
      toast({ title: "Preview Reloaded", description: "The preview has been refreshed." });
    }
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleClearProjectFiles = () => { 
    const defaultFiles: FileType[] = [
        { name: "index.html", content: "<!DOCTYPE html><html><body><h1>Project Cleared</h1></body></html>", type: "html", path: "index.html", isFolder: false },
    ];
    setFiles(defaultFiles); 
    if (projectId) localStorage.setItem(`project_files_${projectId}`, JSON.stringify(defaultFiles)); 
    setCurrentFile(defaultFiles[0]);
    setIframeKey(Date.now());
    toast({ title: "Project Files Cleared (Simulation)", description: "The project has been reset to a blank state." });
  };

  if (isLoadingFilesState && !projectId) { 
    return <div className="flex items-center justify-center h-screen bg-background text-foreground"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mr-2"></div>Loading project...</div>;
  }
  if (!projectId) { 
     return <div className="flex items-center justify-center h-screen bg-background text-foreground">Error: Project ID is missing. Cannot load editor.</div>;
  }

  const editorPane = (
    <ResizablePanel defaultSize={35} minSize={20} collapsible collapsedSize={4} onCollapse={() => setSidebarCollapsed(true)} onExpand={() => setSidebarCollapsed(false)} className="h-full flex flex-col">
      {!sidebarCollapsed && (
        <>
          <FileExplorerEnhanced
            files={files}
            activeFile={currentFile}
            onSelectFile={(file) => setCurrentFile(file)}
            onAddFile={(name, type, parentPath) => addFile(name, `// New ${type} file: ${name}`, type, parentPath)}
            onAddDirectory={(name, parentPath) => addDirectory(name, parentPath)}
            onDelete={deleteFile}
            onRename={renameFile}
          />
          <Separator />
        </>
      )}
      <div className="p-2 flex items-center justify-between bg-muted/30 dark:bg-black/30 border-b border-border">
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                        {sidebarCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{sidebarCollapsed ? "Expand File Explorer" : "Collapse File Explorer"}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">{currentFile?.name || "No file selected"}</span>
           <Button variant="ghost" size="icon" onClick={saveAllFilesToStorage} disabled={!hasUnsavedChangesState} className={hasUnsavedChangesState ? "text-primary" : ""}>
              <Save className="h-4 w-4" />
              {hasUnsavedChangesState && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </Button>
      </div>
      <div className="flex-grow overflow-auto relative">
        {currentFile && !currentFile.isFolder ? (
          <CodeEditor
            key={currentFile.path}
            initialValue={currentFile.content}
            filePath={currentFile.path}
            onCodeChange={(newCode) => updateFileContent(currentFile.path, newCode)}
            editorRef={editorRef}
            theme={theme}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <CodeIcon className="w-16 h-16 mb-4" />
            <p>{currentFile && currentFile.isFolder ? `${currentFile.name} is a folder.` : 'Select a file to start editing or create a new one.'}</p>
          </div>
        )}
      </div>
    </ResizablePanel>
  );

  const aiInteractionPane = (
    <ResizablePanel defaultSize={30} minSize={20} className="h-full flex flex-col bg-card dark:bg-background/30">
      <div className="p-2 border-b border-border flex items-center justify-between bg-muted/20 dark:bg-black/20">
        <Tabs value={activeMainTab} onValueChange={(value) => setActiveMainTab(value as 'chat' | 'console')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 modern-tabs p-0.5 h-auto">
            <TabsTrigger value="chat" className="modern-tab text-xs px-2 py-1.5 h-auto">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> AI Chat
            </TabsTrigger>
            <TabsTrigger value="console" className="modern-tab text-xs px-2 py-1.5 h-auto">
              <Terminal className="h-3.5 w-3.5 mr-1.5" /> Console
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeMainTab === 'chat' ? (
        <div className="flex-grow flex flex-col p-3 overflow-y-auto relative">
          <div className="flex-grow"></div> 
          <GenerationStatus isGenerating={isGenerating} />
          <ModernPromptInput
            onGenerate={handleCodeGeneration}
            isGenerating={isGenerating}
            currentCode={currentFile?.content}
            currentFilePath={currentFile?.path}
          />
        </div>
      ) : (
        <div className="flex-grow overflow-hidden h-full">
          <ProjectConsole 
            projectId={projectId} 
            isAiThinking={isGenerating} 
            onClearProjectFiles={handleClearProjectFiles} 
          />
        </div>
      )}
    </ResizablePanel>
  );

  const previewPane = (
    <ResizablePanel defaultSize={35} minSize={20} className="h-full flex flex-col">
      <div className="p-2 border-b border-border flex items-center justify-between bg-muted/30 dark:bg-black/30">
        <PreviewSettings onRefresh={handleRefreshPreview} onTogglePreview={() => setShowPreview(!showPreview)} isPreviewVisible={showPreview} />
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => { /* Fullscreen logic */ }}>
                        <Expand className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Toggle Fullscreen Preview (Soon)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
                        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Toggle Theme</p></TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <PanelRightOpen className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Back to Projects</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {showPreview ? (
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={`/preview_frame.html?id=${projectId}&theme=${theme}`}
          title="Preview"
          className="w-full h-full border-none bg-background"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-background">
          <Eye className="w-16 h-16 mb-4" />
          <p>Preview is hidden.</p>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="mt-4">Show Preview</Button>
        </div>
      )}
    </ResizablePanel>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="flex-grow">
        {editorPane}
        <ResizableHandle withHandle />
        {aiInteractionPane}
        <ResizableHandle withHandle />
        {previewPane}
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;

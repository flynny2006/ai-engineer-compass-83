import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import CodeEditor, { CodeEditorProps } from '@/components/CodeEditor';
import FileExplorerEnhanced, { FileExplorerProps } from '@/components/FileExplorerEnhanced';
import ModernPromptInput, { ModernPromptInputProps } from '@/components/ModernPromptInput';
import PreviewSettings, { PreviewSettingsProps } from '@/components/PreviewSettings';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Terminal, PanelLeftOpen, PanelRightOpen, Save, Moon, Sun, Expand, CodeIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import ProjectConsole from '@/components/ProjectConsole';
import GenerationStatus, { GenerationStatusProps } from '@/components/GenerationStatus';
import { useTheme, Theme } from '@/hooks/use-theme';
import { createClientComponentClient } from '@supabase/auth-helpers-react';
import { Separator } from '@/components/ui/separator';

// Define a local, more complete FileType
interface LocalFileType {
  name: string;
  content: string;
  type: string; // e.g., 'html', 'css', 'javascript', 'folder'
  path: string; // Full path, e.g., "src/components/Button.tsx" or "src/utils"
  isFolder: boolean;
  children?: LocalFileType[]; // For folders
}

const getSupabase = () => {
  return createClientComponentClient();
};

const fetchFilesFromSupabase = async (projectId: string): Promise<LocalFileType[]> => {
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
        path: file.name, // Assuming 'name' from DB is the full path for now
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

const saveFileToSupabase = async (projectId: string, file: LocalFileType) => {
  try {
    const supabase = getSupabase();
    const fileToSave = {
      project_id: projectId,
      name: file.path, // Use path for the 'name' column in Supabase
      content: file.isFolder ? '' : file.content || '',
      type: file.isFolder ? 'folder' : file.type || 'text',
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

const deleteFileFromSupabase = async (projectId: string, filePath: string) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('project_files')
      .delete()
      .eq('project_id', projectId)
      .eq('name', filePath); // Assuming 'name' column stores the full path

    if (error) {
      console.error("Error deleting file from Supabase:", error);
    } else {
      console.log("File deleted from Supabase:", filePath);
    }
  } catch (error) {
    console.error("Unexpected error deleting file:", error);
  }
};

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);

  const [files, setFiles] = useState<LocalFileType[]>([]);
  const [currentFile, setCurrentFile] = useState<LocalFileType | null>(null);
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

  const addFile = (name: string, content: string, type: string, parentPath?: string): LocalFileType => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    const newFile: LocalFileType = { name, content, type, path, isFolder: false };
    setFiles(prevFiles => [...prevFiles, newFile]);
    setCurrentFile(newFile);
    setHasUnsavedChangesState(true);
    if (projectId) saveFileToSupabase(projectId, newFile); // Save new file
    return newFile;
  };
  
  const addDirectory = (name: string, parentPath?: string): LocalFileType => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    const newDir: LocalFileType = { name, content: '', type: 'folder', path, isFolder: true, children: [] };
    setFiles(prevFiles => [...prevFiles, newDir]);
    // Do not set current file to a directory for editing
    setHasUnsavedChangesState(true);
    if (projectId) saveFileToSupabase(projectId, newDir); // Save new directory
    return newDir;
  };

  const deleteFile = (filePath: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.path !== filePath && !f.path?.startsWith(`${filePath}/`)));
    if (currentFile?.path === filePath || currentFile?.path?.startsWith(`${filePath}/`)) {
      setCurrentFile(null);
    }
    setHasUnsavedChangesState(true); // This implies a change, so it should be true.
    if (projectId) deleteFileFromSupabase(projectId, filePath);
  };
  
  const renameFile = (oldPath: string, newName: string) => {
    // Basic rename, doesn't handle renaming in Supabase or children paths update yet.
    // This would require more complex logic if files are stored with full paths in DB.
    setFiles(prevFiles =>
      prevFiles.map(f => {
        if (f.path === oldPath) {
          const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + newName;
          // Here we'd also need to update Supabase: delete old, insert new, or update if PK allows.
          // And update paths of children if it's a folder.
          return { ...f, name: newName, path: newPath };
        }
        // TODO: If f.path starts with oldPath (it's a child), update its path too.
        return f;
      })
    );
    if (currentFile?.path === oldPath) {
       const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + newName;
       setCurrentFile(prev => prev ? { ...prev, name: newName, path: newPath } : null);
    }
    setHasUnsavedChangesState(true);
    // TODO: Implement Supabase rename (delete old, save new or specialized update)
  };

  const saveAllFilesToStorage = async () => {
    if (!projectId) return;
    console.log("Saving all files to Supabase for project:", projectId);
    setIsLoadingFilesState(true); // Indicate saving
    for (const file of files) {
      await saveFileToSupabase(projectId, file);
    }
    setHasUnsavedChangesState(false);
    setIsLoadingFilesState(false); // Done saving
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
            // Create default files if project is empty
            const defaultHtml: LocalFileType = { name: "index.html", content: "<!DOCTYPE html><html><body><h1>New Project</h1></body></html>", type: "html", path: "index.html", isFolder: false };
            const defaultCss: LocalFileType = { name: "style.css", content: "body { font-family: sans-serif; }", type: "css", path: "style.css", isFolder: false };
            const defaultJs: LocalFileType = { name: "script.js", content: "console.log('hello world')", type: "javascript", path: "script.js", isFolder: false };
            const defaultProjectFiles = [defaultHtml, defaultCss, defaultJs];
            setFiles(defaultProjectFiles);
            setCurrentFile(defaultHtml);
            // Save these default files to Supabase
            defaultProjectFiles.forEach(file => saveFileToSupabase(id, file));
            setHasUnsavedChangesState(false); // Initially no unsaved changes
          }
        })
        .catch(err => console.error("Failed to load files for project", id, err))
        .finally(() => setIsLoadingFilesState(false));
    } else {
      const currentProjectId = localStorage.getItem("current_project_id");
      if (currentProjectId) {
        navigate(`/project?id=${currentProjectId}`, { replace: true });
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

  const handleCodeGeneration = async (prompt: string, currentCodeParam?: string, currentFilePathParam?: string) => {
    setIsGenerating(true);
    // Use currentFile if params are not explicitly passed by ModernPromptInput
    const codeToUpdate = currentCodeParam ?? currentFile?.content ?? "";
    const filePathToUpdate = currentFilePathParam ?? currentFile?.path;

    setTimeout(() => {
      const newCode = `// Generated code for: ${prompt}\n${codeToUpdate}\nconsole.log('AI generated update at ${new Date().toLocaleTimeString()}');`;
      if (filePathToUpdate && files.find(f => f.path === filePathToUpdate)) {
        updateFileContent(filePathToUpdate, newCode);
         toast({ title: "Code Updated", description: `${filePathToUpdate} updated by AI.` });
      } else if (currentFile) { // Fallback to currentFile if filePathToUpdate was somehow invalid
        updateFileContent(currentFile.path, newCode);
        toast({ title: "Code Updated", description: `${currentFile.name} updated by AI.` });
      } else {
         const newFile = addFile("ai-generated.js", newCode, "javascript");
         // saveFileToSupabase already called in addFile
         toast({ title: "New File Added", description: `${newFile.name} created by AI.` });
      }
      setIframeKey(Date.now()); 
      setIsGenerating(false);
    }, 2000);
  };
  
  const handleRefreshPreview = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      saveAllFilesToStorage().then(() => { // Ensure save completes before reload
        if (iframeRef.current && iframeRef.current.contentWindow) { // Re-check due to async
            iframeRef.current.contentWindow.location.reload();
            toast({ title: "Preview Reloaded", description: "The preview has been refreshed." });
        }
      });
    }
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleClearProjectFiles = () => { 
    const defaultFile: LocalFileType = { 
        name: "index.html", 
        content: "<!DOCTYPE html><html><body><h1>Project Cleared</h1></body></html>", 
        type: "html", 
        path: "index.html", 
        isFolder: false 
    };
    setFiles([defaultFile]); 
    if (projectId) {
        // Clear existing files in Supabase for this project first (optional, depends on desired behavior)
        // For now, just save the new default file, potentially overwriting.
        saveFileToSupabase(projectId, defaultFile);
    }
    setCurrentFile(defaultFile);
    setIframeKey(Date.now());
    setHasUnsavedChangesState(false); // Project is now "saved" in its cleared state
    toast({ title: "Project Files Cleared", description: "The project has been reset to a blank state." });
  };

  if (isLoadingFilesState && projectId) { // Show loading only if projectId is set and loading
    return <div className="flex items-center justify-center h-screen bg-background text-foreground"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mr-2"></div>Loading project...</div>;
  }
  if (!projectId && !isLoadingFilesState) { // If no project ID and not loading (e.g., initial state or error)
     return <div className="flex items-center justify-center h-screen bg-background text-foreground">Error: Project ID is missing. Cannot load editor. Try returning to homepage.</div>;
  }

  const editorPane = (
    <ResizablePanel defaultSize={35} minSize={20} collapsible collapsedSize={4} onCollapse={() => setSidebarCollapsed(true)} onExpand={() => setSidebarCollapsed(false)} className="h-full flex flex-col">
      {!sidebarCollapsed && (
        <>
          <FileExplorerEnhanced
            files={files}
            currentFile={currentFile} // Pass currentFile for highlighting selected
            onSelectFile={(file) => setCurrentFile(file as LocalFileType)} // Ensure type cast if needed
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
           <Button variant="ghost" size="icon" onClick={saveAllFilesToStorage} disabled={!hasUnsavedChangesState || isLoadingFilesState} className={hasUnsavedChangesState ? "text-primary" : ""}>
              <Save className="h-4 w-4" />
              {hasUnsavedChangesState && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </Button>
      </div>
      <div className="flex-grow overflow-auto relative">
        {currentFile && !currentFile.isFolder ? (
          <CodeEditor
            key={currentFile.path} // Use path for key as it's unique
            value={currentFile.content} // Changed from initialValue
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
            currentCode={currentFile?.content || ""}
            currentFilePath={currentFile?.path || ""}
          />
        </div>
      ) : (
        <div className="flex-grow overflow-hidden h-full">
          <ProjectConsole 
            projectId={projectId!} // Assert projectId is non-null here as it's checked above
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
        <PreviewSettings 
            onRefresh={handleRefreshPreview} 
            onTogglePreview={() => setShowPreview(!showPreview)} 
            isPreviewVisible={showPreview} 
        />
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
                        <PanelRightOpen className="h-4 w-4" /> {/* Icon was PanelRightOpen */}
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

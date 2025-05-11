
import React, { useState } from "react";
import { Folder, File, Trash2, Edit, Plus, X, ArrowDown, ArrowUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileItem {
  name: string;
  content: string;
  type: string;
}

interface FileExplorerProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  currentFile: string;
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, setFiles, currentFile, setCurrentFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});
  const [newFileDialogOpen, setNewFileDialogOpen] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [renameFile, setRenameFile] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  // Extract folders from file names
  const getFolderStructure = () => {
    const structure: { [folder: string]: FileItem[] } = { "/": [] };
    
    files.forEach(file => {
      const pathSegments = file.name.split('/');
      const fileName = pathSegments.pop() || file.name;
      const folderPath = pathSegments.length > 0 ? pathSegments.join('/') : "/";
      
      if (!structure[folderPath]) {
        structure[folderPath] = [];
      }
      
      structure[folderPath].push({...file, name: fileName});
    });
    
    return structure;
  };

  const folderStructure = getFolderStructure();

  // Toggle folder expanded state
  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  // Handle file click
  const handleFileClick = (folder: string, file: FileItem) => {
    const fullPath = folder === "/" ? file.name : `${folder}/${file.name}`;
    setCurrentFile(fullPath);
  };

  // Create new file
  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "File name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (files.some(file => file.name === newFileName)) {
      toast({
        title: "Error",
        description: "A file with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    let fileType = "txt";
    const extension = newFileName.split('.').pop() || "";
    
    if (extension === "html") fileType = "html";
    else if (extension === "css") fileType = "css";
    else if (extension === "js") fileType = "js";
    else if (extension === "ts" || extension === "tsx") fileType = "ts";
    else if (extension === "json") fileType = "json";
    
    const newFile = {
      name: newFileName,
      content: newFileContent || "",
      type: fileType
    };
    
    setFiles(prev => [...prev, newFile]);
    setCurrentFile(newFileName);
    setNewFileDialogOpen(false);
    setNewFileName("");
    setNewFileContent("");
    
    toast({
      title: "Success",
      description: `File "${newFileName}" created`
    });
  };

  // Delete file
  const handleDeleteFile = (folder: string, file: FileItem) => {
    const fullPath = folder === "/" ? file.name : `${folder}/${file.name}`;
    
    if (confirm(`Are you sure you want to delete "${fullPath}"?`)) {
      setFiles(prev => prev.filter(f => f.name !== fullPath));
      
      if (currentFile === fullPath) {
        const firstAvailableFile = files.find(f => f.name !== fullPath);
        setCurrentFile(firstAvailableFile ? firstAvailableFile.name : "");
      }
      
      toast({
        title: "Success",
        description: `File "${fullPath}" deleted`
      });
    }
  };

  // Rename file
  const handleRenameFileClick = (folder: string, file: FileItem) => {
    const fullPath = folder === "/" ? file.name : `${folder}/${file.name}`;
    setRenameFile(fullPath);
    setNewName(fullPath);
    setRenameDialogOpen(true);
  };

  const handleRenameFile = () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "File name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (files.some(file => file.name === newName && file.name !== renameFile)) {
      toast({
        title: "Error",
        description: "A file with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    setFiles(prev => 
      prev.map(file => 
        file.name === renameFile 
        ? { ...file, name: newName } 
        : file
      )
    );
    
    if (currentFile === renameFile) {
      setCurrentFile(newName);
    }
    
    setRenameDialogOpen(false);
    
    toast({
      title: "Success",
      description: `File renamed to "${newName}"`
    });
  };

  // Render folder and its contents
  const renderFolder = (folderPath: string, files: FileItem[]) => {
    const isExpanded = expandedFolders[folderPath] ?? true;
    const folderName = folderPath === "/" ? "Root" : folderPath.split('/').pop() || folderPath;
    
    return (
      <div key={folderPath} className="mb-1">
        <div 
          onClick={() => toggleFolder(folderPath)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-muted cursor-pointer text-sm font-medium"
        >
          {isExpanded ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
          <Folder className="h-4 w-4 text-amber-500" />
          <span>{folderName}</span>
        </div>
        
        {isExpanded && (
          <div className="pl-4 border-l border-muted ml-2 mt-1">
            {files.map(file => (
              <div 
                key={file.name}
                className={cn(
                  "flex items-center justify-between gap-1 px-2 py-1 rounded text-sm",
                  currentFile === (folderPath === "/" ? file.name : `${folderPath}/${file.name}`) 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <div 
                  className="flex items-center gap-1 cursor-pointer flex-grow"
                  onClick={() => handleFileClick(folderPath, file)}
                >
                  <FileIcon type={file.type} />
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameFileClick(folderPath, file);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(folderPath, file);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render file icon based on type
  const FileIcon = ({ type }: { type: string }) => {
    const getIconColor = () => {
      switch (type) {
        case 'html': return 'text-orange-500';
        case 'css': return 'text-blue-500';
        case 'js': return 'text-yellow-500';
        case 'ts': return 'text-blue-600';
        case 'json': return 'text-gray-500';
        default: return 'text-gray-400';
      }
    };
    
    return <File className={`h-4 w-4 ${getIconColor()}`} />;
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-2 flex justify-between items-center sticky top-0 bg-background z-10 border-b">
        <h3 className="text-sm font-medium">Files</h3>
        <Button variant="ghost" size="sm" onClick={() => setNewFileDialogOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-2">
        {Object.entries(folderStructure).map(([folder, files]) => 
          renderFolder(folder, files)
        )}
      </div>
      
      {/* Create File Dialog */}
      <Dialog open={newFileDialogOpen} onOpenChange={setNewFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="filename" className="text-sm font-medium">File Name</label>
              <Input
                id="filename"
                placeholder="example.js"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Initial Content (optional)</label>
              <textarea
                id="content"
                className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="// Add your code here"
                value={newFileContent}
                onChange={(e) => setNewFileContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFileDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rename File Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="newname" className="text-sm font-medium">New Name</label>
              <Input
                id="newname"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameFile}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileExplorer;

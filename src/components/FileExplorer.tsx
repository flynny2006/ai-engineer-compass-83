
import React, { useState, useRef } from "react";
import { Folder, File, Trash2, Edit, Plus, X, ArrowDown, ArrowUp, FolderPlus, Move, Copy } from "lucide-react";
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
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [renameFile, setRenameFile] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  
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

  // Get all folder paths
  const getAllFolders = () => {
    const folders = new Set<string>(["/"]); // Root folder always exists
    
    files.forEach(file => {
      const pathSegments = file.name.split('/');
      pathSegments.pop(); // Remove filename
      
      let currentPath = "";
      pathSegments.forEach(segment => {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        folders.add(currentPath);
      });
    });
    
    return Array.from(folders);
  };

  const folderStructure = getFolderStructure();
  const allFolders = getAllFolders();

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
    
    const fullPath = currentPath === "/" 
      ? newFileName 
      : `${currentPath}/${newFileName}`;
    
    if (files.some(file => file.name === fullPath)) {
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
      name: fullPath,
      content: newFileContent || "",
      type: fileType
    };
    
    setFiles(prev => [...prev, newFile]);
    setCurrentFile(fullPath);
    setNewFileDialogOpen(false);
    setNewFileName("");
    setNewFileContent("");
    
    toast({
      title: "Success",
      description: `File "${fullPath}" created`
    });
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    const fullPath = currentPath === "/" 
      ? newFolderName 
      : `${currentPath}/${newFolderName}`;
    
    // Check if folder already exists
    if (allFolders.includes(fullPath)) {
      toast({
        title: "Error",
        description: "A folder with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    // Create an empty file as placeholder to establish folder structure
    // This is just a way to represent the folder since we're tracking folders through files
    const placeholderFile = {
      name: `${fullPath}/.gitkeep`,
      content: "",
      type: "txt"
    };
    
    setFiles(prev => [...prev, placeholderFile]);
    setNewFolderDialogOpen(false);
    setNewFolderName("");
    
    // Expand the parent folder
    setExpandedFolders(prev => ({
      ...prev,
      [currentPath]: true,
    }));
    
    toast({
      title: "Success",
      description: `Folder "${fullPath}" created`
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

  // Delete folder
  const handleDeleteFolder = (folderPath: string) => {
    if (confirm(`Are you sure you want to delete folder "${folderPath}" and all its contents?`)) {
      // Delete all files that start with this folder path
      setFiles(prev => prev.filter(f => !f.name.startsWith(`${folderPath}/`)));
      
      toast({
        title: "Success",
        description: `Folder "${folderPath}" deleted`
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

  // Duplicate file
  const handleDuplicateFile = (folder: string, file: FileItem) => {
    const fullPath = folder === "/" ? file.name : `${folder}/${file.name}`;
    const pathParts = fullPath.split('/');
    const fileName = pathParts.pop() || '';
    const fileNameWithoutExt = fileName.includes('.') ? fileName.split('.').slice(0, -1).join('.') : fileName;
    const extension = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';
    const folderPath = pathParts.join('/');
    
    const newFileName = `${fileNameWithoutExt}_copy${extension}`;
    const newFullPath = folderPath ? `${folderPath}/${newFileName}` : newFileName;
    
    // Check if the duplicate name already exists and create a unique name
    let counter = 1;
    let uniquePath = newFullPath;
    
    while (files.some(f => f.name === uniquePath)) {
      const uniqueName = `${fileNameWithoutExt}_copy_${counter}${extension}`;
      uniquePath = folderPath ? `${folderPath}/${uniqueName}` : uniqueName;
      counter++;
    }
    
    const duplicatedFile = {
      name: uniquePath,
      content: file.content,
      type: file.type
    };
    
    setFiles(prev => [...prev, duplicatedFile]);
    
    toast({
      title: "Success",
      description: `File duplicated as "${uniquePath}"`
    });
  };

  // Duplicate folder
  const handleDuplicateFolder = (folderPath: string) => {
    // Generate a unique name for the duplicated folder
    const folderName = folderPath.split('/').pop() || folderPath;
    const parentPath = folderPath.split('/').slice(0, -1).join('/');
    const newFolderName = `${folderName}_copy`;
    const newFolderPath = parentPath ? `${parentPath}/${newFolderName}` : newFolderName;
    
    // Check if the folder name already exists
    let counter = 1;
    let uniquePath = newFolderPath;
    
    while (allFolders.includes(uniquePath)) {
      uniquePath = parentPath ? `${parentPath}/${folderName}_copy_${counter}` : `${folderName}_copy_${counter}`;
      counter++;
    }
    
    // Get all files in this folder and its subfolders
    const folderFiles = files.filter(file => file.name.startsWith(`${folderPath}/`));
    
    // Create duplicates with the new path
    const duplicatedFiles = folderFiles.map(file => {
      const relativePath = file.name.substring(folderPath.length + 1);
      return {
        name: `${uniquePath}/${relativePath}`,
        content: file.content,
        type: file.type
      };
    });
    
    if (duplicatedFiles.length === 0) {
      // If folder was empty, create a placeholder file
      duplicatedFiles.push({
        name: `${uniquePath}/.gitkeep`,
        content: "",
        type: "txt"
      });
    }
    
    setFiles(prev => [...prev, ...duplicatedFiles]);
    
    // Expand the parent folder
    if (parentPath) {
      setExpandedFolders(prev => ({
        ...prev,
        [parentPath]: true,
      }));
    } else {
      setExpandedFolders(prev => ({
        ...prev,
        "/": true,
      }));
    }
    
    toast({
      title: "Success",
      description: `Folder duplicated as "${uniquePath}"`
    });
  };
  
  // Drag and drop handlers
  const handleDragStart = (fullPath: string) => {
    setDraggedItem(fullPath);
  };
  
  const handleDragOver = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    setDragOverFolder(folderPath);
  };
  
  const handleDragLeave = () => {
    setDragOverFolder(null);
  };
  
  const handleDrop = (e: React.DragEvent, targetFolder: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    
    if (!draggedItem) return;
    
    // Check if we're trying to move an item into itself
    if (targetFolder === draggedItem || targetFolder.startsWith(`${draggedItem}/`)) {
      toast({
        title: "Error",
        description: "Cannot move a folder into itself",
        variant: "destructive"
      });
      return;
    }
    
    // Determine if we're moving a file or folder
    const isFolder = files.some(file => file.name.startsWith(`${draggedItem}/`));
    
    if (isFolder) {
      // Move folder and all its contents
      const newFiles = [...files];
      const foldersToUpdate = files.filter(file => file.name.startsWith(`${draggedItem}/`));
      
      foldersToUpdate.forEach(file => {
        const relativePath = file.name.substring(draggedItem.length + 1);
        const newPath = targetFolder === "/" 
          ? `${targetFolder}${draggedItem.split("/").pop()}/${relativePath}` 
          : `${targetFolder}/${draggedItem.split("/").pop()}/${relativePath}`;
        
        const fileIndex = newFiles.findIndex(f => f.name === file.name);
        if (fileIndex !== -1) {
          newFiles[fileIndex] = { ...file, name: newPath };
        }
      });
      
      setFiles(newFiles);
    } else {
      // Move a single file
      const fileName = draggedItem.split("/").pop() || "";
      const newPath = targetFolder === "/" 
        ? fileName 
        : `${targetFolder}/${fileName}`;
      
      if (files.some(file => file.name === newPath)) {
        toast({
          title: "Error",
          description: "A file with this name already exists in the target folder",
          variant: "destructive"
        });
        return;
      }
      
      setFiles(prev => 
        prev.map(file => 
          file.name === draggedItem 
          ? { ...file, name: newPath } 
          : file
        )
      );
      
      if (currentFile === draggedItem) {
        setCurrentFile(newPath);
      }
    }
    
    toast({
      title: "Success",
      description: `Moved item to ${targetFolder}`
    });
    
    setDraggedItem(null);
  };

  // Render folder and its contents
  const renderFolder = (folderPath: string, files: FileItem[]) => {
    const isExpanded = expandedFolders[folderPath] ?? true;
    const folderName = folderPath === "/" ? "Root" : folderPath.split('/').pop() || folderPath;
    
    // Sort items: folders first, then files alphabetically
    const sortedItems = [...files].sort((a, b) => {
      const isAFolder = files.some(file => file.name.startsWith(`${folderPath === "/" ? "" : folderPath + "/"}${a.name}/`));
      const isBFolder = files.some(file => file.name.startsWith(`${folderPath === "/" ? "" : folderPath + "/"}${b.name}/`));
      
      if (isAFolder && !isBFolder) return -1;
      if (!isAFolder && isBFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    
    return (
      <div 
        key={folderPath} 
        className="mb-1"
        onDragOver={(e) => handleDragOver(e, folderPath)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, folderPath)}
      >
        <div 
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded hover:bg-muted cursor-pointer text-sm font-medium",
            dragOverFolder === folderPath && "bg-accent"
          )}
        >
          <div 
            className="flex items-center gap-1 flex-grow"
            onClick={() => toggleFolder(folderPath)}
          >
            {isExpanded ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
            <Folder className="h-4 w-4 text-amber-500" />
            <span>{folderName}</span>
          </div>
          
          <div className="flex items-center">
            {folderPath !== "/" && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateFolder(folderPath);
                  }}
                  title="Duplicate folder"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-red-500" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folderPath);
                  }}
                  title="Delete folder"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPath(folderPath);
                setNewFileDialogOpen(true);
              }}
              title="New file"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPath(folderPath);
                setNewFolderDialogOpen(true);
              }}
              title="New folder"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="pl-4 border-l border-muted ml-2 mt-1">
            {sortedItems.map(file => {
              // Skip .gitkeep files
              if (file.name === ".gitkeep") return null;
              
              const fullPath = folderPath === "/" ? file.name : `${folderPath}/${file.name}`;
              const isFileFolder = allFolders.includes(fullPath);
              
              // If it's a folder, render a folder component
              if (isFileFolder) {
                const folderFiles = files.filter(f => {
                  const pathParts = f.name.split('/');
                  return pathParts.length > 1 && pathParts[0] === file.name;
                }).map(f => {
                  const nameParts = f.name.split('/');
                  return {
                    ...f,
                    name: nameParts.slice(1).join('/')
                  };
                });
                
                return renderFolder(fullPath, folderFiles);
              }
              
              // Otherwise render a file
              return (
                <div 
                  key={file.name}
                  className={cn(
                    "flex items-center justify-between gap-1 px-2 py-1 rounded text-sm",
                    currentFile === (folderPath === "/" ? file.name : `${folderPath}/${file.name}`) 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted"
                  )}
                  draggable
                  onDragStart={() => handleDragStart(fullPath)}
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
                        handleDuplicateFile(folderPath, file);
                      }}
                      title="Duplicate file"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameFileClick(folderPath, file);
                      }}
                      title="Rename file"
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
                      title="Delete file"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
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
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => {
            setCurrentPath("/");
            setNewFolderDialogOpen(true);
          }}>
            <FolderPlus className="h-4 w-4 mr-1" />
            Folder
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            setCurrentPath("/");
            setNewFileDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-1" />
            File
          </Button>
        </div>
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
              <label htmlFor="folderpath" className="text-sm font-medium">Location</label>
              <Input
                id="folderpath"
                value={currentPath}
                readOnly
                disabled
              />
            </div>
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
      
      {/* Create Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="folderPathParent" className="text-sm font-medium">Location</label>
              <Input
                id="folderPathParent"
                value={currentPath}
                readOnly
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="foldername" className="text-sm font-medium">Folder Name</label>
              <Input
                id="foldername"
                placeholder="my-folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
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

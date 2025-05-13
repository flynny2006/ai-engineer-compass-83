
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { File, Plus, Folder, Trash, Edit, Copy, Download, Save, X, Eye } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileType {
  name: string;
  content: string;
  type: string;
}

interface FileExplorerProps {
  files: FileType[];
  setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
  currentFile: string;
  setCurrentFile: React.Dispatch<React.SetStateAction<string>>;
  mainPreviewFile?: string;
  setMainPreviewFile?: React.Dispatch<React.SetStateAction<string>>;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  setFiles,
  currentFile,
  setCurrentFile,
  mainPreviewFile,
  setMainPreviewFile
}) => {
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameFileName, setRenameFileName] = useState('');
  const [fileToRename, setFileToRename] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCreateFile = () => {
    if (!newFileName) {
      toast({
        title: "Error",
        description: "File name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if file already exists
    if (files.some(file => file.name === newFileName)) {
      toast({
        title: "Error",
        description: `File '${newFileName}' already exists`,
        variant: "destructive",
      });
      return;
    }

    // Determine file type
    const extension = newFileName.split('.').pop() || '';
    let fileType = 'text';
    
    if (extension === 'html') fileType = 'html';
    else if (extension === 'css') fileType = 'css';
    else if (extension === 'js') fileType = 'js';
    else if (extension === 'json') fileType = 'json';
    else if (['ts', 'tsx'].includes(extension)) fileType = 'ts';

    // Create new file
    const newFile = {
      name: newFileName,
      content: newFileContent || getDefaultContent(fileType),
      type: fileType
    };

    setFiles([...files, newFile]);
    setCurrentFile(newFileName);
    setShowNewFileDialog(false);
    setNewFileName('');
    setNewFileContent('');

    toast({
      title: "Success",
      description: `File '${newFileName}' created`,
    });
  };

  const handleRenameFile = () => {
    if (!renameFileName) {
      toast({
        title: "Error",
        description: "File name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if file already exists
    if (files.some(file => file.name === renameFileName)) {
      toast({
        title: "Error",
        description: `File '${renameFileName}' already exists`,
        variant: "destructive",
      });
      return;
    }

    // Rename file
    const updatedFiles = files.map(file => {
      if (file.name === fileToRename) {
        return {
          ...file,
          name: renameFileName,
          type: renameFileName.split('.').pop() || file.type
        };
      }
      return file;
    });

    setFiles(updatedFiles);
    
    // Update current file if it's the renamed file
    if (currentFile === fileToRename) {
      setCurrentFile(renameFileName);
    }
    
    // Update preview file if needed
    if (mainPreviewFile === fileToRename && setMainPreviewFile) {
      setMainPreviewFile(renameFileName);
    }
    
    setShowRenameDialog(false);
    setRenameFileName('');
    setFileToRename('');

    toast({
      title: "Success",
      description: `File renamed to '${renameFileName}'`,
    });
  };

  const handleDeleteFile = () => {
    // Cannot delete if only one file is left
    if (files.length <= 1) {
      toast({
        title: "Error",
        description: "Cannot delete the last file",
        variant: "destructive",
      });
      return;
    }

    // Find another file to set as current if deleting the current file
    let newCurrentFile = currentFile;
    if (currentFile === fileToDelete) {
      newCurrentFile = files.find(file => file.name !== fileToDelete)?.name || '';
    }

    // Update preview file if needed
    if (mainPreviewFile === fileToDelete && setMainPreviewFile) {
      setMainPreviewFile(newCurrentFile);
    }

    // Delete file
    setFiles(files.filter(file => file.name !== fileToDelete));
    setCurrentFile(newCurrentFile);
    setShowDeleteConfirmation(false);
    setFileToDelete('');

    toast({
      title: "Success",
      description: `File '${fileToDelete}' deleted`,
    });
  };

  const handleDuplicateFile = (fileName: string) => {
    const fileToClone = files.find(file => file.name === fileName);
    if (!fileToClone) return;

    // Generate a new name
    let baseName = fileName;
    let extension = '';
    
    if (fileName.includes('.')) {
      const lastDotIndex = fileName.lastIndexOf('.');
      baseName = fileName.substring(0, lastDotIndex);
      extension = fileName.substring(lastDotIndex);
    }
    
    let newName = `${baseName}_copy${extension}`;
    let counter = 1;
    
    while (files.some(file => file.name === newName)) {
      newName = `${baseName}_copy${counter}${extension}`;
      counter++;
    }

    // Create duplicated file
    const newFile = {
      name: newName,
      content: fileToClone.content,
      type: fileToClone.type
    };

    setFiles([...files, newFile]);
    setCurrentFile(newName);

    toast({
      title: "Success",
      description: `File duplicated as '${newName}'`,
    });
  };

  const handleDownloadFile = (fileName: string) => {
    const file = files.find(file => file.name === fileName);
    if (!file) return;

    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const getDefaultContent = (fileType: string): string => {
    switch (fileType) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;
      case 'css':
        return `/* Add your styles here */
`;
      case 'js':
        return `// Add your JavaScript code here
`;
      case 'json':
        return `{
  
}`;
      case 'ts':
        return `// Add your TypeScript code here
`;
      default:
        return '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop() || '';
    
    switch (ext) {
      case 'html':
        return <File className="h-4 w-4 text-orange-500" />;
      case 'css':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'js':
        return <File className="h-4 w-4 text-yellow-500" />;
      case 'json':
        return <File className="h-4 w-4 text-green-500" />;
      case 'ts':
      case 'tsx':
        return <File className="h-4 w-4 text-blue-600" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return a.type.localeCompare(b.type);
    }
  });

  const filteredFiles = sortedFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Files</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewFileDialog(true)}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4 mr-1" /> New File
          </Button>
        </div>
        
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-sm"
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{files.length} files</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                Sort: {sortBy === 'name' ? 'Name' : 'Type'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Sort by name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('type')}>
                Sort by type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No files found
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredFiles.map((file) => (
              <ContextMenu key={file.name}>
                <ContextMenuTrigger>
                  <li
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer",
                      currentFile === file.name
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setCurrentFile(file.name)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {getFileIcon(file.name)}
                      <span className="truncate">{file.name}</span>
                    </div>
                    {mainPreviewFile === file.name && (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </li>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem
                    onClick={() => {
                      setCurrentFile(file.name);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </ContextMenuItem>
                  
                  <ContextMenuItem
                    onClick={() => {
                      if (setMainPreviewFile) {
                        setMainPreviewFile(file.name);
                        toast({
                          title: "Preview Updated",
                          description: `Set ${file.name} as the preview file`,
                        });
                      }
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Set as Preview
                  </ContextMenuItem>
                  
                  <ContextMenuSeparator />
                  
                  <ContextMenuItem
                    onClick={() => {
                      setFileToRename(file.name);
                      setRenameFileName(file.name);
                      setShowRenameDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </ContextMenuItem>
                  
                  <ContextMenuItem
                    onClick={() => handleDuplicateFile(file.name)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </ContextMenuItem>
                  
                  <ContextMenuItem
                    onClick={() => handleDownloadFile(file.name)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </ContextMenuItem>
                  
                  <ContextMenuSeparator />
                  
                  <ContextMenuItem
                    onClick={() => {
                      setFileToDelete(file.name);
                      setShowDeleteConfirmation(true);
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </ul>
        )}
      </div>

      {/* New File Dialog */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new file</DialogTitle>
            <DialogDescription>
              Enter a name for the new file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">File Name</label>
              <Input
                placeholder="example.html"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename file</DialogTitle>
            <DialogDescription>
              Enter a new name for {fileToRename}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">New File Name</label>
              <Input
                placeholder="example.html"
                value={renameFileName}
                onChange={(e) => setRenameFileName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFile}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete file</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {fileToDelete}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileExplorer;

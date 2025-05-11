
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { File, Folder, Search, Copy, Trash } from "lucide-react";

interface FileItem {
  name: string;
  content: string;
  type: string;
}

interface EnhancedFileExplorerProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  currentFile: string;
  setCurrentFile: (file: string) => void;
}

const EnhancedFileExplorer: React.FC<EnhancedFileExplorerProps> = ({ 
  files, 
  setFiles, 
  currentFile, 
  setCurrentFile 
}) => {
  const [newFileName, setNewFileName] = useState<string>("");
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>("html");
  const [folders, setFolders] = useState<string[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = useState<boolean>(false);
  const [folderToDelete, setFolderToDelete] = useState<string>("");
  const [fileToDuplicate, setFileToDuplicate] = useState<string | null>(null);
  const [folderToDuplicate, setFolderToDuplicate] = useState<string | null>(null);
  
  // Extract folders from file paths
  useEffect(() => {
    const extractedFolders = new Set<string>();
    
    files.forEach(file => {
      const filePath = file.name;
      const parts = filePath.split('/');
      
      if (parts.length > 1) {
        // Extract all folder levels
        let currentPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath += (i > 0 ? "/" : "") + parts[i];
          extractedFolders.add(currentPath);
        }
      }
    });
    
    setFolders(Array.from(extractedFolders).sort());
  }, [files]);

  // Filter files and folders based on search query
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (fileName: string) => {
    setCurrentFile(fileName);
  };

  const createNewFile = () => {
    if (!newFileName) return;
    
    const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.${fileType}`;
    
    if (files.some(f => f.name === fileName)) {
      toast({
        title: "Error",
        description: "A file with this name already exists.",
        variant: "destructive"
      });
      return;
    }
    
    let initialContent = "";
    switch (fileType) {
      case "html":
        initialContent = "<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>New Page</h1>\n</body>\n</html>";
        break;
      case "css":
        initialContent = "/* CSS Styles */";
        break;
      case "js":
        initialContent = "// JavaScript Code";
        break;
      default:
        initialContent = "";
    }
    
    const newFile = {
      name: fileName,
      content: initialContent,
      type: fileType
    };
    
    setFiles(prev => [...prev, newFile]);
    setCurrentFile(fileName);
    setNewFileName("");
    setIsCreatingFile(false);
    
    toast({
      title: "File Created",
      description: `Created new file: ${fileName}`
    });
  };

  const createNewFolder = () => {
    if (!newFolderName) return;
    
    if (folders.includes(newFolderName)) {
      toast({
        title: "Error",
        description: "A folder with this name already exists.",
        variant: "destructive"
      });
      return;
    }
    
    setFolders(prev => [...prev, newFolderName].sort());
    setNewFolderName("");
    setIsCreatingFolder(false);
    
    toast({
      title: "Folder Created",
      description: `Created new folder: ${newFolderName}`
    });
  };

  const isFileInFolder = (fileName: string, folderPath: string) => {
    return fileName.startsWith(folderPath + '/');
  };

  const getFilesInFolder = (folderPath: string) => {
    return files.filter(file => isFileInFolder(file.name, folderPath));
  };

  const confirmDeleteFolder = (folder: string) => {
    setFolderToDelete(folder);
    setShowDeleteFolderDialog(true);
  };

  const deleteFolder = () => {
    const filesInFolder = files.filter(file => !file.name.startsWith(folderToDelete + '/'));
    const foldersWithoutDeleted = folders.filter(f => f !== folderToDelete && !f.startsWith(folderToDelete + '/'));
    
    setFiles(filesInFolder);
    setFolders(foldersWithoutDeleted);
    
    if (currentFile && currentFile.startsWith(folderToDelete + '/')) {
      setCurrentFile(files[0]?.name || "");
    }
    
    setShowDeleteFolderDialog(false);
    setFolderToDelete("");
    
    toast({
      title: "Folder Deleted",
      description: `Deleted folder: ${folderToDelete}`
    });
  };

  const duplicateFile = (fileName: string) => {
    const fileObj = files.find(f => f.name === fileName);
    if (!fileObj) return;
    
    const nameParts = fileName.split('.');
    const extension = nameParts.pop();
    const baseName = nameParts.join('.');
    const newFileName = `${baseName}_copy.${extension}`;
    
    setFiles(prev => [...prev, {
      ...fileObj,
      name: newFileName
    }]);
    
    toast({
      title: "File Duplicated",
      description: `Duplicated to: ${newFileName}`
    });
  };

  const duplicateFolder = (folderPath: string) => {
    const newFolderPath = `${folderPath}_copy`;
    const filesInFolder = getFilesInFolder(folderPath);
    
    const newFiles = filesInFolder.map(file => {
      const relativePath = file.name.replace(folderPath, '');
      return {
        ...file,
        name: `${newFolderPath}${relativePath}`
      };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    setFolders(prev => [...prev, newFolderPath].sort());
    
    toast({
      title: "Folder Duplicated",
      description: `Duplicated to: ${newFolderPath}`
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search files & folders..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-sm"
        />
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-4">
          {/* Folders */}
          {filteredFolders.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Folders</h3>
              <ul className="space-y-1">
                {filteredFolders.map(folder => (
                  <li key={folder} className="flex items-center justify-between group">
                    <div className="flex items-center file-explorer-item flex-1">
                      <Folder className="h-4 w-4 mr-2 file-folder" />
                      <span className="text-sm">{folder}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => duplicateFolder(folder)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive" 
                        onClick={() => confirmDeleteFolder(folder)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Files */}
          <div>
            <h3 className="text-sm font-medium mb-1">Files</h3>
            <ul className="space-y-1">
              {filteredFiles.map(file => (
                <li 
                  key={file.name}
                  className={`flex items-center justify-between group ${
                    file.name === currentFile ? "file-explorer-item active" : "file-explorer-item"
                  }`}
                  onClick={() => handleFileClick(file.name)}
                >
                  <div className="flex items-center flex-1">
                    <File className={`h-4 w-4 mr-2 ${
                      file.name.endsWith('.html') ? "file-html" :
                      file.name.endsWith('.css') ? "file-css" :
                      file.name.endsWith('.js') ? "file-js" :
                      file.name.endsWith('.ts') || file.name.endsWith('.tsx') ? "file-ts" :
                      file.name.endsWith('.json') ? "file-json" : ""
                    }`} />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateFile(file.name);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Create New File/Folder */}
      <div className="p-2 border-t">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setIsCreatingFile(true)}
          >
            New File
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setIsCreatingFolder(true)}
          >
            New Folder
          </Button>
        </div>
      </div>
      
      {isCreatingFile && (
        <div className="p-2 border-t">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="File name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-2">
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>
              <Button 
                size="sm" 
                onClick={createNewFile}
              >
                Create
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsCreatingFile(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {isCreatingFolder && (
        <div className="p-2 border-t">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={createNewFolder}
              >
                Create
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsCreatingFolder(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Folder Dialog */}
      <AlertDialog open={showDeleteFolderDialog} onOpenChange={setShowDeleteFolderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder and all its contents? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteFolder} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedFileExplorer;

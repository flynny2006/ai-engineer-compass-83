
import React, { useState } from 'react';
import { Download, File, FolderOpen, Trash, Plus, Edit, Save, FileText, Code, FileJson, FilePen, Copy, Folder, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';

interface FileExplorerProps {
  files: {
    name: string;
    content: string;
    type: string;
    path?: string;
  }[];
  setFiles: React.Dispatch<React.SetStateAction<{
    name: string;
    content: string;
    type: string;
    path?: string;
  }[]>>;
  currentFile: string;
  setCurrentFile: React.SetStateAction<any>;
}

const FileExplorerEnhanced: React.FC<FileExplorerProps> = ({
  files,
  setFiles,
  currentFile,
  setCurrentFile
}) => {
  const [newFileName, setNewFileName] = useState<string>('');
  const [isAddingFile, setIsAddingFile] = useState<boolean>(false);
  const [isRenamingFile, setIsRenamingFile] = useState<boolean>(false);
  const [fileToRename, setFileToRename] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [isAddingFolder, setIsAddingFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  
  // Get all unique folders from file paths
  const getFolders = () => {
    const folders = new Set<string>();
    files.forEach(file => {
      if (file.path) {
        // Get all parent folders
        const parts = file.path.split('/');
        let currentPath = '';
        for (let i = 0; i < parts.length; i++) {
          if (currentPath) {
            currentPath += '/';
          }
          currentPath += parts[i];
          folders.add(currentPath);
        }
      }
    });
    return Array.from(folders);
  };
  
  // Toggle folder expansion
  const toggleFolder = (folder: string) => {
    if (expandedFolders.includes(folder)) {
      setExpandedFolders(expandedFolders.filter(f => f !== folder && !f.startsWith(folder + '/')));
    } else {
      setExpandedFolders([...expandedFolders, folder]);
    }
  };
  
  // Check if file is in expanded folder
  const isInExpandedFolder = (filePath?: string) => {
    if (!filePath) return true; // Root files
    const parts = filePath.split('/');
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      if (currentPath) {
        currentPath += '/';
      }
      currentPath += parts[i];
      if (!expandedFolders.includes(currentPath)) {
        return false;
      }
    }
    return true;
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.html')) return <Code className="h-4 w-4 text-orange-500" />;
    if (fileName.endsWith('.css')) return <Code className="h-4 w-4 text-blue-500" />;
    if (fileName.endsWith('.js')) return <Code className="h-4 w-4 text-yellow-500" />;
    if (fileName.endsWith('.json')) return <FileJson className="h-4 w-4 text-green-500" />;
    if (fileName.endsWith('.md')) return <FilePen className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4" />;
  };

  const addNewFile = () => {
    if (!newFileName) {
      toast({
        title: "Error",
        description: "Please enter a file name",
        variant: "destructive"
      });
      return;
    }

    // Check if file name already exists
    if (files.some(file => file.name === newFileName)) {
      toast({
        title: "Error",
        description: "File already exists",
        variant: "destructive"
      });
      return;
    }

    // Get file extension
    const fileExt = newFileName.split('.').pop() || "";
    let fileType = "text";
    let defaultContent = "";

    // Set default content based on file type
    if (fileExt === 'html') {
      fileType = 'html';
      defaultContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Page</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 font-sans antialiased text-gray-900">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gradient-primary mb-6">Hello World</h1>
    <p class="text-lg mb-4">This is a new page built with modern design principles.</p>
    <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
      <h2 class="text-xl font-semibold mb-3">Beautiful Tailwind Components</h2>
      <p>Create stunning, responsive layouts with minimal effort.</p>
    </div>
  </div>
</body>
</html>`;
    } else if (fileExt === 'css') {
      fileType = 'css';
      defaultContent = `/* Modern Tailwind-inspired CSS */
:root {
  --primary: #8B5CF6;
  --primary-light: #A78BFA;
  --secondary: #EC4899;
  --accent: #0EA5E9;
  --background: #F9FAFB;
  --foreground: #1F2937;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  color: var(--foreground);
  background-color: var(--background);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.text-gradient-primary {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.3);
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}`;
    } else if (fileExt === 'js') {
      fileType = 'js';
      defaultContent = `// Modern JavaScript with animations and effects
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add fade-in animation to elements
  const animateElements = document.querySelectorAll('.animate-fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });

  // Interactive hover effects
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('card-active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('card-active');
    });
  });

  // Dynamic theme toggling
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('dark-mode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  }
});`;
    } else if (fileExt === 'json') {
      fileType = 'json';
      defaultContent = `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A beautiful web project with modern design",
  "keywords": [
    "web",
    "responsive",
    "modern",
    "design"
  ],
  "author": "Boongle AI User",
  "license": "MIT",
  "dependencies": {
    "tailwindcss": "^3.3.0",
    "alpinejs": "^3.10.5",
    "gsap": "^3.11.4"
  }
}`;
    } else if (fileExt === 'md') {
      fileType = 'md';
      defaultContent = `# New Document

## Overview
This is a modern, responsive web project created with Boongle AI.

## Features
- Beautiful, responsive design
- Modern UI components
- Tailwind CSS styling
- Interactive elements
- Cross-browser compatibility

## Getting Started
1. Open the index.html file in your browser
2. Explore the interactive components
3. Customize the content to your needs

## Design Principles
This project follows modern design principles with:
- Clean typography
- Proper spacing and hierarchy
- Consistent color palette
- Smooth animations
- Intuitive user interface

## Technologies
- HTML5
- CSS3 with Tailwind
- Modern JavaScript
- Responsive design

## License
This project is open-source and can be used for any purpose.`;
    }

    const newFile = {
      name: newFileName,
      content: defaultContent,
      type: fileType
    };

    setFiles([...files, newFile]);
    setCurrentFile(newFileName);
    setNewFileName('');
    setIsAddingFile(false);

    toast({
      title: "File Created",
      description: `${newFileName} has been created`
    });
  };
  
  // Add folder
  const addNewFolder = () => {
    if (!newFolderName) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive"
      });
      return;
    }
    
    // Create a placeholder file in the folder to make sure it exists
    const placeholderFile = {
      name: ".folder",
      content: "# This is a folder placeholder",
      type: "md",
      path: newFolderName
    };
    
    setFiles([...files, placeholderFile]);
    setNewFolderName('');
    setIsAddingFolder(false);
    setExpandedFolders([...expandedFolders, newFolderName]);
    
    toast({
      title: "Folder Created",
      description: `${newFolderName} folder has been created`
    });
  };
  
  // Delete folder
  const deleteFolder = (folderPath: string) => {
    if (window.confirm(`Are you sure you want to delete the folder ${folderPath} and all its contents?`)) {
      // Filter out all files that are in this folder or subfolder
      const updatedFiles = files.filter(file => !file.path || !file.path.startsWith(folderPath));
      
      setFiles(updatedFiles);
      setExpandedFolders(expandedFolders.filter(folder => folder !== folderPath && !folder.startsWith(folderPath + '/')));
      
      toast({
        title: "Folder Deleted",
        description: `${folderPath} folder and its contents have been deleted`
      });
    }
  };

  // Duplicate a file
  const duplicateFile = (file: { name: string; content: string; type: string; path?: string }) => {
    // Generate a new name (add '-copy' before extension)
    const nameParts = file.name.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');
    const newName = `${baseName}-copy.${ext}`;
    
    // Check if the new name already exists
    if (files.some(f => f.name === newName && f.path === file.path)) {
      toast({
        title: "Error",
        description: `${newName} already exists`,
        variant: "destructive"
      });
      return;
    }
    
    const duplicatedFile = {
      name: newName,
      content: file.content,
      type: file.type,
      path: file.path
    };
    
    setFiles([...files, duplicatedFile]);
    
    toast({
      title: "File Duplicated",
      description: `${file.name} has been duplicated as ${newName}`
    });
  };

  const deleteFile = (fileName: string, filePath?: string) => {
    // Don't allow deletion of README.md
    if (fileName === "README.md") {
      toast({
        title: "Cannot Delete README",
        description: "The README.md file cannot be deleted",
        variant: "destructive"
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      const updatedFiles = files.filter(file => !(file.name === fileName && file.path === filePath));
      setFiles(updatedFiles);
      
      // If we're deleting the current file, switch to index.html or the first available file
      if (currentFile === fileName) {
        const indexFile = updatedFiles.find(file => file.name === 'index.html');
        setCurrentFile(indexFile ? indexFile.name : (updatedFiles[0]?.name || ''));
      }

      toast({
        title: "File Deleted",
        description: `${fileName} has been deleted`
      });
    }
  };

  const renameFile = () => {
    // Don't allow renaming of README.md
    if (fileToRename === "README.md") {
      toast({
        title: "Cannot Rename README",
        description: "The README.md file cannot be renamed",
        variant: "destructive"
      });
      return;
    }
    
    if (!newName) {
      toast({
        title: "Error",
        description: "Please enter a file name",
        variant: "destructive"
      });
      return;
    }

    // Check if file name already exists
    if (files.some(file => file.name === newName)) {
      toast({
        title: "Error",
        description: "File already exists",
        variant: "destructive"
      });
      return;
    }

    const updatedFiles = files.map(file => {
      if (file.name === fileToRename) {
        return {
          ...file,
          name: newName
        };
      }
      return file;
    });

    setFiles(updatedFiles);
    
    // If we're renaming the current file, update currentFile
    if (currentFile === fileToRename) {
      setCurrentFile(newName);
    }

    setIsRenamingFile(false);
    setFileToRename('');
    setNewName('');

    toast({
      title: "File Renamed",
      description: `${fileToRename} has been renamed to ${newName}`
    });
  };

  // Download a single file
  const downloadFile = (file: { name: string; content: string }) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File Downloaded",
      description: `${file.name} has been downloaded`
    });
  };

  // Download all files as ZIP
  const downloadAllFiles = () => {
    const zip = new JSZip();
    
    // Process files and maintain folder structure
    files.forEach(file => {
      if (file.path) {
        zip.file(`${file.path}/${file.name}`, file.content);
      } else {
        zip.file(file.name, file.content);
      }
    });
    
    zip.generateAsync({ type: "blob" }).then(content => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = "boongle-ai-project.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Your Download Has Been Started!",
        description: "Your Project is open-source and can be used anywhere. Thanks for using Boongle AI!"
      });
    });
  };

  // Organize files into a tree structure
  const renderFileTree = () => {
    // Get root files (no path)
    const rootFiles = files.filter(file => !file.path && file.name !== '.folder');
    
    // Get all unique folders
    const folders = getFolders();
    
    return (
      <>
        {/* Render root files first */}
        {rootFiles.map((file) => (
          <li 
            key={file.name} 
            className={cn(
              "flex items-center justify-between p-2 rounded-md cursor-pointer",
              currentFile === file.name ? "bg-accent" : "hover:bg-muted"
            )}
            onClick={() => setCurrentFile(file.name)}
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              {getFileIcon(file.name)}
              <span className="truncate">{file.name}</span>
            </div>
            <div className="flex space-x-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFile(file);
                }}
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateFile(file);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setFileToRename(file.name);
                  setNewName(file.name);
                  setIsRenamingFile(true);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(file.name);
                }}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </li>
        ))}
        
        {/* Render folders and their files */}
        {folders.sort().map(folder => {
          // Get direct children files of this folder
          const folderFiles = files.filter(
            file => file.path === folder && file.name !== '.folder'
          );
          
          // Get direct child folders
          const childFolders = folders.filter(f => {
            const parts = f.split('/');
            const parentPath = parts.slice(0, -1).join('/');
            return parentPath === folder;
          });
          
          // Only show root folders in the main list
          const isRootFolder = !folder.includes('/');
          if (!isRootFolder) return null;
          
          return (
            <li key={folder} className="mb-1">
              <div 
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer",
                  "hover:bg-muted"
                )}
                onClick={() => toggleFolder(folder)}
              >
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4 text-amber-500" />
                  <span>{folder}</span>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {expandedFolders.includes(folder) && (
                <ul className="pl-4 mt-1 border-l-2 border-muted space-y-1">
                  {/* Recursive rendering of child folders */}
                  {childFolders.map(childFolder => {
                    const childFolderName = childFolder.split('/').pop();
                    const childFolderFiles = files.filter(
                      file => file.path === childFolder && file.name !== '.folder'
                    );
                    
                    return (
                      <li key={childFolder} className="mb-1">
                        <div 
                          className={cn(
                            "flex items-center justify-between p-2 rounded-md cursor-pointer",
                            "hover:bg-muted"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolder(childFolder);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <Folder className="h-4 w-4 text-amber-500" />
                            <span>{childFolderName}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFolder(childFolder);
                              }}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {expandedFolders.includes(childFolder) && (
                          <ul className="pl-4 mt-1 border-l-2 border-muted space-y-1">
                            {childFolderFiles.map(file => (
                              <li 
                                key={`${childFolder}/${file.name}`} 
                                className={cn(
                                  "flex items-center justify-between p-2 rounded-md cursor-pointer",
                                  currentFile === file.name ? "bg-accent" : "hover:bg-muted"
                                )}
                                onClick={() => setCurrentFile(file.name)}
                              >
                                <div className="flex items-center space-x-2 overflow-hidden">
                                  {getFileIcon(file.name)}
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <div className="flex space-x-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadFile(file);
                                    }}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateFile(file);
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteFile(file.name, file.path);
                                    }}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                  
                  {/* Render this folder's files */}
                  {folderFiles.map(file => (
                    <li 
                      key={`${folder}/${file.name}`} 
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer",
                        currentFile === file.name ? "bg-accent" : "hover:bg-muted"
                      )}
                      onClick={() => setCurrentFile(file.name)}
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        {getFileIcon(file.name)}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(file);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateFile(file);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(file.name, file.path);
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b flex justify-between items-center bg-muted">
        <h3 className="font-medium">Files</h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsAddingFile(true)}
            className="flex items-center gap-1"
            title="Add File"
          >
            <File className="h-4 w-4" />
            <Plus className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsAddingFolder(true)}
            className="flex items-center gap-1"
            title="Add Folder"
          >
            <Folder className="h-4 w-4" />
            <Plus className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={downloadAllFiles}
            title="Download Project"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-auto flex-1 p-2">
        <ul className="space-y-1">
          {renderFileTree()}
        </ul>
      </div>

      <div className="p-3 border-t mt-auto flex justify-between items-center bg-muted">
        <div className="text-xs text-muted-foreground">
          {files.length} file{files.length !== 1 ? 's' : ''} in project
        </div>
        <Button 
          size="sm" 
          onClick={downloadAllFiles}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Download className="h-4 w-4 mr-2" /> Download Project
        </Button>
      </div>

      {/* Add File Dialog */}
      <Dialog open={isAddingFile} onOpenChange={setIsAddingFile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">File Name</label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g. about.html"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFile(false)}>Cancel</Button>
            <Button onClick={addNewFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Folder Dialog */}
      <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Folder Name</label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. assets"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFolder(false)}>Cancel</Button>
            <Button onClick={addNewFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog open={isRenamingFile} onOpenChange={setIsRenamingFile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">New Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenamingFile(false)}>Cancel</Button>
            <Button onClick={renameFile}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileExplorerEnhanced;

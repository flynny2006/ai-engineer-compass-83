
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  FilePlus,
  Trash, 
  FileCode,
  FileJson,
  FileSpreadsheet,
  FileImage,
  File
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileExplorerProps {
  files: Array<{ name: string; content: string; type: string }>;
  currentFile: string;
  onSelectFile: (fileName: string) => void;
  onCreateFile?: () => void;
  onDeleteFile?: (fileName: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  currentFile, 
  onSelectFile,
  onCreateFile,
  onDeleteFile
}) => {
  // Helper function to get appropriate icon based on file extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'html':
        return <FileCode className="h-4 w-4 text-blue-500" />;
      case 'css':
        return <FileCode className="h-4 w-4 text-pink-500" />;
      case 'js':
      case 'ts':
      case 'tsx':
        return <FileCode className="h-4 w-4 text-yellow-500" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-green-500" />;
      case 'csv':
      case 'xlsx':
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <FileImage className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Files</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCreateFile}
          className="h-7 w-7"
        >
          <FilePlus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-1">
        {files.map((file) => (
          <Button
            key={file.name}
            variant="ghost"
            size="sm"
            className={cn(
              "justify-start w-full text-left font-normal",
              currentFile === file.name && "bg-muted"
            )}
            onClick={() => onSelectFile(file.name)}
          >
            <div className="flex items-center w-full">
              <span className="mr-2">{getFileIcon(file.name)}</span>
              <span className="flex-grow truncate">{file.name}</span>
              {onDeleteFile && file.name !== "index.html" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-2 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.name);
                  }}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;

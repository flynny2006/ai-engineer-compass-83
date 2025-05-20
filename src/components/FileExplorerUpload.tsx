
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileExplorerUploadProps {
  onFileUpload: (file: { name: string, content: string | ArrayBuffer, type: string }) => void;
}

const FileExplorerUpload = ({ onFileUpload }: FileExplorerUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      setIsUploading(false);
      return;
    }
    
    const reader = new FileReader();
    
    // Determine file type
    let fileType = file.name.split('.').pop() || '';
    
    // For images, use readAsDataURL
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(fileType);
    
    if (isImage) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
    
    reader.onload = () => {
      if (reader.result) {
        onFileUpload({
          name: file.name,
          content: reader.result,
          type: fileType
        });
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been added to your project`,
        });
      }
      setIsUploading(false);
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive"
      });
      setIsUploading(false);
    };
  };
  
  return (
    <div className="mb-2">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button 
        variant="outline" 
        size="sm"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
            Uploading...
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Upload className="h-3 w-3" />
            Upload File
          </span>
        )}
      </Button>
    </div>
  );
};

export default FileExplorerUpload;

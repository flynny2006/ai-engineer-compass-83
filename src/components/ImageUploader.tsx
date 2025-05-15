
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (imageData: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = () => {
    if (preview) {
      onImageUploaded(preview);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Click to upload or drag and drop</p>
        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border border-border">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full object-contain max-h-[300px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

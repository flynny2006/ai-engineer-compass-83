
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (imageData: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      setIsUploading(false);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageData = event.target.result as string;
        setPreviewImage(imageData);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (previewImage) {
      onImageUploaded(previewImage);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        onClick={handleUploadClick}
      >
        {previewImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-40 max-w-full rounded-md mb-3" 
            />
            <p className="text-sm text-muted-foreground">Click to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Image className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm font-medium">Click to upload an image</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF (max 5MB)</p>
          </div>
        )}
      </div>

      <div className="flex justify-end w-full space-x-2">
        {previewImage && (
          <Button 
            variant="default" 
            onClick={handleSubmit}
            disabled={isUploading}
          >
            Use this image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

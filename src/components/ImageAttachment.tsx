
import React, { useRef } from 'react';
import { Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ImageAttachmentProps {
  onImageSelect: (file: File) => void;
  attachedImage?: File | null;
  onRemoveImage: () => void;
}

const ImageAttachment: React.FC<ImageAttachmentProps> = ({
  onImageSelect,
  attachedImage,
  onRemoveImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      onImageSelect(file);
      toast({
        title: "Image attached",
        description: `${file.name} has been attached to your message`
      });
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
        onClick={handleAttachClick}
        disabled={!!attachedImage}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {attachedImage && (
        <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
          <ImageIcon className="h-3 w-3 text-white/70" />
          <span className="text-xs text-white/70 max-w-20 truncate">
            {attachedImage.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 rounded-full text-white/70 hover:text-white"
            onClick={onRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageAttachment;

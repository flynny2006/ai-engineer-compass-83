
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnimatedAIInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onAttach?: () => void;
  showAttachButton?: boolean;
  className?: string;
}

export const AnimatedAIInput: React.FC<AnimatedAIInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Message...",
  isLoading = false,
  disabled = false,
  onAttach,
  showAttachButton = true,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic height adjustment for textarea
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "40px"; // Reset height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 200)}px`; // Max 200px height
    }
  }, [value]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled && !isLoading) {
      onSubmit();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        isFocused ? "shadow-lg ring-1 ring-white/20" : "shadow"
      } ${disabled ? "opacity-70" : ""} ${className}`}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center overflow-hidden bg-black/60 backdrop-blur-md border border-white/10 rounded-xl transition-all ${isFocused ? "border-white/30" : ""}`}>
          {showAttachButton && onAttach && (
            <button
              type="button"
              onClick={onAttach}
              className="flex-shrink-0 ml-2 p-2 text-white/60 hover:text-white transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          )}
          
          <textarea
            ref={textAreaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className="w-full bg-transparent border-0 resize-none p-4 text-white placeholder:text-white/50 focus:ring-0 focus:outline-none transition-colors"
            rows={1}
            style={{
              minHeight: "40px",
              maxHeight: "200px",
            }}
          />
          
          <Button 
            type="submit"
            disabled={!value.trim() || disabled || isLoading}
            className={`m-2 rounded-lg flex-shrink-0 p-0 w-10 h-10 items-center justify-center transition-all duration-300 ${
              !value.trim() || disabled ? "bg-white/10 text-white/50" : "bg-white text-black"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Send className={`h-4 w-4 ${value.trim() && !disabled ? "" : "opacity-50"}`} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnimatedAIInput;

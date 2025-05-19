
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface ModelOption {
  id: string;
  name: string;
  description?: string;
  requiresPlan?: boolean;
}

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
  onModelChange?: (modelId: string) => void;
  selectedModel?: string;
  userPlan?: string;
}

// Model options for the switcher
const models: ModelOption[] = [
  { id: 'gemini-1.5', name: 'Gemini 1.5 Flash', description: 'Fast and efficient for most tasks' },
  { id: 'gemini-2.0', name: 'Gemini 2.0 Flash', description: 'Advanced capabilities for complex tasks' },
  { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', description: 'Premium model with enhanced features', requiresPlan: true }
];

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
  onModelChange,
  selectedModel = "gemini-1.5",
  userPlan = "FREE"
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Model selection
  const handleModelSelect = (modelId: string) => {
    const selectedModelOption = models.find(m => m.id === modelId);
    
    // Check if model requires a plan
    if (selectedModelOption?.requiresPlan && userPlan === "FREE") {
      alert("This model requires a paid plan. Please upgrade to access Gemini 2.0 Pro.");
      return;
    }
    
    if (onModelChange) {
      onModelChange(modelId);
    }
  };

  // Handle file attachment click
  const handleAttachClick = () => {
    if (onAttach) {
      onAttach();
    }
  };

  const isPaidUser = userPlan !== "FREE";

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center overflow-hidden bg-black/60 backdrop-blur-md border border-white/10 rounded-xl transition-all ${isFocused ? "shadow-lg ring-1 ring-white/20 border-white/30" : ""}`}>
          {/* Model selector */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <button 
                type="button" 
                className="flex-shrink-0 ml-2 px-2 py-1 text-sm text-white/70 hover:text-white transition-colors bg-white/5 rounded-md"
                onClick={(e) => e.preventDefault()}
              >
                {models.find(m => m.id === selectedModel)?.name || 'Select Model'}
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-56 bg-black/90 backdrop-blur-lg border border-white/10 text-white p-0">
              <div className="p-2">
                <p className="text-xs text-white/70 mb-2">Select Model</p>
                {models.map(model => (
                  <button
                    key={model.id}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedModel === model.id 
                        ? 'bg-white/10 text-white' 
                        : 'hover:bg-white/5 text-white/80'
                    } ${model.requiresPlan && !isPaidUser ? 'opacity-50' : ''}`}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <div className="font-medium flex items-center justify-between">
                      {model.name}
                      {model.requiresPlan && (
                        <span className="text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded">PRO</span>
                      )}
                    </div>
                    {model.description && (
                      <div className="text-xs text-white/60 mt-1">{model.description}</div>
                    )}
                  </button>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
          
          {showAttachButton && (
            <button
              type="button"
              onClick={handleAttachClick}
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

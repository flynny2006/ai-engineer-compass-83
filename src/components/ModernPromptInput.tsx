import React, { useState, useEffect, useRef } from 'react';
import { 
  PromptInput, 
  PromptInputTextarea, 
  PromptInputActions, 
  PromptInputAction 
} from '@/components/ui/prompt-input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUp, Square, Paperclip, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

interface ModernPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onAttach: () => void;
  placeholder?: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
  userPlan: string;
}

const placeholdersList: string[] = [
  "Ask Boongle AI to build a modern landing page...",
  "Ask Boongle AI to build a guns.lol copy...",
  "Ask Boongle AI to build a project management dashboard...",
  "Ask Boongle AI to build an advanced contact form with validation...",
  "Ask Boongle AI to build a job board UI with filtering...",
  "Ask Boongle AI to build a partners page for my app...",
  "Ask Boongle AI to build an ai chat app...",
  "Ask Boongle AI to build a music player app...",
  "Ask Boongle AI to build a landing page for an AI writing assistant...",
  "Create a personal portfolio website with a blog section...",
  "Generate a UI for an e-commerce product page with reviews...",
  "Design a dashboard for tracking fitness activities...",
  "Build a simple to-do list application with categories...",
  "Develop a recipe sharing platform with user accounts...",
  "Draft a mobile app interface for a weather forecast app...",
  "Outline a SaaS application for team collaboration...",
  "Construct a survey form with multiple question types...",
  "Design a booking system for a local barber shop...",
  "Create a UI for a social media feed with comments...",
  "Generate a set of admin panels for user management...",
  "Build an interactive quiz game with scoring...",
  "Design a checkout process for an online store...",
  "Create a file uploader with drag and drop support...",
  "Generate a data visualization chart for sales figures...",
  "Build a real-time chat interface for customer support..."
];

const ModernPromptInput: React.FC<ModernPromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  onAttach,
  placeholder: initialPlaceholder = "Ask Boongle AI to build anything...",
  selectedModel,
  onModelChange,
  userPlan
}) => {
  const { theme } = useTheme();
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentFullPlaceholder = placeholdersList[placeholderIndex];

    const handleTyping = () => {
      if (isDeleting) {
        setAnimatedPlaceholder(prev => prev.substring(0, prev.length - 1));
        setTypingSpeed(50);
      } else {
        setAnimatedPlaceholder(prev => currentFullPlaceholder.substring(0, prev.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && animatedPlaceholder === currentFullPlaceholder) {
        typingTimeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && animatedPlaceholder === "") {
        setIsDeleting(false);
        setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholdersList.length);
      }
    };

    typingTimeoutRef.current = setTimeout(handleTyping, typingSpeed);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [animatedPlaceholder, isDeleting, placeholderIndex, typingSpeed]);
  
  const getModelDisplayName = (modelId: string) => {
    switch(modelId) {
      case "gemini-1.5":
        return "Gemini 1.5 Flash";
      case "gemini-2.0":
        return "Gemini 2.0 Flash";
      case "gemini-2.0-pro":
        return "Gemini 2.0 Pro";
      default:
        return "Gemini 1.5 Flash";
    }
  };

  const handleModelSelect = (modelId: string) => {
    if (modelId === "gemini-2.0-pro" && userPlan === "FREE") {
      toast({
        title: "Upgrade Required",
        description: "Gemini 2.0 Pro requires a paid plan. Please upgrade to access this model.",
        variant: "destructive"
      });
      return;
    }
    
    onModelChange(modelId);
  };

  const isPaidUser = userPlan !== "FREE";

  return (
    <div className="w-full space-y-3">
      {/* Model Selector */}
      <div className="flex justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white bg-background/50 dark:bg-white/10 hover:bg-muted dark:hover:bg-white/20 border border-border dark:border-white/10 rounded-lg px-3 py-1"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {getModelDisplayName(selectedModel)}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-background/90 dark:bg-black/90 border border-border dark:border-white/20">
            <DropdownMenuItem 
              onClick={() => handleModelSelect("gemini-1.5")} 
              className="cursor-pointer text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10"
            >
              <div className="flex items-center justify-between w-full">
                <span>Gemini 1.5 Flash</span>
                {selectedModel === "gemini-1.5" && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleModelSelect("gemini-2.0")} 
              className="cursor-pointer text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10"
            >
              <div className="flex items-center justify-between w-full">
                <span>Gemini 2.0 Flash</span>
                {selectedModel === "gemini-2.0" && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleModelSelect("gemini-2.0-pro")} 
              className={`cursor-pointer text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10 ${!isPaidUser ? 'opacity-50' : ''}`}
              disabled={!isPaidUser}
            >
              <div className="flex items-center justify-between w-full">
                <span>Gemini 2.0 Pro</span>
                <div className="flex items-center gap-2">
                  {!isPaidUser && (
                    <span className="text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded">PRO</span>
                  )}
                  {selectedModel === "gemini-2.0-pro" && isPaidUser && (
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Prompt Input */}
      <PromptInput
        value={value}
        onValueChange={onChange}
        isLoading={isLoading}
        onSubmit={onSubmit}
        className="w-full bg-background/80 dark:bg-white/5 border-border dark:border-white/20 backdrop-blur-sm"
        maxHeight={200}
      >
        <PromptInputTextarea 
          placeholder={value ? "" : (animatedPlaceholder || initialPlaceholder)}
          className="text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 min-h-[60px]"
        />
        <PromptInputActions className="justify-between pt-2">
          <PromptInputAction tooltip="Attach file">
            <Button
              variant={theme === 'light' ? 'attach-gradient' : 'ghost'}
              size="icon"
              className={`h-8 w-8 rounded-full 
                ${theme === 'light' 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              onClick={onAttach}
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </PromptInputAction>
          
          <PromptInputAction
            tooltip={isLoading ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full bg-foreground text-background dark:bg-white dark:text-black hover:bg-foreground/90 dark:hover:bg-white/90"
              onClick={onSubmit}
              disabled={!value.trim() && !isLoading}
            >
              {isLoading ? (
                <Square className="h-4 w-4 fill-current" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
};

export default ModernPromptInput;

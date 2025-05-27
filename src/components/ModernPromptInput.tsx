
import React, { useState } from 'react';
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

const ModernPromptInput: React.FC<ModernPromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  onAttach,
  placeholder = "Ask Boongle AI to build anything...",
  selectedModel,
  onModelChange,
  userPlan
}) => {
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
    // Check if Pro model is selected but user is on free plan
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
              className="text-white/70 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {getModelDisplayName(selectedModel)}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-black/90 border border-white/20">
            <DropdownMenuItem 
              onClick={() => handleModelSelect("gemini-1.5")} 
              className="cursor-pointer text-white hover:bg-white/10"
            >
              <div className="flex items-center justify-between w-full">
                <span>Gemini 1.5 Flash</span>
                {selectedModel === "gemini-1.5" && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleModelSelect("gemini-2.0")} 
              className="cursor-pointer text-white hover:bg-white/10"
            >
              <div className="flex items-center justify-between w-full">
                <span>Gemini 2.0 Flash</span>
                {selectedModel === "gemini-2.0" && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleModelSelect("gemini-2.0-pro")} 
              className={`cursor-pointer text-white hover:bg-white/10 ${!isPaidUser ? 'opacity-50' : ''}`}
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
        className="w-full bg-white/5 border-white/20 backdrop-blur-sm"
        maxHeight={200}
      >
        <PromptInputTextarea 
          placeholder={placeholder}
          className="text-white placeholder:text-white/50 min-h-[60px]"
        />
        <PromptInputActions className="justify-between pt-2">
          <PromptInputAction tooltip="Attach file">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
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
              className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90"
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

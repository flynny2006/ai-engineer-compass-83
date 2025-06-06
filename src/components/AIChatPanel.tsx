
import React, { useState } from 'react';
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from '@/components/ui/chat-input';
import ModernPromptInput from '@/components/ModernPromptInput';

const AIChatPanel: React.FC = () => {
  const [chatValue, setChatValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!chatValue.trim()) return;
    
    setIsLoading(true);
    // Here you would integrate with your existing AI chat functionality
    console.log("Submitting chat:", chatValue);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setChatValue("");
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">AI Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Chat messages area - you can integrate your existing chat components here */}
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Start a conversation with the AI assistant...
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <ChatInput
          variant="default"
          value={chatValue}
          onChange={(e) => setChatValue(e.target.value)}
          onSubmit={handleSubmit}
          loading={isLoading}
          onStop={() => setIsLoading(false)}
        >
          <ChatInputTextArea placeholder="Type your message..." />
          <ChatInputSubmit />
        </ChatInput>
      </div>
    </div>
  );
};

export default AIChatPanel;


import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';

interface ConsoleInputProps {
  onCommand: (command: string) => void;
  commandHistory: string[];
}

const ConsoleInput: React.FC<ConsoleInputProps> = ({ onCommand, commandHistory }) => {
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1); // -1 means new command

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onCommand(inputValue.trim());
      setInputValue('');
      setHistoryIndex(-1); // Reset history navigation
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : commandHistory.length -1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(newIndex >=0 ? commandHistory[commandHistory.length - 1 - newIndex] : '');
      } else {
         setInputValue(''); // Clear if navigating below history
      }
    }
  };

  return (
    <div className="flex items-center p-2 border-t border-border bg-muted/30 dark:bg-black/40 rounded-b-md">
      <span className="text-blue-400 dark:text-blue-300 mr-2 font-mono select-none">$</span>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a command (try 'help')"
        className="flex-grow bg-transparent border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm modern-input"
        autoFocus
      />
      <Button variant="ghost" size="icon" onClick={handleSubmit} className="ml-2">
        <CornerDownLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConsoleInput;


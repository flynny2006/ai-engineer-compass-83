
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState<number>(1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Update line count when content changes
  useEffect(() => {
    if (value) {
      const lines = value.split('\n').length;
      setLineCount(lines);
    } else {
      setLineCount(1);
    }
  }, [value]);
  
  // Handle key combinations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
      
      if (e.key === 'Escape') {
        setShowSearch(false);
        editorRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Handle search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery || !editorRef.current) return;
    
    const textarea = editorRef.current;
    const text = textarea.value;
    const searchIndex = text.indexOf(searchQuery, textarea.selectionEnd);
    
    if (searchIndex !== -1) {
      textarea.focus();
      textarea.setSelectionRange(searchIndex, searchIndex + searchQuery.length);
    }
  };
  
  // Render line numbers
  const renderLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, i) => i + 1).map(num => (
      <div key={num} className="text-right pr-2 text-muted-foreground text-xs select-none leading-6">
        {num}
      </div>
    ));
  };
  
  // Handle text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  
  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-background/80 relative">
      {showSearch && (
        <div className="bg-background/90 border-b p-2 flex items-center shrink-0">
          <form onSubmit={handleSearch} className="flex items-center w-full">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-8 w-full"
            />
            <Button type="submit" size="sm" className="ml-2">
              Find
            </Button>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              className="ml-2"
              onClick={() => setShowSearch(false)}
            >
              Cancel
            </Button>
          </form>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden font-mono text-sm min-h-0">
        <div className="bg-muted/80 py-2 flex flex-col overflow-y-auto shrink-0 w-16">
          {renderLineNumbers()}
        </div>
        <div className="flex-1 relative min-h-0">
          <textarea
            ref={editorRef}
            value={value}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="absolute inset-0 w-full h-full p-2 bg-background resize-none border-0 focus:outline-none overflow-auto"
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              lineHeight: '24px',
              tabSize: 2,
              whiteSpace: 'pre'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;


import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  creditsInfo?: {
    amount: number;
    type: "daily" | "monthly";
  };
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language,
  creditsInfo = { amount: 20, type: "daily" } 
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState<number>(1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // HTML suggestions for autocomplete
  const htmlSuggestions = [
    { tag: "div", snippet: "<div></div>" },
    { tag: "span", snippet: "<span></span>" },
    { tag: "p", snippet: "<p></p>" },
    { tag: "h1", snippet: "<h1></h1>" },
    { tag: "h2", snippet: "<h2></h2>" },
    { tag: "h3", snippet: "<h3></h3>" },
    { tag: "h4", snippet: "<h4></h4>" },
    { tag: "h5", snippet: "<h5></h5>" },
    { tag: "h6", snippet: "<h6></h6>" },
    { tag: "button", snippet: "<button></button>" },
    { tag: "a", snippet: "<a href=\"\"></a>" },
    { tag: "img", snippet: "<img src=\"\" alt=\"\">" },
    { tag: "input", snippet: "<input type=\"text\">" },
    { tag: "form", snippet: "<form></form>" },
    { tag: "label", snippet: "<label for=\"\"></label>" },
    { tag: "select", snippet: "<select>\n  <option value=\"\"></option>\n</select>" },
    { tag: "textarea", snippet: "<textarea></textarea>" },
    { tag: "ul", snippet: "<ul>\n  <li></li>\n</ul>" },
    { tag: "ol", snippet: "<ol>\n  <li></li>\n</ol>" },
    { tag: "li", snippet: "<li></li>" },
    { tag: "table", snippet: "<table>\n  <tr>\n    <td></td>\n  </tr>\n</table>" },
    { tag: "tr", snippet: "<tr></tr>" },
    { tag: "td", snippet: "<td></td>" },
    { tag: "th", snippet: "<th></th>" },
    { tag: "thead", snippet: "<thead></thead>" },
    { tag: "tbody", snippet: "<tbody></tbody>" },
    { tag: "section", snippet: "<section></section>" },
    { tag: "article", snippet: "<article></article>" },
    { tag: "nav", snippet: "<nav></nav>" },
    { tag: "header", snippet: "<header></header>" },
    { tag: "footer", snippet: "<footer></footer>" },
    { tag: "main", snippet: "<main></main>" },
    { tag: "aside", snippet: "<aside></aside>" },
    { tag: "details", snippet: "<details>\n  <summary></summary>\n</details>" },
    { tag: "summary", snippet: "<summary></summary>" },
    { tag: "figure", snippet: "<figure>\n  <img src=\"\" alt=\"\">\n  <figcaption></figcaption>\n</figure>" },
    { tag: "figcaption", snippet: "<figcaption></figcaption>" },
    { tag: "code", snippet: "<code></code>" },
    { tag: "pre", snippet: "<pre></pre>" },
    { tag: "blockquote", snippet: "<blockquote></blockquote>" },
    { tag: "hr", snippet: "<hr>" },
    { tag: "br", snippet: "<br>" },
    { tag: "iframe", snippet: "<iframe src=\"\" title=\"\"></iframe>" },
    { tag: "canvas", snippet: "<canvas></canvas>" },
    { tag: "audio", snippet: "<audio controls>\n  <source src=\"\" type=\"audio/mpeg\">\n</audio>" },
    { tag: "video", snippet: "<video controls>\n  <source src=\"\" type=\"video/mp4\">\n</video>" },
    { tag: "script", snippet: "<script></script>" },
    { tag: "style", snippet: "<style></style>" },
    { tag: "link", snippet: "<link rel=\"stylesheet\" href=\"\">" },
    { tag: "meta", snippet: "<meta name=\"\" content=\"\">" },
    { tag: "title", snippet: "<title></title>" },
    { tag: "html", snippet: "<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n  </head>\n  <body>\n    \n  </body>\n</html>" }
  ];
  
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
      // CTRL+F for search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
      
      // ESC to close search
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
      <div key={num} className="text-right pr-2 text-muted-foreground text-xs select-none">
        {num}
      </div>
    ));
  };
  
  // Critical fix: Create a separate onChange handler for textarea to fix editing issues
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Get the new value directly from the event target
    const newValue = e.target.value;
    onChange(newValue);
  };
  
  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-background/80 relative">
      {/* Credits info */}
      <div className="absolute top-0 left-0 right-0 p-2 text-xs text-muted-foreground text-center bg-background/50 backdrop-blur-sm border-b border-b-border/40 z-10">
        {creditsInfo.amount} {creditsInfo.type} Credits left
      </div>
      
      {showSearch && (
        <div className="bg-background/90 border-b p-2 flex items-center mt-7">
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
      <div className="flex flex-1 overflow-hidden font-mono text-sm relative mt-7">
        <div className="bg-muted/80 py-4 flex flex-col overflow-hidden">
          {renderLineNumbers()}
        </div>
        <textarea
          ref={editorRef}
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 p-4 bg-background resize-none overflow-auto w-full border-0 focus:outline-none code-editor"
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            lineHeight: 1.5,
            tabSize: 2,
            paddingLeft: '0.5rem',
            overflow: 'auto',
            whiteSpace: 'pre',
            caretColor: 'currentColor',
            position: 'relative',
            top: 0,
            left: 0
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;

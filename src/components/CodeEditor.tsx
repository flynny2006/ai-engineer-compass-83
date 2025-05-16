import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Changed import from 'highlight' to 'highlightCode'
import { highlightCode } from "@/lib/syntaxHighlighter"; 

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  // Changed type from HTMLDivElement to HTMLPreElement
  const highlightRef = useRef<HTMLPreElement>(null);
  const [lineCount, setLineCount] = useState<number>(1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

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
      // Update highlighted code
      // Ensure `highlightCode` is a function and handles potential errors.
      // Changed function call from highlight to highlightCode
      if (typeof highlightCode === 'function') {
        try {
          setHighlightedCode(highlightCode(value, language));
        } catch (e) {
          console.error("Syntax highlighting error:", e);
          setHighlightedCode(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")); // Fallback to escaped text
        }
      } else {
         // Fallback if highlightCode function is not available
        setHighlightedCode(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
      }
    } else {
      setLineCount(1);
      setHighlightedCode("");
    }
  }, [value, language]);
  
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
      <div key={num} className="text-right pr-2 text-muted-foreground text-xs select-none leading-normal">
        {num}
      </div>
    ));
  };
  
  // Handle tab key for indentation and other editor behaviors
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    
    // Auto close HTML tags (only for HTML files)
    if (language === 'html' && e.key === '>') {
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPos);
      
      // Check if we're typing a tag and not a closing tag
      const openingTagMatch = textBeforeCursor.match(/<(\w+)(?:\s+[^>]*)$/);
      if (openingTagMatch && !textBeforeCursor.endsWith('</')) {
        const tagName = openingTagMatch[1];
        // Self-closing tags
        const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
        if (!selfClosingTags.includes(tagName)) {
          setTimeout(() => {
            const newValue = value.substring(0, cursorPos) + '>' + `</${tagName}>` + value.substring(cursorPos);
            onChange(newValue);
            textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
          }, 0);
        }
      }
    }
    
    // Auto suggestions for HTML
    if (language === 'html' && e.key !== 'Enter' && e.key !== 'Escape') {
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPos);
      
      // Check if we're starting to type a tag
      const tagStart = textBeforeCursor.lastIndexOf('<');
      if (tagStart !== -1 && !textBeforeCursor.substring(tagStart).includes('>')) {
        const tagText = textBeforeCursor.substring(tagStart + 1);
        
        // Only suggest if we have at least 1 character after "<"
        if (tagText.length >= 1) {
          // Find matching suggestions
          const matches = htmlSuggestions.filter(s => 
            s.tag.toLowerCase().startsWith(tagText.toLowerCase())
          );
          
          if (matches.length > 0 && e.key === 'Tab') { // Trigger suggestion on Tab
            e.preventDefault();
            // Insert the first suggestion
            const replacement = matches[0].snippet;
            const newValue = value.substring(0, tagStart) + replacement + value.substring(cursorPos);
            onChange(newValue);
            
            // Position cursor appropriately inside the inserted tag
            const cursorOffset = replacement.includes('></')
              ? replacement.indexOf('>') + 1
              : replacement.includes('""')
              ? replacement.indexOf('""') + 1
              : replacement.length;
            
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = tagStart + cursorOffset;
            }, 0);
          }
        }
      }
    }
  };
  
  const editorStyles: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: '0.875rem', // text-sm
    lineHeight: 1.6, // leading-normal might be slightly different, adjust if needed
    tabSize: 2,
    WebkitTapHighlightColor: 'transparent',
    padding: '1rem', // p-4
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {showSearch && (
        <div className="bg-background border-b p-2 flex items-center">
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
      <div className="flex flex-1 overflow-hidden">
        <div className="bg-muted py-4 flex flex-col overflow-y-auto no-scrollbar select-none" style={{ lineHeight: editorStyles.lineHeight }}>
          {/* Line numbers need to sync with text area content exactly */}
          {Array.from({ length: lineCount }, (_, i) => i + 1).map(num => (
            <div key={num} className="text-right pr-2 text-muted-foreground text-xs" style={{ height: `calc(${editorStyles.fontSize} * ${editorStyles.lineHeight})`}}>
              {num}
            </div>
          ))}
        </div>
        <div className="relative flex-1 w-full h-full">
          <pre
            ref={highlightRef}
            aria-hidden="true"
            className="absolute inset-0 overflow-auto m-0 p-0 font-mono text-sm bg-background code-editor-highlight"
            style={{ ...editorStyles, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }} // Ensure last line is rendered if empty
          />
          <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleEditorKeyDown} // Renamed from handleKeyDown to handleEditorKeyDown to avoid conflict
            spellCheck={false}
            className={`absolute inset-0 resize-none overflow-auto m-0 p-0 font-mono text-sm bg-transparent text-transparent caret-white border-0 focus:outline-none w-full h-full code-editor`}
            style={editorStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;


import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Code, Send, Play, Eye, MessageSquare, Sun, Moon, Save, Trash, Maximize, RefreshCcw, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Toggle } from "@/components/ui/toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <p>This is a simple web page. Try describing changes you'd like to make.</p>
  </div>
</body>
</html>`;

// Define initial files structure
const initialFiles = [
  { name: "index.html", content: DEFAULT_CODE, type: "html" },
  { name: "styles.css", content: "/* Add your CSS styles here */", type: "css" },
  { name: "script.js", content: "// Add your JavaScript code here", type: "js" }
];

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [files, setFiles] = useState(() => {
    const savedFiles = localStorage.getItem("project_files");
    return savedFiles ? JSON.parse(savedFiles) : initialFiles;
  });
  const [currentFile, setCurrentFile] = useState(() => {
    const lastFile = localStorage.getItem("current_file");
    return lastFile || "index.html";
  });
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: "assistant", content: "Welcome! I'm your AI coding assistant. Describe the changes you'd like to make to the code and I'll help implement them." }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("gemini_api_key") || "";
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(() => !localStorage.getItem("gemini_api_key"));
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  // Get current file content
  const getCurrentFileContent = () => {
    const file = files.find(f => f.name === currentFile);
    return file ? file.content : "";
  };

  // Update file content
  const updateFileContent = (content: string) => {
    const updatedFiles = files.map(file => 
      file.name === currentFile ? { ...file, content } : file
    );
    setFiles(updatedFiles);
    localStorage.setItem("project_files", JSON.stringify(updatedFiles));
  };

  // Update the preview when files change
  useEffect(() => {
    updatePreview();
    // Save files to localStorage
    localStorage.setItem("project_files", JSON.stringify(files));
    localStorage.setItem("current_file", currentFile);
  }, [files, currentFile, lastRefreshTime]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_history");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error("Error parsing saved messages:", error);
      }
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updatePreview = () => {
    if (previewIframeRef.current) {
      const iframe = previewIframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        const htmlFile = files.find(f => f.name === "index.html");
        const cssFile = files.find(f => f.name === "styles.css");
        const jsFile = files.find(f => f.name === "script.js");
        
        // Construct the HTML with linked CSS and JS
        let htmlContent = htmlFile ? htmlFile.content : DEFAULT_CODE;
        
        // Ensure the HTML structure is complete and add style/script tags if needed
        if (htmlContent && !htmlContent.includes('</head>') && cssFile) {
          // If there's no head tag, we need to add one with the styles
          htmlContent = htmlContent.replace('<html>', '<html>\n<head>\n<style>' + cssFile.content + '</style>\n</head>');
        } else if (htmlContent && cssFile) {
          // If there is a head tag, insert styles before it closes
          htmlContent = htmlContent.replace('</head>', `<style>${cssFile.content}</style>\n</head>`);
        }
        
        // Add JavaScript before closing body tag
        if (htmlContent && jsFile) {
          htmlContent = htmlContent.replace('</body>', `<script>${jsFile.content}</script>\n</body>`);
        }
        
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  };

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem("gemini_api_key", apiKey);
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved for future sessions."
      });
    }
  };

  const clearChatHistory = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([
        { role: "assistant", content: "Welcome! I'm your AI coding assistant. Describe the changes you'd like to make to the code and I'll help implement them." }
      ]);
      localStorage.removeItem("chat_history");
      toast({
        title: "Chat History Cleared",
        description: "Your conversation history has been cleared."
      });
    }
  };

  const resetProject = () => {
    setFiles(initialFiles);
    setCurrentFile("index.html");
    setMessages([
      { role: "assistant", content: "Welcome! I'm your AI coding assistant. Describe the changes you'd like to make to the code and I'll help implement them." }
    ]);
    localStorage.removeItem("chat_history");
    localStorage.setItem("project_files", JSON.stringify(initialFiles));
    localStorage.setItem("current_file", "index.html");
    toast({
      title: "Project Reset",
      description: "Your project has been reset to its default state."
    });
    setLastRefreshTime(Date.now());
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userPrompt.trim()) return;
    if (!apiKey && showApiKeyInput) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to continue.",
      });
      return;
    }
    
    const userMessage = { role: "user", content: userPrompt };
    setMessages(prev => [...prev, userMessage]);
    setUserPrompt("");
    setIsLoading(true);

    try {
      // Create enhanced system prompt
      const systemPrompt = `You are an expert web developer AI assistant that helps modify HTML, CSS and JavaScript code.
Current project files:
${files.map(file => `
--- ${file.name} ---
${file.content}
`).join('\n')}

User request: "${userPrompt}"

Previous conversation:
${messages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Analyze the code and the user's request. Then, respond with the full updated files that incorporates the requested changes.
Follow these rules:
1. Return all files that need to be modified in this format:
--- filename.ext ---
Full file content here

2. Always return the complete content for each file
3. Don't include explanations, just the code files
4. Make sure to include proper links between HTML, CSS, and JS files
5. Don't include markdown formatting or code blocks, just the raw code
6. Be creative and implement visual enhancements when appropriate
7. Follow best practices for HTML, CSS, and JavaScript
8. Make sure your code is clean, organized, and well-documented
9. Implement responsive design elements when possible
10. Consider accessibility in your implementations
11. Use modern design principles for beautiful interfaces
12. Create visually appealing color schemes and typography
13. Utilize smooth animations and transitions when appropriate
14. Ensure proper spacing and layout for optimal user experience
15. Implement intuitive navigation and user interaction patterns
16. Use consistent design language throughout the interface
17. Add appropriate hover states and interactive elements
18. Design with a focus on user experience and usability
19. Consider performance optimizations in your implementations
20. Maintain semantic HTML structure
21. When implementing navigation between pages, create the necessary files and update links accordingly
22. Ensure JavaScript code is properly added and functional
23. Use modern CSS features like flexbox, grid, and custom properties
24. Implement proper error handling in JavaScript code
25. Create stunning visual designs with gradients, shadows, and modern UI elements`;

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if we have valid response data
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        // Extract the generated code
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Process the response to extract file contents
        const fileMatches = generatedText.match(/---\s+([a-zA-Z0-9_.-]+)\s+---\s+([\s\S]*?)(?=(?:---\s+[a-zA-Z0-9_.-]+\s+---|$))/g);
        
        if (fileMatches && fileMatches.length > 0) {
          const updatedFiles = [...files];
          const newFiles = [];
          
          fileMatches.forEach(match => {
            const fileNameMatch = match.match(/---\s+([a-zA-Z0-9_.-]+)\s+---/);
            if (fileNameMatch && fileNameMatch[1]) {
              const fileName = fileNameMatch[1].trim();
              let fileContent = match.replace(/---\s+[a-zA-Z0-9_.-]+\s+---/, '').trim();
              
              // Get file extension
              const fileExt = fileName.split('.').pop() || "";
              
              // Check if file already exists
              const existingFileIndex = updatedFiles.findIndex(f => f.name === fileName);
              
              if (existingFileIndex >= 0) {
                // Update existing file
                updatedFiles[existingFileIndex].content = fileContent;
              } else {
                // Add new file
                newFiles.push({
                  name: fileName,
                  content: fileContent,
                  type: fileExt
                });
              }
            }
          });
          
          // Add new files to the list
          const combinedFiles = [...updatedFiles, ...newFiles];
          setFiles(combinedFiles);
          
          // Show toast for new files
          if (newFiles.length > 0) {
            toast({
              title: `Created ${newFiles.length} new file(s)`,
              description: `Added: ${newFiles.map(f => f.name).join(', ')}`
            });
          }
        } else {
          // If no file structure detected, treat it as changes to the current file
          updateFileContent(generatedText);
        }
        
        // Add assistant response
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "✅ Changes applied! Check the preview to see the results." 
        }]);
        
        if (showApiKeyInput) {
          saveApiKey();
        }
        
        // Update preview
        setLastRefreshTime(Date.now());
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `❌ Error: ${error instanceof Error ? error.message : "Failed to process request"}`
      }]);
      toast({
        title: "Error",
        description: "Failed to process your request. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-background ${theme}`}>
      {/* Header */}
      <header className="border-b p-4 bg-background flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <h1 className="text-xl font-semibold">AI Code Engineer</h1>
        </div>
        <div className="flex gap-2 items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                <RefreshCcw className="h-4 w-4 mr-2" /> Reset Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Project</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your project to its default state. All your code changes and chat history will be lost. Are you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetProject} className="bg-destructive text-destructive-foreground">
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Toggle
            aria-label="Toggle theme"
            pressed={theme === "dark"}
            onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Toggle>
          <Button size="sm" variant="outline" onClick={() => {
            updatePreview();
            setLastRefreshTime(Date.now());
          }}>
            <Play className="h-4 w-4 mr-2" /> Run Preview
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Code Editor */}
        <ResizablePanel defaultSize={50} minSize={30} className={`${isFullscreen ? 'hidden' : ''} h-full`}>
          <div className="border-r h-full flex flex-col">
            <div className="p-2 bg-muted flex items-center justify-between">
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Code Editor</span>
              </div>
              
              {/* File selector dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto">
                    {currentFile} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {files.map((file) => (
                    <DropdownMenuItem 
                      key={file.name}
                      onClick={() => setCurrentFile(file.name)}
                      className={cn(
                        "cursor-pointer",
                        currentFile === file.name && "bg-accent"
                      )}
                    >
                      {file.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <textarea
              ref={codeEditorRef}
              className="flex-1 p-4 font-mono text-sm bg-background resize-none overflow-auto w-full border-0 focus:outline-none code-editor"
              value={getCurrentFileContent()}
              onChange={(e) => updateFileContent(e.target.value)}
              spellCheck={false}
            />
          </div>
        </ResizablePanel>

        {isFullscreen ? null : <ResizableHandle withHandle />}

        {/* Right Panel - Chat and Preview */}
        <ResizablePanel defaultSize={50} minSize={30} className="h-full">
          <ResizablePanelGroup direction="vertical">
            {/* Preview Section */}
            <ResizablePanel defaultSize={50} minSize={20} className="border-b">
              <div className="h-full flex flex-col">
                <div className="p-2 bg-muted flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Preview</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 bg-white">
                  <iframe 
                    ref={previewIframeRef}
                    title="Preview"
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Chat Section */}
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="h-full flex flex-col">
                <div className="p-2 bg-muted flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Chat</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={clearChatHistory}
                    title="Clear chat history"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                {/* API Key Input */}
                {showApiKeyInput && (
                  <div className="border-b p-3">
                    <label className="block text-sm font-medium mb-1">Enter Gemini API Key</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="AIza..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <Button 
                        size="sm" 
                        onClick={saveApiKey}
                      >
                        <Save className="h-4 w-4 mr-2" /> Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your API key is stored locally and never sent to our servers.
                    </p>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4" ref={chatContainerRef}>
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
                  <Input
                    placeholder="Describe the changes you want to make..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 relative">
                          <div className="w-5 h-5 border-2 border-t-transparent border-background rounded-full animate-spin absolute"></div>
                          <div className="w-5 h-5 border-2 border-t-transparent border-background rounded-full animate-spin absolute" style={{animationDelay: "0.2s"}}></div>
                        </div>
                      </div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;

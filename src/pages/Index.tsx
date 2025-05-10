
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Code, Send, Play, Eye, MessageSquare, Sun, Moon, Save, Trash, Maximize, RefreshCcw } from "lucide-react";
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

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem("saved_code") || DEFAULT_CODE;
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

  // Update the preview when code changes
  useEffect(() => {
    updatePreview();
    // Save code to localStorage
    localStorage.setItem("saved_code", code);
  }, [code]);

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
        iframeDoc.open();
        iframeDoc.write(code);
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
    setCode(DEFAULT_CODE);
    setMessages([
      { role: "assistant", content: "Welcome! I'm your AI coding assistant. Describe the changes you'd like to make to the code and I'll help implement them." }
    ]);
    localStorage.removeItem("chat_history");
    localStorage.setItem("saved_code", DEFAULT_CODE);
    toast({
      title: "Project Reset",
      description: "Your project has been reset to its default state."
    });
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
Current code:
${code}

User request: "${userPrompt}"

Previous conversation:
${messages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Analyze the code and the user's request. Then, respond with the full updated code that incorporates the requested changes.
Follow these rules:
1. Return ONLY the complete HTML code with your changes implemented
2. Don't include explanations, just the code
3. Maintain the structure of the original code
4. Make sure all styles and scripts are included in the HTML
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
20. Maintain semantic HTML structure`;

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
        
        // Update code state
        setCode(generatedText);
        
        // Add assistant response
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "✅ Changes applied! Check the preview to see the results." 
        }]);
        
        if (showApiKeyInput) {
          saveApiKey();
        }
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
          <Button size="sm" variant="outline" onClick={() => updatePreview()}>
            <Play className="h-4 w-4 mr-2" /> Run Preview
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className={`${isFullscreen ? 'hidden' : 'w-1/2'} border-r h-full flex flex-col`}>
          <div className="p-2 bg-muted flex items-center">
            <Code className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Code Editor</span>
          </div>
          <textarea
            ref={codeEditorRef}
            className="flex-1 p-4 font-mono text-sm bg-background resize-none overflow-auto w-full border-0 focus:outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Right Panel - Chat and Preview */}
        <div className={`${isFullscreen ? 'w-full' : 'w-1/2'} h-full flex flex-col`}>
          {/* Preview Section */}
          <div className="h-1/2 border-b flex flex-col">
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

          {/* Chat Section */}
          <div className={`${isFullscreen ? 'h-1/2' : 'h-1/2'} flex flex-col`}>
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
                  <div className="w-4 h-4 border-2 border-t-transparent border-background rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

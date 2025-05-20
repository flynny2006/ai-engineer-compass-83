import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Code, Send, Play, Eye, MessageSquare, Sun, Moon, Save, Trash, Maximize, RefreshCcw, ChevronDown, FileText, Gift, Settings, Database, Plus, Image, Menu, Info, FileCode } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import PreviewSettings from "@/components/PreviewSettings";
import { packageJsonContent } from "@/data/packageJson";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import FileExplorerEnhanced from '@/components/FileExplorerEnhanced';
import FileExplorerUpload from '@/components/FileExplorerUpload';
import { useProjectFiles, FileType } from "@/hooks/use-project-files";

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
    p {
      line-height: 1.5;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>The Preview hasn't been built yet.</h1>
    <p>Ask our AI Assistant to build something to see the app here! Or Edit the Code yourself.</p>
  </div>
</body>
</html>`;

// Define initial files structure
const initialFiles: FileType[] = [{
  name: "index.html",
  content: DEFAULT_CODE,
  type: "html"
}, {
  name: "styles.css",
  content: "/* Add your CSS styles here */",
  type: "css"
}, {
  name: "script.js",
  content: "// Add your JavaScript code here",
  type: "js"
}, {
  name: "package.json",
  content: packageJsonContent,
  type: "json"
}];

const initialMessages = [{
  role: "assistant",
  content: "Welcome! I'm your AI coding assistant. Describe the changes you'd like to make to the code and I'll help implement them."
}];

const DAILY_CREDIT_LIMIT = 25;
const UNLIMITED_CODE = "3636";
const CREDIT_CODES = {
  "56722": 100,
  "757874": 500,
  "776561": 1600
};

// Number of retries for API calls
const MAX_API_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

const Index = () => {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  // Use the enhanced useProjectFiles hook
  const {
    files, 
    setFiles,
    currentFile, 
    setCurrentFile,
    mainPreviewFile, 
    setMainPreviewFile,
    updateFileContent,
    getCurrentProjectId,
    getStorageKey,
    handleFileUpload
  } = useProjectFiles(initialFiles);
  
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Array<{
    role: string;
    content: string;
    image?: string;
  }>>(initialMessages);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("gemini_api_key") || "";
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(() => !localStorage.getItem("gemini_api_key"));
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [editorView, setEditorView] = useState<"code" | "files">("code");
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [buildError, setBuildError] = useState<boolean>(false);
  
  // AI generation status
  const [aiStatus, setAiStatus] = useState<{
    active: boolean;
    currentFile: string;
    progress: number;
    files: { name: string; status: 'pending' | 'coding' | 'complete' }[];
  }>({
    active: false,
    currentFile: '',
    progress: 0,
    files: []
  });

  // Load chat messages from localStorage when component mounts or project ID changes
  useEffect(() => {
    const projectId = getCurrentProjectId();
    if (!projectId) return;
    
    try {
      const chatKey = getStorageKey("chat_history");
      const savedMessages = localStorage.getItem(chatKey);
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages(initialMessages);
        // Save initial messages to project-specific storage
        localStorage.setItem(chatKey, JSON.stringify(initialMessages));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages(initialMessages);
    }
  }, [getCurrentProjectId, getStorageKey]);

  // Credits system
  const [dailyCredits, setDailyCredits] = useState<number>(() => {
    const savedCredits = localStorage.getItem("daily_credits");
    if (savedCredits) {
      const { value, lastReset } = JSON.parse(savedCredits);
      const today = new Date().setHours(0, 0, 0, 0);
      const lastResetDate = new Date(lastReset).setHours(0, 0, 0, 0);
      if (today > lastResetDate) {
        return DAILY_CREDIT_LIMIT;
      }
      return value;
    }
    return DAILY_CREDIT_LIMIT;
  });

  // New lifetime credits system
  const [lifetimeCredits, setLifetimeCredits] = useState<number>(() => {
    return parseInt(localStorage.getItem("lifetime_credits") || "0", 10);
  });
  const [hasUnlimitedCredits, setHasUnlimitedCredits] = useState<boolean>(() => {
    return localStorage.getItem("unlimited_credits") === "true";
  });
  const [claimCode, setClaimCode] = useState<string>("");
  const [showClaimDialog, setShowClaimDialog] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [apiErrorOccurred, setApiErrorOccurred] = useState<boolean>(false);
  const [thinkingState, setThinkingState] = useState<string>("");

  // Combined credits
  const totalAvailableCredits = dailyCredits + lifetimeCredits;

  // Get current file content and language
  const getCurrentFileContent = () => {
    const file = files.find(f => f.name === currentFile);
    return file ? file.content : "";
  };
  
  const getCurrentFileLanguage = () => {
    if (currentFile.endsWith('.html')) return 'html';
    if (currentFile.endsWith('.css')) return 'css';
    if (currentFile.endsWith('.js')) return 'js';
    if (currentFile.endsWith('.ts') || currentFile.endsWith('.tsx')) return 'ts';
    if (currentFile.endsWith('.json')) return 'json';
    return 'text';
  };

  // Function to sanitize code blocks by removing backticks
  const sanitizeCodeBlocks = (text: string): string => {
    // Remove code block markers
    return text.replace(/```[\w]*\n?/g, '').replace(/```$/g, '');
  };

  // Check for code errors like triple backticks and remove them
  const checkForCodeErrors = (content: string) => {
    if (content.includes('```')) {
      const sanitizedContent = sanitizeCodeBlocks(content);
      return sanitizedContent;
    }
    return content;
  };

  // Fix code errors
  const handleFixCodeErrors = () => {
    setUserPrompt("Fix the code syntax. It appears to contain markdown backticks (```) that should be removed.");
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
    setBuildError(false);
  };

  // Save credits to localStorage
  useEffect(() => {
    const creditsData = {
      value: dailyCredits,
      lastReset: new Date().toISOString()
    };
    localStorage.setItem("daily_credits", JSON.stringify(creditsData));
  }, [dailyCredits]);

  // Save lifetime credits to localStorage
  useEffect(() => {
    localStorage.setItem("lifetime_credits", lifetimeCredits.toString());
  }, [lifetimeCredits]);

  // Save unlimited credits status
  useEffect(() => {
    if (hasUnlimitedCredits) {
      localStorage.setItem("unlimited_credits", "true");
    }
  }, [hasUnlimitedCredits]);

  // Reset credits at midnight
  useEffect(() => {
    const checkAndResetCredits = () => {
      const savedCredits = localStorage.getItem("daily_credits");
      if (savedCredits) {
        const { lastReset } = JSON.parse(savedCredits);
        const today = new Date().setHours(0, 0, 0, 0);
        const lastResetDate = new Date(lastReset).setHours(0, 0, 0, 0);
        if (today > lastResetDate) {
          setDailyCredits(DAILY_CREDIT_LIMIT);
        }
      }
    };

    const interval = setInterval(checkAndResetCredits, 60000);
    checkAndResetCredits();
    return () => clearInterval(interval);
  }, []);

  // Update the preview when files change
  useEffect(() => {
    updatePreview();
  }, [files, currentFile, mainPreviewFile, lastRefreshTime]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const projectId = getCurrentProjectId();
      if (!projectId) return;
      
      const chatKey = getStorageKey("chat_history");
      localStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, getCurrentProjectId, getStorageKey]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  
  // Enhanced updatePreview function to handle navigation
  const updatePreview = () => {
    if (previewIframeRef.current) {
      const iframe = previewIframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const htmlFile = files.find(f => f.name === mainPreviewFile) || files.find(f => f.name === "index.html");
        const cssFile = files.find(f => f.name === "styles.css");
        const jsFile = files.find(f => f.name === "script.js");

        let htmlContent = htmlFile ? htmlFile.content : DEFAULT_CODE;

        if (htmlContent && !htmlContent.includes('</head>') && cssFile) {
          htmlContent = htmlContent.replace('<html>', '<html>\n<head>\n<style>' + cssFile.content + '</style>\n</head>');
        } else if (htmlContent && cssFile) {
          htmlContent = htmlContent.replace('</head>', `<style>${cssFile.content}</style>\n</head>`);
        }

        if (htmlContent && jsFile) {
          htmlContent = htmlContent.replace('</body>', `<script>${jsFile.content}</script>\n</body>`);
        }

        const navigationScript = `
          <script>
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                  window.parent.postMessage({ type: 'navigate', href: href }, '*');
                } else {
                  window.open(link.href, '_blank');
                }
              }
            });
          </script>
        `;

        htmlContent = htmlContent.replace('</body>', `${navigationScript}</body>`);
        
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  };

  // Listen for navigation events from the iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigate') {
        const targetFile = event.data.href;
        const fileExists = files.some(f => f.name === targetFile);
        
        if (fileExists) {
          setMainPreviewFile(targetFile);
          toast({
            title: "Navigation",
            description: `Navigated to ${targetFile}`
          });
        } else {
          toast({
            title: "File not found",
            description: `The file ${targetFile} does not exist in your project`,
            variant: "destructive"
          });
        }
      }
    };
    
    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [files, setMainPreviewFile]);

  // Load initial prompt if available (from homepage)
  useEffect(() => {
    const lastPrompt = localStorage.getItem("last_prompt");
    if (lastPrompt) {
      setUserPrompt(lastPrompt);
      localStorage.removeItem("last_prompt");
    }
  }, []);
  
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
      setMessages(initialMessages);
      const chatKey = getStorageKey("chat_history");
      localStorage.removeItem(chatKey);
      toast({
        title: "Chat History Cleared",
        description: "Your conversation history has been cleared."
      });
    }
  };
  
  const resetProject = () => {
    const currentDailyCredits = dailyCredits;
    const currentLifetimeCredits = lifetimeCredits;
    const isUnlimited = hasUnlimitedCredits;
    
    setFiles(initialFiles);
    setCurrentFile("index.html");
    setMainPreviewFile("index.html");
    setMessages(initialMessages);
    setEditorView("code");
    
    if (getCurrentProjectId()) {
      const projectId = getCurrentProjectId();
      localStorage.setItem(getStorageKey("project_files"), JSON.stringify(initialFiles));
      localStorage.setItem(getStorageKey("current_file"), "index.html");
      localStorage.setItem(getStorageKey("main_preview_file"), "index.html");
      localStorage.setItem(getStorageKey("chat_history"), JSON.stringify(initialMessages));
      
      const savedProjects = localStorage.getItem("saved_projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map((project: any) => {
          if (project.id === projectId) {
            return {
              ...project,
              files: initialFiles,
              lastModified: new Date().toISOString()
            };
          }
          return project;
        });
        
        localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
      }
    }

    setDailyCredits(currentDailyCredits);
    setLifetimeCredits(currentLifetimeCredits);
    setHasUnlimitedCredits(isUnlimited);
    
    toast({
      title: "Project Reset",
      description: "Your project has been reset to its default state. Credits were preserved."
    });
    
    setLastRefreshTime(Date.now());
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleClaimCode = () => {
    if (claimCode === UNLIMITED_CODE) {
      setHasUnlimitedCredits(true);
      setShowClaimDialog(false);
      toast({
        title: "Unlimited Credits Activated!",
        description: "You now have unlimited credits to use the AI."
      });
    } else if (CREDIT_CODES[claimCode as keyof typeof CREDIT_CODES]) {
      const bonusCredits = CREDIT_CODES[claimCode as keyof typeof CREDIT_CODES];
      setLifetimeCredits(prev => prev + bonusCredits);
      setShowClaimDialog(false);
      toast({
        title: "Credits Claimed!",
        description: `You've received ${bonusCredits} lifetime credits that won't expire!`
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The code you entered is invalid.",
        variant: "destructive"
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive"
        });
        return;
      }
      setImageUpload(file);
      setShowImageUpload(true);
    }
  };

  // Convert image file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Add delay for AI response based on subscription status
  const simulateAIThinking = async () => {
    if (!hasUnlimitedCredits) {
      setThinkingState("Thinking...");
      await new Promise(resolve => setTimeout(resolve, 3500));
      setThinkingState("Building...");
      return true;
    }
    return false;
  };

  // Retry mechanism for API calls
  const callAPIWithRetry = async (url: string, options: RequestInit, maxRetries: number): Promise<Response> => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (response.ok) {
          setApiErrorOccurred(false);
          return response;
        }
        
        // If we get a 503, we'll retry
        if (response.status === 503) {
          lastError = new Error(`API error: ${response.status}`);
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
          continue;
        }
        
        // For other errors, we'll just return the response
        return response;
      } catch (error) {
        lastError = error;
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }
    
    // If we've exhausted all retries, we'll throw the last error
    setApiErrorOccurred(true);
    throw lastError;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    if (!apiKey && showApiKeyInput) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to continue."
      });
      return;
    }

    if (totalAvailableCredits <= 0 && !hasUnlimitedCredits) {
      toast({
        title: "Credit Limit Reached",
        description: "You've used all your available credits. Claim codes for more credits or wait until tomorrow for daily credits.",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage = {
      role: "user",
      content: userPrompt
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserPrompt("");
    setIsLoading(true);
    
    // Simulate AI thinking for non-subscribers
    await simulateAIThinking();

    // Set AI status as active for the chat
    setAiStatus({
      active: true,
      currentFile: '',
      progress: 0,
      files: [
        { name: 'index.html', status: 'pending' },
        { name: 'styles.css', status: 'pending' },
        { name: 'script.js', status: 'pending' }
      ]
    });

    if (!hasUnlimitedCredits) {
      if (lifetimeCredits > 0) {
        setLifetimeCredits(prev => prev - 1);
      } else {
        setDailyCredits(prev => prev - 1);
      }
    }
    
    setRetryCount(0);
    setThinkingState("");
    
    try {
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
10. Consider accessibility in your implementations`;

      const response = await callAPIWithRetry("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40
          }
        })
      }, MAX_API_RETRIES);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        let generatedText = data.candidates[0].content.parts[0].text;
        
        // Clean up any code block formatting
        generatedText = sanitizeCodeBlocks(generatedText);

        const fileMatches = generatedText.match(/---\s+([a-zA-Z0-9_.-]+)\s+---\s+([\s\S]*?)(?=(?:---\s+[a-zA-Z0-9_.-]+\s+---|$))/g);
        if (fileMatches && fileMatches.length > 0) {
          const updatedFiles = [...files];
          const newFiles: FileType[] = [];
          fileMatches.forEach(match => {
            const fileNameMatch = match.match(/---\s+([a-zA-Z0-9_.-]+)\s+---/);
            if (fileNameMatch && fileNameMatch[1]) {
              const fileName = fileNameMatch[1].trim();
              let fileContent = match.replace(/---\s+[a-zA-Z0-9_.-]+\s+---/, '').trim();
              
              // Clean any remaining backticks if present
              fileContent = fileContent.replace(/```[\w]*\n?/g, '').replace(/```$/g, '');

              const fileExt = fileName.split('.').pop() || "";

              const existingFileIndex = updatedFiles.findIndex(f => f.name === fileName);
              if (existingFileIndex >= 0) {
                updatedFiles[existingFileIndex].content = fileContent;
              } else {
                newFiles.push({
                  name: fileName,
                  content: fileContent,
                  type: fileExt
                });
              }
            }
          });

          const combinedFiles = [...updatedFiles, ...newFiles];
          setFiles(combinedFiles);

          if (newFiles.length > 0) {
            toast({
              title: `Created ${newFiles.length} new file(s)`,
              description: `Added: ${newFiles.map(f => f.name).join(', ')}`
            });
          }
        } else {
          // If no file matches, treat the entire response as content for the current file
          // Make sure to clean any code blocks first
          const cleanedContent = sanitizeCodeBlocks(generatedText);
          updateFileContent(currentFile, cleanedContent);
        }

        // Complete AI status
        setAiStatus(prev => ({
          ...prev,
          active: false,
          progress: 100,
          files: prev.files.map(file => ({ ...file, status: 'complete' }))
        }));

        setMessages(prev => [...prev, {
          role: "assistant",
          content: "✅ Changes applied! Check the preview to see the results."
        }]);
        if (showApiKeyInput) {
          saveApiKey();
        }

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
      
      // If API error occurs, show a helpful toast
      if (apiErrorOccurred) {
        toast({
          title: "API Service Temporarily Unavailable",
          description: "The AI service is experiencing high demand. Please try again in a few moments.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
      setThinkingState("");
    }
  };

  // Enhanced handleImageUpload function with retry mechanism
  const confirmImageUpload = async () => {
    if (imageUpload) {
      try {
        const base64Image = await convertToBase64(imageUpload);

        const userMessage = {
          role: "user",
          content: userPrompt || "Please build a website based on this image",
          image: base64Image
        };
        setMessages(prev => [...prev, userMessage]);
        setUserPrompt("");
        setIsLoading(true);
        setShowImageUpload(false);
        setImageUpload(null);
        
        // Simulate AI thinking for non-subscribers
        await simulateAIThinking();

        // Set AI status as active for the chat
        setAiStatus({
          active: true,
          currentFile: '',
          progress: 0,
          files: [
            { name: 'index.html', status: 'pending' },
            { name: 'styles.css', status: 'pending' },
            { name: 'script.js', status: 'pending' }
          ]
        });

        if (!hasUnlimitedCredits) {
          if (lifetimeCredits > 0) {
            setLifetimeCredits(prev => prev - 1);
          } else {
            setDailyCredits(prev => prev - 1);
          }
        }
        
        setRetryCount(0);
        setThinkingState("");
        
        try {
          const systemPrompt = `You are an expert web developer AI assistant that helps modify HTML, CSS and JavaScript code.
Current project files:
${files.map(file => `
--- ${file.name} ---
${file.content}
`).join('\n')}

User request: "${userPrompt || "Please build a website based on this image"}"
User has uploaded an image, which you'll see in your input. Please analyze it and build a website based on it.

Previous conversation:
${messages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Analyze the image and the user's request. Then, respond with the full updated files that incorporates the requested changes.

Follow these rules:
1. Return all files that need to be modified in this format:
--- filename.ext ---
Full file content here

2. Always return the complete content for each file
3. Don't include explanations, just the code files
4. Make sure to include proper links between HTML, CSS, and JS files
5. Don't include markdown formatting or code blocks, just the raw code`;

          const response = await callAPIWithRetry("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
              contents: [{
                role: "user",
                parts: [{
                  text: systemPrompt
                }, {
                  inline_data: {
                    mime_type: imageUpload.type,
                    data: base64Image.split(',')[1]
                  }
                }]
              }],
              generationConfig: {
                temperature: 0.2,
                topP: 0.8,
                topK: 40
              }
            })
          }, MAX_API_RETRIES);
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();

          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let generatedText = data.candidates[0].content.parts[0].text;
            
            // Clean up any code block formatting
            generatedText = sanitizeCodeBlocks(generatedText);

            const fileMatches = generatedText.match(/---\s+([a-zA-Z0-9_.-]+)\s+---\s+([\s\S]*?)(?=(?:---\s+[a-zA-Z0-9_.-]+\s+---|$))/g);
            if (fileMatches && fileMatches.length > 0) {
              const updatedFiles = [...files];
              const newFiles: FileType[] = [];
              fileMatches.forEach(match => {
                const fileNameMatch = match.match(/---\s+([a-zA-Z0-9_.-]+)\s+---/);
                if (fileNameMatch && fileNameMatch[1]) {
                  const fileName = fileNameMatch[1].trim();
                  let fileContent = match.replace(/---\s+[a-zA-Z0-9_.-]+\s+---/, '').trim();
                  
                  // Clean any remaining backticks if present
                  fileContent = fileContent.replace(/```[\w]*\n?/g, '').replace(/```$/g, '');

                  const fileExt = fileName.split('.').pop() || "";

                  const existingFileIndex = updatedFiles.findIndex(f => f.name === fileName);
                  if (existingFileIndex >= 0) {
                    updatedFiles[existingFileIndex].content = fileContent;
                  } else {
                    newFiles.push({
                      name: fileName,
                      content: fileContent,
                      type: fileExt
                    });
                  }
                }
              });

              const combinedFiles = [...updatedFiles, ...newFiles];
              setFiles(combinedFiles);

              if (newFiles.length > 0) {
                toast({
                  title: `Created ${newFiles.length} new file(s)`,
                  description: `Added: ${newFiles.map(f => f.name).join(', ')}`
                });
              }
            } else {
              // If no file matches, treat the entire response as content for the current file
              // Make sure to clean any code blocks first
              const cleanedContent = sanitizeCodeBlocks(generatedText);
              updateFileContent(currentFile, cleanedContent);
            }

            // Complete AI status
            setAiStatus(prev => ({
              ...prev,
              active: false,
              progress: 100,
              files: prev.files.map(file => ({ ...file, status: 'complete' }))
            }));
            
            setMessages(prev => [...prev, {
              role: "assistant",
              content: "✅ I've analyzed your image and created a website based on it! Check the preview to see the results."
            }]);
            if (showApiKeyInput) {
              saveApiKey();
            }

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
          
          // If API error occurs, show a helpful toast
          if (apiErrorOccurred) {
            toast({
              title: "API Service Temporarily Unavailable",
              description: "The AI service is experiencing high demand. Please try again in a few moments.",
              variant: "destructive"
            });
          }
        } finally {
          setIsLoading(false);
          setThinkingState("");
        }
      } catch (error) {
        console.error("Image conversion error:", error);
        toast({
          title: "Error",
          description: "Failed to process the image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Fix for CodeEditor onChange handler
  const handleFileContentChange = (newContent: string) => {
    updateFileContent(currentFile, newContent);
  };
  
  const creditPercentage = dailyCredits / DAILY_CREDIT_LIMIT * 100;
  
  return (
    <div className={`flex flex-col h-screen bg-background ${theme}`}>
      {/* Header */}
      <header className="border-b p-4 bg-background flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <h1 className={cn("text-xl font-semibold", isMobile && "sr-only")}>Boongle AI - Software Engineer</h1>
          {isMobile && <h1 className="text-lg font-semibold">Boongle AI</h1>}
        </div>
        <div className="flex gap-2 items-center">
          <Link to="/supabase">
            <Button variant={theme === 'light' ? "modern" : "outline"} size={isMobile ? "icon" : "sm"} className={isMobile ? "h-9 w-9 p-0" : ""}>
              <Database className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Supabase</span>}
            </Button>
          </Link>
          <Navigation />
          <div className="flex gap-1 md:gap-2 items-center">
            <div className={cn("flex items-center gap-1 md:gap-2", isMobile ? "mr-1" : "mr-4")}>
              <span className={cn("text-sm font-medium", isMobile && "hidden md:inline")}>
                {hasUnlimitedCredits ? "∞" : `${totalAvailableCredits}`} Credits
              </span>
              {!hasUnlimitedCredits && !isMobile && <Progress value={creditPercentage} className="w-24 h-2" />}
              <Button size={isMobile ? "icon" : "sm"} variant={theme === 'light' ? "modern" : "outline"} onClick={() => setShowClaimDialog(true)} className={isMobile ? "h-9 w-9 p-0" : ""}>
                <Gift className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Claim</span>}
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size={isMobile ? "icon" : "sm"} variant={theme === 'light' ? "modern" : "outline"} className={isMobile ? "h-9 w-9 p-0" : ""}>
                  <RefreshCcw className="h-4 w-4" />
                  {!isMobile && <span className="ml-1">Reset</span>}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isMobile ? "w-[90vw] max-w-[90vw] p-4" : ""}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your project to its default state. All your code changes, file explorer, and chat history will be lost. Are you sure you want to continue?
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
            <Toggle aria-label="Toggle theme" pressed={theme === "dark"} onPressedChange={pressed => setTheme(pressed ? "dark" : "light")} className={isMobile ? "h-9 w-9 p-0" : ""}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Toggle>
            <Button size={isMobile ? "icon" : "sm"} variant={theme === 'light' ? "modern" : "outline"} onClick={() => {
              updatePreview();
              setLastRefreshTime(Date.now());
            }} className={isMobile ? "h-9 w-9 p-0" : ""}>
              <Play className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Run</span>}
            </Button>
          </div>
        </div>
      </header>

      {/* Claim Code Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className={cn("sm:max-w-md", isMobile && "w-[90vw] max-w-[90vw] p-4 rounded-lg")}>
          <DialogHeader>
            <DialogTitle>Claim Credits</DialogTitle>
            <DialogDescription>
              Enter your code to claim additional credits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Enter claim code</label>
              <Input placeholder="Enter code..." value={claimCode} onChange={e => setClaimCode(e.target.value)} />
            </div>
            
            {/* Credits status */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Your Credits</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span>Daily:</span>
                  <span className="font-semibold">{dailyCredits}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span>Lifetime:</span>
                  <span className="font-semibold">{lifetimeCredits}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded col-span-2">
                  <span>Unlimited:</span>
                  <span className="font-semibold">{hasUnlimitedCredits ? "Yes" : "No"}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Daily credits reset every 24 hours. Lifetime credits never expire.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleClaimCode}>
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Upload Dialog */}
      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Image Upload</DialogTitle>
            <DialogDescription>
              Upload an image to generate a website design
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {imageUpload && <div className="border rounded-md p-2 flex justify-center">
                <img src={URL.createObjectURL(imageUpload)} alt="Uploaded" className="max-h-[300px] object-contain" />
              </div>}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Add a description (optional)</label>
              <Input placeholder="Describe what you want to build..." value={userPrompt} onChange={e => setUserPrompt(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelImageUpload}>
              Cancel
            </Button>
            <Button onClick={confirmImageUpload}>
              Generate Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Code Editor */}
        <ResizablePanel defaultSize={50} minSize={30} className={`${isFullscreen ? 'hidden' : ''} h-full`}>
          <div className="border-r h-full flex flex-col">
            <div className="p-2 bg-muted flex items-center justify-between">
              <Tabs value={editorView} onValueChange={value => setEditorView(value as "code" | "files")} className="w-full">
                <TabsList className={cn("grid w-60 grid-cols-2", isMobile && "w-full")}>
                  <TabsTrigger value="code">Editor</TabsTrigger>
                  <TabsTrigger value="files">File Explorer</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-2">
                {editorView === "code" && <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        {currentFile} <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {files.map(file => <DropdownMenuItem key={file.name} onClick={() => setCurrentFile(file.name)} className={cn("cursor-pointer", currentFile === file.name && "bg-accent")}>
                          {file.name}
                        </DropdownMenuItem>)}
                    </DropdownMenuContent>
                  </DropdownMenu>}
                
                <PreviewSettings files={files} mainFile={mainPreviewFile} setMainFile={setMainPreviewFile} />
              </div>
            </div>
            
            <div className="flex-1 h-full">
              <Tabs value={editorView} className="h-full">
                <TabsContent value="code" className="h-full mt-0">
                  <CodeEditor 
                    value={getCurrentFileContent()} 
                    onChange={handleFileContentChange}
                    language={getCurrentFileLanguage()}
                  />
                </TabsContent>
                
                <TabsContent value="files" className="h-full mt-0 overflow-hidden">
                  <div className="p-2">
                    <FileExplorerUpload onFileUpload={handleFileUpload} />
                  </div>
                  <FileExplorerEnhanced files={files} setFiles={setFiles} currentFile={currentFile} setCurrentFile={setCurrentFile} />
                </TabsContent>
              </Tabs>
            </div>
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
                    <span className="text-sm font-medium">Preview: {mainPreviewFile}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 bg-white">
                  <iframe ref={previewIframeRef} title="Preview" className="w-full h-full" sandbox="allow-scripts allow-same-origin" />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Chat Section */}
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="h-full flex flex-col">
                <div className="p-2 bg-muted flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Chat</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={clearChatHistory} title="Clear chat history">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                {/* AI Generation Status Panel */}
                {aiStatus.active && (
                  <div className="bg-black/80 backdrop-blur-md p-4 border border-white/10 text-white mb-4 mx-2 mt-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCode className="text-blue-400 animate-pulse" />
                      <h4 className="text-sm font-semibold">AI Generation - 2025</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{width: `${aiStatus.progress}%`}}></div>
                      </div>
                      
                      <p className="text-blue-300 font-medium">
                        {aiStatus.currentFile && (
                          <>Currently coding: <span className="text-white">{aiStatus.currentFile}</span></>
                        )}
                      </p>
                      
                      <div className="space-y-1 mt-2">
                        {aiStatus.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              file.status === 'complete' ? 'bg-green-500' : 
                              file.status === 'coding' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                            }`}></div>
                            <span className={
                              file.status === 'complete' ? 'text-green-300' : 
                              file.status === 'coding' ? 'text-blue-300' : 'text-gray-400'
                            }>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* API Key Input */}
                {showApiKeyInput && <div className="border-b p-3">
                    <label className="block text-sm font-medium mb-1">Enter Gemini API Key</label>
                    <div className="flex gap-2">
                      <Input type="password" placeholder="AIza..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
                      <Button size="sm" onClick={saveApiKey}>
                        <Save className="h-4 w-4 mr-2" /> Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your API key is stored locally and never sent to our servers.
                    </p>
                  </div>}

                {/* Credits display */}
                {!isMobile && (
                  <div className="border-b px-3 py-1.5 text-xs text-muted-foreground">
                    <span>{lifetimeCredits > 0 ? `${lifetimeCredits} lifetime` : `${dailyCredits} daily`} Credits left</span>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4" ref={chatContainerRef}>
                  <div className="space-y-4">
                    {messages.map((msg, i) => <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {msg.image && <div className="mb-3">
                              <img src={msg.image} alt="User uploaded" className="max-w-full rounded-md max-h-[200px]" />
                            </div>}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>)}
                    {thinkingState && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                          <p className="text-sm whitespace-pre-wrap flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
                            {thinkingState}
                          </p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Build Error Message */}
                {buildError && <div className="border-t p-3 bg-destructive/10">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-destructive">Build Unsuccessful</span>
                      <Button variant="destructive" size="sm" onClick={() => {
                        // Clean all file contents of backticks
                        const cleanedFiles = files.map(file => ({
                          ...file,
                          content: sanitizeCodeBlocks(file.content)
                        }));
                        setFiles(cleanedFiles);
                        setBuildError(false);
                        toast({
                          title: "Code Cleaned",
                          description: "Removed problematic code markup from all files."
                        });
                        setLastRefreshTime(Date.now());
                      }}>
                        Fix
                      </Button>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">
                      The code contains syntax errors. There might be markdown backticks (```) in the code.
                    </p>
                  </div>}

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
                  <div className="flex items-center">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading || totalAvailableCredits <= 0 && !hasUnlimitedCredits} title="Upload image">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input placeholder="Ask Boongle AI to build anything..." value={userPrompt} onChange={e => setUserPrompt(e.target.value)} disabled={isLoading || totalAvailableCredits <= 0 && !hasUnlimitedCredits} className="flex-1 rounded" />
                  <Button type="submit" variant="circle" disabled={isLoading || totalAvailableCredits <= 0 && !hasUnlimitedCredits} className="transition-transform hover:scale-105 hover:shadow-lg">
                    {isLoading ? <div className="flex items-center justify-center">
                        <div className="w-5 h-5 relative animate-spin rounded-full border-2 border-solid border-gray-300 border-t-transparent"></div>
                      </div> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up">
                        <path d="m5 12 7-7 7 7"></path>
                        <path d="M12 19V5"></path>
                      </svg>}
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

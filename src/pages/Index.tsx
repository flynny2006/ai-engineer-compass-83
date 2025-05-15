import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Code, ArrowUp, Play, Eye, MessageSquare, Sun, Moon, Save, Trash, Maximize, RefreshCcw, ChevronDown, FileText, Gift, Settings, Database, Plus, Image, Menu, Info } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import PreviewSettings from "@/components/PreviewSettings";
import { packageJsonContent } from "@/data/packageJson";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import FileExplorerEnhanced from '@/components/FileExplorerEnhanced';

// Define initial files structure
const initialFiles = [
  { name: "index.html", content: DEFAULT_CODE, type: "html" },
  { name: "styles.css", content: "/* Add your CSS styles here */", type: "css" },
  { name: "script.js", content: "// Add your JavaScript code here", type: "js" },
  { name: "package.json", content: packageJsonContent, type: "json" }
];

const initialMessages = [
  { role: "assistant", content: "Welcome! I'm your AI coding assistant. Describe the app you'd like to build and I'll help you create it with HTML, CSS, and JavaScript." }
];

const DAILY_CREDIT_LIMIT = 25;
const UNLIMITED_CODE = "3636";
const CREDIT_CODES = {
  "56722": 100,
  "757874": 500,
  "776561": 1600,
  // More can be added here in the future
};

const Index = () => {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [files, setFiles] = useState(() => {
    const savedFiles = localStorage.getItem("project_files");
    return savedFiles ? JSON.parse(savedFiles) : initialFiles;
  });
  const [currentFile, setCurrentFile] = useState(() => {
    const lastFile = localStorage.getItem("current_file");
    return lastFile || "index.html";
  });
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Array<{role: string, content: string, image?: string}>>(() => {
    const savedMessages = localStorage.getItem("chat_history");
    return savedMessages ? JSON.parse(savedMessages) : initialMessages;
  });
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
  const [mainPreviewFile, setMainPreviewFile] = useState<string>(() => {
    return localStorage.getItem("main_preview_file") || "index.html";
  });
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [buildError, setBuildError] = useState<boolean>(false);
  
  // Credits system
  const [dailyCredits, setDailyCredits] = useState<number>(() => {
    const savedCredits = localStorage.getItem("daily_credits");
    if (savedCredits) {
      const { value, lastReset } = JSON.parse(savedCredits);
      
      // Check if we need to reset credits (new day)
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

  // Update file content
  const updateFileContent = (content: string) => {
    const updatedFiles = files.map(file => 
      file.name === currentFile ? { ...file, content } : file
    );
    setFiles(updatedFiles);
    localStorage.setItem("project_files", JSON.stringify(updatedFiles));
    
    // Check for potential code errors
    checkForCodeErrors(content);
  };
  
  // Check for code errors like triple backticks
  const checkForCodeErrors = (content: string) => {
    // Check if content ends with backticks or contains double backticks
    const endsWithBackticks = content.trim().endsWith('```');
    const containsDoubleBackticks = content.includes('``````');
    
    if (endsWithBackticks || containsDoubleBackticks) {
      setBuildError(true);
    } else {
      setBuildError(false);
    }
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
    
    // Set up interval to check credits reset (every minute)
    const interval = setInterval(checkAndResetCredits, 60000);
    
    // Check on component mount
    checkAndResetCredits();
    
    return () => clearInterval(interval);
  }, []);

  // Update the preview when files change
  useEffect(() => {
    updatePreview();
    // Save files to localStorage
    localStorage.setItem("project_files", JSON.stringify(files));
    localStorage.setItem("current_file", currentFile);
    localStorage.setItem("main_preview_file", mainPreviewFile);
  }, [files, currentFile, mainPreviewFile, lastRefreshTime]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

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
        const htmlFile = files.find(f => f.name === mainPreviewFile) || 
                         files.find(f => f.name === "index.html");
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
      setMessages(initialMessages);
      localStorage.removeItem("chat_history");
      toast({
        title: "Chat History Cleared",
        description: "Your conversation history has been cleared."
      });
    }
  };

  const resetProject = () => {
    // Store current credits before reset
    const currentDailyCredits = dailyCredits;
    const currentLifetimeCredits = lifetimeCredits;
    const isUnlimited = hasUnlimitedCredits;
    
    setFiles(initialFiles);
    setCurrentFile("index.html");
    setMainPreviewFile("index.html");
    setMessages(initialMessages);
    localStorage.removeItem("chat_history");
    localStorage.setItem("project_files", JSON.stringify(initialFiles));
    localStorage.setItem("current_file", "index.html");
    localStorage.setItem("main_preview_file", "index.html");
    setEditorView("code");
    
    // Restore credits after reset
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
      // Add credits to lifetime credits
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Confirm image upload
  const confirmImageUpload = async () => {
    if (imageUpload) {
      try {
        const base64Image = await convertToBase64(imageUpload);
        
        // Create a user message with the image
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
        
        // Deduct credit if not unlimited
        if (!hasUnlimitedCredits) {
          if (lifetimeCredits > 0) {
            setLifetimeCredits(prev => prev - 1);
          } else {
            setDailyCredits(prev => prev - 1);
          }
        }
        
        try {
          // Create enhanced system prompt
          const systemPrompt = `You are a professional web developer AI assistant with expertise in HTML, CSS and JavaScript. Your task is to design and create beautiful, functional web applications based on user requests.

Current project files:
${files.map(file => `
--- ${file.name} ---
${file.content}
`).join('\n')}

User request: "${userPrompt || "Please build a website based on this image"}"
User has uploaded an image, which you'll see in your input. Please analyze it and build a website based on it.

Previous conversation:
${messages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Analyze the image and the user's request carefully. Create a responsive, modern web application that implements the requested features or changes.

Follow these guidelines:
1. Return all modified or created files in this format:
--- filename.ext ---
Full file content here

2. Always return complete file content for each file
3. Use semantic HTML5 elements and proper structure
4. Implement responsive design using flexbox and/or grid
5. Create visually appealing interfaces with attention to typography, spacing and color
6. Use modern CSS techniques including variables, animations, and transitions
7. Write clean, efficient JavaScript with proper error handling
8. Ensure cross-browser compatibility and mobile responsiveness
9. Implement proper user feedback for interactions (hover states, focus states)
10. Optimize performance and loading times
11. Consider accessibility best practices (ARIA attributes, keyboard navigation)
12. Use consistent naming conventions and code organization
13. Comment your code appropriately to explain complex logic
14. Create intuitive navigation patterns and user flows
15. Test edge cases and error conditions
16. Implement proper form validation where needed
17. Use localStorage for persistent data when appropriate
18. Create smooth transitions between application states
19. Ensure proper contrast for text readability
20. Design with a mobile-first approach`;

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
                  parts: [
                    { text: systemPrompt },
                    { inline_data: { mime_type: imageUpload.type, data: base64Image.split(',')[1] } }
                  ]
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
          
          // Process response as in regular submission
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
            
            // Add assistant response with detailed explanation
            setMessages(prev => [...prev, { 
              role: "assistant", 
              content: "I've analyzed your image and created a website that matches its design elements. The site includes responsive layouts, matching color schemes, and appropriate typography. I've implemented interactive elements and animations to enhance user experience while maintaining the visual style from your image. Check the preview to see how it looks." 
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
        } finally {
          setIsLoading(false);
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
  
  // Cancel image upload
  const cancelImageUpload = () => {
    setShowImageUpload(false);
    setImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    
    // Check if user has credits available
    if (totalAvailableCredits <= 0 && !hasUnlimitedCredits) {
      toast({
        title: "Credit Limit Reached",
        description: "You've used all your available credits. Claim codes for more credits or wait until tomorrow for daily credits.",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage = { role: "user", content: userPrompt };
    setMessages(prev => [...prev, userMessage]);
    setUserPrompt("");
    setIsLoading(true);
    
    // Deduct credit if not unlimited
    if (!hasUnlimitedCredits) {
      // First use lifetime credits, then daily credits
      if (lifetimeCredits > 0) {
        setLifetimeCredits(prev => prev - 1);
      } else {
        setDailyCredits(prev => prev - 1);
      }
    }

    try {
      // Create enhanced system prompt
      const systemPrompt = `You are a professional web developer AI assistant with expertise in HTML, CSS and JavaScript. Your task is to design and create beautiful, functional web applications based on user requests.

Current project files:
${files.map(file => `
--- ${file.name} ---
${file.content}
`).join('\n')}

User request: "${userPrompt}"

Previous conversation:
${messages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Analyze the code and the user's request carefully. Create a responsive, modern web application that implements the requested features or changes.

Follow these guidelines:
1. Return all modified or created files in this format:
--- filename.ext ---
Full file content here

2. Always return complete file content for each file
3. Use semantic HTML5 elements and proper structure
4. Implement responsive design using flexbox and/or grid
5. Create visually appealing interfaces with attention to typography, spacing and color
6. Use modern CSS techniques including variables, animations, and transitions
7. Write clean, efficient JavaScript with proper error handling
8. Ensure cross-browser compatibility and mobile responsiveness
9. Implement proper user feedback for interactions (hover states, focus states)
10. Optimize performance and loading times
11. Consider accessibility best practices (ARIA attributes, keyboard navigation)
12. Use consistent naming conventions and code organization
13. Comment your code appropriately to explain complex logic
14. Create intuitive navigation patterns and user flows
15. Test edge cases and error conditions
16. Implement proper form validation where needed
17. Use localStorage for persistent data when appropriate
18. Create smooth transitions between application states
19. Ensure proper contrast for text readability
20. Design with a mobile-first approach`;

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
        
        // Add assistant response with detailed explanation
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I've analyzed your request and implemented the changes. I've created a responsive web application with modern design principles, proper HTML structure, and efficient JavaScript. The code includes CSS animations for smooth transitions and is optimized for both desktop and mobile devices. Check the preview to see the results." 
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

  const creditPercentage = (dailyCredits / DAILY_CREDIT_LIMIT) * 100;

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
            <Button variant="outline" size={isMobile ? "icon" : "sm"} className={isMobile ? "h-9 w-9 p-0" : ""}>
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
              {!hasUnlimitedCredits && !isMobile && (
                <Progress
                  value={creditPercentage}
                  className="w-24 h-2"
                />
              )}
              <Button 
                size={isMobile ? "icon" : "sm"} 
                variant="outline" 
                onClick={() => setShowClaimDialog(true)}
                className={isMobile ? "h-9 w-9 p-0" : ""}
              >
                <Gift className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Claim</span>}
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size={isMobile ? "icon" : "sm"} 
                  variant="outline"
                  className={isMobile ? "h-9 w-9 p-0" : ""}
                >
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
            <Toggle
              aria-label="Toggle theme"
              pressed={theme === "dark"}
              onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
              className={isMobile ? "h-9 w-9 p-0" : ""}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Toggle>
            <Button 
              size={isMobile ? "icon" : "sm"} 
              variant="outline" 
              onClick={() => {
                updatePreview();
                setLastRefreshTime(Date.now());
              }}
              className={isMobile ? "h-9 w-9 p-0" : ""}
            >
              <Play className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Run</span>}
            </Button>
          </div>
        </div>
      </header>

      {/* Claim Code Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className={cn(
          "sm:max-w-md",
          isMobile && "w-[90vw] max-w-[90vw] p-4 rounded-lg"
        )}>
          <DialogHeader>
            <DialogTitle>Claim Credits</DialogTitle>
            <DialogDescription>
              Enter your code to claim additional credits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Enter claim code</label>
              <Input 
                placeholder="Enter code..." 
                value={claimCode} 
                onChange={(e) => setClaimCode(e.target.value)}
              />
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
            {imageUpload && (
              <div className="border rounded-md p-2 flex justify-center">
                <img 
                  src={URL.createObjectURL(imageUpload)} 
                  alt="Uploaded" 
                  className="max-h-[300px] object-contain"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Add a description (optional)</label>
              <Input 
                placeholder="Describe what you want to build..." 
                value={userPrompt} 
                onChange={(e) => setUserPrompt(e.target.value)}
              />
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
              <Tabs value={editorView} onValueChange={(value) => setEditorView(value as "code" | "files")} className="w-full">
                <TabsList className={cn("grid w-60 grid-cols-2", isMobile && "w-full")}>
                  <TabsTrigger value="code">Editor</TabsTrigger>
                  <TabsTrigger value="files">File Explorer</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-2">
                {editorView === "code" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
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
                )}
                
                <PreviewSettings
                  files={files}
                  mainFile={mainPreviewFile}
                  setMainFile={setMainPreviewFile}
                />
              </div>
            </div>
            
            <div className="flex-1 h-full">
              <Tabs value={editorView} className="h-full">
                <TabsContent value="code" className="h-full mt-0">
                  <CodeEditor
                    value={getCurrentFileContent()}
                    onChange={updateFileContent}
                    language={getCurrentFileLanguage()}
                  />
                </TabsContent>
                
                <TabsContent value="files" className="h-full mt-0 overflow-hidden">
                  <FileExplorerEnhanced 
                    files={files} 
                    setFiles={setFiles} 
                    currentFile={currentFile} 
                    setCurrentFile={setCurrentFile} 
                  />
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
                          {msg.image && (
                            <div className="mb-3">
                              <img 
                                src={msg.image} 
                                alt="User uploaded" 
                                className="max-w-full rounded-md max-h-[200px]" 
                              />
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Build Error Message */}
                {buildError && (
                  <div className="border-t p-3 bg-destructive/10">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-destructive">Build Unsuccessful</span>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleFixCodeErrors}
                      >
                        Fix
                      </Button>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">
                      The code contains syntax errors. There might be markdown backticks (```) in the code.
                    </p>
                  </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading || (totalAvailableCredits <= 0 && !hasUnlimitedCredits)}
                      title="Upload image"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Ask Boongle AI to build anything..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    disabled={isLoading || (totalAvailableCredits <= 0 && !hasUnlimitedCredits)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || (totalAvailableCredits <= 0 && !hasUnlimitedCredits)}
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white border shadow-sm hover:bg-gray-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 relative">
                          <div className="w-5 h-5 border-2 border-t-transparent border-background rounded-full animate-spin absolute"></div>
                          <div className="w-5 h-5 border-2 border-t-transparent border-background rounded-full animate-spin absolute" style={{animationDelay: "0.2s"}}></div>
                        </div>
                      </div>
                    ) : (
                      <ArrowUp className="h-4 w-4 text-black" />
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

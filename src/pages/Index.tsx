import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Code, Send, Play, Eye, MessageSquare, Sun, Moon, Save, Trash, Maximize, RefreshCcw, ChevronDown, FileText, Gift, Settings, Upload } from "lucide-react";
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
import ImageUploader from "@/components/ImageUploader";

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
  { name: "script.js", content: "// Add your JavaScript code here", type: "js" },
  { name: "package.json", content: packageJsonContent, type: "json" }
];

const initialMessages = [
  { role: "assistant", content: "Welcome! I'm your AI coding assistant. Describe the changes you'd like to make to the code and I'll help implement them." }
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showImageUploader, setShowImageUploader] = useState<boolean>(false);

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
    // Do NOT reset credits when resetting project
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

  // Handle image upload with the correct prop name
  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    setShowImageUploader(false);
    
    // Attach image to the next message
    if (imageData) {
      toast({
        title: "Image Uploaded",
        description: "Your image has been attached to your next message."
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userPrompt.trim() && !uploadedImage) return;
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
    
    const userMessage = { 
      role: "user", 
      content: userPrompt,
      ...(uploadedImage ? { image: uploadedImage } : {})
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserPrompt("");
    setUploadedImage(null);
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
      const systemPrompt = `You are an expert web developer AI assistant that helps modify HTML, CSS and JavaScript code.
Current project files:
${files.map(file => `
--- ${file.name} ---
${file.content}
`).join('\n')}

User request: "${userPrompt}"

Previous conversation:
${messages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

${uploadedImage ? "The user has attached an image to this request. Please analyze it carefully and create HTML/CSS/JS code that replicates this design or integrates this image appropriately. Pay attention to colors, layout, typography and the overall visual style." : ""}

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
25. Create stunning visual designs with gradients, shadows, and modern UI elements
26. Use color theory principles to create harmonious color schemes (complementary, analogous, triadic)
27. Implement skeuomorphic design elements when appropriate for added realism
28. Consider microinteractions to enhance user engagement
29. Use parallax effects and subtle animations for depth
30. Implement neumorphic design elements for a modern look
31. Use glassmorphism effects for elegant, translucent interfaces
32. Incorporate well-designed typography hierarchies with proper sizing and spacing
33. Create visually balanced layouts using the rule of thirds
34. Ensure contrast ratios meet WCAG accessibility standards
35. Use whitespace effectively to create visual hierarchy and improve readability
36. Implement dark mode considerations in all designs
37. Use CSS variables for themeable components
38. Create responsive layouts that work across all device sizes
39. Implement proper loading states and transitions
40. Use subtle hover animations to indicate interactivity
41. Create cohesive UI component systems with consistent styling
42. Use proper heading structures for semantic HTML
43. Implement proper meta tags for SEO optimization
44. Use image optimization techniques for better performance
45. Create beautiful, custom form elements that maintain accessibility
46. Use clean, scalable SVG icons where appropriate
47. Implement proper focus states for keyboard navigation
48. Use progressive enhancement principles in your implementations
49. Consider the psychological impact of color choices in your designs
50. Implement custom scrollbar styling that matches the design theme
51. Maintain proper content hierarchy for better user understanding
52. Use typography to establish a strong visual identity
53. Create custom cursor effects for enhanced interactivity
54. Implement data visualization with clean, minimal designs
55. Use grid systems for consistent spacing and alignment
56. Incorporate loading skeleton screens instead of spinners when possible
57. Use proper transitions between interactive states
58. Consider cultural color associations in your design choices
59. Implement motion designs that respect users' motion preferences
60. Use proper column widths and line lengths for optimal readability
61. Create tactile and satisfying feedback for interactive elements
62. Consider mobile-first design principles for responsive interfaces
63. Use conditional loading techniques to improve performance on mobile
64. Implement responsive touch targets for mobile users (minimum 44x44px)\n65. Optimize typography for readability on small screens
66. Consider thumb reachability zones on mobile interfaces
67. Use bottom navigation patterns for mobile interfaces
68. Implement swipe gestures for natural mobile interaction
69. Consider device-specific features like haptic feedback
70. Adapt form inputs for optimal mobile experience
71. Use viewport units for responsive sizing
72. Consider landscape and portrait orientations
73. Implement appropriate keyboard behavior on mobile
74. Consider offline usage patterns for mobile users
75. Optimize image loading and scaling for mobile devices
76. Implement responsive spacing systems that adapt to screen sizes
77. Consider reduced motion preferences for animations
78. Use appropriate color contrasts for outdoor visibility
79. Implement proper touch feedback states for mobile elements
80. Consider mobile-specific UI patterns for complex interactions
81. If an image is attached, analyze its visual style carefully
82. For image cloning, pay attention to color schemes, typography, and layout structure
83. When cloning an image, try to replicate the look and feel, not just the content
84. For UI screenshots, replicate the exact component structure and styling
85. For design inspirations, extract the color palette and apply it consistently
86. Match the typography style, spacing, and visual hierarchy from attached images
87. For product mockups, create a replica with HTML/CSS that matches the design
88. Extract color palettes from images and use CSS variables for consistent application
89. Pay attention to shadows, gradients, and texture effects in images
90. For complex images, break down the visual elements into reusable components
91. Ensure margins and padding match the visual spacing in image references
92. Use CSS grid or flexbox to match complex layouts from images
93. For branding elements in images, maintain consistent style throughout the implementation
94. Implement animations that match the visual style in motion design mockups
95. Use CSS filters to match specific visual effects from reference images`;

      // Fix the inline_data format to be compatible with TypeScript
      let requestBody: any = {
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
      };
      
      // Add image to the request if present
      if (uploadedImage) {
        requestBody.contents[0].parts.push({ 
          inline_data: {
            mime_type: "image/jpeg",
            data: uploadedImage.split(",")[1] // Remove the data:image/jpeg;base64, part
          }
        });
      }

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(requestBody)
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
                    This will reset your project to its default state. All your code changes, file explorer, and chat history will be lost. Your credits will be preserved.
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

      {/* Image Uploader Dialog */}
      <Dialog open={showImageUploader} onOpenChange={setShowImageUploader}>
        <DialogContent className={cn(
          "sm:max-w-md",
          isMobile && "w-[90vw] max-w-[90vw] p-4 rounded-lg"
        )}>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Upload an image for the AI to analyze and clone
            </DialogDescription>
          </DialogHeader>

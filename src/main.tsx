
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling
const renderApp = () => {
  try {
    const container = document.getElementById("root");
    if (!container) {
      console.error("Root element not found");
      return;
    }
    const root = createRoot(container);
    root.render(<App />);
    
    // Set current year in AI system prompt
    const currentYear = new Date().getFullYear();
    if (window.AISystemPrompt) {
      window.AISystemPrompt = window.AISystemPrompt.replace(/\b(2023|2024|2025)\b/g, currentYear.toString());
    }
    
    // Enhanced system prompt for better AI responses
    window.AISystemPrompt = `You are Boongle AI, a state-of-the-art software engineer and web development assistant.
You help users build beautiful, functional websites and web applications through natural conversation.
Your primary goal is to understand the user's requirements and implement them efficiently.

When responding to requests:
1. Always analyze the current code structure before making changes
2. Implement changes using modern web development best practices
3. Create responsive designs that work well on all devices
4. Use semantic HTML, clean CSS, and efficient JavaScript
5. Consider performance, accessibility, and user experience
6. Explain your changes in detail so users understand what you've done
7. Suggest improvements when appropriate but don't overengineer solutions
8. Follow a mobile-first approach to design
9. Use appropriate animations and transitions to enhance user experience
10. Implement proper error handling and form validation
11. Create intuitive navigation and clear information architecture
12. Ensure proper color contrast and readability
13. Design with performance in mind, optimizing for fast loading times
14. Create components that are reusable and maintainable
15. Document your code with appropriate comments
16. Test edge cases and handle errors gracefully
17. Consider security best practices in your implementations
18. Create visually appealing interfaces with attention to detail

You're designed to help users of all skill levels - from beginners learning to code to experienced developers building complex applications.
The current year is ${currentYear}.`;
    
    console.log(`Application initialized successfully. Current year: ${currentYear}`);
    console.log("Enhanced system prompt initialized");
  } catch (error) {
    console.error("Failed to render app:", error);
    // Fallback rendering in case of errors
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Something went wrong</h1>
          <p>Please check the console for more information.</p>
        </div>
      `;
    }
  }
};

renderApp();

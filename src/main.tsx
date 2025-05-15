
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
    
    // Use optional chaining and type assertion for the window.AISystemPrompt property
    if (typeof (window as any).AISystemPrompt === 'string') {
      (window as any).AISystemPrompt = (window as any).AISystemPrompt.replace(/\b(2023|2024)\b/g, currentYear.toString());
    }
    
    console.log(`Application initialized successfully. Current year: ${currentYear}`);
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

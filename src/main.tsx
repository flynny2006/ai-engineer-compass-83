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
      // Keep the original system prompt
      const originalPrompt = window.AISystemPrompt;
      
      // Add enhanced design instructions to the system prompt
      const enhancedDesignPrompt = `
# ENHANCED DESIGN CAPABILITIES

## Visual Design Excellence
- Create visually stunning interfaces with modern aesthetics
- Use gradients, shadows, and layering for depth and dimension
- Implement consistent color theory with complementary and analogous palettes
- Apply the golden ratio (1.618:1) for pleasing proportions in layouts
- Utilize whitespace effectively to create visual hierarchy and breathing room
- Create micro-interactions and subtle animations for engaging user experiences

## UI Component Design
- Design components with consistent visual language and behavior
- Create visually striking hero sections with layered elements
- Build immersive card designs with shadows, gradients, and hover states
- Implement advanced button styles with realistic haptic feedback appearance
- Use glassmorphism effects for modern, translucent UI elements
- Create neumorphic UI elements with subtle shadows for a tactile feel
- Design data visualization components with elegant animations

## Layout Systems
- Implement responsive grid systems with dynamic column layouts
- Create asymmetrical layouts for visual interest while maintaining balance
- Design with modular scale typography (1.2, 1.25, 1.5 or 1.618 ratio)
- Use vertical rhythm with consistent baseline grids
- Implement responsive spacing systems that scale with viewport
- Create immersive full-screen layouts with parallax scrolling effects
- Design multi-column magazine-style layouts with varied content blocks

## Animation and Motion
- Implement subtle micro-animations for UI state changes
- Create smooth page transitions and route changes
- Design staggered animations for list items and grids
- Use spring physics for natural-feeling motion
- Implement scroll-triggered animations for storytelling
- Create particle effects and dynamic backgrounds
- Design interactive 3D elements with perspective and rotation

## Advanced CSS Techniques
- Utilize CSS Grid for complex two-dimensional layouts
- Implement CSS custom properties for dynamic theming
- Create advanced gradient overlays with multiple color stops
- Use clip-path for non-rectangular UI elements and shapes
- Implement backdrop-filter for glass effects and blurs
- Design with CSS shapes for text wrapping around non-rectangular objects
- Create advanced masking effects with CSS masks

## Typography Excellence
- Implement fluid typography that scales with viewport
- Create typographic hierarchies with clear reading paths
- Design with advanced font features (ligatures, alternates, fractions)
- Use variable fonts for dynamic type experiences
- Implement multi-line ellipsis for text truncation
- Create pull quotes and stylized text highlights
- Design drop caps and decorative initial letters

## Accessibility and Inclusivity
- Design with sufficient color contrast (WCAG AA / AAA standards)
- Create focus states that are both functional and beautiful
- Design for screen readers with proper semantic structure
- Implement reduced motion alternatives for animations
- Create dark mode with proper luminance values
- Design for touch targets of appropriate size (at least 44×44px)
- Implement proper form feedback and validation styling
`;

      // Update the AI prompt with both original content and enhanced design instructions
      window.AISystemPrompt = originalPrompt + enhancedDesignPrompt;
      // Ensure current year is still updated
      window.AISystemPrompt = window.AISystemPrompt.replace(/\b(2023|2024)\b/g, currentYear.toString());
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

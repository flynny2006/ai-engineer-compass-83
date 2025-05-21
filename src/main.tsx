
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
- Design with a focus on visual weight and balance across all elements
- Incorporate subtle texture patterns for added dimension and character
- Apply advanced lighting principles including highlights and soft shadows
- Implement depth through parallax effects and z-axis manipulation

## UI Component Design
- Design components with consistent visual language and behavior
- Create visually striking hero sections with layered elements
- Build immersive card designs with shadows, gradients, and hover states
- Implement advanced button styles with realistic haptic feedback appearance
- Use glassmorphism effects for modern, translucent UI elements
- Create neumorphic UI elements with subtle shadows for a tactile feel
- Design data visualization components with elegant animations
- Build custom form elements with meaningful micro-interactions
- Implement skeleton loading states for improved perceived performance
- Create pristine empty states that guide and delight users
- Design responsive modals and dialogs with backdrop effects
- Craft tooltips and popovers with directional awareness

## Layout Systems
- Implement responsive grid systems with dynamic column layouts
- Create asymmetrical layouts for visual interest while maintaining balance
- Design with modular scale typography (1.2, 1.25, 1.5 or 1.618 ratio)
- Use vertical rhythm with consistent baseline grids
- Implement responsive spacing systems that scale with viewport
- Create immersive full-screen layouts with parallax scrolling effects
- Design multi-column magazine-style layouts with varied content blocks
- Implement content-aware breakpoints rather than device-specific
- Utilize CSS subgrid for advanced nested grid layouts
- Apply content-first responsive design principles
- Use container queries for component-specific responsiveness
- Implement advanced flexbox patterns for complex layouts

## Animation and Motion
- Implement subtle micro-animations for UI state changes
- Create smooth page transitions and route changes
- Design staggered animations for list items and grids
- Use spring physics for natural-feeling motion
- Implement scroll-triggered animations for storytelling
- Create particle effects and dynamic backgrounds
- Design interactive 3D elements with perspective and rotation
- Apply orchestrated animation sequences for complex interactions
- Use variable speed animations based on interaction context
- Implement gesture-driven animations for touch interfaces
- Create cinematic reveal sequences for important content
- Design playful loading animations that reflect brand personality

## Advanced CSS Techniques
- Utilize CSS Grid for complex two-dimensional layouts
- Implement CSS custom properties for dynamic theming
- Create advanced gradient overlays with multiple color stops
- Use clip-path for non-rectangular UI elements and shapes
- Implement backdrop-filter for glass effects and blurs
- Design with CSS shapes for text wrapping around non-rectangular objects
- Create advanced masking effects with CSS masks
- Utilize smooth scrolling with scroll-behavior and scroll-snap
- Implement view transitions for seamless page changes
- Use container style queries for contextual styling
- Create advanced blend modes for unique visual effects
- Implement logical properties for internationalization support

## Typography Excellence
- Implement fluid typography that scales with viewport
- Create typographic hierarchies with clear reading paths
- Design with advanced font features (ligatures, alternates, fractions)
- Use variable fonts for dynamic type experiences
- Implement multi-line ellipsis for text truncation
- Create pull quotes and stylized text highlights
- Design drop caps and decorative initial letters
- Use proper kerning and tracking for headings and body text
- Implement optimal line lengths (45-75 characters) for readability
- Create custom highlighted text treatments
- Design section headings with decorative elements
- Use contrast effectively in type weight and size

## Accessibility and Inclusivity
- Design with sufficient color contrast (WCAG AA / AAA standards)
- Create focus states that are both functional and beautiful
- Design for screen readers with proper semantic structure
- Implement reduced motion alternatives for animations
- Create dark mode with proper luminance values
- Design for touch targets of appropriate size (at least 44×44px)
- Implement proper form feedback and validation styling
- Design with color blindness considerations in mind
- Create interfaces that work with keyboard navigation
- Implement proper heading hierarchy for screen readers
- Design voice user interface patterns
- Use appropriate text spacing for dyslexic users

## Visual Storytelling
- Create cohesive visual narratives through scrolling experiences
- Design progressive disclosure patterns for complex information
- Implement visual metaphors that enhance understanding
- Create data visualizations that tell compelling stories
- Design with purposeful color symbolism and psychology
- Implement visual hierarchy that guides users through journeys
- Create emotional design elements that build connection
- Design interfaces that transform based on user progression
- Implement subtle easter eggs that delight and surprise

## Brand Integration
- Create design systems that express brand personality
- Implement consistent visual language across components
- Design with brand color psychology in mind
- Create custom illustrations and icons that reflect brand values
- Implement typography systems that align with brand voice
- Design microinteractions that express brand personality
- Create custom animations that reinforce brand attributes
- Design gradients and color treatments unique to the brand
- Implement signature patterns or textures for brand recognition
- Create brand-aligned empty and error states

## Color Mastery
- Design with purposeful color palettes that evoke specific emotions
- Use strategic color accents to guide attention and create focal points
- Create color systems with accessible contrast ratios at all levels
- Implement context-aware color schemes that adapt to content
- Design with color psychology principles for target audiences
- Create advanced gradient systems with multiple color stops and angles
- Use split complementary color schemes for sophisticated palettes
- Implement dynamic darkening/lightening for interactive elements
- Design with color temperature to create depth and atmosphere
- Create color harmonies that support information hierarchies
- Use vibrance and saturation strategically for emphasis
- Design duotone and tritone effects for unique brand aesthetics

## Elevated Imagery & Graphics
- Create custom UI illustration systems with consistent style
- Design abstract geometric patterns for backgrounds and accents
- Use image treatments with creative cropping and framing
- Implement advanced image hover effects and reveals
- Create layered image compositions with depth and dimension
- Design image galleries with thoughtful grid arrangements
- Use image masks and cutouts for creative layouts
- Implement subtle image animations on scroll or hover
- Create hero images with foreground/background separation
- Design with integrated text and image compositions
- Use image color grading to match brand palette
- Implement responsive image art direction for different viewports
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

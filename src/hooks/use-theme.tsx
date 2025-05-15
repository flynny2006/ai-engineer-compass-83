
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => null,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference in localStorage or use system preference
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      
      if (!savedTheme) {
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        return systemPreference;
      }
      
      return savedTheme || "light";
    }
    
    return "light";
  });

  // Apply theme class to document
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Apply custom CSS variables for the completely redesigned dark mode
    if (theme === "dark") {
      // Modern dark theme with deep blues and purples
      root.style.setProperty("--background", "224 71% 4%"); // Dark blue-black background
      root.style.setProperty("--foreground", "213 31% 91%"); // Light blue-white text
      
      root.style.setProperty("--card", "224 71% 4%"); // Dark blue-black card
      root.style.setProperty("--card-foreground", "213 31% 91%"); // Light blue-white text
      
      root.style.setProperty("--popover", "224 71% 4%"); // Dark blue-black popover
      root.style.setProperty("--popover-foreground", "213 31% 91%"); // Light blue-white text
      
      root.style.setProperty("--primary", "262 80% 70%"); // Vibrant purple primary
      root.style.setProperty("--primary-foreground", "210 20% 98%"); // Nearly white primary text
      
      root.style.setProperty("--secondary", "215 27% 11%"); // Dark blue secondary
      root.style.setProperty("--secondary-foreground", "210 20% 98%"); // Nearly white secondary text
      
      root.style.setProperty("--muted", "215 27% 11%"); // Dark blue muted
      root.style.setProperty("--muted-foreground", "217 33% 60%"); // Muted blue-gray text
      
      root.style.setProperty("--accent", "215 27% 11%"); // Dark blue accent
      root.style.setProperty("--accent-foreground", "210 20% 98%"); // Nearly white accent text
      
      root.style.setProperty("--destructive", "0 62% 30%"); // Deep red for destructive
      root.style.setProperty("--destructive-foreground", "210 20% 98%"); // Nearly white destructive text
      
      root.style.setProperty("--border", "215 28% 17%"); // Dark blue border
      root.style.setProperty("--input", "215 28% 17%"); // Dark blue input
      root.style.setProperty("--ring", "262 80% 70%"); // Vibrant purple ring
      
      // Update sidebar colors to match completely modernized dark theme
      root.style.setProperty("--sidebar-background", "224 71% 4%"); // Dark blue-black sidebar
      root.style.setProperty("--sidebar-foreground", "213 31% 91%"); // Light blue-white text
      root.style.setProperty("--sidebar-primary", "262 80% 70%"); // Vibrant purple primary
      root.style.setProperty("--sidebar-primary-foreground", "0 0% 100%"); // Pure white text
      root.style.setProperty("--sidebar-accent", "215 27% 11%"); // Dark blue accent
      root.style.setProperty("--sidebar-accent-foreground", "213 31% 91%"); // Light blue-white text
      root.style.setProperty("--sidebar-border", "215 28% 17%"); // Dark blue border
      root.style.setProperty("--sidebar-ring", "262 80% 70%"); // Vibrant purple ring
      
      // Syntax highlighting variables for dark mode - more vibrant colors
      root.style.setProperty("--syntax-keyword", "262 80% 70%"); // Vibrant purple for keywords
      root.style.setProperty("--syntax-string", "35 90% 61%"); // Bright gold for strings
      root.style.setProperty("--syntax-comment", "220 14% 53%"); // Muted blue-gray for comments
      root.style.setProperty("--syntax-number", "176 85% 55%"); // Bright cyan for numbers
      root.style.setProperty("--syntax-class", "290 90% 80%"); // Bright magenta for classes
      root.style.setProperty("--syntax-property", "197 90% 70%"); // Bright blue for properties
      root.style.setProperty("--syntax-tag", "330 90% 70%"); // Bright pink for tags
      root.style.setProperty("--syntax-attribute", "119 80% 50%"); // Bright green for attributes
      root.style.setProperty("--syntax-operator", "35 90% 61%"); // Gold for operators
      root.style.setProperty("--syntax-function", "35 90% 61%"); // Gold for functions
    } else {
      // Reset custom properties when in light mode
      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--card");
      root.style.removeProperty("--card-foreground");
      root.style.removeProperty("--popover");
      root.style.removeProperty("--popover-foreground");
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--secondary-foreground");
      root.style.removeProperty("--muted");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--destructive");
      root.style.removeProperty("--destructive-foreground");
      root.style.removeProperty("--border");
      root.style.removeProperty("--input");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--sidebar-background");
      root.style.removeProperty("--sidebar-foreground");
      root.style.removeProperty("--sidebar-primary");
      root.style.removeProperty("--sidebar-primary-foreground");
      root.style.removeProperty("--sidebar-accent");
      root.style.removeProperty("--sidebar-accent-foreground");
      root.style.removeProperty("--sidebar-border");
      root.style.removeProperty("--syntax-keyword");
      root.style.removeProperty("--syntax-string");
      root.style.removeProperty("--syntax-comment");
      root.style.removeProperty("--syntax-number");
      root.style.removeProperty("--syntax-class");
      root.style.removeProperty("--syntax-property");
      root.style.removeProperty("--syntax-tag");
      root.style.removeProperty("--syntax-attribute");
      root.style.removeProperty("--syntax-operator");
      root.style.removeProperty("--syntax-function");
    }
  }, [theme]);

  // Listen for system preference changes with safety checks
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

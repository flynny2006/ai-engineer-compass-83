
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
      // Enhanced light mode with cleaner, more modern aesthetics
      root.style.setProperty("--background", "0 0% 100%"); // Pure white background
      root.style.setProperty("--foreground", "222 47% 11%"); // Dark blue-gray text
      
      root.style.setProperty("--card", "0 0% 100%"); // White card
      root.style.setProperty("--card-foreground", "222 47% 11%"); // Dark blue-gray text
      
      root.style.setProperty("--popover", "0 0% 100%"); // White popover
      root.style.setProperty("--popover-foreground", "222 47% 11%"); // Dark blue-gray text
      
      root.style.setProperty("--primary", "262 83% 58%"); // Vibrant purple primary
      root.style.setProperty("--primary-foreground", "0 0% 100%"); // White primary text
      
      root.style.setProperty("--secondary", "220 14% 96%"); // Light gray secondary
      root.style.setProperty("--secondary-foreground", "222 47% 11%"); // Dark blue-gray secondary text
      
      root.style.setProperty("--muted", "220 14% 96%"); // Light gray muted
      root.style.setProperty("--muted-foreground", "220 8% 46%"); // Gray text for muted
      
      root.style.setProperty("--accent", "220 14% 96%"); // Light gray accent
      root.style.setProperty("--accent-foreground", "222 47% 11%"); // Dark blue-gray accent text
      
      root.style.setProperty("--destructive", "0 84% 60%"); // Bright red destructive
      root.style.setProperty("--destructive-foreground", "210 20% 98%"); // Light destructive text
      
      root.style.setProperty("--border", "220 13% 91%"); // Light gray border
      root.style.setProperty("--input", "220 13% 91%"); // Light gray input
      root.style.setProperty("--ring", "262 83% 58%"); // Purple ring
      
      // Light mode syntax highlighting - cleaner, more readable colors
      root.style.setProperty("--syntax-keyword", "262 60% 50%"); // Purple for keywords
      root.style.setProperty("--syntax-string", "22 80% 45%"); // Orange-brown for strings
      root.style.setProperty("--syntax-comment", "220 10% 50%"); // Gray for comments
      root.style.setProperty("--syntax-number", "195 70% 50%"); // Blue for numbers
      root.style.setProperty("--syntax-class", "280 60% 50%"); // Magenta for classes
      root.style.setProperty("--syntax-property", "210 80% 45%"); // Blue for properties
      root.style.setProperty("--syntax-tag", "330 70% 45%"); // Pink for tags
      root.style.setProperty("--syntax-attribute", "90 60% 40%"); // Green for attributes
      root.style.setProperty("--syntax-operator", "35 80% 45%"); // Orange for operators
      root.style.setProperty("--syntax-function", "210 80% 45%"); // Blue for functions
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

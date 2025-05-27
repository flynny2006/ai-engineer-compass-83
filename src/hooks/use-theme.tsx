
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light", // Default to light or derive from system
  setTheme: () => null,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light"; // Fallback for server-side rendering or environments without window
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Apply custom CSS variables. These should ideally match definitions in index.css
    // for consistency and serve as JS-driven overrides if needed.
    if (theme === "dark") {
      // Modern dark theme with deep blues and purples
      root.style.setProperty("--background", "224 71% 4%"); 
      root.style.setProperty("--foreground", "213 31% 91%"); 
      root.style.setProperty("--card", "224 71% 4%"); 
      root.style.setProperty("--card-foreground", "213 31% 91%"); 
      root.style.setProperty("--popover", "224 71% 4%"); 
      root.style.setProperty("--popover-foreground", "213 31% 91%"); 
      root.style.setProperty("--primary", "262 80% 70%"); 
      root.style.setProperty("--primary-foreground", "210 20% 98%"); 
      root.style.setProperty("--secondary", "215 27% 11%"); 
      root.style.setProperty("--secondary-foreground", "210 20% 98%"); 
      root.style.setProperty("--muted", "215 27% 11%"); 
      root.style.setProperty("--muted-foreground", "217 33% 60%"); 
      root.style.setProperty("--accent", "215 27% 11%"); 
      root.style.setProperty("--accent-foreground", "210 20% 98%"); 
      root.style.setProperty("--destructive", "0 62% 30%"); 
      root.style.setProperty("--destructive-foreground", "210 20% 98%"); 
      root.style.setProperty("--border", "215 28% 17%"); 
      root.style.setProperty("--input", "215 28% 17%"); 
      root.style.setProperty("--ring", "262 80% 70%"); 
      
      // Update sidebar colors for dark theme
      root.style.setProperty("--sidebar-background", "222 47% 11%");
      root.style.setProperty("--sidebar-foreground", "210 40% 98%");
      root.style.setProperty("--sidebar-primary", "263 70% 66%");
      root.style.setProperty("--sidebar-primary-foreground", "210 40% 98%");
      root.style.setProperty("--sidebar-accent", "217 33% 17%");
      root.style.setProperty("--sidebar-accent-foreground", "210 40% 98%");
      root.style.setProperty("--sidebar-border", "215 28% 22%");
      root.style.setProperty("--sidebar-ring", "263 70% 66%");
      
      // Syntax highlighting variables for dark mode
      root.style.setProperty("--syntax-keyword", "var(--dark-syntax-keyword)");
      root.style.setProperty("--syntax-string", "var(--dark-syntax-string)");
      root.style.setProperty("--syntax-comment", "var(--dark-syntax-comment)");
      root.style.setProperty("--syntax-number", "var(--dark-syntax-number)");
      root.style.setProperty("--syntax-class", "var(--dark-syntax-class)");
      root.style.setProperty("--syntax-property", "var(--dark-syntax-property)");
      root.style.setProperty("--syntax-tag", "var(--dark-syntax-tag)");
      root.style.setProperty("--syntax-attribute", "var(--dark-syntax-attribute)");
      root.style.setProperty("--syntax-operator", "var(--dark-syntax-operator)");
      root.style.setProperty("--syntax-function", "var(--dark-syntax-function)");

    } else {
      // Enhanced light mode - yellowish tint
      root.style.setProperty("--background", "var(--light-background)"); // "48 90% 97%"
      root.style.setProperty("--foreground", "var(--light-foreground)"); // "220 25% 15%"
      root.style.setProperty("--card", "var(--light-card)"); // "45 100% 98%"
      root.style.setProperty("--card-foreground", "var(--light-foreground)");
      root.style.setProperty("--popover", "var(--light-popover)"); // "45 100% 98%"
      root.style.setProperty("--popover-foreground", "var(--light-foreground)");
      root.style.setProperty("--primary", "var(--light-primary)"); // "248 85% 60%"
      root.style.setProperty("--primary-foreground", "var(--light-primary-foreground)"); // "0 0% 100%"
      root.style.setProperty("--secondary", "var(--light-secondary)"); // "48 70% 94%"
      root.style.setProperty("--secondary-foreground", "var(--light-secondary-foreground)"); // "220 25% 20%"
      root.style.setProperty("--muted", "var(--light-muted)"); // "48 75% 95%"
      root.style.setProperty("--muted-foreground", "var(--light-muted-foreground)"); // "215 20% 45%"
      root.style.setProperty("--accent", "var(--light-accent)"); // "48 80% 92%"
      root.style.setProperty("--accent-foreground", "var(--light-accent-foreground)"); // "220 25% 18%"
      root.style.setProperty("--destructive", "0 70% 55%"); 
      root.style.setProperty("--destructive-foreground", "0 0% 100%");
      root.style.setProperty("--border", "var(--light-border)"); // "45 50% 90%"
      root.style.setProperty("--input", "var(--light-input)"); // "45 50% 92%"
      root.style.setProperty("--ring", "var(--light-ring)"); // "248 80% 58%"
      
      // Standard light mode sidebar colors (can be adjusted if yellowish tint desired for sidebar too)
      root.style.setProperty("--sidebar-background", "0 0% 98%");
      root.style.setProperty("--sidebar-foreground", "240 5.3% 26.1%");
      root.style.setProperty("--sidebar-primary", "248 90% 66%");
      root.style.setProperty("--sidebar-primary-foreground", "0 0% 98%");
      root.style.setProperty("--sidebar-accent", "240 4.8% 95.9%");
      root.style.setProperty("--sidebar-accent-foreground", "240 5.9% 10%");
      root.style.setProperty("--sidebar-border", "220 13% 91%");
      root.style.setProperty("--sidebar-ring", "248 90% 66%");

      // Syntax highlighting variables for light mode
      root.style.setProperty("--syntax-keyword", "var(--light-syntax-keyword)");
      root.style.setProperty("--syntax-string", "var(--light-syntax-string)");
      root.style.setProperty("--syntax-comment", "var(--light-syntax-comment)");
      root.style.setProperty("--syntax-number", "var(--light-syntax-number)");
      root.style.setProperty("--syntax-class", "var(--light-syntax-class)");
      root.style.setProperty("--syntax-property", "var(--light-syntax-property)");
      root.style.setProperty("--syntax-tag", "var(--light-syntax-tag)");
      root.style.setProperty("--syntax-attribute", "var(--light-syntax-attribute)");
      root.style.setProperty("--syntax-operator", "var(--light-syntax-operator)");
      root.style.setProperty("--syntax-function", "var(--light-syntax-function)");
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) { // Only change if no explicit theme is set
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};


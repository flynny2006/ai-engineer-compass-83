
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
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    // Check for system preference if no saved preference
    if (!savedTheme) {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      return systemPreference;
    }
    
    return savedTheme || "light";
  });

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Apply custom CSS variables for the gray-black theme when in dark mode
    if (theme === "dark") {
      root.style.setProperty("--background", "222 18% 11%"); // Dark gray-black background
      root.style.setProperty("--foreground", "210 40% 98%");
      
      root.style.setProperty("--card", "222 18% 11%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      
      root.style.setProperty("--popover", "222 18% 11%");
      root.style.setProperty("--popover-foreground", "210 40% 98%");
      
      root.style.setProperty("--primary", "210 40% 98%");
      root.style.setProperty("--primary-foreground", "222 47.4% 11.2%");
      
      root.style.setProperty("--secondary", "217 19% 27%"); // Darker gray for secondary elements
      root.style.setProperty("--secondary-foreground", "210 40% 98%");
      
      root.style.setProperty("--muted", "217 19% 27%");
      root.style.setProperty("--muted-foreground", "215 20.2% 65.1%");
      
      root.style.setProperty("--accent", "217 19% 27%");
      root.style.setProperty("--accent-foreground", "210 40% 98%");
      
      root.style.setProperty("--destructive", "0 62.8% 30.6%");
      root.style.setProperty("--destructive-foreground", "0 0% 98%");
      
      root.style.setProperty("--border", "217 19% 27%");
      root.style.setProperty("--input", "217 19% 27%");
      root.style.setProperty("--ring", "224.3 76.3% 48%");
      
      // Update sidebar colors to match gray-black theme
      root.style.setProperty("--sidebar-background", "222 30% 9%");
      root.style.setProperty("--sidebar-foreground", "210 40% 98%");
      root.style.setProperty("--sidebar-accent", "217 19% 27%");
      root.style.setProperty("--sidebar-accent-foreground", "210 40% 98%");
      root.style.setProperty("--sidebar-border", "217 19% 27%");
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
      root.style.removeProperty("--sidebar-accent");
      root.style.removeProperty("--sidebar-accent-foreground");
      root.style.removeProperty("--sidebar-border");
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
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

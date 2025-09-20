// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const {settings} = useAuth();
  const [theme, setTheme] = useState();

  // set theme when account settings data is updated
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  // set theme when account settings data is updated
  useEffect(() => {
    if(settings) {

      setTheme(settings && settings.enable_dark_mode == 1 ? "dark" : "light")
    }
  }, [settings])

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

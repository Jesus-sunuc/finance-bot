import { useContext } from "react";
import { ThemeContext } from "./themeContext";

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useTheme = () => {
  const { theme } = useThemeContext();
  return theme;
};

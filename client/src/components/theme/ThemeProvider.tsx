import { useState, useEffect, type FC, type ReactNode } from "react";
import { ThemeContext } from "./themeContext";

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const themeSetEvent = new CustomEvent("theme", {
      detail: { theme },
    });
    window.dispatchEvent(themeSetEvent);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

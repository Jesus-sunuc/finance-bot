import React from "react";
import { useThemeContext } from "./useThemeContext";

export const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  const handleThemeChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <button
      className="active btn btn-transparent fs-4 ml-3 border-0"
      onClick={handleThemeChange}
      data-toggle="popover"
      data-content="Theme"
      title={getThemePopoverTitle(theme)}
    >
      <i className={`bi-${getThemeIcon(theme)}`} />
    </button>
  );
};

function getThemeIcon(theme: string) {
  if (theme === "light") {
    return "brightness-high-fill";
  } else if (theme === "dark") {
    return "moon-stars-fill";
  }
}

function getThemePopoverTitle(theme: string) {
  if (theme === "light") {
    return "Light Theme";
  } else if (theme === "dark") {
    return "Dark Theme";
  } else {
    return "System Default Theme";
  }
}
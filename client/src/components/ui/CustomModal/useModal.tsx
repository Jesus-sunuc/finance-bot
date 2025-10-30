import { useState } from "react";
import type { CustomModalControls } from "./CustomModal";

export const useModal = (
  label: string,
  size: string = "notincludedanywhere"
): CustomModalControls => {
  const random = (Math.random() + 1).toString(36).substring(7);
  const [id, _setId] = useState(
    `custoModalLabel${label
      .replace(/ /g, "")
      .replace(/[^\w\s']|_/g, "")}${random}`
  );
  const [isOpen, setIsOpen] = useState(false);

  // Map Bootstrap size classes to Tailwind classes
  const getSizeClass = () => {
    if (size === "sm") return "max-w-sm";
    if (size === "lg") return "max-w-4xl";
    if (size === "xl") return "max-w-6xl";
    if (size === "fullscreen") return "max-w-full h-full";
    return "max-w-lg"; // default
  };

  const sizeClass = getSizeClass();

  const hide = () => {
    setIsOpen(false);
  };

  const show = () => {
    setIsOpen(true);
  };

  const isHidden = () => {
    return !isOpen;
  };

  return { hide, show, sizeClass, id, label, isHidden, isOpen };
};

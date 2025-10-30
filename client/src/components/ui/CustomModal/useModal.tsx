import { Modal } from "bootstrap";
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
  const validSizes = [
    "sm",
    "lg",
    "xl",
    "fullscreen",
    "fullscreen-sm-down",
    "fullscreen-md-down",
    "fullscreen-lg-down",
    "fullscreen-xl-down",
    "fullscreen-xxl-down",
  ];
  const sizeClass = size.includes("fullscreen")
    ? validSizes.includes(size)
      ? `modal-xl modal-${size}`
      : ``
    : validSizes.includes(size)
      ? `modal-${size}`
      : ``;

  const hide = () => {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  };
  const show = () => {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = new Modal(modalElement);
      if (modal) {
        modal.show();
      }
    }
  };

  const isHidden = () => {
    const modal = document.getElementById(id);
    return !modal?.style.display;
  };
  return { hide, show, sizeClass, id, label, isHidden };
};

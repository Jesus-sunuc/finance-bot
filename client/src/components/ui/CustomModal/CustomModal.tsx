import React, { type FC, useEffect } from "react";
import { createPortal } from "react-dom";

export interface CustomModalControls {
  hide: () => void;
  show: () => void;
  sizeClass: string;
  id: string;
  label: string;
  isHidden: () => boolean;
}

export type ModalButton = FC<{
  showModal: () => void;
}>;

export const CustomModal: FC<{
  controls: CustomModalControls;
  ModalButton?: ModalButton;
  dismissible?: boolean;
  onClose?: () => void;
  onShow?: () => void;
  children: React.ReactNode;
}> = ({
  controls,
  ModalButton,
  dismissible = true,
  onClose,
  onShow,
  children,
}) => {
  useEffect(() => {
    const customModalElement = document.getElementById(controls.id);
    const listener = () => {
      if (onShow) onShow();
    };
    if (customModalElement) {
      customModalElement.addEventListener("shown.bs.modal", listener);
    }
    return () =>
      customModalElement?.removeEventListener("show.bs.modal", listener);
  }, [controls.id, onShow]);

  useEffect(() => {
    const customModalElement = document.getElementById(controls.id);
    const listener = () => {
      if (onClose) onClose();
    };
    if (customModalElement) {
      customModalElement.addEventListener("hidden.bs.modal", listener);
    }
    return () =>
      customModalElement?.removeEventListener("hidden.bs.modal", listener);
  }, [controls.id, onClose]);

  const portalElement = document.querySelector("#custom-modal-portal");

  return (
    <>
      {ModalButton ? (
        <ModalButton showModal={controls.show} />
      ) : (
        <button className="btn btn-bold w-100" onClick={controls.show}>
          {controls.label}
        </button>
      )}
      {portalElement &&
        createPortal(
          <div
            className="modal fade"
            data-bs-backdrop={dismissible ? "true" : "static"}
            id={controls.id}
            tabIndex={-1}
          >
            <div
              className={
                `modal-dialog modal-dialog-centered modal-dialog-scrollable ` +
                controls.sizeClass
              }
            >
              <div className="modal-content">{children}</div>
            </div>
          </div>,
          portalElement
        )}
    </>
  );
};

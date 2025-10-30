import React, { type FC, useEffect } from "react";
import { createPortal } from "react-dom";

export interface CustomModalControls {
  hide: () => void;
  show: () => void;
  sizeClass: string;
  id: string;
  label: string;
  isHidden: () => boolean;
  isOpen: boolean;
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
    if (controls.isOpen && onShow) {
      onShow();
    }
  }, [controls.isOpen, onShow]);

  useEffect(() => {
    if (!controls.isOpen && onClose) {
      onClose();
    }
  }, [controls.isOpen, onClose]);

  const portalElement = document.querySelector("#custom-modal-portal");

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dismissible && e.target === e.currentTarget) {
      controls.hide();
    }
  };

  return (
    <>
      {ModalButton ? (
        <ModalButton showModal={controls.show} />
      ) : (
        <button
          className="w-full py-2 px-4 bg-badger-orange text-white rounded hover:bg-badger-orange-600 transition-colors"
          onClick={controls.show}
        >
          {controls.label}
        </button>
      )}
      {portalElement &&
        controls.isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackdropClick}
            id={controls.id}
          >
            <div
              className={`
                bg-white dark:bg-gray-800 
                rounded-lg shadow-xl 
                overflow-y-auto 
                max-h-[90vh] 
                w-full mx-4
                ${controls.sizeClass}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </div>,
          portalElement
        )}
    </>
  );
};

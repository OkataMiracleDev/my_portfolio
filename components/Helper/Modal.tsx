"use client";
import React, { ReactNode, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10002] flex items-center justify-center p-4"
      style={{ background: 'oklch(0.12 0.05 285 / 0.9)' }}
      onClick={onClose}
    >
      <div 
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: 'oklch(0.25 0.04 285 / 0.5)',
            color: 'var(--color-text-primary)',
          }}
          aria-label="Close modal"
        >
          <span className="text-2xl">×</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

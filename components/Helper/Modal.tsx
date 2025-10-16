"use client";
import React, { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[60%] lg:w-[50%] h-[85%] mt-10 md:mt-0 overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="fixed md:absolute top-25 md:top-3 right-10 md:right-4 text-gray-500 hover:text-black text-5xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

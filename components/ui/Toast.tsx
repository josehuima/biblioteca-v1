"use client";

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  return createPortal(
    <div
      className={`fixed bottom-4 right-4 flex items-center ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out z-50`}
      role="alert"
    >
      <span className="mr-2">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>,
    document.body
  );
};

export default Toast; 
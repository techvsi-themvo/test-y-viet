'use client';

import React from 'react';

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  isShowCloseIcon?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  isShowCloseIcon = true,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 min-w-[300px] relative">
        {isShowCloseIcon && (
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-black"
            onClick={onClose}
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl w-full m-4"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b text-xl font-semibold text-gray-800">{children}</div>;
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 text-gray-700">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-t flex justify-end bg-gray-50">{children}</div>;
}

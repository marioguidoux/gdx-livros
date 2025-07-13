import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full bg-white rounded-full border border-gray-300 px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}

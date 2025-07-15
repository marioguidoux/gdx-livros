import './globals.css';
import React from 'react';

export const metadata = {
  title: 'GDX Livros',
  description: 'Galeria de livros',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}

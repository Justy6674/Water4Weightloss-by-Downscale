
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookUser } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Water4Weightloss',
  description: 'Track your hydration and achieve your weight loss goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#334155" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
        <Toaster />
        <footer className="bg-card/50 mt-auto p-4 text-muted-foreground text-sm border-t">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
             <p className="text-center sm:text-left">&copy; 2024 Water4Weightloss. All rights reserved.</p>
             <p className="text-center sm:text-right">This is a demo application. Please consult a healthcare professional for medical advice.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

    
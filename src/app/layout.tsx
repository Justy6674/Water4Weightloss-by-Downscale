
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookUser } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Water4Weightloss by Downscale',
  description: 'Track your hydration and achieve your weight loss goals.',
  icons: {
    icon: '/favicon.ico',
  },
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
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
        <Toaster />
        <footer className="bg-card/50 mt-auto p-4 text-center text-muted-foreground text-sm border-t">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
             <p>&copy; 2024 Downscale Weight Loss Clinic. All rights reserved.</p>
              <Button asChild variant="outline">
                <Link href="https://www.downscale.com.au" target="_blank" rel="noopener noreferrer">
                  <BookUser className="mr-2 h-4 w-4" />
                  Book a Consultation (Australia)
                </Link>
              </Button>
          </div>
        </footer>
      </body>
    </html>
  );
}

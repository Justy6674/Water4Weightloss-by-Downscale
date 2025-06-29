
import type {Metadata} from 'next';
import { Inter, Roboto, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
  variable: '--font-headline',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

export const metadata: Metadata = {
  title: 'Water4Weightloss',
  description: 'Track your hydration and achieve your weight loss goals.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#334155',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${roboto.variable} ${jetbrainsMono.variable}`}>
      <head />
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


import type { Metadata, Viewport } from 'next';
import { Inter, Roboto, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';

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
    icon: '/favicon 192x192.png',
    apple: '/favicon 192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#334155',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${roboto.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

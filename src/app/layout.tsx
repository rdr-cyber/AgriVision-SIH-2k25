import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AiChatbot } from '@/components/chatbot';
import './globals.css';
import { CartProvider } from '@/context/cart-context';

export const metadata: Metadata = {
  title: 'AgriVision: AI & Blockchain Powered Herb Traceability',
  description:
    'AI-Driven Quality Check & Blockchain Traceability for Herbs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          {children}
          <AiChatbot />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
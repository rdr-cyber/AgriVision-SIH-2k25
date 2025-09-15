import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AiChatbot } from '@/components/chatbot';
import './globals.css';
import { CartProvider } from '@/context/cart-context';

export const metadata: Metadata = {
  title: 'AgriVision: AI & Blockchain Powered Herb Traceability',
  description:
    'AI-Driven Quality Check & Blockchain Traceability for Herbs - Developed by Team 404 Not Found for Smart India Hackathon 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AgriVision - Blockchain-enabled Herbal Supply Chain</title>
      </head>
      <body>
        <CartProvider>
          {children}
          <Toaster />
          <AiChatbot />
        </CartProvider>
      </body>
    </html>
  );
}
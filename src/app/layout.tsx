import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { WalletProvider } from '@/contexts/wallet-context';
import Header from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FundChain',
  description: 'A Web3 crowdfunding platform where anyone can create a campaign, receive donations, and withdraw funds when the goal is met.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <WalletProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}

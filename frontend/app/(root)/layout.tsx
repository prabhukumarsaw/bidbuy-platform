'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Loading from '../loading';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuctionPage = pathname?.startsWith('/auction');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
      {!isAuctionPage && <Footer />}
    </div>
  );
}

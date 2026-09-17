import './globals.css';
import Navbar from '@/components/layout/Navbar';
import FloatingContact from '@/components/layout/FloatingContact';

export const metadata = {
  title: 'GameShop — Roblox & UGPhone Services',
  description: 'Dịch vụ Roblox và UGPhone uy tín, giao dịch nhanh chóng',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#12081f]">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        <FloatingContact />
      </body>
    </html>
  );
}

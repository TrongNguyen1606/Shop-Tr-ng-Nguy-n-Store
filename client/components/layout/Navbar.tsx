'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wallet, User as UserIcon } from 'lucide-react';
import { api } from '@/lib/api';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get('/auth/me').then((d) => setUser(d.user)).catch(() => setUser(null));
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-fuchsia-500/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/shop" className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          GameShop
        </Link>

        <nav className="hidden md:flex gap-6 text-sm text-neutral-300">
          <Link href="/shop" className="hover:text-fuchsia-400">Cửa hàng</Link>
          <Link href="/transactions" className="hover:text-fuchsia-400">Lịch sử giao dịch</Link>
          {user?.role !== 'user' && user && (
            <Link href="/admin/reconciliation" className="hover:text-fuchsia-400">Quản trị</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                <Wallet size={16} /> {user.balance?.toLocaleString() || 0}đ
              </div>
              <Link href="/profile" className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700">
                <UserIcon size={18} />
              </Link>
            </>
          ) : (
            <Link href="/login" className="px-4 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-sm font-medium">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

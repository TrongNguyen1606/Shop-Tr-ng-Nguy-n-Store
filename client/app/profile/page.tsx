'use client';
import { useEffect, useState } from 'react';
import CardTopupForm from '@/components/deposit/CardTopupForm';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get('/auth/me').then((d) => setUser(d.user)).catch(() => {});
  }, []);

  if (!user) return <p className="text-neutral-400">Đang tải...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-neutral-900 border border-fuchsia-500/20 rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-white">Hồ sơ của bạn</h2>
        <p className="text-neutral-300 text-sm">Email: <span className="text-white">{user.email}</span></p>
        <p className="text-neutral-300 text-sm">Số dư: <span className="text-emerald-400 font-semibold">{user.balance?.toLocaleString()}đ</span></p>
        <p className="text-neutral-300 text-sm">Vai trò: <span className="text-white">{user.role}</span></p>

        {user.discord?.id ? (
          <p className="text-neutral-300 text-sm">Discord: <span className="text-[#5865F2]">{user.discord.username}</span></p>
        ) : (
          <a href="/api/auth/discord" className="inline-block bg-[#5865F2] rounded-lg px-4 py-2 text-white text-sm mt-2">
            Liên kết Discord
          </a>
        )}
      </div>

      <CardTopupForm />
    </div>
  );
}

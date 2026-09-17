'use client';
import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { api } from '@/lib/api';

export default function TopDeposit() {
  const [top, setTop] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users/leaderboard/top-deposit').then(setTop).catch(() => setTop([]));
  }, []);

  if (!top.length) return null;

  const medalColor = ['text-yellow-400', 'text-neutral-300', 'text-amber-600'];

  return (
    <div className="bg-neutral-900 border border-fuchsia-500/20 rounded-2xl p-5">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
        <Trophy size={18} className="text-yellow-400" /> Top Nạp
      </h3>
      <ul className="space-y-2">
        {top.map((u, i) => (
          <li key={u._id} className="flex items-center justify-between text-sm">
            <span className={`flex items-center gap-2 ${i < 3 ? medalColor[i] : 'text-neutral-300'}`}>
              #{i + 1} {u.discord?.username || u.email.split('@')[0]}
            </span>
            <span className="text-emerald-400 font-medium">{u.totalDeposited.toLocaleString()}đ</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

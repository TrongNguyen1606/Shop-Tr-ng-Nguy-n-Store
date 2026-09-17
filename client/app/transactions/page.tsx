'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const TYPE_LABEL: Record<string, string> = {
  deposit: 'Nạp tiền',
  purchase: 'Mua hàng',
  admin_adjust: 'Owner điều chỉnh',
  refund: 'Hoàn tiền',
};

export default function TransactionsPage() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users/me/transactions').then(setList).catch(() => setList([]));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Lịch sử giao dịch</h1>
      <div className="bg-neutral-900 border border-fuchsia-500/20 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-neutral-400 border-b border-neutral-800 text-left">
            <tr>
              <th className="p-3">Thời gian</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Số tiền</th>
              <th className="p-3">Số dư sau</th>
              <th className="p-3">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {list.map((tx) => (
              <tr key={tx._id} className="border-b border-neutral-800">
                <td className="p-3 text-neutral-400">{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                <td className="p-3">{TYPE_LABEL[tx.type] || tx.type}</td>
                <td className={`p-3 font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}đ
                </td>
                <td className="p-3 text-neutral-300">{tx.balanceAfter.toLocaleString()}đ</td>
                <td className="p-3 text-neutral-400">{tx.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="p-4 text-neutral-500 text-sm">Chưa có giao dịch nào.</p>}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ReconciliationPage() {
  const [orderStats, setOrderStats] = useState<any[]>([]);
  const [cardStats, setCardStats] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/recon/orders').then((d) => { setOrderStats(d.summary); setOrders(d.list); });
    api.get('/admin/recon/cards').then((d) => setCardStats(d.stats));
  }, []);

  async function updateStatus(id: string, status: string) {
    await api.patch(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-white mb-3">Đối soát đơn hàng</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {orderStats.map((s) => (
            <div key={s._id} className="bg-neutral-900 border border-fuchsia-500/20 rounded-xl p-4">
              <p className="text-neutral-400 text-sm">{s._id}</p>
              <p className="text-2xl font-bold text-white">{s.count}</p>
              <p className="text-fuchsia-400 text-sm">{s.total.toLocaleString()}đ</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-3">Đối soát thẻ cào</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cardStats.map((s) => (
            <div key={s._id} className="bg-neutral-900 border border-fuchsia-500/20 rounded-xl p-4">
              <p className="text-neutral-400 text-sm">{s._id}</p>
              <p className="text-2xl font-bold text-white">{s.count}</p>
              <p className="text-emerald-400 text-xs">Khai: {(s.declaredTotal || 0).toLocaleString()}đ</p>
              <p className="text-emerald-400 text-xs">Nhận: {(s.actualTotal || 0).toLocaleString()}đ</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-3">Đơn hàng gần đây</h2>
        <div className="bg-neutral-900 border border-fuchsia-500/20 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-neutral-400 border-b border-neutral-800 text-left">
              <tr>
                <th className="p-3">Khách</th>
                <th className="p-3">Game ID</th>
                <th className="p-3">Số tiền</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-neutral-800">
                  <td className="p-3">{o.user?.email}</td>
                  <td className="p-3">{o.gameId}</td>
                  <td className="p-3">{o.totalAmount.toLocaleString()}đ</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="bg-neutral-800 rounded px-2 py-1 text-white text-xs"
                    >
                      <option value="pending">Đang chờ xử lý</option>
                      <option value="processing">Đang thực hiện</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="failed_cancelled">Thất bại/Hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

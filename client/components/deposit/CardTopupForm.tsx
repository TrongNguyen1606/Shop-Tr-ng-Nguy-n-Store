'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

const TELCOS = ['VIETTEL', 'MOBIFONE', 'VINAPHONE', 'ZING', 'GATE', 'VNMOBI'];

export default function CardTopupForm() {
  const [form, setForm] = useState({ telco: 'VIETTEL', code: '', serial: '', amount: 20000 });
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit() {
    setStatus('pending');
    setMsg('');
    try {
      const data = await api.post('/cards/submit', form);
      pollStatus(data.requestId);
    } catch (err: any) {
      setStatus('failed');
      setMsg(err.message);
    }
  }

  function pollStatus(requestId: string) {
    const interval = setInterval(async () => {
      try {
        const data = await api.get(`/cards/status/${requestId}`);
        if (data.status === 'success') {
          setStatus('success');
          setMsg(`Nạp thành công ${data.actualAmount.toLocaleString()}đ`);
          clearInterval(interval);
        } else if (data.status === 'failed' || data.status === 'wrong_amount') {
          setStatus('failed');
          setMsg(data.message || 'Thẻ không hợp lệ');
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    }, 3000);
    setTimeout(() => clearInterval(interval), 60000);
  }

  return (
    <div className="bg-neutral-900 border border-fuchsia-500/20 rounded-2xl p-5 space-y-3 max-w-md">
      <h3 className="font-bold text-white mb-1">Nạp thẻ cào</h3>
      <select
        value={form.telco}
        onChange={(e) => setForm({ ...form, telco: e.target.value })}
        className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white"
      >
        {TELCOS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input
        placeholder="Mã thẻ"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white"
      />
      <input
        placeholder="Số serial"
        value={form.serial}
        onChange={(e) => setForm({ ...form, serial: e.target.value })}
        className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white"
      />
      <input
        type="number"
        placeholder="Mệnh giá"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
        className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white"
      />
      <button
        onClick={handleSubmit}
        disabled={status === 'pending'}
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg py-2 text-white disabled:opacity-50"
      >
        {status === 'pending' ? 'Đang xử lý thẻ...' : 'Nạp thẻ'}
      </button>
      {msg && <p className={status === 'success' ? 'text-emerald-400 text-sm' : 'text-red-400 text-sm'}>{msg}</p>}
    </div>
  );
}

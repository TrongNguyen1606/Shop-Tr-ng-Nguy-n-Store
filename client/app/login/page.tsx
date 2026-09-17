'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [form, setForm] = useState({ email: '', password: '', otp: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    setError(''); setMsg('');
    try {
      await api.post('/auth/login', { email: form.email, password: form.password });
      router.push('/shop');
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleRegister() {
    setError(''); setMsg('');
    try {
      const data = await api.post('/auth/register', { email: form.email, password: form.password });
      setMsg(data.message);
      setMode('verify');
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleVerify() {
    setError(''); setMsg('');
    try {
      const data = await api.post('/auth/verify-email', { email: form.email, otp: form.otp });
      setMsg(data.message);
      setMode('login');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-neutral-900 border border-fuchsia-500/20 rounded-2xl p-6">
      <h1 className="text-xl font-bold text-white mb-4">
        {mode === 'login' ? 'Đăng nhập' : mode === 'register' ? 'Đăng ký' : 'Xác thực Email'}
      </h1>

      <a
        href="/api/auth/google"
        className="flex items-center justify-center gap-2 w-full bg-white text-neutral-900 rounded-lg py-2 font-medium mb-4"
      >
        Đăng nhập với Google
      </a>

      <div className="flex items-center gap-2 text-neutral-500 text-xs mb-4">
        <div className="flex-1 h-px bg-neutral-700" /> hoặc <div className="flex-1 h-px bg-neutral-700" />
      </div>

      {mode !== 'verify' && (
        <>
          <input
            placeholder="Email Gmail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white mb-3"
          />
          <input
            placeholder="Mật khẩu"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white mb-3"
          />
        </>
      )}

      {mode === 'verify' && (
        <input
          placeholder="Mã OTP (6 số)"
          value={form.otp}
          onChange={(e) => setForm({ ...form, otp: e.target.value })}
          className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white mb-3"
        />
      )}

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      {msg && <p className="text-emerald-400 text-sm mb-2">{msg}</p>}

      {mode === 'login' && (
        <>
          <button onClick={handleLogin} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg py-2 text-white mb-3">
            Đăng nhập
          </button>
          <p className="text-sm text-neutral-400 text-center">
            Chưa có tài khoản?{' '}
            <button onClick={() => setMode('register')} className="text-fuchsia-400">Đăng ký</button>
          </p>
        </>
      )}

      {mode === 'register' && (
        <>
          <button onClick={handleRegister} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg py-2 text-white mb-3">
            Đăng ký
          </button>
          <p className="text-sm text-neutral-400 text-center">
            Đã có tài khoản?{' '}
            <button onClick={() => setMode('login')} className="text-fuchsia-400">Đăng nhập</button>
          </p>
        </>
      )}

      {mode === 'verify' && (
        <button onClick={handleVerify} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg py-2 text-white">
          Xác thực
        </button>
      )}
    </div>
  );
}

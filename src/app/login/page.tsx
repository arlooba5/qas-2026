'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/member');
    } catch {
      setError('信箱或密碼不正確，請重新輸入');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#EAF3DE] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">🏃</div>
          <h1 className="text-2xl font-bold text-[#1a3a0f]" style={{fontFamily:'Noto Serif TC,serif'}}>歡迎回來</h1>
          <p className="text-gray-500 text-sm mt-1">登入您的 QAS 會員帳號</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">電子信箱</label>
              <input type="email" className="form-input" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">密碼</label>
              <input type="password" className="form-input" placeholder="請輸入密碼" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#3B6D11] hover:bg-[#27500a] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-60 mt-2">
              {loading ? '登入中...' : '登入'}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link href="#" className="text-xs text-[#639922]">忘記密碼？</Link>
          </div>
          <hr className="my-5" />
          <p className="text-center text-sm text-gray-500">
            還沒有帳號？ <Link href="/register" className="text-[#3B6D11] font-medium">免費註冊</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('兩次密碼不一致'); return; }
    if (form.password.length < 8) { setError('密碼至少需要 8 個字元'); return; }
    setLoading(true); setError('');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'members', user.uid), {
        uid: user.uid, name: form.name, email: form.email, phone: form.phone,
        role: 'member', level: 'basic', points: 0, createdAt: serverTimestamp(),
      });
      router.push('/member');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('email-already-in-use')) setError('此信箱已被註冊');
      else setError('註冊失敗，請稍後再試');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#EAF3DE] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">🏃</div>
          <h1 className="text-2xl font-bold text-[#1a3a0f]" style={{fontFamily:'Noto Serif TC,serif'}}>建立帳號</h1>
          <p className="text-gray-500 text-sm mt-1">加入 QAS 會員，享受專屬優惠</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">姓名 *</label><input className="form-input" placeholder="您的真實姓名" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">電子信箱 *</label><input type="email" className="form-input" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">手機號碼</label><input type="tel" className="form-input" placeholder="09xx-xxx-xxx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">密碼 *</label><input type="password" className="form-input" placeholder="至少 8 個字元" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
            <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">確認密碼 *</label><input type="password" className="form-input" placeholder="再次輸入密碼" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required /></div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#3B6D11] hover:bg-[#27500a] text-white py-3 rounded-xl font-medium transition-all disabled:opacity-60 mt-2">
              {loading ? '建立中...' : '建立帳號'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            已有帳號？ <Link href="/login" className="text-[#3B6D11] font-medium">立即登入</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

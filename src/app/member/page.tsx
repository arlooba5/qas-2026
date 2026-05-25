'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, BookOpen, MessageCircle, Star, Gift } from 'lucide-react';

export default function MemberPage() {
  const { user, member, loading } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">載入中...</div></div>;
  if (!user) return null;

  const levelLabel = { basic:'一般會員', silver:'銀卡會員', gold:'金卡會員' }[member?.level || 'basic'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 mb-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EAF3DE] border-3 border-[#97C459] flex items-center justify-center">
            <User size={28} className="text-[#3B6D11]" />
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-[#1a3a0f]">{member?.name || user.email?.split('@')[0]}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
            <div className="inline-flex items-center gap-1 bg-[#EAF3DE] text-[#3B6D11] text-xs px-3 py-1 rounded-full mt-1.5 font-medium">
              <Star size={11} /> {levelLabel}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-xs mb-1">會員點數</div>
            <div className="text-3xl font-bold text-[#3B6D11]">{member?.points || 0}<span className="text-sm ml-1">點</span></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[['報告購買','2',<ShoppingBag key="s" size={18} className="text-[#3B6D11]" />],['課程報名','3',<BookOpen key="b" size={18} className="text-[#3B6D11]" />],['諮詢預約','1',<MessageCircle key="m" size={18} className="text-[#3B6D11]" />]].map(([l,n,ic])=>(
            <div key={String(l)} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="flex justify-center mb-2">{ic}</div>
              <div className="text-2xl font-bold text-[#3B6D11]">{n}</div>
              <div className="text-xs text-gray-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-[#1a3a0f] mb-4 pb-3 border-b border-gray-50 flex items-center gap-2">
              <ShoppingBag size={16} /> 最近訂單
            </h3>
            {[['冰鑑識人 HR 評鑑報告','已完成'],['AI 驅動：補助計畫書撰寫','已確認'],['品牌顧問諮詢 — 1hr','待確認']].map(([name,status])=>(
              <div key={name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700 flex-1 mr-3 leading-snug">{name}</span>
                <span className={status==='已完成'||status==='已確認' ? 'status-confirmed' : 'status-pending'}>{status}</span>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-[#1a3a0f] mb-4 pb-3 border-b border-gray-50 flex items-center gap-2">
              <Gift size={16} /> 會員優惠
            </h3>
            {[['課程 9 折優惠','適用中'],['報告 95 折','適用中'],['生日月雙倍點數','6月'],['點數折抵 (100點=NT$50)','可使用']].map(([b,s])=>(
              <div key={b} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{b}</span>
                <span className={s==='適用中'||s==='可使用' ? 'text-[#3B6D11] text-xs font-medium' : 'text-gray-400 text-xs'}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Link href="/reports" className="btn-primary text-sm">購買報告</Link>
          <Link href="/courses" className="btn-outline text-sm">瀏覽課程</Link>
          <Link href="/consulting" className="btn-outline text-sm">預約諮詢</Link>
        </div>
      </div>
    </div>
  );
}

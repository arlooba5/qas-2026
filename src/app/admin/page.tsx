'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { COURSES, REPORTS, CONSULTANTS } from '@/lib/data';
import { LayoutDashboard, BookOpen, Calendar, FileText, Users, ShoppingBag, Settings, ChevronRight } from 'lucide-react';

const MENU = [
  { icon: LayoutDashboard, label: '總覽', href: '/admin' },
  { icon: BookOpen, label: '課程管理', href: '/admin/courses' },
  { icon: Calendar, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '報告管理', href: '/admin/reports' },
  { icon: Users, label: '顧問管理', href: '/admin/consultants' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: Users, label: '會員管理', href: '/admin/members' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
];

const SAMPLE_ORDERS = [
  { id:'REG20260522144057', name:'吳佩霙', item:'HR 實務：規章與說明書建立', amount:5400, status:'待確認' },
  { id:'REG20260522085349', name:'陳怡鈴', item:'AI 影像行銷與設計實戰', amount:6000, status:'待確認' },
  { id:'REG20260521172642', name:'游惠婷', item:'商業攝影實務與質感美學', amount:6000, status:'已確認' },
  { id:'REG20260521172148', name:'陳怡涵', item:'卓越店經理訓練', amount:5400, status:'待確認' },
  { id:'REG20260521141942', name:'STELLA', item:'AI 驅動：補助計畫書撰寫', amount:6000, status:'已確認' },
];

export default function AdminPage() {
  const { user, member, loading, isStaff } = useAuth();
  const router = useRouter();
  const [pwd, setPwd] = useState('');
  const [authed, setAuthed] = useState(false);
  const ADMIN_PWD = 'qas2026admin';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && !isStaff) {
      // 允許輸入後台密碼
    }
  }, [user, loading, isStaff, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">載入中...</div>;
  if (!user) return null;

  if (!isStaff && !authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm text-center">
        <div className="text-3xl mb-4">🔐</div>
        <h2 className="font-bold text-[#1a3a0f] mb-2">後台管理</h2>
        <p className="text-gray-400 text-sm mb-5">請輸入後台密碼</p>
        <input type="password" className="form-input mb-4 text-center" placeholder="後台密碼" value={pwd} onChange={e=>setPwd(e.target.value)} />
        <button onClick={() => { if(pwd===ADMIN_PWD) setAuthed(true); else alert('密碼錯誤'); }}
          className="w-full bg-[#3B6D11] text-white py-2.5 rounded-xl font-medium">進入後台</button>
      </div>
    </div>
  );

  const totalRevenue = SAMPLE_ORDERS.filter(o=>o.status==='已確認').reduce((s,o)=>s+o.amount,0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d2206] flex-shrink-0">
        <div className="p-4 border-b border-white/10">
          <div className="text-white font-bold text-sm">QAS 後台管理</div>
          <div className="text-white/40 text-xs mt-0.5">{member?.name || user.email}</div>
        </div>
        <nav className="py-3">
          {MENU.map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all
                ${href === '/admin' ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <div className="border-t border-white/10 mt-3 pt-3">
            <Link href="/" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/40 hover:text-white/70 transition-all">
              ← 返回網站
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-[#1a3a0f]">📊 系統總覽</h1>
          <div className="text-sm text-gray-400">{new Date().toLocaleDateString('zh-TW')}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {label:'本月訂單', value: SAMPLE_ORDERS.length, unit:'筆'},
            {label:'本月營收', value:`NT$${totalRevenue.toLocaleString()}`, unit:''},
            {label:'課程數量', value: COURSES.length, unit:'堂'},
            {label:'報告種類', value: REPORTS.length, unit:'種'},
          ].map(({label,value,unit}) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-gray-400 text-xs mb-2">{label}</div>
              <div className="text-2xl font-bold text-[#3B6D11]">{value}<span className="text-sm ml-1 text-gray-400">{unit}</span></div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {label:'新增課程', href:'/admin/courses', icon:'📚'},
            {label:'新增活動', href:'/admin/events', icon:'🎪'},
            {label:'查看訂單', href:'/admin/orders', icon:'📋'},
          ].map(({label,href,icon}) => (
            <Link key={href} href={href}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="font-medium text-[#1a3a0f] text-sm">{label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#3B6D11] transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-[#1a3a0f] mb-4 pb-3 border-b border-gray-50">最新報名紀錄</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-400 pb-2">
              <th className="pb-3 font-medium">編號</th>
              <th className="pb-3 font-medium">學員</th>
              <th className="pb-3 font-medium">課程 / 項目</th>
              <th className="pb-3 font-medium">金額</th>
              <th className="pb-3 font-medium">狀態</th>
              <th className="pb-3 font-medium">操作</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {SAMPLE_ORDERS.map(o => (
                <tr key={o.id}>
                  <td className="py-3 text-gray-400 text-xs">{o.id.slice(-8)}</td>
                  <td className="py-3 font-medium text-gray-700">{o.name}</td>
                  <td className="py-3 text-gray-500 max-w-xs truncate">{o.item}</td>
                  <td className="py-3 font-medium text-[#3B6D11]">NT${o.amount.toLocaleString()}</td>
                  <td className="py-3"><span className={o.status==='已確認' ? 'status-confirmed' : 'status-pending'}>{o.status}</span></td>
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      {o.status==='待確認' && <button className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2.5 py-1 rounded-lg hover:bg-[#d4e8b0] transition-colors">確認</button>}
                      <button className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors">查看</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

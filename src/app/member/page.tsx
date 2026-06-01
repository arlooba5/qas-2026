'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface Member {
  name: string;
  email: string;
  phone: string;
  level: string;
  role: string;
  points: number;
  consultingCredits: number;
  reportCredits: number;
  courseCredits: number;
}

interface Order {
  id: string;
  type: string;
  itemName?: string;
  courseName?: string;
  consultantName?: string;
  planName?: string;
  amount?: number;
  fee?: number;
  status: string;
  createdAt: any;
}

const LEVEL_LABELS: Record<string, string> = {
  basic: '一般會員',
  silver: '🥈 銀卡會員',
  gold: '🥇 金卡會員',
};

const LEVEL_COLORS: Record<string, string> = {
  basic: '#6b7280',
  silver: '#7B8FA1',
  gold: '#C9A84C',
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待確認', color: '#d97706' },
  confirmed: { label: '已確認', color: '#059669' },
  completed: { label: '已完成', color: '#3B6D11' },
  cancelled: { label: '已取消', color: '#dc2626' },
};

const TYPE_MAP: Record<string, string> = {
  course: '課程報名',
  report: '報告購買',
  consulting: '諮詢預約',
  membership: '會員申請',
};

export default function MemberPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'course' | 'report' | 'consulting'>('all');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      try {
        // 讀取會員資料
        const memberDoc = await getDoc(doc(db, 'members', user.uid));
        if (memberDoc.exists()) {
          setMember(memberDoc.data() as Member);
        }

        // 讀取訂單（只讀自己的）
        const ordersSnap = await getDocs(
          query(
            collection(db, 'orders'),
            where('buyerUid', '==', user.uid)
          )
        );
        const ordersData = ordersSnap.docs
          .map(d => ({ id: d.id, ...d.data() } as Order))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setOrders(ordersData);
      } catch (err) {
        console.error('讀取資料失敗：', err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.type === activeTab);

  const countByType = (type: string) => orders.filter(o => o.type === type).length;

  const getOrderName = (order: Order) =>
    order.itemName || order.courseName || order.consultantName || order.planName || '—';

  const getOrderAmount = (order: Order) =>
    order.amount || order.fee || 0;

  if (loading) return <div className="text-center py-20 text-gray-400">載入中...</div>;

  if (!member) return (
    <div className="text-center py-20">
      <div className="text-gray-400 mb-4">找不到會員資料</div>
      <button onClick={() => signOut(auth).then(() => router.push('/login'))}
        className="text-sm text-red-500">登出</button>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Noto Serif TC,serif' }}>會員中心</h1>
        <p className="text-white/60 text-sm">管理您的訂單與會員權益</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* 會員資訊卡 */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a3a0f] to-[#639922] flex items-center justify-center text-white text-2xl font-bold">
                {member.name?.charAt(0) || '?'}
              </div>
              <div>
                <div className="text-xl font-bold text-[#1a3a0f]">{member.name}</div>
                <div className="text-sm text-gray-500">{member.email}</div>
                <div className="mt-1">
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: `${LEVEL_COLORS[member.level] || '#6b7280'}20`, color: LEVEL_COLORS[member.level] || '#6b7280' }}>
                    ☆ {LEVEL_LABELS[member.level] || '一般會員'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">會員點數</div>
              <div className="text-2xl font-bold text-[#3B6D11]">{member.points || 0} <span className="text-sm font-normal">點</span></div>
            </div>
          </div>
        </div>

        {/* 統計數字 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '報告購買', count: countByType('report'), icon: '📊' },
            { label: '課程報名', count: countByType('course'), icon: '📚' },
            { label: '諮詢預約', count: countByType('consulting'), icon: '💬' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-[#3B6D11]">{s.count}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 贈品次數（金卡/銀卡才顯示） */}
        {(member.level === 'gold' || member.level === 'silver') && (
          <div className="card p-5 mb-6">
            <h3 className="font-bold text-[#1a3a0f] mb-3 text-sm">🎁 會員贈品剩餘次數</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '顧問諮詢', count: member.consultingCredits || 0, icon: '🧭' },
                { label: '檢測報告', count: member.reportCredits || 0, icon: '📋' },
                { label: '平台課程', count: member.courseCredits || 0, icon: '🎓' },
              ].map(g => (
                <div key={g.label} className={`text-center p-3 rounded-xl ${g.count > 0 ? 'bg-[#EAF3DE]' : 'bg-gray-50'}`}>
                  <div className="text-xl mb-1">{g.icon}</div>
                  <div className={`text-xl font-bold ${g.count > 0 ? 'text-[#3B6D11]' : 'text-gray-400'}`}>{g.count}</div>
                  <div className="text-xs text-gray-500">{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 會員優惠 */}
        <div className="card p-5 mb-6">
          <h3 className="font-bold text-[#1a3a0f] mb-3 text-sm">🎟️ 會員優惠</h3>
          <div className="space-y-2">
            {member.level === 'gold' && (
              <>
                <div className="flex justify-between text-sm"><span>課程 7折優惠</span><span className="text-[#3B6D11] font-medium">適用中</span></div>
                <div className="flex justify-between text-sm"><span>報告 7折優惠</span><span className="text-[#3B6D11] font-medium">適用中</span></div>
              </>
            )}
            {member.level === 'silver' && (
              <>
                <div className="flex justify-between text-sm"><span>課程 8折優惠</span><span className="text-[#3B6D11] font-medium">適用中</span></div>
                <div className="flex justify-between text-sm"><span>報告 8折優惠</span><span className="text-[#3B6D11] font-medium">適用中</span></div>
              </>
            )}
            {member.level === 'basic' && (
              <div className="text-sm text-gray-400">升級為銀卡或金卡會員，享受更多優惠</div>
            )}
            <div className="flex justify-between text-sm"><span>生日月雙倍點數</span><span className="text-gray-400">6月</span></div>
          </div>
        </div>

        {/* 最近訂單 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1a3a0f]">📦 我的訂單</h3>
          </div>

          {/* 分類 Tab */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { key: 'all', label: '全部' },
              { key: 'course', label: '課程' },
              { key: 'report', label: '報告' },
              { key: 'consulting', label: '諮詢' },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                  ${activeTab === t.key ? 'bg-[#3B6D11] text-white border-[#3B6D11]' : 'bg-white text-gray-500 border-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">尚無訂單紀錄</div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(order => {
                const status = STATUS_MAP[order.status] || { label: order.status, color: '#6b7280' };
                return (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="font-medium text-[#1a3a0f] text-sm">{getOrderName(order)}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{TYPE_MAP[order.type] || order.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#3B6D11]">
                        {getOrderAmount(order) > 0 ? `NT$${getOrderAmount(order).toLocaleString()}` : '—'}
                      </div>
                      <div className="text-xs mt-0.5 font-medium" style={{ color: status.color }}>
                        {status.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 登出 */}
        <div className="text-center mt-6">
          <button onClick={() => signOut(auth).then(() => router.push('/login'))}
            className="text-sm text-gray-400 hover:text-gray-600">
            登出
          </button>
        </div>
      </div>
    </div>
  );
}

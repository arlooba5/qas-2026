'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Event } from '@/lib/types';

const DEFAULT_EVENTS = [
  {id:'e1', emoji:'🎤', name:'2026 企業意識提升論壇', date:'2026年7月20日', type:'論壇', description:'匯聚各領域專家，探討意識提升如何驅動企業真實成長。', status:'active'},
  {id:'e2', emoji:'🛠️', name:'知行合一工作坊', date:'2026年8月10日', type:'工作坊', description:'透過體驗式學習，帶領您從內在探索到外在行動，突破知行分離的困境。', status:'active'},
  {id:'e3', emoji:'🌱', name:'QAS 年度學習節', date:'2026年9月1日', type:'活動', description:'克斯年度盛事，包含課程博覽會、顧問諮詢日、會員感謝活動。', status:'active'},
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'events'), where('status','==','active'), orderBy('createdAt','desc')));
        if (snap.empty) {
          setEvents(DEFAULT_EVENTS);
        } else {
          setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch {
        setEvents(DEFAULT_EVENTS);
      } finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const EMOJIS: Record<string,string> = {'論壇':'🎤','工作坊':'🛠️','課程':'📚','活動':'🌱','研討會':'🎓'};

  return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white mb-2" style={{fontFamily:'Noto Serif TC,serif'}}>🎪 活動資訊</h1>
        <p className="text-white/60">最新講座、工作坊與企業活動</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">載入中...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(e => (
              <div key={e.id} className="card overflow-hidden group cursor-pointer">
                <div className="h-52 bg-gradient-to-br from-[#1a3a0f] to-[#639922] flex items-center justify-center relative">
                  <span className="text-6xl">{EMOJIS[e.type] || e.emoji || '🎪'}</span>
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">📅 {e.date}</div>
                </div>
                <div className="p-5">
                  <span className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2.5 py-0.5 rounded-full font-medium">{e.type}</span>
                  <h3 className="font-bold text-[#1a3a0f] mt-2 mb-2 leading-snug">{e.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{e.description}</p>
                  {e.detailContent && (
                    <div className="text-sm text-gray-600 leading-relaxed mb-3 p-3 bg-gray-50 rounded-lg whitespace-pre-line">
                      {e.detailContent.slice(0, 150)}{e.detailContent.length > 150 ? '...' : ''}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#3B6D11]">
                      {e.price ? `NT$${e.price.toLocaleString()}` : '免費'}
                    </span>
                    <button className="bg-[#3B6D11] hover:bg-[#27500a] text-white text-sm px-4 py-1.5 rounded-full transition-all">了解更多</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

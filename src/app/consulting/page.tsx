'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Consultant } from '@/lib/types';
import { CONSULTANTS } from '@/lib/data';

export default function ConsultingPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'consultants'), where('status','==','active'), orderBy('createdAt','desc')));
        if (snap.empty) {
          setConsultants(CONSULTANTS.filter(c => c.status === 'active'));
        } else {
          setConsultants(snap.docs.map(d => ({ id: d.id, ...d.data() } as Consultant)));
        }
      } catch {
        setConsultants(CONSULTANTS.filter(c => c.status === 'active'));
      } finally { setLoading(false); }
    };
    fetchConsultants();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white mb-2" style={{fontFamily:'Noto Serif TC,serif'}}>💼 專家諮詢預約</h1>
        <p className="text-white/60">多種顧問專業，一對一深度諮詢</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">載入中...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {consultants.map(c => (
              <div key={c.id} className="card overflow-hidden group">
                <div className="bg-gradient-to-br from-[#1a3a0f] to-[#27500a] p-6">
                  <div className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-2xl mb-3">{c.emoji}</div>
                  <h3 className="text-white font-bold text-base">{c.name}</h3>
                  <div className="text-white/50 text-xs mt-0.5">{c.title}</div>
                </div>
                <div className="p-5">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{c.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(c.tags||[]).map(t => <span key={t} className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2.5 py-0.5 rounded-full">{t}</span>)}
                  </div>
                  {c.detailUrl && (
                    <a href={c.detailUrl} target="_blank" rel="noreferrer"
                      className="text-xs text-[#639922] hover:underline block mb-3">📄 查看顧問介紹 →</a>
                  )}
                  <button className="w-full bg-[#3B6D11] hover:bg-[#27500a] text-white text-sm py-2.5 rounded-xl transition-all font-medium">
                    預約諮詢 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

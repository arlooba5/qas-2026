'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2 } from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  tags: string[];
  photoUrl?: string;
  fee?: number;
  detailUrl?: string;
  status: string;
}

interface TimeSlot {
  id: string;
  consultantId: string;
  consultantName: string;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  enrolled: number;
  fee: number;
  type: string;
  status: string;
  note?: string;
}

export default function ConsultingPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{consultant: Consultant, slot: TimeSlot} | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', phone:'', email:'', company:'', note:'' });
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cSnap, sSnap] = await Promise.all([
          getDocs(query(collection(db, 'consultants'), where('status','==','active'), orderBy('createdAt','desc'))),
          getDocs(query(collection(db, 'consultingSlots'), where('status','==','active'), orderBy('date','asc'))),
        ]);
        setConsultants(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as Consultant)));
        setSlots(sSnap.docs.map(d => ({ id: d.id, ...d.data() } as TimeSlot)));
      } catch(e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      await addDoc(collection(db, 'orders'), {
        type: 'consulting',
        itemId: selected.slot.id,
        itemName: `${selected.consultant.name} 諮詢 — ${selected.slot.date} ${selected.slot.time}`,
        consultantId: selected.consultant.id,
        consultantName: selected.consultant.name,
        slotId: selected.slot.id,
        slotDate: selected.slot.date,
        slotTime: selected.slot.time,
        amount: selected.slot.fee,
        subjectName: form.name,
        subjectEmail: form.email,
        subjectPhone: form.phone,
        subjectCompany: form.company,
        note: form.note,
        buyerName: form.name,
        buyerEmail: form.email,
        buyerPhone: form.phone,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch(e) { console.error(e); }
  };

  if (done) return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white" style={{fontFamily:'Noto Serif TC,serif'}}>💼 專家諮詢預約</h1>
      </div>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#EAF3DE] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-[#3B6D11]" />
        </div>
        <div className="inline-block bg-[#EAF3DE] text-[#3B6D11] text-sm px-4 py-1 rounded-full mb-4 font-medium">
          預約 #QAS-{Date.now().toString().slice(-6)}
        </div>
        <h2 className="text-2xl font-bold text-[#1a3a0f] mb-2">預約已送出！</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          感謝您的預約，我們將於 1 個工作日內與您確認諮詢細節。
        </p>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-left mb-8">
          <div className="flex justify-between py-2 text-sm border-b border-gray-50"><span className="text-gray-500">顧問</span><span className="font-medium">{selected?.consultant.name}</span></div>
          <div className="flex justify-between py-2 text-sm border-b border-gray-50"><span className="text-gray-500">時間</span><span className="font-medium">{selected?.slot.date} {selected?.slot.time}</span></div>
          <div className="flex justify-between py-2 text-sm"><span className="text-gray-500">費用</span><span className="font-bold text-[#3B6D11]">NT${selected?.slot.fee.toLocaleString()}</span></div>
        </div>
        <button onClick={() => { setDone(false); setSelected(null); setStep(1); setForm({name:'',phone:'',email:'',company:'',note:''}); }}
          className="btn-outline">再預約一次</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white mb-2" style={{fontFamily:'Noto Serif TC,serif'}}>💼 專家諮詢預約</h1>
        <p className="text-white/60">選擇顧問與時段，一對一深度諮詢</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">載入中...</div>
        ) : (
          <>
            {/* 顧問列表 */}
            {!selected && (
              <>
                <h2 className="text-xl font-bold text-[#1a3a0f] mb-6">選擇顧問</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                  {consultants.map(c => {
                    const cSlots = slots.filter(s => s.consultantId === c.id);
                    return (
                      <div key={c.id} className="card overflow-hidden">
                        <div className="bg-gradient-to-br from-[#1a3a0f] to-[#27500a] p-6">
                          {c.photoUrl ? (
                            <img src={c.photoUrl} alt={c.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mb-3" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-2xl mb-3">{c.emoji}</div>
                          )}
                          <h3 className="text-white font-bold text-base">{c.name}</h3>
                          <div className="text-white/50 text-xs mt-0.5">{c.title}</div>
                          {c.fee && <div className="text-[#97C459] text-sm font-medium mt-1">NT${c.fee.toLocaleString()} / 次</div>}
                        </div>
                        <div className="p-5">
                          <p className="text-gray-500 text-sm leading-relaxed mb-3">{c.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(c.tags||[]).map(t => <span key={t} className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2.5 py-0.5 rounded-full">{t}</span>)}
                          </div>
                          {c.detailUrl && (
                            <a href={c.detailUrl} target="_blank" rel="noreferrer"
                              className="text-xs text-[#639922] hover:underline block mb-3">📄 查看顧問介紹 →</a>
                          )}
                          {cSlots.length > 0 ? (
                            <div>
                              <div className="text-xs text-gray-400 mb-2">可預約時段：</div>
                              <div className="space-y-2">
                                {cSlots.map(s => (
                                  <button key={s.id} onClick={() => { setSelected({consultant:c, slot:s}); setStep(2); }}
                                    className="w-full text-left p-2.5 border border-gray-100 rounded-lg hover:border-[#97C459] hover:bg-[#EAF3DE] transition-all text-sm">
                                    <div className="font-medium text-[#1a3a0f]">{s.date} {s.time}</div>
                                    <div className="flex justify-between items-center mt-0.5">
                                      <span className="text-xs text-gray-400">{s.type} · {s.duration}分鐘</span>
                                      <span className="text-xs font-bold text-[#3B6D11]">NT${s.fee.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">剩餘 {s.capacity - (s.enrolled||0)} 個名額</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-3 text-gray-400 text-xs bg-gray-50 rounded-lg">
                              目前無可預約時段<br/>請洽 LINE@ 詢問
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {consultants.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-4">💼</div>
                    <p>顧問資料載入中，請稍後再試</p>
                  </div>
                )}
              </>
            )}

            {/* 填寫預約資料 */}
            {selected && step === 2 && (
              <div className="max-w-2xl mx-auto">
                <button onClick={() => { setSelected(null); setStep(1); }}
                  className="text-sm text-gray-500 hover:text-[#3B6D11] mb-6 flex items-center gap-1">
                  ← 返回選擇時段
                </button>
                <div className="bg-[#EAF3DE] rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{selected.consultant.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-[#1a3a0f]">{selected.consultant.name}</div>
                      <div className="text-sm text-gray-500">{selected.slot.date} {selected.slot.time} · {selected.slot.duration}分鐘 · {selected.slot.type}</div>
                    </div>
                    <div className="text-xl font-bold text-[#3B6D11]">NT${selected.slot.fee.toLocaleString()}</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-[#1a3a0f] mb-4 pb-3 border-b border-gray-100">填寫預約資料</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs text-gray-500 mb-1 block">姓名 *</label>
                      <input className="form-input" placeholder="真實姓名" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">電話 *</label>
                      <input className="form-input" placeholder="09xx-xxx-xxx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                    <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">信箱 *</label>
                      <input className="form-input" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                    <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">公司 / 單位</label>
                      <input className="form-input" placeholder="選填" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /></div>
                    <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">想諮詢的問題</label>
                      <textarea className="form-input" style={{minHeight:'80px',resize:'vertical'}} placeholder="請簡述您想討論的議題，讓顧問提前準備..." value={form.note} onChange={e=>setForm({...form,note:e.target.value})} /></div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <button onClick={() => { setSelected(null); setStep(1); }} className="btn-outline text-sm">返回</button>
                    <button onClick={handleSubmit}
                      disabled={!form.name || !form.phone || !form.email}
                      className="btn-primary text-sm disabled:opacity-50">確認送出預約</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

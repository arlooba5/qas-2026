'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Report } from '@/lib/types';
import { REPORTS } from '@/lib/data';
import { CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', gender:'', phone:'', email:'', company:'', title:'', note:'', bName:'', bPhone:'', bEmail:'', invoice:'' });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'reports'), where('status','==','active'), orderBy('createdAt','desc')));
        if (snap.empty) {
          setReports(REPORTS.filter(r => r.status === 'active'));
        } else {
          setReports(snap.docs.map(d => ({ id: d.id, ...d.data() } as Report)));
        }
      } catch {
        setReports(REPORTS.filter(r => r.status === 'active'));
      } finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  const personal = reports.filter(r => r.type === 'personal');
  const org = reports.filter(r => r.type === 'organization');

  const handleSubmit = async () => {
    try {
      const { addDoc, collection: col, serverTimestamp } = await import('firebase/firestore');
      await addDoc(col(db, 'orders'), {
        type: 'report', itemId: selected?.id, itemName: selected?.name,
        amount: selected?.price || 2000,
        subjectName: form.name, subjectEmail: form.email, subjectPhone: form.phone,
        subjectCompany: form.company,
        buyerName: form.bName, buyerEmail: form.bEmail, buyerPhone: form.bPhone,
        invoiceInfo: form.invoice, note: form.note,
        status: 'pending', createdAt: serverTimestamp(),
      });
    } catch(e) { console.error(e); }
    setStep(3);
  };

  if (step === 3) return (
    <div>
      <div className="page-header"><h1 className="text-4xl font-bold text-white" style={{fontFamily:'Noto Serif TC,serif'}}>🔬 檢測報告</h1></div>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#EAF3DE] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-[#3B6D11]" />
        </div>
        <div className="inline-block bg-[#EAF3DE] text-[#3B6D11] text-sm px-4 py-1 rounded-full mb-4 font-medium">
          訂單 #QAS-{Date.now().toString().slice(-6)}
        </div>
        <h2 className="text-2xl font-bold text-[#1a3a0f] mb-2">訂單已送出！</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">感謝您的訂購，我們將於 1 個工作日內與您聯繫付款事宜。</p>
        <button onClick={() => { setStep(1); setSelected(null); }} className="btn-outline">再購買一份</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white mb-2" style={{fontFamily:'Noto Serif TC,serif'}}>🔬 檢測報告</h1>
        <p className="text-white/60">七種科學化評估，精準定位您的現況</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">載入中...</div>
        ) : (
          <>
            <div className="text-center mb-10">
              <p className="text-gray-500">每份報告均價 <span className="text-[#3B6D11] font-bold text-lg">NT$2,000</span>，會員享有專屬優惠</p>
            </div>
            {step === 1 && <>
              {personal.length > 0 && <>
                <h3 className="text-lg font-bold text-[#1a3a0f] mb-4">個人評估</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {personal.map(r => (
                    <div key={r.id} onClick={() => { setSelected(r); setStep(2); }}
                      className="p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 bg-white hover:border-[#97C459] hover:shadow-md">
                      <div className="text-3xl mb-3">{r.emoji}</div>
                      <div className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-full inline-block mb-2">{r.category}</div>
                      <h3 className="font-bold text-[#1a3a0f] text-sm mb-2 leading-snug">{r.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                      <div className="text-[#3B6D11] font-bold mt-3">NT${(r.price||2000).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>}
              {org.length > 0 && <>
                <h3 className="text-lg font-bold text-[#1a3a0f] mb-4">企業評估</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {org.map(r => (
                    <div key={r.id} onClick={() => { setSelected(r); setStep(2); }}
                      className="p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 bg-white hover:border-[#97C459] hover:shadow-md">
                      <div className="text-3xl mb-3">{r.emoji}</div>
                      <div className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full inline-block mb-2">{r.category}</div>
                      <h3 className="font-bold text-[#1a3a0f] text-sm mb-2 leading-snug">{r.name}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                      <div className="text-[#3B6D11] font-bold mt-3">NT${(r.price||2000).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>}
            </>}
            {step === 2 && selected && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-[#EAF3DE] rounded-xl p-4 flex justify-between items-center mb-6">
                  <div>
                    <div className="font-bold text-[#1a3a0f]">{selected.name}</div>
                    <div className="text-sm text-gray-500">{selected.category}</div>
                  </div>
                  <div className="text-xl font-bold text-[#3B6D11]">NT${(selected.price||2000).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-[#1a3a0f] mb-4 pb-3 border-b border-gray-100">受測者資訊</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs text-gray-500 mb-1 block">姓名 *</label><input className="form-input" placeholder="真實姓名" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">性別</label><select className="form-input" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">請選擇</option><option>男</option><option>女</option></select></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">電話 *</label><input className="form-input" placeholder="09xx-xxx-xxx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">信箱 *</label><input className="form-input" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">公司</label><input className="form-input" placeholder="選填" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">職稱</label><input className="form-input" placeholder="選填" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
                  </div>
                  <h3 className="font-bold text-[#1a3a0f] mb-4 pb-3 border-b border-gray-100 mt-6">訂購人資訊</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs text-gray-500 mb-1 block">姓名 *</label><input className="form-input" placeholder="訂購人姓名" value={form.bName} onChange={e=>setForm({...form,bName:e.target.value})} /></div>
                    <div><label className="text-xs text-gray-500 mb-1 block">電話 *</label><input className="form-input" placeholder="09xx-xxx-xxx" value={form.bPhone} onChange={e=>setForm({...form,bPhone:e.target.value})} /></div>
                    <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">信箱（收據）*</label><input className="form-input" placeholder="email@example.com" value={form.bEmail} onChange={e=>setForm({...form,bEmail:e.target.value})} /></div>
                    <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">發票抬頭 / 統編</label><input className="form-input" placeholder="如需公司發票請填寫" value={form.invoice} onChange={e=>setForm({...form,invoice:e.target.value})} /></div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <button onClick={() => setStep(1)} className="btn-outline text-sm">返回選擇</button>
                    <button onClick={handleSubmit} className="btn-primary text-sm">確認送出訂單</button>
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

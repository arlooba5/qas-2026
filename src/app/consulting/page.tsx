'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, addDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { MapPin, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  title: string;
  description: string;
  emoji: string;
  tags: string[];
  status: string;
  photoUrl?: string;
  detailUrl?: string;
}

interface ConsultingSlot {
  id: string;
  consultantId: string;
  consultantName: string;
  date: string;
  time: string;
  duration: number;
  fee: number;
  capacity: number;
  enrolled: number;
  type: string;
  status: string;
  note: string;
}

const TYPE_LABELS: Record<string, string> = {
  '1對1': '1對1 諮詢',
  '小組': '小組諮詢',
  '企業': '企業諮詢',
};

export default function ConsultingPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [slots, setSlots] = useState<ConsultingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState<string>('全部');
  const [expandedConsultant, setExpandedConsultant] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ConsultingSlot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', note: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 讀取顧問
        const consultantsSnap = await getDocs(
          query(collection(db, 'consultants'), where('status', '==', 'active'))
        );
        const consultantsData = consultantsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Consultant));
        setConsultants(consultantsData);

        // 讀取時段
        const slotsSnap = await getDocs(
          query(collection(db, 'consultingSlots'), where('status', '==', 'active'))
        );
        const slotsData = slotsSnap.docs
          .map(d => ({ id: d.id, ...d.data() } as ConsultingSlot))
          .sort((a, b) => a.date.localeCompare(b.date));
        setSlots(slotsData);
      } catch (err) {
        console.error('讀取失敗：', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const consultantNames = ['全部', ...Array.from(new Set(slots.map(s => s.consultantName)))];

  const filteredSlots = selectedConsultant === '全部'
    ? slots
    : slots.filter(s => s.consultantName === selectedConsultant);

  // 依顧問分組
  const slotsByConsultant = filteredSlots.reduce((acc, slot) => {
    if (!acc[slot.consultantName]) acc[slot.consultantName] = [];
    acc[slot.consultantName].push(slot);
    return acc;
  }, {} as Record<string, ConsultingSlot[]>);

  const getConsultantInfo = (name: string) =>
    consultants.find(c => c.name === name);

  const handleBook = (slot: ConsultingSlot) => {
    setSelectedSlot(slot);
    setShowForm(true);
    setSubmitted(false);
    setForm({ name: '', phone: '', email: '', company: '', note: '' });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email) {
      alert('請填寫姓名、電話、Email');
      return;
    }
    if (!/^09\d{8}$/.test(form.phone)) {
      alert('請填寫正確的手機號碼');
      return;
    }
    if (!selectedSlot) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        type: 'consulting',
        slotId: selectedSlot.id,
        consultantName: selectedSlot.consultantName,
        date: selectedSlot.date,
        time: selectedSlot.time,
        duration: selectedSlot.duration,
        fee: selectedSlot.fee,
        slotType: selectedSlot.type,
        buyerName: form.name,
        buyerPhone: form.phone,
        buyerEmail: form.email,
        buyerCompany: form.company,
        note: form.note,
        status: 'pending',
        source: 'website',
        createdAt: serverTimestamp(),
      });
      // 更新時段 enrolled +1
      await updateDoc(doc(db, 'consultingSlots', selectedSlot.id), {
        enrolled: increment(1),
      });
      // 本地狀態同步更新
      setSlots(prev => prev.map(s =>
        s.id === selectedSlot.id ? { ...s, enrolled: s.enrolled + 1 } : s
      ));
      setSubmitted(true);
    } catch (err) {
      alert('送出失敗，請稍後再試');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Noto Serif TC,serif' }}>🧭 專家諮詢</h1>
        <p className="text-white/60">由實戰顧問一對一陪伴，找到屬於你的解方</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* 顧問篩選 Tab */}
        <div className="flex gap-2 flex-wrap mb-8">
          {consultantNames.map(name => (
            <button key={name} onClick={() => setSelectedConsultant(name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                ${selectedConsultant === name ? 'bg-[#3B6D11] text-white border-[#3B6D11]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#3B6D11]'}`}>
              {name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">載入中...</div>
        ) : Object.keys(slotsByConsultant).length === 0 ? (
          <div className="text-center py-20 text-gray-400">目前沒有開放的諮詢時段</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(slotsByConsultant).map(([consultantName, consultantSlots]) => {
              const info = getConsultantInfo(consultantName);
              const isExpanded = expandedConsultant === consultantName;
              return (
                <div key={consultantName} className="card overflow-hidden">
                  {/* 顧問資訊 header */}
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedConsultant(isExpanded ? null : consultantName)}
                  >
                    <div className="flex items-center gap-4">
                      {info?.detailUrl ? (
                        <a href={info.detailUrl} target="_blank" rel="noreferrer" className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a3a0f] to-[#639922] flex items-center justify-center text-2xl overflow-hidden hover:opacity-80 transition-opacity">
                            {info.photoUrl ? (
                              <img src={info.photoUrl} alt={consultantName} className="w-full h-full object-cover" />
                            ) : (
                              <span>{info?.emoji || '👤'}</span>
                            )}
                          </div>
                        </a>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a3a0f] to-[#639922] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                          {info?.photoUrl ? (
                            <img src={info.photoUrl} alt={consultantName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{info?.emoji || '👤'}</span>
                          )}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1a3a0f] text-lg">{consultantName}</span>
                          {info?.detailUrl && (
                            <a href={info.detailUrl} target="_blank" rel="noreferrer" className="text-xs text-[#639922] hover:underline">查看介紹 →</a>
                          )}
                        </div>
                        {info?.title && <div className="text-sm text-gray-500">{info.title}</div>}
                        {info?.tags && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {info.tags.map((tag: string) => (
                              <span key={tag} className="text-xs bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-full">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{consultantSlots.length} 個時段</span>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* 顧問介紹（展開） */}
                  {isExpanded && info?.description && (
                    <div className="px-5 pb-3 text-sm text-gray-600 bg-[#f9fbf7] border-t border-gray-100">
                      <p className="py-3">{info.description}</p>
                    </div>
                  )}

                  {/* 時段列表 */}
                  <div className="border-t border-gray-100">
                    {consultantSlots.map(slot => {
                      const remain = slot.capacity - slot.enrolled;
                      const isFull = remain <= 0;
                      return (
                        <div key={slot.id} className={`flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0 ${isFull ? 'opacity-50' : 'hover:bg-gray-50'} transition-colors`}>
                          <div className="flex items-center gap-6">
                            <div>
                              <div className="font-medium text-[#1a3a0f] text-sm">
                                {slot.date} {slot.time}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>⏱ {slot.duration} 分鐘</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{TYPE_LABELS[slot.type] || slot.type}</span>
                                <span>👥 剩 {remain} 位</span>
                              </div>
                              {slot.note && <div className="text-xs text-gray-400 mt-1">📝 {slot.note}</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-lg font-bold text-[#3B6D11]">NT${slot.fee.toLocaleString()}</div>
                            <button
                              onClick={() => !isFull && handleBook(slot)}
                              disabled={isFull}
                              className={`text-sm px-4 py-1.5 rounded-full transition-all ${isFull ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#3B6D11] hover:bg-[#27500a] text-white'}`}>
                              {isFull ? '已額滿' : '立即預約'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 預約表單 Modal */}
      {showForm && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                  <h3 className="text-xl font-bold text-[#1a3a0f] mb-2">預約成功！</h3>
                  <p className="text-sm text-gray-500 mb-6">我們將盡快與您確認諮詢細節</p>
                  <div className="text-left bg-[#f9fbf7] rounded-xl p-4 text-sm space-y-2 mb-6">
                    <div><span className="text-gray-500">顧問：</span><span className="font-medium">{selectedSlot.consultantName}</span></div>
                    <div><span className="text-gray-500">時間：</span><span className="font-medium">{selectedSlot.date} {selectedSlot.time}</span></div>
                    <div><span className="text-gray-500">費用：</span><span className="font-medium text-[#3B6D11]">NT${selectedSlot.fee.toLocaleString()}</span></div>
                  </div>
                  <button onClick={() => setShowForm(false)}
                    className="w-full bg-[#3B6D11] text-white py-3 rounded-xl font-medium">
                    關閉
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-[#1a3a0f]">預約諮詢</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                  </div>

                  {/* 時段摘要 */}
                  <div className="bg-[#EAF3DE] rounded-xl p-4 mb-5 text-sm">
                    <div className="font-bold text-[#1a3a0f] mb-1">{selectedSlot.consultantName}</div>
                    <div className="text-gray-600">{selectedSlot.date} {selectedSlot.time} · {selectedSlot.duration} 分鐘</div>
                    <div className="text-[#3B6D11] font-bold mt-1">NT${selectedSlot.fee.toLocaleString()}</div>
                  </div>

                  {/* 表單 */}
                  <div className="space-y-3">
                    {[
                      { id: 'name', label: '姓名', required: true, placeholder: '請輸入真實姓名' },
                      { id: 'phone', label: '聯絡電話', required: true, placeholder: '09xxxxxxxx' },
                      { id: 'email', label: 'Email', required: true, placeholder: 'your@email.com' },
                      { id: 'company', label: '公司/單位', required: false, placeholder: '（選填）' },
                    ].map(field => (
                      <div key={field.id}>
                        <label className="block text-xs font-bold text-[#1a3a0f] mb-1">
                          {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={form[field.id as keyof typeof form]}
                          onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#3B6D11]"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold text-[#1a3a0f] mb-1">諮詢問題簡述</label>
                      <textarea
                        rows={3}
                        placeholder="請簡述您想諮詢的問題（選填）"
                        value={form.note}
                        onChange={e => setForm({ ...form, note: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#3B6D11] resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-[#3B6D11] hover:bg-[#27500a] text-white py-3 rounded-xl font-medium mt-5 transition-all disabled:opacity-60">
                    {submitting ? '送出中...' : '確認預約'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

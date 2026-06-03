"use client";

import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, query, where,
  getDocs, orderBy, addDoc, Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// ─── Firebase ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCPo-k65Z1Rj4_WrWSgHUtl-8gXUP8u0Jk",
  authDomain: "qas-2026.firebaseapp.com",
  projectId: "qas-2026",
  storageBucket: "qas-2026.firebasestorage.app",
  messagingSenderId: "536015498250",
  appId: "1:536015498250:web:013e243fd9880ab71243f3",
};
const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db   = getFirestore(app);
const auth = getAuth(app);

// ─── 型別 ────────────────────────────────────────────────────────────────────
interface Consultant {
  id: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  photoUrl: string;
  emoji: string;
  displayOrder: number;
  status: string;
  consultingNote?: string;
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
  note?: string;
}

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  note: string;
}

// ─── 主元件 ──────────────────────────────────────────────────────────────────
export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Modal 狀態
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [slots, setSlots] = useState<ConsultingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ConsultingSlot | null>(null);

  // 預約表單
  const [bookingForm, setBookingForm] = useState<BookingForm>({ name: "", phone: "", email: "", note: "" });
  const [bookingStep, setBookingStep] = useState<"slots" | "form" | "done">("slots");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // ── 監聽登入狀態（自動填入會員資料）──────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // ── 載入顧問列表 ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const q = query(
          collection(db, "consultants"),
          where("status", "==", "active"),
          orderBy("displayOrder", "asc")
        );
        const snap = await getDocs(q);
        setConsultants(snap.docs.map(d => ({ id: d.id, ...d.data() } as Consultant)));
      } catch {
        // displayOrder 索引不存在時 fallback
        const snap = await getDocs(collection(db, "consultants"));
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Consultant))
          .filter(c => c.status === "active")
          .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
        setConsultants(list);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── 開啟預約 Modal ────────────────────────────────────────────────────────
  const openModal = async (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setSelectedSlot(null);
    setBookingStep("slots");
    setBookingError("");
    setBookingForm({ name: "", phone: "", email: "", note: "" });
    setSlotsLoading(true);

    try {
      const q = query(
        collection(db, "consultingSlots"),
        where("consultantId", "==", consultant.id),
        where("status", "==", "open"),
        orderBy("date", "asc")
      );
      const snap = await getDocs(q);
      const now = new Date().toISOString().slice(0, 10);
      const available = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as ConsultingSlot))
        .filter(s => s.date >= now && s.enrolled < s.capacity);
      setSlots(available);
    } catch {
      const snap = await getDocs(query(
        collection(db, "consultingSlots"),
        where("consultantId", "==", consultant.id)
      ));
      const now = new Date().toISOString().slice(0, 10);
      setSlots(
        snap.docs
          .map(d => ({ id: d.id, ...d.data() } as ConsultingSlot))
          .filter(s => s.status === "open" && s.date >= now && s.enrolled < s.capacity)
          .sort((a, b) => a.date.localeCompare(b.date))
      );
    } finally {
      setSlotsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedConsultant(null);
    setSlots([]);
    setSelectedSlot(null);
    setBookingStep("slots");
  };

  // ── 送出預約 ──────────────────────────────────────────────────────────────
  const submitBooking = async () => {
    if (!selectedSlot || !selectedConsultant) return;
    if (!bookingForm.name || !bookingForm.phone) {
      setBookingError("請填寫姓名與電話");
      return;
    }
    setBookingLoading(true);
    setBookingError("");
    try {
      await addDoc(collection(db, "orders"), {
        type: "consulting",
        consultantId: selectedConsultant.id,
        consultantName: selectedConsultant.name,
        slotId: selectedSlot.id,
        date: selectedSlot.date,
        time: selectedSlot.time,
        duration: selectedSlot.duration,
        fee: selectedSlot.fee,
        buyerUid: user?.uid ?? "",
        buyerName: bookingForm.name,
        buyerPhone: bookingForm.phone,
        buyerEmail: bookingForm.email,
        note: bookingForm.note,
        status: "pending",
        createdAt: Timestamp.now(),
      });
      setBookingStep("done");
    } catch (e) {
      setBookingError("預約失敗，請稍後再試");
    } finally {
      setBookingLoading(false);
    }
  };

  // ─── 畫面 ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#EAF3DE]">
      {/* Hero */}
      <div className="bg-[#1a3a0f] py-16 px-6 text-center">
        <h1 className="text-white text-3xl font-bold mb-3">專家諮詢</h1>
        <p className="text-[#97C459] text-base max-w-xl mx-auto">
          與專業顧問一對一深度對談，找到最適合您的解決方案
        </p>
      </div>

      {/* 顧問卡片列表 */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-[#3B6D11] animate-pulse">載入中...</p>
          </div>
        ) : consultants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#3B6D11]/60">目前尚無顧問資料</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map(c => (
              <div key={c.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#97C459]/30 hover:shadow-md transition-shadow">
                {/* 照片 */}
                <div className="relative h-56 bg-[#EAF3DE] flex items-center justify-center">
                  {c.photoUrl
                    ? <img src={c.photoUrl} alt={c.name}
                        className="w-full h-full object-cover" />
                    : <span className="text-6xl">{c.emoji || "👤"}</span>
                  }
                </div>

                {/* 資訊 */}
                <div className="p-5">
                  <h3 className="text-[#1a3a0f] font-bold text-lg">{c.name}</h3>
                  <p className="text-[#639922] text-sm mb-3">{c.title}</p>

                  {/* 標籤 */}
                  {c.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {c.tags.map(tag => (
                        <span key={tag}
                          className="bg-[#EAF3DE] text-[#3B6D11] text-xs px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 簡介 */}
                  {c.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {c.description}
                    </p>
                  )}

                  {/* 按鈕區 */}
                  <div className="flex gap-2">
                    {c.detailUrl && (
                      <a href={c.detailUrl} target="_blank" rel="noopener noreferrer"
                        className="flex-1 border border-[#639922] text-[#3B6D11] py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-[#EAF3DE] transition-colors">
                        🔍 查看介紹
                      </a>
                    )}
                    <button
                      onClick={() => openModal(c)}
                      className={`${c.detailUrl ? 'flex-1' : 'w-full'} bg-[#639922] hover:bg-[#3B6D11] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors`}>
                      📅 預約諮詢
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 預約 Modal ── */}
      {selectedConsultant && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="bg-[#1a3a0f] rounded-t-2xl p-5 flex items-center gap-4">
              {selectedConsultant.photoUrl
                ? <img src={selectedConsultant.photoUrl} alt=""
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#639922]" />
                : <div className="w-14 h-14 rounded-full bg-[#639922] flex items-center justify-center text-2xl">
                    {selectedConsultant.emoji || "👤"}
                  </div>
              }
              <div className="flex-1">
                <p className="text-[#97C459] text-xs">預約諮詢</p>
                <p className="text-white font-bold text-base">{selectedConsultant.name}</p>
                <p className="text-[#97C459]/80 text-xs">{selectedConsultant.title}</p>
              </div>
              <button onClick={closeModal} className="text-[#97C459] hover:text-white text-xl leading-none">×</button>
            </div>

            <div className="p-5">

              {/* Step 1：選時段 */}
              {bookingStep === "slots" && (
                <div>
                  {selectedConsultant.consultingNote && (
                    <div className="bg-[#EAF3DE] rounded-lg p-3 mb-4 text-[#3B6D11] text-sm">
                      💬 {selectedConsultant.consultingNote}
                    </div>
                  )}
                  <p className="text-[#1a3a0f] font-semibold text-sm mb-3">選擇可預約時段</p>
                  {slotsLoading ? (
                    <p className="text-[#639922] text-sm text-center py-6 animate-pulse">載入時段中...</p>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">目前無可預約時段</p>
                      <p className="text-gray-300 text-xs mt-1">請稍後再查看或聯繫我們</p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-5">
                      {slots.map(slot => (
                        <button key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                            selectedSlot?.id === slot.id
                              ? "border-[#639922] bg-[#EAF3DE]"
                              : "border-gray-200 hover:border-[#97C459]"
                          }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[#1a3a0f] font-semibold text-sm">
                                {slot.date} {slot.time}
                              </p>
                              <p className="text-gray-400 text-xs mt-0.5">
                                {slot.type === "online" ? "🌐 線上" : "📍 現場"} ｜ {slot.duration} 分鐘
                              </p>
                              {slot.note && <p className="text-gray-400 text-xs mt-0.5">{slot.note}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-[#639922] font-bold text-sm">NT${slot.fee.toLocaleString()}</p>
                              <p className="text-gray-400 text-xs">剩 {slot.capacity - slot.enrolled} 位</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedSlot && (
                    <button
                      onClick={() => setBookingStep("form")}
                      className="w-full bg-[#639922] hover:bg-[#3B6D11] text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                      下一步：填寫資料 →
                    </button>
                  )}
                </div>
              )}

              {/* Step 2：填寫資料 */}
              {bookingStep === "form" && selectedSlot && (
                <div>
                  {/* 已選時段摘要 */}
                  <div className="bg-[#EAF3DE] rounded-xl p-3 mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[#1a3a0f] font-semibold text-sm">{selectedSlot.date} {selectedSlot.time}</p>
                      <p className="text-[#639922] text-xs">{selectedSlot.duration} 分鐘 ｜ NT${selectedSlot.fee.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setBookingStep("slots")}
                      className="text-[#639922] text-xs hover:underline">更換</button>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-[#3B6D11] text-xs mb-1.5">姓名 *</label>
                      <input type="text" value={bookingForm.name}
                        onChange={e => setBookingForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="您的姓名" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[#3B6D11] text-xs mb-1.5">電話 *</label>
                      <input type="tel" value={bookingForm.phone}
                        onChange={e => setBookingForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="0912-345-678" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[#3B6D11] text-xs mb-1.5">Email（選填）</label>
                      <input type="email" value={bookingForm.email}
                        onChange={e => setBookingForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="your@email.com" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[#3B6D11] text-xs mb-1.5">諮詢主題或備註（選填）</label>
                      <textarea rows={3} value={bookingForm.note}
                        onChange={e => setBookingForm(f => ({ ...f, note: e.target.value }))}
                        placeholder="簡述您希望諮詢的問題..."
                        className={inputCls + " resize-none"} />
                    </div>
                  </div>

                  {bookingError && (
                    <p className="text-red-500 text-xs mb-3">{bookingError}</p>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setBookingStep("slots")}
                      className="flex-1 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                      ← 返回
                    </button>
                    <button onClick={submitBooking} disabled={bookingLoading}
                      className="flex-1 bg-[#639922] hover:bg-[#3B6D11] disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                      {bookingLoading ? "送出中..." : "確認預約"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3：完成 */}
              {bookingStep === "done" && (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-[#1a3a0f] font-bold text-lg mb-2">預約成功！</h3>
                  <p className="text-gray-500 text-sm mb-1">
                    已預約 {selectedConsultant.name} 顧問
                  </p>
                  <p className="text-[#639922] text-sm font-medium mb-6">
                    {selectedSlot?.date} {selectedSlot?.time}
                  </p>
                  <p className="text-gray-400 text-xs mb-6">
                    我們將盡快與您確認預約，請留意電話或 Email 通知。
                  </p>
                  <button onClick={closeModal}
                    className="bg-[#639922] text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3B6D11] transition-colors">
                    關閉
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#639922] placeholder:text-gray-300";

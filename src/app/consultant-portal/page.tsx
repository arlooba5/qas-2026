"use client";

import { useEffect, useState, useRef } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth, onAuthStateChanged, signOut, User,
} from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, collection,
  query, where, getDocs, addDoc, updateDoc, deleteDoc,
  orderBy, Timestamp,
} from "firebase/firestore";

// ─── Firebase ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCPo-k65Z1Rj4_WrWSgHUtl-8gXUP8u0Jk",
  authDomain: "qas-2026.firebaseapp.com",
  projectId: "qas-2026",
  storageBucket: "qas-2026.firebasestorage.app",
  messagingSenderId: "536015498250",
  appId: "1:536015498250:web:013e243fd9880ab71243f3",
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db   = getFirestore(app);

// Apps Script 網址（含 uploadImageToGitHub action）
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwK93lH6ImhVFAKcKeMVHL2zdGoS3ndzlVd5_iU2Au6f9usaL_N1qayDMIH5Q_6dcpE/exec";

// ─── 型別 ────────────────────────────────────────────────────────────────────
interface MemberData {
  uid: string; name: string; email: string; phone?: string;
  role: string; level?: string; consultantId?: string;
}

interface ConsultantProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  photoUrl: string;
  detailUrl: string;
  emoji: string;
  displayOrder: number;
  status: "active" | "inactive";
  consultingNote: string;
}

interface ConsultingSlot {
  id: string; consultantId: string; consultantName: string;
  date: string; time: string; duration: number; fee: number;
  capacity: number; enrolled: number; type: string; status: string; note?: string;
}

interface Order {
  id: string; buyerUid?: string; buyerName?: string; buyerEmail?: string;
  buyerPhone?: string; type: string; consultantId?: string; slotId?: string;
  date?: string; time?: string; status?: string; fee?: number; createdAt?: Timestamp;
}

type TabType = "overview" | "slots" | "orders" | "profile";

const EMPTY_PROFILE: Omit<ConsultantProfile, "id"> = {
  name: "", title: "", description: "", tags: [],
  photoUrl: "", detailUrl: "", emoji: "👤",
  displayOrder: 99, status: "active", consultingNote: "",
};

// ─── 主元件 ──────────────────────────────────────────────────────────────────
export default function ConsultantPortalPage() {
  const [user, setUser]           = useState<User | null>(null);
  const [member, setMember]       = useState<MemberData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const [slots, setSlots]           = useState<ConsultingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [orders, setOrders]         = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // 個人資料
  const [profile, setProfile]         = useState<ConsultantProfile | null>(null);
  const [profileForm, setProfileForm] = useState<Omit<ConsultantProfile, "id">>(EMPTY_PROFILE);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg]   = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [tagInput, setTagInput]       = useState("");

  // 照片上傳
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile]       = useState<File | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 時段 modal
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot]     = useState<ConsultingSlot | null>(null);
  const [slotForm, setSlotForm] = useState({
    date: "", time: "", duration: 60, fee: 1500,
    capacity: 1, type: "online", status: "open", note: "",
  });
  const [slotSaving, setSlotSaving] = useState(false);

  // ── 驗證 ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setLoading(false); return; }
      setUser(u);
      try {
        const snap = await getDoc(doc(db, "members", u.uid));
        if (snap.exists()) {
          const data = snap.data() as MemberData;
          if (data.role !== "consultant" && data.role !== "admin") {
            setAccessDenied(true);
          } else {
            setMember({ ...data, uid: u.uid });
          }
        } else { setAccessDenied(true); }
      } catch { setAccessDenied(true); }
      finally { setLoading(false); }
    });
    return () => unsub();
  }, []);

  // ── 載入顧問 Profile ──────────────────────────────────────────────────────
  const loadProfile = async (consultantId: string) => {
    const snap = await getDoc(doc(db, "consultants", consultantId));
    if (snap.exists()) {
      const data = { id: snap.id, ...snap.data() } as ConsultantProfile;
      setProfile(data);
      setProfileForm({
        name: data.name ?? "",
        title: data.title ?? "",
        description: data.description ?? "",
        tags: data.tags ?? [],
        photoUrl: data.photoUrl ?? "",
        detailUrl: data.detailUrl ?? "",
        emoji: data.emoji ?? "👤",
        displayOrder: data.displayOrder ?? 99,
        status: data.status ?? "active",
        consultingNote: data.consultingNote ?? "",
      });
      setPhotoPreview(data.photoUrl || null);
    }
  };

  // ── 載入時段 ──────────────────────────────────────────────────────────────
  const loadSlots = async () => {
    if (!member?.consultantId) return;
    setSlotsLoading(true);
    try {
      const q = query(collection(db, "consultingSlots"),
        where("consultantId", "==", member.consultantId), orderBy("date", "asc"));
      const snap = await getDocs(q);
      setSlots(snap.docs.map(d => ({ id: d.id, ...d.data() } as ConsultingSlot)));
    } finally { setSlotsLoading(false); }
  };

  // ── 載入訂單 ──────────────────────────────────────────────────────────────
  const loadOrders = async () => {
    if (!member?.consultantId) return;
    setOrdersLoading(true);
    try {
      const q = query(collection(db, "orders"),
        where("consultantId", "==", member.consultantId), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    } finally { setOrdersLoading(false); }
  };

  useEffect(() => {
    if (member?.consultantId) {
      loadProfile(member.consultantId);
      loadSlots();
      loadOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  // ── 照片選取預覽 ──────────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("照片請控制在 5MB 以下");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── 上傳照片到 GitHub（透過 Apps Script，FormData 避免 CORS）────────────
  const uploadPhoto = async (): Promise<string> => {
    if (!photoFile || !member?.name) return profileForm.photoUrl;
    setPhotoUploading(true);
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res((r.result as string).split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(photoFile);
      });
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const filename = `${member.name}.${ext}`;

      const form = new FormData();
      form.append("payload", JSON.stringify({
        action: "uploadImageToGitHub",
        filename,
        base64,
        mimeType: photoFile.type,
      }));

      const resp = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: form,
      });
      const result = await resp.json();
      if (result.success) {
        return `https://raw.githubusercontent.com/arlooba5/qas-2026/main/public/images/consultants/${filename}`;
      } else {
        throw new Error(result.error ?? "上傳失敗");
      }
    } finally {
      setPhotoUploading(false);
    }
  };

  // ── 儲存個人資料 ──────────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!member?.consultantId) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      let photoUrl = profileForm.photoUrl;
      if (photoFile) {
        photoUrl = await uploadPhoto();
      }
      const payload = { ...profileForm, photoUrl };
      await setDoc(doc(db, "consultants", member.consultantId), payload, { merge: true });
      setProfileForm(f => ({ ...f, photoUrl }));
      setPhotoPreview(photoUrl);
      setPhotoFile(null);
      setProfileMsg({ type: "ok", text: "✅ 儲存成功！官網將於數分鐘內更新。" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "儲存失敗";
      setProfileMsg({ type: "err", text: `❌ ${msg}` });
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Tag 管理 ──────────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !profileForm.tags.includes(t)) {
      setProfileForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };
  const removeTag = (tag: string) =>
    setProfileForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  // ── 時段 CRUD ─────────────────────────────────────────────────────────────
  const openNewSlot = () => {
    setEditingSlot(null);
    setSlotForm({ date: "", time: "", duration: 60, fee: 1500, capacity: 1, type: "online", status: "open", note: "" });
    setShowSlotModal(true);
  };
  const openEditSlot = (slot: ConsultingSlot) => {
    setEditingSlot(slot);
    setSlotForm({ date: slot.date, time: slot.time, duration: slot.duration, fee: slot.fee,
      capacity: slot.capacity, type: slot.type, status: slot.status, note: slot.note || "" });
    setShowSlotModal(true);
  };
  const saveSlot = async () => {
    if (!member?.consultantId || !slotForm.date || !slotForm.time) return;
    setSlotSaving(true);
    try {
      const payload = { ...slotForm, consultantId: member.consultantId,
        consultantName: member.name, enrolled: editingSlot?.enrolled ?? 0 };
      if (editingSlot) await updateDoc(doc(db, "consultingSlots", editingSlot.id), payload);
      else await addDoc(collection(db, "consultingSlots"), payload);
      setShowSlotModal(false);
      await loadSlots();
    } finally { setSlotSaving(false); }
  };
  const deleteSlot = async (id: string) => {
    if (!confirm("確定要刪除這個時段？")) return;
    await deleteDoc(doc(db, "consultingSlots", id));
    await loadSlots();
  };
  const toggleSlotStatus = async (slot: ConsultingSlot) => {
    await updateDoc(doc(db, "consultingSlots", slot.id),
      { status: slot.status === "open" ? "closed" : "open" });
    await loadSlots();
  };

  // ── 統計 ──────────────────────────────────────────────────────────────────
  const openSlots    = slots.filter(s => s.status === "open").length;
  const totalEnrolled = slots.reduce((a, s) => a + s.enrolled, 0);
  const totalRevenue  = orders.filter(o => o.status !== "cancelled").reduce((a, o) => a + (o.fee || 0), 0);
  const pendingOrders = orders.filter(o => !o.status || o.status === "pending").length;

  // ── 畫面 ──────────────────────────────────────────────────────────────────
  if (loading)      return <LoadingScreen />;
  if (!user)        return <NotLoggedIn />;
  if (accessDenied) return <AccessDenied />;
  if (!member)      return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0d2206]">
      {/* Header */}
      <header className="bg-[#1a3a0f] border-b border-[#3B6D11] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profile?.photoUrl
            ? <img src={profile.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            : <div className="w-8 h-8 rounded-full bg-[#639922] flex items-center justify-center text-white font-bold text-sm">{member.name?.charAt(0)}</div>
          }
          <div>
            <p className="text-[#97C459] text-xs">顧問自助後台</p>
            <p className="text-white font-semibold text-sm">{member.name}</p>
          </div>
        </div>
        <button onClick={() => signOut(auth).then(() => window.location.href = "/login")}
          className="text-[#97C459] hover:text-white text-sm transition-colors">登出</button>
      </header>

      {/* Nav */}
      <nav className="bg-[#1a3a0f] border-b border-[#3B6D11] px-6">
        <div className="flex gap-1">
          {([
            { key: "overview", label: "📊 總覽" },
            { key: "slots",    label: "🗓 諮詢時段" },
            { key: "orders",   label: "📋 預約訂單" },
            { key: "profile",  label: "👤 個人資料" },
          ] as { key: TabType; label: string }[]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-[#639922] text-[#97C459]"
                  : "border-transparent text-[#639922]/60 hover:text-[#97C459]"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* ── 總覽 ── */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-white text-xl font-bold mb-6">歡迎回來，{member.name} 顧問 👋</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="開放時段"  value={openSlots}       unit="個" color="#639922" />
              <StatCard label="累計預約"  value={totalEnrolled}   unit="人" color="#97C459" />
              <StatCard label="待確認訂單" value={pendingOrders}  unit="筆" color="#f59e0b" />
              <StatCard label="累計收入"  value={`NT$${totalRevenue.toLocaleString()}`} color="#34d399" />
            </div>
            <div className="bg-[#1a3a0f] rounded-xl p-5 border border-[#3B6D11]">
              <h3 className="text-[#97C459] font-semibold mb-3">最近時段</h3>
              {slots.length === 0
                ? <p className="text-[#639922]/60 text-sm">尚無時段，前往「諮詢時段」新增</p>
                : <div className="space-y-2">
                    {slots.slice(0, 5).map(s => (
                      <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#3B6D11]/40 last:border-0">
                        <span className="text-white text-sm">{s.date} {s.time}</span>
                        <span className="text-[#639922] text-sm">{s.enrolled}/{s.capacity} 人</span>
                        <StatusBadge status={s.status} />
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── 諮詢時段 ── */}
        {activeTab === "slots" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">諮詢時段管理</h2>
              <button onClick={openNewSlot}
                className="bg-[#639922] hover:bg-[#3B6D11] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                ＋ 新增時段
              </button>
            </div>
            {slotsLoading ? <p className="text-[#97C459] text-sm">載入中...</p>
              : slots.length === 0 ? <EmptyState message="尚無時段，點擊「新增時段」開始設定" />
              : <div className="space-y-3">
                  {slots.map(slot => (
                    <div key={slot.id} className="bg-[#1a3a0f] rounded-xl p-4 border border-[#3B6D11]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-semibold">{slot.date} {slot.time}</span>
                            <StatusBadge status={slot.status} />
                            <span className="text-[#97C459]/60 text-xs">{slot.type === "online" ? "🌐 線上" : "📍 現場"}</span>
                          </div>
                          <div className="flex gap-4 text-sm text-[#639922]">
                            <span>⏱ {slot.duration} 分鐘</span>
                            <span>💰 NT${slot.fee.toLocaleString()}</span>
                            <span>👥 {slot.enrolled}/{slot.capacity} 人</span>
                          </div>
                          {slot.note && <p className="text-[#97C459]/60 text-xs mt-1">{slot.note}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toggleSlotStatus(slot)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-[#3B6D11] text-[#97C459] hover:bg-[#3B6D11] transition-colors">
                            {slot.status === "open" ? "關閉" : "開放"}
                          </button>
                          <button onClick={() => openEditSlot(slot)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-[#639922] text-[#639922] hover:bg-[#639922] hover:text-white transition-colors">
                            編輯
                          </button>
                          <button onClick={() => deleteSlot(slot.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors">
                            刪除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── 預約訂單 ── */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-white text-xl font-bold mb-6">預約訂單</h2>
            {ordersLoading ? <p className="text-[#97C459] text-sm">載入中...</p>
              : orders.length === 0 ? <EmptyState message="尚無預約訂單" />
              : <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-[#1a3a0f] rounded-xl p-4 border border-[#3B6D11]">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-semibold">{order.buyerName || "（未留名）"}</span>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-[#639922]">
                            {order.date     && <span>📅 {order.date} {order.time}</span>}
                            {order.buyerPhone && <span>📞 {order.buyerPhone}</span>}
                            {order.buyerEmail && <span>✉️ {order.buyerEmail}</span>}
                            {order.fee      && <span>💰 NT${order.fee.toLocaleString()}</span>}
                          </div>
                          {order.createdAt && (
                            <p className="text-[#639922]/50 text-xs mt-1">
                              報名時間：{order.createdAt.toDate().toLocaleDateString("zh-TW")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── 個人資料（可編輯）── */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-white text-xl font-bold">個人資料編輯</h2>

            {/* 照片區 */}
            <div className="bg-[#1a3a0f] rounded-xl p-5 border border-[#3B6D11]">
              <p className="text-[#97C459] text-sm font-medium mb-4">形象照片</p>
              <div className="flex items-center gap-5">
                <div className="relative">
                  {photoPreview
                    ? <img src={photoPreview} alt="形象照" className="w-24 h-24 rounded-full object-cover border-2 border-[#639922]" />
                    : <div className="w-24 h-24 rounded-full bg-[#0d2206] border-2 border-dashed border-[#3B6D11] flex items-center justify-center text-3xl">
                        {profileForm.emoji || "👤"}
                      </div>
                  }
                </div>
                <div className="flex-1">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                    className="hidden" onChange={handlePhotoChange} />
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-[#639922] text-[#97C459] py-2 rounded-lg text-sm hover:bg-[#639922]/10 transition-colors mb-2">
                    {photoPreview ? "更換照片" : "選擇照片"}
                  </button>
                  <p className="text-[#639922]/50 text-xs">支援 JPG / PNG / WebP，建議 400×400px，5MB 以下</p>
                  {photoFile && (
                    <p className="text-[#97C459] text-xs mt-1">已選取：{photoFile.name}（儲存時自動上傳）</p>
                  )}
                </div>
              </div>
            </div>

            {/* 基本資訊 */}
            <div className="bg-[#1a3a0f] rounded-xl p-5 border border-[#3B6D11] space-y-4">
              <p className="text-[#97C459] text-sm font-medium">基本資訊</p>
              <div className="grid grid-cols-2 gap-4">
                <ProfileFormField label="顯示名稱 *">
                  <input type="text" value={profileForm.name}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="王小明" className={inputCls} />
                </ProfileFormField>
                <ProfileFormField label="職稱 / 頭銜 *">
                  <input type="text" value={profileForm.title}
                    onChange={e => setProfileForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="企業培訓顧問" className={inputCls} />
                </ProfileFormField>
              </div>
              <ProfileFormField label="個人簡介（官網顯示）">
                <textarea rows={4} value={profileForm.description}
                  onChange={e => setProfileForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="請簡述您的專業背景與服務特色..."
                  className={inputCls + " resize-none"} />
              </ProfileFormField>
              <ProfileFormField label="諮詢說明（預約頁顯示）">
                <textarea rows={2} value={profileForm.consultingNote}
                  onChange={e => setProfileForm(f => ({ ...f, consultingNote: e.target.value }))}
                  placeholder="例：專注企業組織診斷，適合中小企業主"
                  className={inputCls + " resize-none"} />
              </ProfileFormField>
            </div>

            {/* 標籤 */}
            <div className="bg-[#1a3a0f] rounded-xl p-5 border border-[#3B6D11]">
              <p className="text-[#97C459] text-sm font-medium mb-3">專業標籤</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profileForm.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-[#639922]/20 text-[#97C459] text-xs px-3 py-1 rounded-full">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white ml-1 leading-none">×</button>
                  </span>
                ))}
                {profileForm.tags.length === 0 && (
                  <span className="text-[#639922]/40 text-xs">尚未新增標籤</span>
                )}
              </div>
              <div className="flex gap-2">
                <input type="text" value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="輸入標籤後按 Enter 或點新增"
                  className={inputCls + " flex-1"} />
                <button onClick={addTag}
                  className="border border-[#639922] text-[#97C459] px-4 py-2 rounded-lg text-sm hover:bg-[#639922]/10 transition-colors">
                  新增
                </button>
              </div>
            </div>

            {/* 進階設定 */}
            <div className="bg-[#1a3a0f] rounded-xl p-5 border border-[#3B6D11] space-y-4">
              <p className="text-[#97C459] text-sm font-medium">進階設定</p>
              <div className="grid grid-cols-2 gap-4">
                <ProfileFormField label="Emoji 代表圖示">
                  <input type="text" value={profileForm.emoji}
                    onChange={e => setProfileForm(f => ({ ...f, emoji: e.target.value }))}
                    placeholder="👤" className={inputCls} />
                </ProfileFormField>
                {member.role === "admin" && (
                  <ProfileFormField label="顯示排序（數字越小越前面）">
                    <input type="number" min={1} value={profileForm.displayOrder}
                      onChange={e => setProfileForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
                      className={inputCls} />
                  </ProfileFormField>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ProfileFormField label="詳細頁連結（選填）">
                  <input type="url" value={profileForm.detailUrl}
                    onChange={e => setProfileForm(f => ({ ...f, detailUrl: e.target.value }))}
                    placeholder="https://..." className={inputCls} />
                </ProfileFormField>
                <ProfileFormField label="官網顯示狀態">
                  <select value={profileForm.status}
                    onChange={e => setProfileForm(f => ({ ...f, status: e.target.value as "active" | "inactive" }))}
                    className={inputCls}>
                    <option value="active">顯示（上線）</option>
                    <option value="inactive">隱藏（下線）</option>
                  </select>
                </ProfileFormField>
              </div>
            </div>

            {/* 帳號資訊（唯讀）*/}
            <div className="bg-[#1a3a0f] rounded-xl p-5 border border-[#3B6D11]">
              <p className="text-[#97C459] text-sm font-medium mb-3">帳號資訊（唯讀）</p>
              <div className="space-y-2">
                <ReadonlyRow label="登入信箱" value={member.email} />
                <ReadonlyRow label="電話" value={member.phone || "未設定"} />
                <ReadonlyRow label="顧問 ID" value={member.consultantId || "尚未設定"} mono />
              </div>
              <p className="text-[#639922]/40 text-xs mt-3">如需修改帳號資訊，請聯繫管理員 arlooba5@gmail.com</p>
            </div>

            {/* 儲存按鈕 */}
            {profileMsg && (
              <div className={`rounded-lg px-4 py-3 text-sm ${
                profileMsg.type === "ok"
                  ? "bg-green-900/30 border border-green-700 text-green-400"
                  : "bg-red-900/30 border border-red-800 text-red-400"}`}>
                {profileMsg.text}
              </div>
            )}
            <button onClick={saveProfile}
              disabled={profileSaving || photoUploading}
              className="w-full bg-[#639922] hover:bg-[#3B6D11] disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              {photoUploading ? "上傳照片中..." : profileSaving ? "儲存中..." : "💾 儲存並更新官網"}
            </button>
          </div>
        )}
      </main>

      {/* 時段 Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a3a0f] rounded-2xl w-full max-w-md border border-[#3B6D11] max-h-[90vh] flex flex-col">
            <h3 className="text-white font-bold text-lg p-6 pb-4 shrink-0">
              {editingSlot ? "編輯時段" : "新增諮詢時段"}
            </h3>
            <div className="overflow-y-auto px-6 pb-2 flex-1 space-y-4">
              <ModalField label="日期">
                <input type="date" value={slotForm.date}
                  onChange={e => setSlotForm({ ...slotForm, date: e.target.value })} className={inputCls} />
              </ModalField>
              <ModalField label="時間">
                <input type="time" value={slotForm.time}
                  onChange={e => setSlotForm({ ...slotForm, time: e.target.value })} className={inputCls} />
              </ModalField>
              <div className="grid grid-cols-2 gap-3">
                <ModalField label="時長（分鐘）">
                  <input type="number" value={slotForm.duration}
                    onChange={e => setSlotForm({ ...slotForm, duration: Number(e.target.value) })} className={inputCls} />
                </ModalField>
                <ModalField label="費用（NT$）">
                  <input type="number" value={slotForm.fee}
                    onChange={e => setSlotForm({ ...slotForm, fee: Number(e.target.value) })} className={inputCls} />
                </ModalField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ModalField label="容量（人）">
                  <input type="number" min={1} value={slotForm.capacity}
                    onChange={e => setSlotForm({ ...slotForm, capacity: Number(e.target.value) })} className={inputCls} />
                </ModalField>
                <ModalField label="類型">
                  <select value={slotForm.type} onChange={e => setSlotForm({ ...slotForm, type: e.target.value })} className={inputCls}>
                    <option value="online">線上</option>
                    <option value="onsite">現場</option>
                  </select>
                </ModalField>
              </div>
              <ModalField label="狀態">
                <select value={slotForm.status} onChange={e => setSlotForm({ ...slotForm, status: e.target.value })} className={inputCls}>
                  <option value="open">開放報名</option>
                  <option value="closed">暫停報名</option>
                </select>
              </ModalField>
              <ModalField label="備註（選填）">
                <input type="text" value={slotForm.note}
                  onChange={e => setSlotForm({ ...slotForm, note: e.target.value })}
                  placeholder="例：僅接受 Zoom 視訊" className={inputCls} />
              </ModalField>
            </div>
            <div className="flex gap-3 p-6 pt-4 shrink-0">
              <button onClick={() => setShowSlotModal(false)}
                className="flex-1 border border-[#3B6D11] text-[#97C459] py-2.5 rounded-lg text-sm font-medium hover:bg-[#3B6D11]/30 transition-colors">
                取消
              </button>
              <button onClick={saveSlot} disabled={slotSaving || !slotForm.date || !slotForm.time}
                className="flex-1 bg-[#639922] hover:bg-[#3B6D11] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                {slotSaving ? "儲存中..." : "確認儲存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 樣式常數 ─────────────────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0d2206] border border-[#3B6D11] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#639922] placeholder:text-[#639922]/40";

// ─── 子元件 ───────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return <div className="min-h-screen bg-[#0d2206] flex items-center justify-center"><p className="text-[#97C459] animate-pulse">載入中...</p></div>;
}
function NotLoggedIn() {
  return <div className="min-h-screen bg-[#0d2206] flex flex-col items-center justify-center gap-4">
    <p className="text-white text-lg">請先登入</p>
    <a href="/login" className="bg-[#639922] text-white px-6 py-2.5 rounded-lg text-sm hover:bg-[#3B6D11] transition-colors">前往登入</a>
  </div>;
}
function AccessDenied() {
  return <div className="min-h-screen bg-[#0d2206] flex flex-col items-center justify-center gap-4">
    <p className="text-white text-lg">⛔ 此頁面僅限顧問使用</p>
    <a href="/" className="bg-[#1a3a0f] border border-[#3B6D11] text-[#97C459] px-6 py-2.5 rounded-lg text-sm hover:bg-[#3B6D11] transition-colors">返回首頁</a>
  </div>;
}
function EmptyState({ message }: { message: string }) {
  return <div className="bg-[#1a3a0f] rounded-xl p-10 border border-[#3B6D11] text-center">
    <p className="text-[#639922]/60 text-sm">{message}</p>
  </div>;
}
function StatCard({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color: string }) {
  return <div className="bg-[#1a3a0f] rounded-xl p-4 border border-[#3B6D11]">
    <p className="text-[#639922]/70 text-xs mb-1">{label}</p>
    <p className="font-bold text-xl" style={{ color }}>{value}{unit && <span className="text-sm font-normal ml-0.5">{unit}</span>}</p>
  </div>;
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    open:   { label: "開放", className: "bg-green-900/50 text-green-400 border-green-700" },
    closed: { label: "關閉", className: "bg-gray-800 text-gray-400 border-gray-700" },
    full:   { label: "額滿", className: "bg-orange-900/50 text-orange-400 border-orange-700" },
  };
  const s = map[status] ?? { label: status, className: "bg-gray-800 text-gray-400 border-gray-700" };
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${s.className}`}>{s.label}</span>;
}
function OrderStatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending:   { label: "待確認", className: "bg-yellow-900/50 text-yellow-400 border-yellow-700" },
    confirmed: { label: "已確認", className: "bg-green-900/50 text-green-400 border-green-700" },
    cancelled: { label: "已取消", className: "bg-red-900/50 text-red-400 border-red-700" },
    completed: { label: "已完成", className: "bg-blue-900/50 text-blue-400 border-blue-700" },
  };
  const s = map[status ?? "pending"] ?? { label: status, className: "bg-gray-800 text-gray-400 border-gray-700" };
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${s.className}`}>{s.label}</span>;
}
function ProfileFormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[#97C459] text-xs mb-1.5">{label}</label>{children}</div>;
}
function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[#97C459] text-xs mb-1.5">{label}</label>{children}</div>;
}
function ReadonlyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="flex items-center justify-between py-1.5 border-b border-[#3B6D11]/40 last:border-0">
    <span className="text-[#639922]/70 text-sm w-24 shrink-0">{label}</span>
    <span className={`text-sm text-right ${mono ? "font-mono text-[#97C459]" : "text-white"}`}>{value}</span>
  </div>;
}

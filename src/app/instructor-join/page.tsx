// src/app/instructor-join/page.tsx
// QAS 克斯 — 講師／顧問夥伴加入說明頁（公開頁面，不需登入）
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "講師／顧問夥伴加入說明｜QAS 克斯",
  description:
    "邀請講師與顧問夥伴加入克斯共創學習生態圈（土壤計畫）：加入 LINE 群組、上傳 2027 年課綱、完成官網註冊。",
};

const LINKS = {
  soilPlan: "/soil-plan",
  lineGroup: "https://line.me/R/ti/g/Mf5cefFqub",
  drive:
    "https://drive.google.com/drive/folders/1aEEvndiiUgKU9lUAbZ19-r6utnVbZyUB?usp=sharing",
  register: "/register",
};

type Step = {
  no: string;
  title: string;
  desc: string;
  points: string[];
  cta: { label: string; href: string; external?: boolean };
};

const STEPS: Step[] = [
  {
    no: "01",
    title: "認識土壤計畫，加入共創學習生態圈",
    desc: "土壤計畫是克斯的課程開發指引：以「成長意識」為核心，向外發展用人、行銷、財務、團隊、數位創新五個經營面向。我們邀請講師與顧問夥伴一起耕耘這片土壤，共創學習生態圈。",
    points: ["先閱讀土壤計畫的理念與課程地圖", "想想您的專長最適合落在哪個面向"],
    cta: { label: "前往土壤計畫", href: LINKS.soilPlan },
  },
  {
    no: "02",
    title: "加入講師 LINE 群組",
    desc: "未來的通知、講師小聚、會議與各項聯繫，都會在群組中進行，請務必加入。",
    points: ["點擊下方按鈕，用手機 LINE 開啟", "加入後請將群組暱稱改為「真實姓名」"],
    cta: { label: "加入 LINE 群組", href: LINKS.lineGroup, external: true },
  },
  {
    no: "03",
    title: "上傳 2027 年可開課的課綱",
    desc: "請依照土壤計畫的課程地圖規劃課程，並參考雲端資料夾中的範例格式撰寫後上傳。",
    points: [
      "課程規格：6 小時工作坊",
      "課程主題需對應課程地圖中的面向",
      "依範例格式撰寫，檔名請標註「講師姓名＿課程名稱」",
    ],
    cta: { label: "開啟課綱範例與上傳資料夾", href: LINKS.drive, external: true },
  },
  {
    no: "04",
    title: "官網註冊，開通講師權限",
    desc: "請到克斯官網註冊會員。註冊完成後，到 LINE 群組告知我們，我們會為您開通講師權限。",
    points: [
      "使用常用 Email 完成註冊",
      "到群組留言：「已完成註冊，註冊 Email：＿＿＿」",
      "開通後即可使用講師／顧問專區功能",
    ],
    cta: { label: "前往官網註冊", href: LINKS.register },
  },
];

const MAP = [
  { name: "用人意識", topics: ["識人與特質判讀", "招募與任用決策", "激勵與帶人方式", "授權與放手", "接班與傳承"] },
  { name: "行銷意識", topics: ["定位與差異化", "價值主張與話術", "客戶旅程", "口碑與轉介紹", "數位工具與內容"] },
  { name: "財務意識", topics: ["損益與成本結構", "現金流管理", "定價邏輯", "投資與風險判斷", "數字化決策習慣"] },
  { name: "團隊意識", topics: ["溝通與衝突處理", "角色與分工", "信任與共識建立", "會議與決策", "跨部門協作"] },
  { name: "數位創新意識", topics: ["數位與 AI 工具應用", "流程自動化思維", "資料與數據敏感度", "創新嘗試與快速驗證", "數位風險與資安基本觀念"] },
];

const CHECKLIST = [
  "已閱讀土壤計畫與課程地圖",
  "已加入講師 LINE 群組",
  "已上傳 2027 年 6 小時工作坊課綱",
  "已完成官網註冊，並在群組告知",
];

function CtaButton({ cta, primary = false }: { cta: Step["cta"]; primary?: boolean }) {
  const cls = `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
    primary
      ? "bg-[#639922] text-white hover:bg-[#527f1c]"
      : "border border-[#1a3a0f]/20 bg-white text-[#1a3a0f] hover:border-[#639922] hover:text-[#639922]"
  }`;
  const label = (
    <>
      {cta.label}
      <span aria-hidden>{cta.external ? "↗" : "→"}</span>
    </>
  );
  return cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
    </a>
  ) : (
    <Link href={cta.href} className={cls}>
      {label}
    </Link>
  );
}

export default function InstructorJoinPage() {
  return (
    <main className="min-h-screen bg-[#f7f9f3] text-[#22301b]">
      {/* Hero */}
      <section className="bg-[#1a3a0f] text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold tracking-widest text-[#a9d26b]">講師／顧問專區・夥伴邀請</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            一起耕耘這片土壤，
            <br className="sm:hidden" />
            共創學習生態圈
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-white/80">
            誠摯邀請講師與顧問夥伴加入克斯「土壤計畫」。完成以下四個步驟，我們就能一起規劃 2027 年的課程，並為您開通官網講師權限。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaButton primary cta={{ label: "加入 LINE 群組", href: LINKS.lineGroup, external: true }} />
            <a
              href="#steps"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              查看四個步驟 <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-[#1a3a0f]">加入四步驟</h2>
        <ol className="mt-8 space-y-5">
          {STEPS.map((s) => (
            <li
              key={s.no}
              className="grid gap-4 rounded-2xl border border-[#1a3a0f]/10 bg-white p-6 shadow-sm sm:grid-cols-[72px_1fr] sm:p-8"
            >
              <div className="text-3xl font-bold text-[#639922] sm:text-4xl">{s.no}</div>
              <div>
                <h3 className="text-lg font-bold text-[#1a3a0f] sm:text-xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-[#22301b]/80">{s.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-sm leading-relaxed">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#639922]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <CtaButton cta={s.cta} primary />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Course map */}
      <section className="border-y border-[#1a3a0f]/10 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-[#1a3a0f]">課程地圖：成長意識與五大面向</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-[#22301b]/80">
            規劃 2027 年課綱時，請以「成長意識」為核心，選擇一個面向（或跨面向）設計 6 小時工作坊。以下主題供參考。
          </p>

          <div className="mt-8 rounded-2xl bg-[#1a3a0f] px-6 py-5 text-center text-white">
            <div className="text-xs tracking-widest text-[#a9d26b]">核心</div>
            <div className="mt-1 text-xl font-bold">成長意識</div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {MAP.map((d, i) => (
              <div key={d.name} className="rounded-2xl border border-[#639922]/30 bg-[#f7f9f3] p-5">
                <div className="text-xs font-semibold text-[#639922]">面向 {i + 1}</div>
                <div className="mt-1 font-bold text-[#1a3a0f]">{d.name}</div>
                <ul className="mt-3 space-y-1.5 text-sm text-[#22301b]/80">
                  {d.topics.map((t) => (
                    <li key={t}>・{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <CtaButton cta={{ label: "看完整土壤計畫", href: LINKS.soilPlan }} />
          </div>
        </div>
      </section>

      {/* Course spec + checklist */}
      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#1a3a0f]/10 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#1a3a0f]">課綱規格</h2>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              ["開課年度", "2027 年"],
              ["課程形式", "工作坊（實作、討論、演練為主）"],
              ["課程時數", "6 小時"],
              ["主題方向", "對應土壤計畫課程地圖之面向"],
              ["撰寫格式", "依雲端資料夾內範例"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[88px_1fr] gap-3 border-b border-[#1a3a0f]/5 pb-3 last:border-0">
                <dt className="font-semibold text-[#639922]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <CtaButton primary cta={{ label: "課綱範例與上傳", href: LINKS.drive, external: true }} />
          </div>
        </div>

        <div className="rounded-2xl bg-[#1a3a0f] p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">完成確認清單</h2>
          <ul className="mt-5 space-y-3">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#a9d26b] text-xs text-[#a9d26b]">
                  ✓
                </span>
                <span className="text-white/90">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-white/70">
            有任何問題，歡迎直接在 LINE 群組提問，或來電 04-2243-3680 與我們聯繫。
          </p>
        </div>
      </section>
    </main>
  );
}

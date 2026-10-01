import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "成長意識與五大面向｜QAS 克斯",
  description:
    "克斯土壤計畫課程開發指引——以成長意識為核心，向外發展用人、行銷、財務、團隊、數位創新五個經營面向。",
};

type Dimension = {
  title: string;
  en: string;
  color: string;
  colorSoft: string;
  link: string;
  question: string;
  body: string;
  topics: string[];
  outcomes: string[];
};

const dimensions: Dimension[] = [
  {
    title: "用人意識",
    en: "People Awareness",
    color: "#2f7a5a",
    colorSoft: "#e1eee6",
    link: "成長意識往人際關係延伸的第一步：先看懂自己，才能看懂別人。",
    question: "我真的看懂眼前這個人嗎？",
    body: "用人意識是看懂人的能力——看懂自己、看懂夥伴、看懂客戶背後的動機、特質與需要。多數經營者用人靠直覺或靠職位描述，用人意識要教的是一套看人的方法，讓招募、任用、帶人、識人不再只憑感覺。",
    topics: ["識人與特質判讀", "招募與任用決策", "激勵與帶人方式", "授權與放手", "接班與傳承"],
    outcomes: [
      "用一套具體方法而非直覺判斷一個人適不適合某個位置",
      "看懂同一件事，不同特質的人為什麼反應不同",
      "知道怎麼帶不同特質的人，而不是用同一套方式對所有人",
    ],
  },
  {
    title: "行銷意識",
    en: "Marketing Awareness",
    color: "#b5832a",
    colorSoft: "#f4ead0",
    link: "成長意識往外部世界延伸：先看懂自己是誰，才能讓客戶看懂你的價值。",
    question: "客戶為什麼要選我，而不是別人？",
    body: "行銷意識不是學會投廣告或做社群，而是先建立「從客戶角度看自己」的能力。很多經營者行銷做不好，不是工具不會用，是根本不清楚自己在客戶心裡是什麼位置。這個面向要先建立定位與價值的意識，再談工具與通路。",
    topics: ["定位與差異化", "價值主張與話術", "客戶旅程", "口碑與轉介紹", "數位工具與內容"],
    outcomes: [
      "用一句話說清楚自己和競爭者的不同",
      "看懂客戶從認識到成交的每一步卡在哪裡",
      "把價值講給客戶聽得懂、記得住",
    ],
  },
  {
    title: "財務意識",
    en: "Financial Awareness",
    color: "#4f6fa8",
    colorSoft: "#e4e9f4",
    link: "成長意識往理性決策延伸：先誠實面對數字，才能不被情緒或僥倖帶著走。",
    question: "這個決定，錢會怎麼流動？",
    body: "財務意識不是教記帳或報表製作，而是讓非財務背景的人也能用數字做決策——看懂成本結構、現金流、定價背後的邏輯。多數經營與管理上的錯誤決策，源頭是缺乏財務意識，而不是缺乏財務專業。",
    topics: ["損益與成本結構", "現金流管理", "定價邏輯", "投資與風險判斷", "數字化決策習慣"],
    outcomes: [
      "看懂一份簡單報表在說什麼，而不只是交給會計處理",
      "知道一個決定會怎麼影響現金流，而不是只看賺不賺",
      "用數字，而不是感覺，來判斷一件事值不值得做",
    ],
  },
  {
    title: "團隊意識",
    en: "Team Awareness",
    color: "#98432b",
    colorSoft: "#f5e1d9",
    link: "成長意識往群體延伸：一群人願意一起成長，才會變成真正的團隊。",
    question: "我們是一群人在做事，還是一個團隊？",
    body: "團隊意識談的是協作、溝通與文化——讓一群各自做事的人，變成真正互相補位、共同承擔的團隊。這個面向常和用人意識搭配：用人意識看懂個人，團隊意識處理人和人之間怎麼一起工作。",
    topics: ["溝通與衝突處理", "角色與分工", "信任與共識建立", "會議與決策文化", "跨部門協作"],
    outcomes: [
      "看懂團隊卡住的原因，是分工不清、溝通不良，還是信任不足",
      "用具體方法處理團隊裡的衝突，而不是迴避或硬壓下去",
      "建立起讓團隊自己也能持續運作的共識與默契",
    ],
  },
  {
    title: "數位創新意識",
    en: "Digital Innovation Awareness",
    color: "#2b7a94",
    colorSoft: "#dcedf1",
    link: "成長意識往方法延伸：願意先改變做事的慣性，才願意嘗試新的工具與方法。",
    question: "這件事，有沒有更聰明的做法？",
    body: "數位創新意識不是教會學員操作某個軟體或工具，而是建立「用新方法解決舊問題」的敏感度與嘗試意願。多數人不是學不會工具，而是沒有意識到自己的工作方式可以被改變。這個面向要先鬆動習慣的做事方法，再帶入數位與 AI 工具，讓學員願意動手試、持續調整。",
    topics: ["數位與 AI 工具應用", "流程自動化思維", "資料與數據敏感度", "創新嘗試與快速驗證", "數位風險與資安基本觀念"],
    outcomes: [
      "看出自己手上哪些重複性工作可以被工具取代或簡化",
      "願意動手嘗試新工具，而不是先預設自己學不會",
      "用小規模試驗來驗證一個新做法，而不是等到完美才開始",
    ],
  },
];

export default function SoilPlanPage() {
  return (
    <div className="bg-[#f2f5ef] text-[#17251e]">
      {/* Hero */}
      <section className="bg-[#1a3a0f] text-[#f2f5ef] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            成長意識與五大面向
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#d7e4cf]">
            克斯土壤計畫課程開發指引——以成長意識為核心，向外發展五個經營面向。
          </p>

          {/* Diagram */}
          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="rounded-full bg-[#7d5aa6] px-7 py-3 font-serif font-bold text-[#1c1424]">
              成長意識
            </div>
            <div className="h-6 w-px bg-white/30" />
            <div className="flex flex-wrap justify-center gap-2">
              {dimensions.map((d) => (
                <span
                  key={d.title}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#0d1f16]"
                  style={{ backgroundColor: d.color }}
                >
                  {d.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Growth map */}
        <figure className="mb-10">
          <img
            src="/soil-plan/growth-map-2027.webp"
            alt="克斯 2027 年度學習地圖：以成長意識為核心，向外發展用人、行銷、財務、團隊、數位創新五個經營面向"
            width={1536}
            height={1024}
            className="w-full h-auto rounded-xl shadow-sm"
          />
        </figure>

        {/* Intro */}
        <p className="mb-4 leading-relaxed">
          土壤計畫相信教育訓練不是輸入資訊，而是創造情境讓人自然成長。這個信念落到課程架構上，就是把
          <strong>成長意識</strong>放在中心，其餘五個經營面向——用人、行銷、財務、團隊、數位創新——都是成長意識向外長出的枝幹。一個人先能看見自己、願意改變，才有辦法真正把用人、行銷、財務、團隊、數位創新的方法用得深、用得久；反過來，這五個面向的課程，也是讓學員練習成長意識最具體的場域。
        </p>
        <div className="mb-10 rounded-md border-l-4 border-[#b5832a] bg-[#f4ead0] px-4 py-3 text-sm">
          講師設計課程時，建議先問：這堂課想讓學員在哪個面向「動手做」，又想在成長意識上留下什麼樣的「看見」。兩者一起設計，課程才不會只是知識輸入。
        </div>

        {/* Core */}
        <section className="mb-10 rounded-xl border-2 border-[#7d5aa6] bg-[#ece4f4] p-6 md:p-8">
          <h2 className="font-serif text-2xl font-bold text-[#7d5aa6]">核心：成長意識</h2>
          <p className="mt-1 text-sm text-[#54645b]">Growth Awareness</p>
          <p className="mt-4 border-l-4 border-[#7d5aa6] pl-3 font-serif text-lg">
            「我願意先改變自己，還是只想改變別人？」
          </p>
          <p className="mt-4 leading-relaxed">
            成長意識是所有課程共同的土壤——處理的是自我覺察、心態轉換與持續學習的能力。它不是獨立的一堂課，而是貫穿五大面向的底層設計原則：每一個面向的課程，都應該在教方法之前，先讓學員看見自己原本沒看見的慣性或盲點。
          </p>
          <h3 className="mt-5 mb-2 text-sm font-bold">涵蓋主題</h3>
          <div className="flex flex-wrap gap-2">
            {["自我覺察", "心態與慣性轉換", "壓力與情緒調節", "持續學習的方法", "生命意義與價值澄清"].map(
              (t) => (
                <span key={t} className="rounded-full bg-white px-3 py-1 text-xs text-[#7d5aa6]">
                  {t}
                </span>
              )
            )}
          </div>
          <h3 className="mt-5 mb-2 text-sm font-bold">學員學完應該能</h3>
          <ul className="list-disc space-y-1 pl-5 leading-relaxed">
            <li>看見自己反覆卡住的慣性模式，而不只是抱怨外在環境</li>
            <li>把一次課程或活動的體悟，轉化成持續的行動</li>
            <li>用更開放的心態面對改變，而不是防衛或抗拒</li>
          </ul>
        </section>

        <p className="mb-8 text-center text-sm text-[#54645b]">從成長意識出發，往外長成五個面向</p>

        {/* Five dimensions */}
        <div className="space-y-6">
          {dimensions.map((d, i) => (
            <section
              key={d.title}
              className="rounded-xl bg-white p-6 md:p-8 shadow-sm"
              style={{ borderLeft: `5px solid ${d.color}` }}
            >
              <h2 className="font-serif text-xl font-bold" style={{ color: d.color }}>
                {["一", "二", "三", "四", "五"][i]}、{d.title}
              </h2>
              <p className="mt-1 text-sm text-[#54645b]">{d.en}</p>
              <p className="mt-3 text-sm italic" style={{ color: d.color }}>
                {d.link}
              </p>
              <p className="mt-2 border-l-4 pl-3 font-serif text-lg" style={{ borderColor: d.color }}>
                「{d.question}」
              </p>
              <p className="mt-3 leading-relaxed">{d.body}</p>

              <h3 className="mt-5 mb-2 text-sm font-bold">涵蓋主題</h3>
              <div className="flex flex-wrap gap-2">
                {d.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{ backgroundColor: d.colorSoft, color: d.color }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h3 className="mt-5 mb-2 text-sm font-bold">學員學完應該能</h3>
              <ul className="list-disc space-y-1 pl-5 leading-relaxed">
                {d.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-[#d3dbd1] pt-5 text-sm text-[#54645b]">
          成長意識為核心，五大面向為向外延伸的課程場域，講師可依專長從任一面向、任一養份形式切入設計，並在教學中呼應成長意識的核心提問。
          <img
            src="/soil-plan/qas-logo-banner.webp"
            alt="QAS 克斯有限公司"
            width={387}
            height={120}
            className="mt-6 h-12 w-auto rounded"
          />
        </footer>
      </div>
    </div>
  );
}

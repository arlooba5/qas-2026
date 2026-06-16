'use client';
import Link from 'next/link';
import { ArrowRight, Search, BookOpen, MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0d2206] via-[#1a3a0f] to-[#27500a] flex items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 30% 50%, #97C459 0%, transparent 50%), radial-gradient(circle at 70% 30%, #639922 0%, transparent 50%)'}} />
        <div className="relative max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <img src="/images/logo-banner.jpg" alt="QAS 克斯有限公司" className="h-20 object-contain" style={{maxWidth:'280px'}} onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6" style={{fontFamily:'Noto Serif TC, serif'}}>
            讓每個人都能<br /><span className="text-[#97C459]">輕易找到前行的路</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            幫助每一個人，找到動力、方向、方法
          </p>
        </div>
      </section>

      {/* GPS METHOD */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label">我們的方法</div>
            <h2 className="section-title" style={{fontFamily:'Noto Serif TC, serif'}}>您的專屬 GPS 地圖</h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              透過量子檢測，我們從您的神態、氣色、行為模式與思維結構中，精準解讀您當下的狀態與潛在能量。就像冰鑑識人術所揭示的——每個人都有屬於自己的底色與時勢，找到它，才能真正啟動前行的力量。我們幫您看清「現在在哪」、「適合往哪走」，以及「用什麼方式走得最穩」。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {num:'01', icon:'🧭', title:'先找方向', desc:'透過量子診斷報告，從多維度解析您的特質與當下處境，幫您找到最適合的前行方向，不走冤枉路。'},
              {num:'02', icon:'⚡', title:'再找動力', desc:'方向清晰，動力自然湧現。我們協助您連結內在驅動力，讓每一步都走在對的能量頻率上。'},
              {num:'03', icon:'🛤️', title:'方法自然產生', desc:'當方向與動力到位，具體的方法與行動就會自然浮現。課程、諮詢、教練陪伴，讓成長真正發生。'},
            ].map((item) => (
              <div key={item.num} className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#639922] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="text-6xl font-bold text-gray-50 leading-none mb-4" style={{fontFamily:'Noto Serif TC, serif'}}>{item.num}</div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#1a3a0f] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MVV */}
      <section className="py-24 px-4 bg-[#0d2206]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-medium tracking-widest uppercase text-[#97C459] mb-2">使命 · 願景 · 價值觀</div>
            <h2 className="text-3xl font-bold text-white" style={{fontFamily:'Noto Serif TC, serif'}}>我們相信的事</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {icon:'🌱', title:'使命', content:'協助每一個個人與組織提升意識，讓人「像樣」——不只是表面的成功，而是真正知行合一的狀態。'},
              {icon:'🔭', title:'願景', content:'成為台灣最值得信賴的意識整合平台，讓每個人都能找到自己的 GPS 座標，並有能力抵達理想目的地。'},
              {icon:'💎', title:'價值觀', content:'真實 — 從真實的檢測開始\n整合 — 知識、行動、成果三位一體\n陪伴 — 不只給工具，更給支持'},
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all duration-200">
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="text-xs tracking-widest uppercase text-[#97C459] mb-3">{item.title}</div>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label">三大服務</div>
            <h2 className="section-title" style={{fontFamily:'Noto Serif TC, serif'}}>從哪裡開始都可以</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:<Search size={26} className="text-[#3B6D11]"/>, title:'檢測報告', desc:'7種科學化評估工具，從個人特質到組織環境，精準定位您的現況座標。', href:'/reports', cta:'探索報告'},
              {icon:<BookOpen size={26} className="text-[#3B6D11]"/>, title:'課程培訓', desc:'涵蓋 AI 應用、HR 實務、商業思維等多元主題，由實戰專家授課。', href:'/courses', cta:'瀏覽課程'},
              {icon:<MessageCircle size={26} className="text-[#3B6D11]"/>, title:'專家諮詢', desc:'8種顧問專業領域，一對一深度諮詢，為您的具體問題提供量身建議。', href:'/consulting', cta:'預約諮詢'},
            ].map((svc) => (
              <Link key={svc.title} href={svc.href}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:border-[#97C459]/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#EAF3DE] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#d4e8b0] transition-colors">
                  {svc.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1a3a0f] mb-2">{svc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{svc.desc}</p>
                <div className="text-[#639922] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {svc.cta} <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4 bg-[#27500a]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['500+','服務企業'],['2,000+','培訓學員'],['7','種檢測報告'],['8','位專家顧問']].map(([n,l])=>(
            <div key={l}>
              <div className="text-4xl font-bold text-[#97C459] mb-1" style={{fontFamily:'Noto Serif TC, serif'}}>{n}</div>
              <div className="text-white/50 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a3a0f] mb-4" style={{fontFamily:'Noto Serif TC, serif'}}>準備好開始了嗎？</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">立即加入 QAS 會員，享有課程優惠、報告折扣與專屬服務</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register" className="btn-primary text-base">免費建立帳號</Link>
            <Link href="/about" className="btn-outline text-base">了解更多</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

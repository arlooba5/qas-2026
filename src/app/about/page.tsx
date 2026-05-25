export default function AboutPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white mb-2" style={{fontFamily:'Noto Serif TC,serif'}}>關於克斯</h1>
        <p className="text-white/60">系統整合的教育服務</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="h-96 bg-gradient-to-br from-[#1a3a0f] to-[#639922] rounded-3xl flex items-center justify-center text-8xl">🏃</div>
          <div>
            <div className="section-label">我們的故事</div>
            <h2 className="text-3xl font-bold text-[#1a3a0f] mb-6" style={{fontFamily:'Noto Serif TC,serif'}}>克斯，讓價值成為行動。</h2>
            <p className="text-gray-500 leading-relaxed mb-4">我們協助企業建立有感的文化，陪伴個人整合內在能量與行動方向，透過訓練、教練與專業診斷，讓成長不只被理解，而是真正發生。</p>
            <p className="text-gray-500 leading-relaxed mb-4">QAS（Quality Assessment System）是克斯有限公司的核心服務品牌，以「像樣」為理念，相信每個人都值得擁有清晰的方向感。</p>
            <p className="text-gray-500 leading-relaxed"><span className="text-[#3B6D11] font-bold">知行合一</span> — 從未知到已知，從已知到真正行動。這不是口號，而是我們每一天在做的事。</p>
          </div>
        </div>
        <div className="bg-[#0d2206] rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily:'Noto Serif TC,serif'}}>聯絡我們</h3>
          <p className="text-white/50 mb-6">有任何問題，歡迎透過以下方式與我們聯繫</p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[['📍','地址','台中市北屯區文心路4段955號17樓'],['💬','LINE@','@713irmkk'],['🏢','統編','91101392']].map(([e,l,v])=>(
              <div key={l} className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl mb-2">{e}</div>
                <div className="text-white/40 text-xs mb-1">{l}</div>
                <div className="text-white text-sm font-medium">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0d2206] text-white/60 pt-12 pb-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/images/logo.png" alt="QAS Logo" className="h-9 w-9 object-contain rounded-full bg-[#EAF3DE] p-0.5" />
              <div className="text-white font-bold text-base">QAS 克斯有限公司</div>
            </div>
            <p className="text-sm leading-relaxed mb-3">系統整合的教育服務<br />從未知到已知，從已知到知行合一</p>
            <div className="text-xs text-white/40 space-y-1">
              <div>統一編號：91101392</div>
              <div>台中市北屯區文心路4段955號17樓</div>
              <div>LINE@：@713irmkk</div>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-medium mb-3">服務</h4>
            {[['檢測報告','/reports'],['課程培訓','/courses'],['專家諮詢','/consulting'],['活動資訊','/events']].map(([l,h])=>(
              <Link key={h} href={h} className="block text-sm text-white/50 hover:text-[#97C459] mb-2 transition-colors">{l}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-white text-sm font-medium mb-3">會員</h4>
            {[['登入','/login'],['免費註冊','/register'],['會員中心','/member'],['關於我們','/about']].map(([l,h])=>(
              <Link key={h} href={h} className="block text-sm text-white/50 hover:text-[#97C459] mb-2 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/30">
          <span>© 2026 克斯有限公司 Kesi Co., Ltd. All rights reserved.</span>
          <span>LINE@：@713irmkk</span>
        </div>
      </div>
    </footer>
  );
}

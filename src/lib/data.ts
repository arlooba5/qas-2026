import { Course, Report, Consultant } from './types';

export const COURSES: Course[] = [
  { id: '950', name: 'AI 驅動：政府補助計畫書撰寫實戰與數位工具應用', date: '7月16日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '黃裕安', capacity: 30, category: 'AI', status: 'active' },
  { id: '835', name: 'AI 影像行銷與設計實戰', date: '7月8日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '莊家瑋', capacity: 30, category: 'AI', status: 'active' },
  { id: '596', name: '數位學習：AI 影像與行銷應用', date: '6月16日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '張禕中', capacity: 30, category: 'AI', status: 'active' },
  { id: '360', name: 'HR 實務：規章與說明書建立', date: '6月23日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 5400, instructor: '莊琬婷', capacity: 30, category: 'HR', status: 'active' },
  { id: '46185', name: '精準招募識人術：人才管理', date: '6月12日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 4800, instructor: '黃緹涓', capacity: 30, category: 'HR', status: 'active' },
  { id: '535', name: '人際困擾排除：職場心理健康', date: '6月10日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '邱雅琳', capacity: 30, category: '心理', status: 'active' },
  { id: '518', name: '諮商心理：壓力調適與生涯探索', date: '6月9日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '邱雅琳', capacity: 30, category: '心理', status: 'active' },
  { id: '201', name: '人類圖企業運用：特質與分工', date: '6月6日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 5400, instructor: '鍾佑妮', capacity: 30, category: '管理', status: 'active' },
  { id: '936', name: '卓越店經理訓練：經營管理實務', date: '7月15日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 5400, instructor: '郭豈辰', capacity: 30, category: '管理', status: 'active' },
  { id: '745', name: '商務談判與商業模式應用', date: '7月1日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '蘇達人', capacity: 30, category: '管理', status: 'active' },
  { id: '807', name: '商業攝影實務與質感美學', date: '7月7日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '莊家瑋', capacity: 30, category: '行銷', status: 'active' },
  { id: '675', name: '短影音行銷：社群經營實戰', date: '6月24日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 5400, instructor: '方澤寓', capacity: 30, category: '行銷', status: 'active' },
  { id: '3', name: '勞動法令實務：權益保障與合規', date: '7月8日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 4800, instructor: '蔡依婷', capacity: 30, category: '勞資', status: 'active' },
  { id: '461', name: '勞動契約與工作規則建置', date: '6月2日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 4800, instructor: '陳晏綜', capacity: 30, category: '勞資', status: 'active' },
  { id: '731', name: '勞資關係優化與爭議預防', date: '6月30日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 4800, instructor: '黃照權', capacity: 30, category: '勞資', status: 'active' },
  { id: '375', name: '團隊動能引導：桌遊協作實務', date: '5月20日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '簡坤宸', capacity: 30, category: '管理', status: 'active' },
  { id: '400', name: '團隊凝聚力：高績效組織建立', date: '10月15日', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 4800, instructor: '鍾佑妮', capacity: 30, category: '管理', status: 'active' },
  { id: '666', name: '團隊凝聚與自我突破：體驗教育', date: '待定', time: '09:00-17:00', location: '台中市北屯區文心路四段955號17樓', price: 6000, instructor: '林瑛桀', capacity: 30, category: '管理', status: 'active' },
];

export const REPORTS: Report[] = [
  { id: 'r1', name: '冰鑑識人 HR 評鑑報告', category: '個人人才評鑑', type: 'personal', description: '以古典相人學為基礎，結合現代 HR 視角，深入評估人才特質、潛能與風險，提供企業用人決策依據', price: 2000, emoji: '🧠', status: 'active' },
  { id: 'r2', name: '幸福感報告', category: '個人身心評估', type: 'personal', description: '評估個人在生理、心理、社會與環境四大層面的幸福感指數，協助找出提升生活品質的關鍵方向', price: 2000, emoji: '😊', status: 'active' },
  { id: 'r3', name: '內在驅動力檢測報告', category: '價值觀與信念評估', type: 'personal', description: '深度探索個人核心價值觀與信念體系，找出驅動行為與決策的根本動力，協助建立更清晰的人生方向', price: 2000, emoji: '⚡', status: 'active' },
  { id: 'r4', name: '成功能量檢測', category: '個人潛能評估', type: 'personal', description: '透過多維度評估找出個人的核心優勢與成功驅動力，協助制定最適合的個人發展路徑與行動策略', price: 2000, emoji: '🚀', status: 'active' },
  { id: 'r5', name: '組織環境檢測報告', category: '組織診斷', type: 'organization', description: '全面檢視組織內部文化、溝通機制與工作環境現況，協助管理層掌握組織健康度並制定改善策略', price: 2000, emoji: '🏢', status: 'active' },
  { id: 'r6', name: '企業勞資關係風險檢測', category: '企業風險管理', type: 'organization', description: '系統性評估勞資關係潛在風險，涵蓋法規遵循、溝通落差、員工滿意度等指標，降低勞資爭議發生率', price: 2000, emoji: '⚖️', status: 'active' },
  { id: 'r7', name: '商業模式檢測', category: '策略分析', type: 'organization', description: '從價值主張、客群定位、收益來源到成本結構，全方位檢測現有商業模式的可持續性與競爭優勢', price: 2000, emoji: '💡', status: 'active' },
];

export const CONSULTANTS: Consultant[] = [
  { id: 'c1', name: '經營顧問', title: '企業策略 · 商業模式', emoji: '🏢', description: '協助企業釐清策略方向、商業模式優化與組織運作效能提升，提供系統性的經營診斷與改善建議', tags: ['企業策略', '商業模式', '組織診斷'], status: 'active' },
  { id: 'c2', name: '品牌顧問', title: '品牌定位 · 視覺識別', emoji: '🎨', description: '從品牌定位、視覺識別到品牌故事，協助建立有溫度且具市場競爭力的品牌形象', tags: ['品牌定位', '視覺識別', '品牌故事'], status: 'active' },
  { id: 'c3', name: '行銷顧問', title: '行銷策略 · 內容規劃', emoji: '📢', description: '整合線上線下行銷策略，從市場分析到執行規劃，提升品牌曝光與潛在客戶轉換率', tags: ['行銷策略', '內容行銷', '廣告投放'], status: 'active' },
  { id: 'c4', name: '社群顧問', title: '社群經營 · 內容策略', emoji: '📱', description: '打造有黏著力的社群生態，從內容規劃到社群經營，建立品牌與受眾之間真實的連結', tags: ['社群經營', '內容策略', 'KOL合作'], status: 'active' },
  { id: 'c5', name: 'AI 顧問', title: 'AI導入 · 數位轉型', emoji: '🤖', description: '協助企業評估並導入 AI 工具與流程，從需求分析到實際應用，提升營運效率與競爭優勢', tags: ['AI導入', '流程優化', '數位轉型'], status: 'active' },
  { id: 'c6', name: '用人顧問', title: '招募策略 · 人才培育', emoji: '👥', description: '從招募策略制定到人才培育規劃，協助建立完善的人才管理體系與組織學習文化', tags: ['招募策略', '人才培育', '組織文化'], status: 'active' },
  { id: 'c7', name: '勞資顧問', title: '勞動法令 · 爭議預防', emoji: '⚖️', description: '提供勞動法令諮詢、勞資關係優化與爭議預防專業建議，協助企業建立健全的勞資關係', tags: ['勞動法令', '勞資關係', '爭議預防'], status: 'active' },
  { id: 'c8', name: '創業教練', title: '創業輔導 · 資源整合', emoji: '🚀', description: '陪伴創業者從想法驗證到商業落地，提供商業模式設計、資源整合與創業心理支持', tags: ['創業輔導', '商模驗證', '資源整合'], status: 'active' },
];

export const CATEGORY_EMOJIS: Record<string, string> = {
  'AI': '🤖', 'HR': '👔', '心理': '🧘', '管理': '📊',
  '行銷': '📣', '勞資': '⚖️', '全部': '✨'
};

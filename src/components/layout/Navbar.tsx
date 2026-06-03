'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { Menu, X, ChevronDown, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: '首頁' },
  { href: '/reports', label: '檢測報告' },
  { href: '/courses', label: '課程' },
  { href: '/consultants', label: '專家諮詢' },
  { href: '/events', label: '活動' },
  { href: '/about', label: '關於我們' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, member, logout, isAdmin, isStaff } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isConsultant = (member?.role as string) === 'consultant' || (member?.role as string) === 'admin';

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0d2206] z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/images/logo.png" alt="QAS Logo" className="h-10 w-10 object-contain rounded-full bg-[#EAF3DE] p-0.5"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div>
            <div className="text-white font-bold text-sm tracking-wide leading-none">QAS</div>
            <div className="text-white/50 text-[10px] leading-none mt-0.5">克斯有限公司</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0 flex-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-3.5 h-16 flex items-center text-sm transition-all duration-200 whitespace-nowrap
                ${pathname === href
                  ? 'text-white border-b-2 border-[#97C459]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-all">
                <div className="w-6 h-6 rounded-full bg-[#639922] flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <span className="text-white text-sm">{member?.name || user.email?.split('@')[0]}</span>
                <ChevronDown size={14} className="text-white/70" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  <Link href="/member"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}>
                    <User size={15} /> 會員中心
                  </Link>

                  {/* 顧問後台：role = consultant 或 admin */}
                  {isConsultant && (
                    <Link href="/consultant-portal"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3B6D11] hover:bg-[#EAF3DE] font-medium"
                      onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> 顧問後台
                    </Link>
                  )}

                  {/* 後台管理：admin 或 staff */}
                  {isStaff && (
                    <Link href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      <Settings size={15} /> 後台管理
                    </Link>
                  )}

                  <hr className="my-1" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={15} /> 登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login"
                className="text-white/80 hover:text-white text-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 transition-all">
                登入
              </Link>
              <Link href="/register"
                className="bg-[#639922] hover:bg-[#97C459] text-white text-sm px-4 py-1.5 rounded-full transition-all font-medium">
                免費註冊
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden ml-auto text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d2206] border-t border-white/10 px-4 pb-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className="block py-3 text-white/80 hover:text-white border-b border-white/5 text-sm"
              onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-3">
            {user ? (
              <>
                <Link href="/member"
                  className="text-center text-white border border-white/30 py-2 rounded-full text-sm"
                  onClick={() => setMobileOpen(false)}>
                  會員中心
                </Link>
                {isConsultant && (
                  <Link href="/consultant-portal"
                    className="text-center bg-[#639922] text-white py-2 rounded-full text-sm font-medium"
                    onClick={() => setMobileOpen(false)}>
                    顧問後台
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login"
                  className="flex-1 text-center text-white border border-white/30 py-2 rounded-full text-sm"
                  onClick={() => setMobileOpen(false)}>
                  登入
                </Link>
                <Link href="/register"
                  className="flex-1 text-center bg-[#639922] text-white py-2 rounded-full text-sm font-medium"
                  onClick={() => setMobileOpen(false)}>
                  免費註冊
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

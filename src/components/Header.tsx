import React, { useState } from 'react';
import { useRouter, Link, RoutePath } from '../router/Router';
import { TrendingUp, Menu, X, ArrowLeft, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { name: string; path: RoutePath }[] = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الاستثمار', path: '/investments' },
    { name: 'كيف يعمل', path: '/how-it-works' },
    { name: 'عن المنصة', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/35 transition-all">
              <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider text-white font-mono flex items-center gap-1.5">
                INVEST
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest font-sans font-medium">المنصة المالية الذكية</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPath === '/login' ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 active:scale-95"
            >
              <span>إنشاء حساب</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Website Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 text-sm font-semibold border border-slate-800 transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl text-slate-950 bg-emerald-400 hover:bg-emerald-300 text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>إنشاء حساب</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          <div className="mt-2 pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>بيئة مالية رقمية مؤمنة بأحدث بروتوكولات التشفير</span>
          </div>
        </div>
      )}
    </header>
  );
};

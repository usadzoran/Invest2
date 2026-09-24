import React from 'react';
import { Link } from '../router/Router';
import { TrendingUp, ShieldCheck, Lock, Globe, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-white font-mono tracking-wider">
                INVEST
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              منصة INVEST المالية المتطورة توفر لك منظومة استثمارية ذكية ومرنة مصممة خصيصاً لمساعدتك على استثمار أموالك بذكاء وبناء استقلاليتك المالية بكل ثقة وأمان.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                تشفير آمن 256-bit
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                حماية البيانات المالية
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wide">روابط الموقع</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/investments" className="hover:text-emerald-400 transition-colors">
                  الاستثمار
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  كيف يعمل
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info & Notice */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wide">نظام المنصة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              منصة INVEST موقع ويب رسمي يعمل عبر كافة المتصفحات الحديثة على أجهزة الكمبيوتر والأجهزة اللوحية والهواتف الذكية.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>عنوان الموقع الرسمي:</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono break-all" dir="ltr">
                https://usadzoran.github.io/Invest/
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} INVEST. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2">
            <span>موقع ويب آمن — المرحلة الأولى</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>جاهز للربط المستقبلي</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

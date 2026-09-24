import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { InvestmentSection } from '../components/InvestmentSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { Link } from '../router/Router';
import { ArrowLeft, Shield, Zap, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Platform Value Proposition Highlights */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">أمان وحماية مصرفية</h4>
                <p className="text-xs text-slate-400 mt-0.5">معايير تشفير رقمية حديثة لحماية بياناتك</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">أداء وسرعة فائقة</h4>
                <p className="text-xs text-slate-400 mt-0.5">موقع ويب متجاوب بسرعة تحميل مثالية</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">نمو مالي منظم</h4>
                <p className="text-xs text-slate-400 mt-0.5">خطط استثمارية مدروسة لتحقيق الاستدامة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <FeaturesSection />

      {/* 4. Investment Section (Teaser with Supabase ready cards) */}
      <InvestmentSection showMoreLink={true} />

      {/* 5. How It Works Section */}
      <HowItWorksSection />

      {/* 6. Call To Action Footer Banner */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800/80 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            جاهز للانطلاق في مسارك الاستثماري؟
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            انضم إلى مجتمع مستثمري INVEST وتعرف على فرص النمو المالي الذكي عبر منصتنا الرقمية المبتكرة.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>إنشاء حساب جديد</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <span>تعرف أكثر على المنصة</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

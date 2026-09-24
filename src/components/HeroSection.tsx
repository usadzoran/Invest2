import React from 'react';
import { Link } from '../router/Router';
import { ArrowLeft, TrendingUp, ShieldCheck, Sparkles, BarChart3, CheckCircle2, ChevronLeft } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>الجيل الجديد من منصات الاستثمار المالي</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] lg:leading-[1.15]">
              استثمر بذكاء، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                ونمِّ أموالك
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              منصة INVEST تمنحك بيئة رقمية آمنة وموثوقة لاستكشاف أفضل فرص الاستثمار وتنمية رأس مالك وفق معايير مدروسة وإشراف تقني متكامل لمساعدتك على بناء مستقبلك المالي.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-95"
              >
                <span>ابدأ الآن</span>
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all duration-200"
              >
                <span>تسجيل الدخول</span>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-right">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>بيئة موثوقة</span>
                </div>
                <p className="text-[11px] text-slate-500">أمان وحماية بياناتك</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>خطط متنوعة</span>
                </div>
                <p className="text-[11px] text-slate-500">تناسب احتياجاتك</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>شفافية كاملة</span>
                </div>
                <p className="text-[11px] text-slate-500">متابعة واضحة للعوائد</p>
              </div>
            </div>

          </div>

          {/* Visual Financial Preview Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame */}
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 via-slate-900/80 to-slate-950 p-1 border border-slate-800 shadow-2xl shadow-emerald-950/50">
                <div className="rounded-xl bg-slate-950/90 p-5 sm:p-6 space-y-6">
                  
                  {/* Top Bar of Financial Portal */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">لوحة المستثمر الذكية</div>
                        <div className="text-sm font-bold text-white">INVEST Portal</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      موقع ويب نشط
                    </span>
                  </div>

                  {/* Portfolio Growth Representation */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">مؤشر نمو رأس المال المستثمر</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                        +24.8% <TrendingUp className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Visual Growth Wave Bars */}
                    <div className="h-24 flex items-end gap-2 pt-4 px-1" dir="ltr">
                      <div className="flex-1 bg-slate-800 rounded-t h-[35%] hover:bg-emerald-500/50 transition-all"></div>
                      <div className="flex-1 bg-slate-800 rounded-t h-[48%] hover:bg-emerald-500/50 transition-all"></div>
                      <div className="flex-1 bg-slate-700 rounded-t h-[42%] hover:bg-emerald-500/50 transition-all"></div>
                      <div className="flex-1 bg-slate-700 rounded-t h-[60%] hover:bg-emerald-500/50 transition-all"></div>
                      <div className="flex-1 bg-emerald-700/60 rounded-t h-[55%] hover:bg-emerald-500/50 transition-all"></div>
                      <div className="flex-1 bg-emerald-600/80 rounded-t h-[75%] hover:bg-emerald-500/50 transition-all"></div>
                      <div className="flex-1 bg-emerald-500 rounded-t h-[92%] shadow-lg shadow-emerald-500/40"></div>
                    </div>
                  </div>

                  {/* Two Mini Feature Blocks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>نظام حماية متقدم</span>
                      </div>
                      <div className="text-xs font-bold text-white">تشفير وحماية مصرفية</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                        <span>تقارير الأرباح</span>
                      </div>
                      <div className="text-xs font-bold text-white">تحليلات لحظية دقيقة</div>
                    </div>
                  </div>

                  {/* Note on Phase 1 */}
                  <div className="pt-2 text-center text-xs text-slate-500">
                    واجهة الموقع الرسمية مهيأة للربط المباشر بقاعدة البيانات
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

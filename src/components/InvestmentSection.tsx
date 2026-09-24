import React from 'react';
import { Layers, Database, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from '../router/Router';

export const InvestmentSection: React.FC<{ showMoreLink?: boolean }> = ({ showMoreLink = false }) => {
  return (
    <section id="investments" className="py-20 bg-slate-950/70 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>فرص الاستثمار المتاحة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            خطط الاستثمار
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            استعرض مسارات وخطط الاستثمار المصممة بعناية لتحقيق عوائد مجزية ومدروسة تناسب مختلف تطلعاتك المالية.
          </p>
        </div>

        {/* Database Connection Notice (Phase 1 Specification) */}
        <div className="mt-10 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-emerald-500/30 shadow-lg text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>سيتم تحميل خطط الاستثمار من قاعدة البيانات</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            تم تجهيز بنية البطاقات لعرض خطط الاستثمار فور ربط الموقع بقاعدة بيانات Supabase في المرحلة القادمة، دون الاعتماد على أي بيانات وهمية.
          </p>
        </div>

        {/* Prepared Card Placeholders (Ready for Supabase in Phase 2) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((slotNumber) => (
            <div
              key={slotNumber}
              className="relative group rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/30"
            >
              {/* Badge placeholder */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                <div className="h-6 w-28 rounded-md bg-slate-800/80 animate-pulse flex items-center justify-center text-[11px] text-slate-400 font-medium">
                  خطة استثمار #{slotNumber}
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Ready Fields for Supabase Record Binding */}
              <div className="py-8 space-y-5">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-medium">العائد المتوقع للخطة</div>
                  <div className="h-9 w-36 rounded-lg bg-slate-800/60 flex items-center px-3 text-sm text-slate-400 font-mono">
                    -- % / فترة الخطة
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">الحد الأدنى للاستثمار</span>
                    <span className="text-slate-300 font-medium">-- $</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">مدة دورة الاستثمار</span>
                    <span className="text-slate-300 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>-- يوم</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="text-slate-400">دورية توزيع الأرباح</span>
                    <span className="text-slate-300 font-medium">--</span>
                  </div>
                </div>
              </div>

              {/* Action Button Placeholder */}
              <div className="pt-4">
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-slate-800/80 text-slate-400 text-sm font-semibold cursor-not-allowed border border-slate-700/60 flex items-center justify-center gap-2"
                >
                  <span>بانتظار مزامنة قاعدة البيانات</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* View All Investments Link if in home page */}
        {showMoreLink && (
          <div className="mt-12 text-center">
            <Link
              to="/investments"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>استعراض كافة تفاصيل قسم الاستثمار</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

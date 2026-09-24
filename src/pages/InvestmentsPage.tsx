import React from 'react';
import { InvestmentSection } from '../components/InvestmentSection';
import { Link } from '../router/Router';
import { Layers, ShieldCheck, Database, Info, ArrowLeft } from 'lucide-react';

export const InvestmentsPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>محفظة وخطط الاستثمار</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              استكشف خطط الاستثمار
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              هنا تجد المكان المخصص لعرض واستعراض كافة خطط الاستثمار المطروحة عبر المنصة. تهدف الخطط إلى تمكين المستثمرين من تحقيق نمو تدريجي وآمن لرؤوس أموالهم.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Database className="w-3.5 h-3.5" />
                تكامل مباشر مع Supabase (المرحلة 2)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                حماية وإدارة مدروسة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Investment Cards Section (Clean cards ready for Supabase) */}
      <InvestmentSection showMoreLink={false} />

      {/* Guidelines and Information Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Info className="w-5 h-5 text-emerald-400" />
              <span>كيف سيتم ربط الخطط؟</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              في المرحلة الثانية من المشروع، سيتم ربط هذا القسم مباشرة بجدول الخطط في قاعدة بيانات Supabase. سيتم جلب أسماء الخطط، ومعدلات الأرباح، وفترات الاستثمار تلقائياً بدون أي بيانات افتراضية وهمية.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>سياسة الشفافية والأمان</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              تعتمد المنصة مبدأ الوضوح الكامل في تفاصيل كل خطة استثمارية، من شروط الإيداع إلى جداول توزيع الأرباح، مع ضمان تشفير جميع العمليات المالية والمحاسبية.
            </p>
          </div>

        </div>

        {/* CTA to Register */}
        <div className="mt-12 p-8 rounded-2xl bg-slate-900/70 border border-emerald-500/20 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">تريد بدء الاستثمار فور انطلاق الخطط؟</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            سارع بتجهيز حسابك الشخصي لتكون مستعداً للاستثمار فور تفعيل الربط السحابي في المرحلة القادمة.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm hover:bg-emerald-300 transition-colors shadow-md"
            >
              <span>إنشاء حسابك الآن</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

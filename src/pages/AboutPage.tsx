import React from 'react';
import { TrendingUp, ShieldCheck, Globe, Cpu, CheckCircle2, Lock } from 'lucide-react';
import { Link } from '../router/Router';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 space-y-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>من نحن</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            عن منصة INVEST
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            منصة استثمار مالية رقمية متطورة صُممت خصيصاً لتمكين الأفراد والمستثمرين من إدارة استثماراتهم وتنمية أموالهم بأعلى معايير الشفافية والأمان التكنولوجي.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="text-2xl font-bold text-white">رؤيتنا</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              أن نكون المنصة المالية الرائدة والمفضلة للمستثمرين الباحثين عن فرص استثمار رقمية ذكية، شفافة، وسهلة الوصول من أي مكان في العالم عبر متصفح الويب المباشر.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="text-2xl font-bold text-white">رسالتنا</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              توفير بيئة استثمارية رقمية آمنة وموثوقة خالية من التعقيدات، تعتمد على التكنولوجيا الحديثة لتقديم تجربة استخدام سلسة تمكن كل مستثمر من متابعة عوائده بدقة تامة.
            </p>
          </div>

        </div>
      </div>

      {/* Technical Architecture Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs text-emerald-400 font-semibold mb-1">الهندسة التقنية</div>
              <h3 className="text-xl font-bold text-white">موقع ويب حقيقي 100% (Pure Web Platform)</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-fit">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>usadzoran.github.io/Invest/</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            تم بناء موقع INVEST ليعمل بالكامل داخل متصفحات الويب الحديثة (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge) دون الاعتماد على أي أطر تطبيقات هاتف أو حزم APK أو طبقات WebView. نفس الرابط ونفس الواجهة الاستثنائية متاحة بتجاوب كامل لجميع الأجهزة والشاشات.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-bold text-base">React 19</div>
              <div className="text-[11px] text-slate-400">واجهة المستخدم الحديثة</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-bold text-base">TypeScript</div>
              <div className="text-[11px] text-slate-400">أمان الأنماط البرمجية</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-bold text-base">Tailwind CSS</div>
              <div className="text-[11px] text-slate-400">تصميم وتنسيق مالي أنيق</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-bold text-base">GitHub Pages</div>
              <div className="text-[11px] text-slate-400">استضافة ونشر سحابي سريع</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">مبادئنا الأساسية</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>الشفافية المطلقة</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              وضوح تام في الشروط ومعدلات العوائد دون أي رسوم مخفية أو وعود غير واقعية.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>حماية البيانات</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              تشفير كامل لكافة الاتصالات والبيانات وفق أحدث الممارسات القياسية العالمية.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>الاستدامة التقنية</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              بنية تحتية رقمية متينة قادرة على التوسع ومواكبة نمو قاعدة المستثمرين باستمرار.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

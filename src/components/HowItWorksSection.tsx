import React from 'react';
import { UserPlus, Compass, TrendingUp, LineChart, HelpCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'إنشاء حساب',
      description: 'سجّل حسابك في منصة INVEST بكل سهولة عبر إدخال بياناتك الأساسية للبدء في استخدام المنصة.',
      icon: UserPlus,
      accent: 'emerald',
    },
    {
      number: '02',
      title: 'اختيار خطة',
      description: 'استعرض خطط الاستثمار المتاحة واختر الخطة التي تتناسب مع رأس مالك وأهدافك المالية.',
      icon: Compass,
      accent: 'teal',
    },
    {
      number: '03',
      title: 'الاستثمار',
      description: 'قم بتأكيد رغبتك في الاستثمار في الخطة المختارة ليتم تشغيل رأس المال وفق الشروط المحددة.',
      icon: TrendingUp,
      accent: 'emerald',
    },
    {
      number: '04',
      title: 'متابعة الأرباح',
      description: 'راقب نمو أرباحك وتوزيعات العوائد المستمرة بكل شفافية من خلال صفحة المتابعة المخصصة.',
      icon: LineChart,
      accent: 'teal',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>آلية العمل</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            كيف يعمل موقع INVEST؟
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            أربع خطوات واضحة ومباشرة تبدأ من خلالها رحلتك نحو استثمار أموالك وإدارتها بطريقة منظمة.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group"
              >
                <div>
                  {/* Top Step Number and Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-mono text-slate-700 group-hover:text-emerald-400/80 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>الخطوة {idx + 1} من 4</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400"></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Note */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto">
          ملاحظة: هذه خطوات إرشادية توضح آلية استخدام الموقع، وستصبح العمليات تفاعلية بالكامل فور ربط الأنظمة السحابية.
        </div>

      </div>
    </section>
  );
};

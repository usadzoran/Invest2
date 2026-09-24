import React from 'react';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { Link } from '../router/Router';
import { HelpCircle, CheckCircle, ShieldCheck, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const faqs = [
    {
      q: 'هل يتطلب استخدام المنصة تثبيت أي برامج أو تطبيقات؟',
      a: 'لا، منصة INVEST هي موقع ويب متكامل (Website) يعمل مباشرة داخل متصفح هاتفك أو حاسوبك دون الحاجة لتنزيل أي تطبيق أو ملف APK.',
    },
    {
      q: 'كيف أبدأ الاستثمار بعد إنشاء الحساب؟',
      a: 'بمجرد تسجيل الدخول في المنصة، ستتمكن من الاطلاع على كافة تفاصيل الخطط الاستثمارية المتاحة واختيار الخطة الأنسب لإيداع رأس المال وبدء دورة الاستثمار.',
    },
    {
      q: 'كيف يتم احتساب ومتابعة الأرباح؟',
      a: 'تحسب الأرباح وفق النسبة المقررة لكل خطة استثمارية، ويتم تحديثها دورياً في لوحة المتابعة الخاصة بحسابك بكل شفافية ودقة.',
    },
    {
      q: 'ما هي متطلبات الأمان في المنصة؟',
      a: 'تطبق المنصة أعلى بروتوكولات الأمان الرقمي وتشفير SSL لضمان سرية حسابات المستثمرين وحماية بياناتهم في كافة الأوقات.',
    },
  ];

  return (
    <div className="py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>دليل استخدام المنصة</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            كيف تعمل منصة INVEST؟
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            تعرف بالتفصيل على الخطوات الأربع البسيطة التي تقودك نحو تجربة استثمارية ذكية، واضحة، ومحمية بالكامل.
          </p>
        </div>
      </div>

      {/* Main How It Works Steps Component */}
      <HowItWorksSection />

      {/* Step Breakdown Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">تفاصيل المراحل الاستثمارية</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">نظرة أعمق على ما يحدث في كل خطوة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
                01
              </span>
              <h3 className="text-base font-bold text-white">التسجيل والتحقق من الهوية</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              إنشاء حساب المستثمر عبر الموقع الرسمي في ثوانٍ معدودة. توفر المنصة إجراءات تحقق مرنة ومؤمنة لحماية حسابك من أي وصول غير مصرح به.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 font-mono font-bold flex items-center justify-center text-sm">
                02
              </span>
              <h3 className="text-base font-bold text-white">دراسة واختيار الخطة</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              تصفح بطاقات الخطط التي توضح الحد الأدنى للإيداع، المدة الزمنية لدورة الاستثمار، ومعدل الأرباح المتوقع بكل شفافية قبل اتخاذ القرار.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
                03
              </span>
              <h3 className="text-base font-bold text-white">تأكيد الاستثمار وبدء الدورة</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              عند اعتماد الخطة، يبدأ رأس المال في العمل وفق الجدول الزمني المحدد بدقة، مع إمكانية مراجعة سجل العمليات في أي وقت.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 font-mono font-bold flex items-center justify-center text-sm">
                04
              </span>
              <h3 className="text-base font-bold text-white">المتابعة واستلام العوائد</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              يتم إيداع العوائد بشكل منتظم في محفظة الحساب، مع توفير مؤشرات بيانية واضحة تعكس وتيرة نمو الأرباح الإجمالية.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">الأسئلة الشائعة</h2>
          <p className="text-xs sm:text-sm text-slate-400">إجابات على أبرز الاستفسارات حول الموقع</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/90 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 pr-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">ابدأ رحلتك معنا اليوم</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            سجل الآن مجاناً وكن من أوائل المستثمرين عند إطلاق خطط الاستثمار الرسمية.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm hover:bg-emerald-300 transition-colors shadow-md"
            >
              <span>إنشاء حساب جديد</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

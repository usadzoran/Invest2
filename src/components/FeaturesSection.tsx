import React from 'react';
import { LayoutDashboard, Eye, LineChart, ShieldCheck, UserCog, Star } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'واجهة سهلة الاستخدام',
      description: 'تصميم انسيابي وواضح يوفر تجربة مستخدم سلسة على كافة المتصفحات، سواء كنت تتصفح من الكمبيوتر، الجهاز اللوحي، أو الهاتف.',
      icon: LayoutDashboard,
      badge: 'مرونة وسلاسة',
    },
    {
      title: 'متابعة الحساب',
      description: 'لوحة موحدة توفر نظرة عامة فورية على حالة الحساب، والأنشطة المسجلة، والمعلومات الأساسية بكل شفافية.',
      icon: Eye,
      badge: 'نظرة شاملة',
    },
    {
      title: 'متابعة الاستثمارات',
      description: 'مراقبة خططك الاستثمارية بدقة، مع عرض فترات الاستحقاق وتفاصيل دورات الاستثمار بشكل منظم.',
      icon: LineChart,
      badge: 'دقة المتابعة',
    },
    {
      title: 'نظام آمن',
      description: 'أعلى معايير الحماية الرقمية وتشفير البيانات المتوافقة مع أحدث بروتوكولات الأمان الإلكتروني.',
      icon: ShieldCheck,
      badge: 'حماية متقدمة',
    },
    {
      title: 'إمكانية إدارة الحساب',
      description: 'أدوات مرنة للتحكم في تفضيلات حسابك، وتحديث بياناتك الشخصية وإعدادات الأمان بكل يسر.',
      icon: UserCog,
      badge: 'تحكم كامل',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-950/60 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 text-emerald-400" />
            <span>مميزات المنصة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            لماذا تختار INVEST؟
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            تم بناء المنصة وفق أسس هندسية حديثة تجمع بين الأمان الفائق، والسهولة المطلقة في تتبع وإدارة الاستثمارات.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-7 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400/90 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span>واجهة جاهزة للعرض</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Link } from '../router/Router';
import { TrendingUp, Lock, Mail, User, ArrowLeft, Info, AlertCircle, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submittedInfo, setSubmittedInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedInfo(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/35 transition-all">
              <TrendingUp className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black text-white font-mono tracking-wider">
              INVEST
            </span>
          </Link>

          <h2 className="text-2xl font-extrabold text-white">
            إنشاء حساب مستثمر جديد
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            انضم إلى مجتمع INVEST وابدأ أولى خطوات رحلتك المالية
          </p>
        </div>

        {/* Phase 1 Notice Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1.5 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">واجهة إنشاء الحساب (المرحلة الأولى):</strong> هذه صفحة شكلية تحاكي واجهة التسجيل. سيتم ربط قاعدة البيانات Supabase وتفعيل تسجيل المستخدمين في المرحلة القادمة.
          </p>
        </div>

        {/* Informative Submission Feedback */}
        {submittedInfo && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-1 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">تم تجربة نموذج التسجيل بنجاح</div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                لا يتم إنشاء حسابات حقيقية أو تخزين بيانات في هذه المرحلة امتثالاً لتعليمات المرحلة الأولى.
              </p>
            </div>
          </div>
        )}

        {/* Register Form Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-950/50 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-right"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-1 text-xs text-slate-400">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 shrink-0"
                />
                <span className="leading-relaxed">
                  أوافق على الشروط وسياسة الخصوصية الخاصة بمنصة INVEST.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 mt-2"
            >
              <span>إنشاء الحساب</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

          </form>

          {/* Switch to Login */}
          <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            <span>لديك حساب بالفعل؟ </span>
            <Link to="/login" className="text-emerald-400 hover:underline font-bold">
              تسجيل الدخول
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

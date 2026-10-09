import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CollegeSetupModal: React.FC = () => {
  const { 
    collegeName, 
    setCollegeName, 
    login, 
    isCollegeSetupOpen, 
    setIsCollegeSetupOpen 
  } = useApp();

  const [step, setStep] = useState<'setup' | 'login' | 'forgot'>('setup');
  const [inputCollege, setInputCollege] = useState(collegeName);
  const [email, setEmail] = useState('priya.sharma@campusiq.edu.in');
  const [password, setPassword] = useState('CampusIQ2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetConfirmation, setResetConfirmation] = useState('');

  if (!isCollegeSetupOpen) return null;

  const handleCollegeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCollege.trim()) {
      setErrorMsg('Please enter a valid institution name.');
      return;
    }
    setErrorMsg('');
    setCollegeName(inputCollege.trim());
    setStep('login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }
    setErrorMsg('');
    login(inputCollege, 'stud-1');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid registered email address.');
      return;
    }
    setErrorMsg('');
    setResetConfirmation(
      `[Demo Mode]: A password reset request has been registered for ${forgotEmail}. (Note: As an offline sandbox demo, no external SMTP server is connected. You may use any demo account below to log in directly).`
    );
  };

  const selectJudgePersona = (studentId: string, isAdmin = false) => {
    login(inputCollege, studentId, isAdmin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] p-6 text-white text-center relative">
          <button 
            onClick={() => setIsCollegeSetupOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight font-heading">
            Campus IQ AI
          </h2>
          <p className="text-xs text-purple-200 font-medium mt-1">
            Student Success Platform
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* STEP 1: College / Institute Setup */}
          {step === 'setup' && (
            <form onSubmit={handleCollegeSubmit} className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EDE9FE] dark:bg-purple-900/50 text-[#6D28D9] dark:text-purple-300 mb-2">
                  Institutional Setup
                </span>
                <h3 className="text-lg font-bold text-[#242038] dark:text-purple-100 font-heading">
                  Enter Your College or Institute Name
                </h3>
                <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1">
                  Configure the institutional workspace for this session.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1.5">
                  Institute Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#77738C] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={inputCollege}
                    onChange={(e) => setInputCollege(e.target.value)}
                    placeholder="e.g. KPMG Institute of Technology & Advanced Analytics"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Continue to Authentication</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Login Screen */}
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#77738C] dark:text-purple-400">
                    Selected Institute:
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setStep('setup')}
                    className="text-xs text-[#7C3AED] dark:text-purple-300 hover:underline font-semibold cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <p className="text-sm font-bold text-[#6D28D9] dark:text-purple-200 truncate mt-0.5">
                  {inputCollege}
                </p>
                <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading mt-3">
                  Welcome to Campus IQ AI
                </h3>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1.5">
                  Email Address or Student Roll No
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#77738C] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campusiq.edu.in"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#242038] dark:text-purple-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('forgot');
                      setErrorMsg('');
                      setResetConfirmation('');
                    }}
                    className="text-xs text-[#7C3AED] dark:text-purple-300 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#77738C] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#77738C] hover:text-[#242038] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
              >
                Sign In to Campus IQ AI
              </button>
            </form>
          )}

          {/* STEP 3: Forgot Password Flow */}
          {step === 'forgot' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading">
                  Reset Account Password
                </h3>
                <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1">
                  Enter your registered college email address to receive password reset instructions.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {resetConfirmation ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reset Request Processed</span>
                  </div>
                  <p>{resetConfirmation}</p>
                  <button
                    onClick={() => setStep('login')}
                    className="mt-2 text-xs font-semibold text-[#7C3AED] underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1.5">
                      Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#77738C] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="student@campusiq.edu.in"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('login')}
                      className="w-1/3 py-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 text-[#77738C] dark:text-purple-300 text-xs font-semibold hover:bg-[#FAF9FF] cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Request Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Access Mode */}
          <div className="pt-4 border-t border-[#E9E4F5] dark:border-purple-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#242038] dark:text-purple-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                1-Click Demo Profiles
              </span>
              <span className="text-[10px] text-[#77738C]">Instant Entry</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                onClick={() => selectJudgePersona('stud-1')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 hover:border-[#7C3AED] hover:bg-[#EDE9FE]/50 dark:hover:bg-purple-950/30 transition text-left group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-[#6D28D9]">
                  Priya Sharma
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  Grade A • All-Rounder (91.2)
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-2')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition text-left group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-rose-600">
                  Rohan Verma
                </p>
                <p className="text-[10px] text-rose-600 dark:text-rose-400">
                  Grade C • DSA Shortage (68%)
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-3')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition text-left group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-amber-600">
                  Ananya Patel
                </p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  Grade B • High CGPA / Low Placement
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-1', true)}
                className="p-2.5 rounded-xl border border-[#EDE9FE] dark:border-purple-900/50 bg-[#EDE9FE]/40 dark:bg-purple-950/40 hover:border-[#7C3AED] transition text-left group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#6D28D9] dark:text-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
                  Faculty Admin
                </p>
                <p className="text-[10px] text-[#77738C] dark:text-purple-300">
                  Campus Intelligence
                </p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

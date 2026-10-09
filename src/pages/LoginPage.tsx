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
  Trophy,
  Activity,
  AlertTriangle,
  Bot,
  ChevronRight,
  BookOpen,
  Award,
  TrendingUp,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { 
    collegeName, 
    setCollegeName, 
    login 
  } = useApp();

  const [step, setStep] = useState<'setup' | 'login' | 'forgot'>('login');
  const [inputCollege, setInputCollege] = useState(collegeName || 'KPMG Institute of Technology & Advanced Analytics');
  const [email, setEmail] = useState('priya.sharma@campusiq.edu.in');
  const [password, setPassword] = useState('CampusIQ2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetConfirmation, setResetConfirmation] = useState('');

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
    // Log in with matching account or default to Priya
    let targetId = 'stud-1';
    if (email.toLowerCase().includes('rohan')) targetId = 'stud-2';
    else if (email.toLowerCase().includes('ananya')) targetId = 'stud-3';
    else if (email.toLowerCase().includes('amit')) targetId = 'stud-4';
    else if (email.toLowerCase().includes('sneha')) targetId = 'stud-5';
    else if (email.toLowerCase().includes('vikram')) targetId = 'stud-6';
    else if (email.toLowerCase().includes('arpan')) targetId = 'stud-7';

    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('faculty');
    login(inputCollege, targetId, isAdmin);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid registered email address.');
      return;
    }
    setErrorMsg('');
    setResetConfirmation(
      `[Demo Mode Notice]: A password reset token was simulated for ${forgotEmail}. (Offline sandbox mode: no external SMTP server connected. You may use any demo account below to log in directly).`
    );
  };

  const selectJudgePersona = (studentId: string, isAdmin = false) => {
    login(inputCollege, studentId, isAdmin);
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Subtle Mist Ambient Glows */}
      <div className="mist-glow -top-24 -left-24 w-96 h-96 bg-violet-400/15 dark:bg-violet-900/20" />
      <div className="mist-glow -bottom-24 -right-24 w-96 h-96 bg-purple-400/15 dark:bg-purple-900/20" />
      <div className="mist-glow top-1/3 right-1/4 w-80 h-80 bg-fuchsia-300/10 dark:bg-fuchsia-900/15" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-[#1D172E] rounded-3xl border border-[#E9E4F5] dark:border-purple-900/40 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Brand Hero Presentation & Abstract Learning Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#6D28D9] via-[#7C3AED] to-[#5B21B6] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative background mist circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                    Campus IQ
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#6D28D9] tracking-wider uppercase">
                    AI
                  </span>
                </div>
                <p className="text-xs text-purple-200 mt-0.5 font-medium">
                  Student Success Platform
                </p>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-purple-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Personalized Academic Intelligence</span>
            </div>

            {/* Abstract Learning Visual Card */}
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-purple-100">Live Success Gauge</span>
                </div>
                <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                  91.2 / 100
                </span>
              </div>

              {/* Mini visual metrics */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <p className="text-[10px] text-purple-200 font-medium">Attendance</p>
                  <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-300" /> 92.5% Safe
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <p className="text-[10px] text-purple-200 font-medium">CGPA</p>
                  <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-300" /> 8.85 / 10
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-[11px] text-purple-100 leading-snug">
                <span className="font-semibold text-white">AI Advice:</span> Focus on DSA Assignment 4 to unlock the Code Master milestone this week.
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-purple-100">
                <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5 text-purple-200" />
                </div>
                <span>Explainable 4-factor Success Score (0–100)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-purple-100">
                <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span>Proactive 75% attendance recovery engine</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-purple-100">
                <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span>Gamified milestones & zero-shaming progression</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-purple-100">
                <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-cyan-200" />
                </div>
                <span>Contextual AI tutor with 7-day revision plans</span>
              </div>
            </div>
          </div>

          {/* Bottom Motivation Quote */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/15">
            <p className="text-xs italic text-purple-200 font-medium leading-relaxed">
              "Your Future Is Built One Achievement at a Time."
            </p>
          </div>
        </div>

        {/* Right Column: Clean Login & College Setup Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white dark:bg-[#1D172E]">
          
          <div>
            {/* STEP 1: College / Institute Setup */}
            {step === 'setup' && (
              <form onSubmit={handleCollegeSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDE9FE] dark:bg-purple-900/30 text-[#6D28D9] dark:text-purple-300 border border-[#E9E4F5] dark:border-purple-800/40 mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Institute Configuration</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
                    Setup Your Institution
                  </h2>
                  <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1">
                    Enter the name of your college or university to customize the analytics portal.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1.5">
                    College / Institute Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#77738C] dark:text-purple-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={inputCollege}
                      onChange={(e) => setInputCollege(e.target.value)}
                      placeholder="e.g. KPMG Institute of Technology & Advanced Analytics"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 placeholder-[#77738C]/60 focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                  <span>Continue to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Main Login Screen */}
            {step === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-[#E9E4F5] dark:border-purple-900/40">
                    <span className="text-[11px] font-medium text-[#77738C] dark:text-purple-300">
                      Selected Institute:
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep('setup')}
                      className="text-xs text-[#7C3AED] dark:text-purple-300 hover:text-[#6D28D9] font-semibold transition cursor-pointer"
                    >
                      Change Institute
                    </button>
                  </div>
                  <p className="text-xs font-bold text-[#6D28D9] dark:text-purple-200 truncate mt-1">
                    {inputCollege}
                  </p>

                  <h2 className="text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading mt-3">
                    Sign in to Campus IQ
                  </h2>
                  <p className="text-xs text-[#77738C] dark:text-purple-300 mt-0.5">
                    Enter your academic credentials or select a demo profile below.
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
                    College Email or Student Roll Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#77738C] dark:text-purple-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya.sharma@campusiq.edu.in"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 placeholder-[#77738C]/60 focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] outline-none transition"
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
                    <Lock className="w-4 h-4 text-[#77738C] dark:text-purple-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 placeholder-[#77738C]/60 focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#77738C] dark:text-purple-400 hover:text-[#242038] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-semibold text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer mt-1"
                >
                  Sign In to Campus IQ AI
                </button>
              </form>
            )}

            {/* STEP 3: Forgot Password Flow */}
            {step === 'forgot' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#242038] dark:text-purple-100 font-heading">
                    Reset Account Password
                  </h2>
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
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Reset Request Processed</span>
                    </div>
                    <p className="leading-relaxed">{resetConfirmation}</p>
                    <button
                      onClick={() => setStep('login')}
                      className="mt-2 text-xs font-semibold text-[#7C3AED] hover:underline block cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1.5">
                        Registered College Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#77738C] dark:text-purple-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="student@campusiq.edu.in"
                          className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 placeholder-[#77738C]/60 focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setStep('login')}
                        className="w-1/3 py-3 rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 text-[#77738C] dark:text-purple-300 text-xs font-semibold hover:bg-[#FAF9FF] dark:hover:bg-purple-900/20 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Request Reset Link
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Demo Profiles Strip */}
          <div className="mt-8 pt-5 border-t border-[#E9E4F5] dark:border-purple-900/40">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-[#242038] dark:text-purple-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                1-Click Demo Profiles
              </span>
              <span className="text-[10px] text-[#77738C] dark:text-purple-400 font-medium">Instant Access</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => selectJudgePersona('stud-1')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-[#7C3AED] hover:bg-[#EDE9FE]/50 dark:hover:bg-purple-900/30 text-left transition group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-[#6D28D9] truncate">
                  Priya Sharma
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                  Grade A • High Scorer (91.2)
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-2')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-left transition group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-rose-600 truncate">
                  Rohan Verma
                </p>
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium truncate">
                  Grade C • DSA Shortage (68%)
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-3')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-left transition group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-amber-600 truncate">
                  Ananya Patel
                </p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate">
                  Grade B • High CGPA / Few Certs
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-4')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-left transition group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-rose-600 truncate">
                  Amit Kumar
                </p>
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium truncate">
                  Grade D • At-Risk (44.5)
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-5')}
                className="p-2.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 text-left transition group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#242038] dark:text-purple-100 group-hover:text-[#6D28D9] truncate">
                  Sneha Reddy
                </p>
                <p className="text-[10px] text-[#7C3AED] dark:text-purple-400 font-medium truncate">
                  Grade B • 95% Att / Low Exams
                </p>
              </button>

              <button
                onClick={() => selectJudgePersona('stud-1', true)}
                className="p-2.5 rounded-xl border border-[#EDE9FE] dark:border-purple-800/40 bg-[#EDE9FE]/60 dark:bg-purple-950/30 hover:border-[#7C3AED] text-left transition group cursor-pointer"
              >
                <p className="text-xs font-bold text-[#6D28D9] dark:text-purple-200 flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
                  Faculty Admin
                </p>
                <p className="text-[10px] text-[#77738C] dark:text-purple-300 font-medium truncate">
                  Institutional Intelligence
                </p>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BackendStudentsPanel } from '../components/BackendStudentsPanel';
import { 
  Activity, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Trophy, 
  GraduationCap, 
  BookOpen, 
  Star, 
  Flame,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  Info,
  Medal,
  Search,
  HelpCircle,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { 
  calculateStudentSuccessScore, 
  calculateOverallAttendance, 
  calculateAcademicScore, 
  calculateAssignmentRate, 
  calculateClassesNeededFor75,
  evaluateBadges
} from '../utils/scoring';

export const Dashboard: React.FC = () => {
  const { currentStudent, allStudents, switchStudent, setActiveTab } = useApp();
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState('');

  const breakdown = calculateStudentSuccessScore(currentStudent);
  const { attended: attAttended, total: attTotal, percentage: attendancePct } = calculateOverallAttendance(currentStudent);
  const { cgpa } = calculateAcademicScore(currentStudent);
  const { completed: completedAssignments, total: totalAssignments, percentage: assignmentPct } = calculateAssignmentRate(currentStudent);
  const earnedBadges = evaluateBadges(currentStudent).filter(b => b.earned);

  // Check for any subject below 75%
  const lowAttendanceSubject = (currentStudent.attendanceRecords || []).find(s => {
    return s.total > 0 && ((s.attended / s.total) * 100 < 75);
  });

  const consecutiveClassesNeeded = lowAttendanceSubject 
    ? calculateClassesNeededFor75(lowAttendanceSubject.attended, lowAttendanceSubject.total)
    : 0;

  // Class Leaderboard sorted by Success Score
  const rankedStudents = [...allStudents]
    .map(stud => {
      const b = calculateStudentSuccessScore(stud);
      const badges = evaluateBadges(stud).filter(x => x.earned).length;
      return {
        student: stud,
        score: b.overallScore,
        level: b.level,
        levelName: b.levelName,
        grade: b.gradeSegment,
        badgesCount: badges
      };
    })
    .sort((a, b) => b.score - a.score);

  const filteredLeaderboard = rankedStudents
    .filter(r => 
      r.student.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
      r.student.rollNo.toLowerCase().includes(leaderboardSearch.toLowerCase())
    )
    .slice(0, 10);

  const loggedInRank = rankedStudents.findIndex(r => r.student.id === currentStudent.id) + 1;
  const nextHigherStudent = loggedInRank > 1 ? rankedStudents[loggedInRank - 2] : null;

  // Academic Performance Trend Data (Semesters)
  const academicTrendData = (currentStudent.academicHistory || []).map(sem => ({
    semester: `Sem ${sem.semester}`,
    sgpa: sem.sgpa,
    target: 8.5
  }));

  // Subject-wise attendance bar data
  const subjectAttendanceData = (currentStudent.attendanceRecords || []).map(s => {
    const pct = s.total > 0 ? Number(((s.attended / s.total) * 100).toFixed(1)) : 0;
    return {
      name: s.subjectCode,
      fullName: s.subjectName,
      attendance: pct,
      attended: s.attended,
      total: s.total,
      isShortage: pct < 75
    };
  });

  // Recent Academic Activities
  const recentActivities = [
    { title: 'IA-1 Results Published: Data Structures', time: 'Yesterday', icon: GraduationCap, type: 'academic' },
    { title: 'Submitted Assignment 2: DBMS 2PC Simulation', time: '3 days ago', icon: CheckCircle2, type: 'assignment' },
    { title: 'Certificate Verified: KPMG GenAI Case Challenge', time: '5 days ago', icon: Trophy, type: 'event' },
    { title: 'Weekly Attendance Sync Complete (94.2%)', time: '1 week ago', icon: Calendar, type: 'attendance' }
  ];

  // SVG Gauge Calculations for Centrepiece
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (breakdown.overallScore / 100) * circumference;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] text-white p-6 md:p-8 shadow-xl shadow-violet-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus IQ AI • Student Success Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              Welcome back, {currentStudent.name}
            </h1>
            <p className="text-sm md:text-base text-violet-100 font-medium mt-1">
              "Your future is built one achievement at a time."
            </p>
            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-semibold">
              <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/10 font-mono">Roll: {currentStudent.rollNo}</span>
              <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/10">{currentStudent.branch}</span>
              <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/10">Semester {currentStudent.semester}</span>
              <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/10">Section {currentStudent.classSection}</span>
            </div>
          </div>

          {/* Quick AI Focus Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 md:max-w-xs shrink-0 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>AI Focus Recommendation</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-medium">
              {breakdown.nextActionSteps[0]}
            </p>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="mt-3 text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 transition"
            >
              Ask AI Assistant <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Atmospheric mist glow shapes */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-60 h-60 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
      </div>

      <BackendStudentsPanel />

      {/* Critical Attendance Shortage Alert Banner (If Applicable) */}
      {lowAttendanceSubject && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-900 dark:text-rose-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-rose-500 text-white shrink-0 mt-0.5 shadow-md shadow-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2 font-heading">
                <span>Attendance Shortage: {lowAttendanceSubject.subjectName} is below the 75% requirement</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-rose-600 text-white font-mono font-bold">
                  {((lowAttendanceSubject.attended / lowAttendanceSubject.total) * 100).toFixed(1)}%
                </span>
              </h4>
              <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 font-medium leading-relaxed">
                You must attend the next <strong>{consecutiveClassesNeeded} consecutive classes</strong> in this subject without absence to restore your attendance to the mandatory 75% threshold.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('student-info')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shrink-0 shadow transition"
          >
            Review Timetable
          </button>
        </div>
      )}

      {/* SIGNATURE FEATURE: Student Success Score Centrepiece Card */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] p-6 lg:p-8 shadow-card relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Circular Score Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] dark:text-[#A78BFA] mb-2">
              Signature Analytics Metric
            </span>
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-[#EDE9FE] dark:text-[#2E244A]"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#dashboardScoreGrad)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="dashboardScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[#242038] dark:text-white font-heading tracking-tight">
                  {breakdown.overallScore}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8] mt-0.5">
                  out of 100
                </span>
                <span className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  breakdown.gradeSegment === 'Grade A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                  breakdown.gradeSegment === 'Grade B' ? 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]' :
                  breakdown.gradeSegment === 'Grade C' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                }`}>
                  {breakdown.gradeSegment}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#77738C] dark:text-[#A59DB8]">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                +{((breakdown.overallScore - breakdown.previousScore) || 0).toFixed(1)} pts
              </span>
              <span>• Level {breakdown.level} ({breakdown.levelName})</span>
            </div>
          </div>

          {/* Breakdown & Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E4F5] dark:border-[#332A50]">
              <div>
                <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
                  Student Success Score Breakdown
                </h3>
                <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
                  Deterministic institutional weighting across 4 critical pillars
                </p>
              </div>
              <button
                onClick={() => setShowFormulaModal(!showFormulaModal)}
                className="text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA] hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How is it calculated?</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#242038] dark:text-white">Academic Performance</span>
                  <span className="font-mono text-[#7C3AED] dark:text-[#A78BFA] font-bold">40% Wt</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#77738C] dark:text-[#A59DB8]">
                  <span>Score: {breakdown.academicScore}%</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{(breakdown.academicScore * 0.4).toFixed(1)} pts</span>
                </div>
                <div className="w-full bg-[#E9E4F5] dark:bg-[#332A50] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#7C3AED] h-full rounded-full" style={{ width: `${breakdown.academicScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#242038] dark:text-white">Attendance Compliance</span>
                  <span className="font-mono text-[#7C3AED] dark:text-[#A78BFA] font-bold">25% Wt</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#77738C] dark:text-[#A59DB8]">
                  <span>Compliance: {breakdown.attendanceScore}%</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{(breakdown.attendanceScore * 0.25).toFixed(1)} pts</span>
                </div>
                <div className="w-full bg-[#E9E4F5] dark:bg-[#332A50] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#6D28D9] h-full rounded-full" style={{ width: `${breakdown.attendanceScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#242038] dark:text-white">Assignments & Coursework</span>
                  <span className="font-mono text-[#7C3AED] dark:text-[#A78BFA] font-bold">20% Wt</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#77738C] dark:text-[#A59DB8]">
                  <span>Submitted: {breakdown.assignmentScore}%</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{(breakdown.assignmentScore * 0.2).toFixed(1)} pts</span>
                </div>
                <div className="w-full bg-[#E9E4F5] dark:bg-[#332A50] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#A78BFA] h-full rounded-full" style={{ width: `${breakdown.assignmentScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#242038] dark:text-white">Verified Participation</span>
                  <span className="font-mono text-[#7C3AED] dark:text-[#A78BFA] font-bold">15% Wt</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#77738C] dark:text-[#A59DB8]">
                  <span>Events Credit: {breakdown.participationScore}%</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{(breakdown.participationScore * 0.15).toFixed(1)} pts</span>
                </div>
                <div className="w-full bg-[#E9E4F5] dark:bg-[#332A50] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.participationScore}%` }} />
                </div>
              </div>
            </div>

            {/* Expandable Formula Explanation */}
            {showFormulaModal && (
              <div className="p-4 rounded-2xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#EDE9FE] dark:border-[#2E244A] text-xs space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-[#7C3AED] dark:text-[#A78BFA]">
                  <Info className="w-4 h-4" />
                  <span>Success Score Mathematical Formulation</span>
                </div>
                <p className="font-mono text-[11px] p-2 rounded-xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] text-[#242038] dark:text-white">
                  Success Score = (Attendance × 0.25) + (Academics × 0.40) + (Participation × 0.15) + (Assignments × 0.20)
                </p>
                <p className="text-[#77738C] dark:text-[#A59DB8] leading-relaxed">
                  Every component is normalized to a 100-point scale based on validated institutional records. Incomplete or pending data is marked provisional to ensure fair and transparent evaluation.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">
                Strongest: <strong className="text-[#242038] dark:text-white">{breakdown.strongestIndicator}</strong>
              </span>
              <button
                onClick={() => setActiveTab('success-score')}
                className="text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA] hover:underline flex items-center gap-1"
              >
                <span>Detailed Explainability Audit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* DASHBOARD SUMMARY METRIC CARDS (Spacious 4-Per-Row Layout) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#242038] dark:text-white font-heading">
            Key Academic Indicators
          </h2>
          <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">Real-time synchronization</span>
        </div>

        {/* Row 1: 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Attendance Compliance */}
          <div 
            onClick={() => setActiveTab('student-info')}
            className={`p-6 rounded-3xl bg-white dark:bg-[#1D172E] border shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between ${
              attendancePct < 75 
                ? 'border-rose-400 dark:border-rose-700' 
                : 'border-[#E9E4F5] dark:border-[#332A50]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">Attendance</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  attendancePct < 75 ? 'bg-rose-100 text-rose-600' : 'bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#2E244A] dark:text-[#A78BFA]'
                }`}>
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-black font-heading ${attendancePct < 75 ? 'text-rose-600' : 'text-[#242038] dark:text-white'}`}>
                  {attendancePct}%
                </span>
              </div>
              <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-1">
                {attAttended} of {attTotal} sessions attended
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E9E4F5] dark:border-[#332A50] text-xs">
              {attendancePct < 75 ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Shortage Active (&lt;75%)
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Compliance Satisfied
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Academic CGPA */}
          <div 
            onClick={() => setActiveTab('student-info')}
            className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">Cumulative CGPA</span>
                <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#2E244A] dark:text-[#A78BFA] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-heading text-[#242038] dark:text-white">
                  {cgpa}
                </span>
                <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">/ 10</span>
              </div>
              <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-1">
                University transcript baseline
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E9E4F5] dark:border-[#332A50] text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold">
              {currentStudent.academicHistory?.length || 0} Semesters Recorded
            </div>
          </div>

          {/* Card 3: Assignments */}
          <div 
            onClick={() => setActiveTab('student-info')}
            className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">Assignments</span>
                <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#2E244A] dark:text-[#A78BFA] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-heading text-[#242038] dark:text-white">
                  {assignmentPct}%
                </span>
              </div>
              <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-1">
                {completedAssignments} of {totalAssignments} coursework items
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E9E4F5] dark:border-[#332A50] text-xs text-emerald-600 font-semibold">
              On-Time Submission Rate
            </div>
          </div>

          {/* Card 4: Event Participation */}
          <div 
            onClick={() => setActiveTab('your-participation')}
            className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">Co-Curricular</span>
                <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#2E244A] dark:text-[#A78BFA] flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-heading text-[#242038] dark:text-white">
                  {currentStudent.eventParticipations?.length || 0}
                </span>
                <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">Events</span>
              </div>
              <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-1">
                Hackathons & symposiums
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E9E4F5] dark:border-[#332A50] text-xs text-emerald-600 font-semibold">
              {currentStudent.eventParticipations?.filter(e => e.verificationStatus === 'Verified').length || 0} Verified by Faculty
            </div>
          </div>

        </div>

        {/* Row 2: 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Card 5: Class Rank */}
          <div 
            onClick={() => setActiveTab('student-segmentation')}
            className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">Class Standing</span>
              <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#2E244A] dark:text-[#A78BFA] flex items-center justify-center">
                <Medal className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-heading text-[#7C3AED] dark:text-[#A78BFA]">
                Rank #{loggedInRank}
              </span>
              <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">in Section {currentStudent.classSection}</span>
            </div>
            <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-2">
              {nextHigherStudent 
                ? `${Math.ceil(nextHigherStudent.score - breakdown.overallScore + 1)} pts to reach Rank #${loggedInRank - 1}`
                : 'Leading the cohort'}
            </p>
          </div>

          {/* Card 6: Badges Card */}
          <div 
            onClick={() => setActiveTab('badges')}
            className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">Milestone Badges</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-heading text-[#242038] dark:text-white">
                {earnedBadges.length} of 8
              </span>
              <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">Unlocked</span>
            </div>
            <p className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold mt-2">
              View All Honors →
            </p>
          </div>

          {/* Card 7: Placement Readiness */}
          <div 
            onClick={() => setActiveTab('student-segmentation')}
            className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">Placement Index</span>
              <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#2E244A] dark:text-[#A78BFA] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-heading text-[#242038] dark:text-white">
                {currentStudent.placementReadiness.overallPercent}%
              </span>
              <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">({currentStudent.placementReadiness.status})</span>
            </div>
            <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-2">
              {currentStudent.placementReadiness.codingScore}% coding • {currentStudent.placementReadiness.projectsCount} verified projects
            </p>
          </div>

        </div>
      </div>

      {/* CHARTS & ANALYTICS (Violet & Lavender Styling) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Academic Trajectory */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
                Academic Performance Trajectory (SGPA)
              </h3>
              <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
                Progression across completed semesters
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]">
              Target: 8.5+
            </span>
          </div>

          <div className="h-64 w-full">
            {academicTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={academicTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="violetAcademicGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9E4F5" />
                  <XAxis dataKey="semester" stroke="#77738C" fontSize={12} />
                  <YAxis domain={[5, 10]} stroke="#77738C" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1D172E', borderColor: '#332A50', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                  />
                  <ReferenceLine y={8.5} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Excellence (8.5)', fill: '#10b981', fontSize: 10 }} />
                  <Area type="monotone" dataKey="sgpa" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#violetAcademicGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#77738C]">
                No semester records uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Subject-Wise Attendance Analytics */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
                Subject-Wise Attendance Analytics
              </h3>
              <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
                Threshold compliance marked at 75%
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              Min 75% Required
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9E4F5" />
                <XAxis dataKey="name" stroke="#77738C" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#77738C" fontSize={12} />
                <Tooltip 
                  formatter={(val: any, name: any, item: any) => [`${val}% (${item.payload.attended}/${item.payload.total} sessions)`, item.payload.fullName]}
                  contentStyle={{ backgroundColor: '#1D172E', borderColor: '#332A50', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                />
                <ReferenceLine y={75} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" label={{ value: '75% Threshold', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                  {subjectAttendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isShortage ? '#ef4444' : '#7C3AED'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* GAMIFIED CLASS LEADERBOARD & PROGRESSION PATH */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E9E4F5] dark:border-[#332A50]">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-[#242038] dark:text-white font-heading">
                Class Academic & Success Leaderboard
              </h3>
            </div>
            <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-0.5">
              Cohort peers in {currentStudent.classSection} ({currentStudent.branch})
            </p>
          </div>

          {/* Level Up Encouragement Pill */}
          <div className="px-4 py-2.5 rounded-2xl bg-[#EDE9FE] dark:bg-[#2E244A] text-xs font-bold text-[#6D28D9] dark:text-[#EDE9FE] flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {nextHigherStudent 
                ? `Level ${breakdown.level} Active: Need ${Math.ceil(nextHigherStudent.score - breakdown.overallScore + 1)} points to advance to Rank #${loggedInRank - 1}!`
                : '🎉 Exceptional! You hold Rank #1 in your cohort.'}
            </span>
          </div>
        </div>

        {/* Milestone Progression Path */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8] mb-4">
            Achievement Progression Milestones
          </p>
          <div className="grid grid-cols-5 gap-2 md:gap-4 text-center">
            {[
              { lvl: 1, name: 'Explorer', range: '0–39', achieved: breakdown.level >= 1 },
              { lvl: 2, name: 'Achiever', range: '40–59', achieved: breakdown.level >= 2 },
              { lvl: 3, name: 'Scholar', range: '60–74', achieved: breakdown.level >= 3 },
              { lvl: 4, name: 'Master', range: '75–84', achieved: breakdown.level >= 4 },
              { lvl: 5, name: 'Grandmaster', range: '85–100', achieved: breakdown.level >= 5 },
            ].map((node, i) => (
              <div key={node.lvl} className="flex flex-col items-center relative">
                {i < 4 && (
                  <div className={`hidden md:block absolute top-5 left-1/2 w-full h-1 -z-0 transition-colors ${
                    breakdown.level > node.lvl ? 'bg-[#7C3AED]' : 'bg-[#E9E4F5] dark:bg-[#332A50]'
                  }`} />
                )}
                
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md z-10 transition-transform ${
                  node.lvl === breakdown.level 
                    ? 'bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white ring-4 ring-[#7C3AED]/30 scale-110' 
                    : node.achieved 
                    ? 'bg-[#7C3AED] text-white' 
                    : 'bg-[#F4F0FF] dark:bg-[#241D38] text-[#77738C] border border-[#E9E4F5] dark:border-[#332A50]'
                }`}>
                  {node.lvl === breakdown.level ? (
                    <Star className="w-5 h-5 fill-white" />
                  ) : node.achieved ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>L{node.lvl}</span>
                  )}
                </div>

                <p className={`text-xs font-bold mt-2 ${node.lvl === breakdown.level ? 'text-[#7C3AED] dark:text-[#A78BFA]' : 'text-[#242038] dark:text-white'}`}>
                  {node.name}
                </p>
                <p className="text-[10px] text-[#77738C] dark:text-[#A59DB8]">{node.range} pts</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-[#77738C] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={leaderboardSearch}
              onChange={(e) => setLeaderboardSearch(e.target.value)}
              placeholder="Search classmate..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E9E4F5] dark:border-[#332A50] bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
            />
          </div>
          <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">
            Showing top {filteredLeaderboard.length} peers
          </span>
        </div>

        {/* Top 10 Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E4F5] dark:border-[#332A50] text-[#77738C] dark:text-[#A59DB8] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Success Score</th>
                <th className="pb-3 font-semibold">Progression Tier</th>
                <th className="pb-3 font-semibold">Cohort Grade</th>
                <th className="pb-3 font-semibold text-right">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E4F5] dark:divide-[#332A50]">
              {filteredLeaderboard.map((entry, idx) => {
                const rank = idx + 1;
                const isCurrent = entry.student.id === currentStudent.id;
                return (
                  <tr 
                    key={entry.student.id}
                    className={`transition-colors ${
                      isCurrent 
                        ? 'bg-[#EDE9FE]/70 dark:bg-[#2E244A]/60 font-semibold' 
                        : 'hover:bg-[#FAF9FF] dark:hover:bg-[#241D38]'
                    }`}
                  >
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        {rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-[11px] shadow-sm">1</span>
                        ) : rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black flex items-center justify-center text-[11px] shadow-sm">2</span>
                        ) : rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-[11px] shadow-sm">3</span>
                        ) : (
                          <span className="w-6 h-6 text-[#77738C] font-semibold flex items-center justify-center text-xs">#{rank}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={entry.student.avatarUrl} 
                          alt={entry.student.name} 
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-[#7C3AED]/20"
                        />
                        <div>
                          <p className={`font-semibold ${isCurrent ? 'text-[#6D28D9] dark:text-[#EDE9FE]' : 'text-[#242038] dark:text-white'}`}>
                            {entry.student.name} {isCurrent && <span className="ml-1.5 text-[10px] text-[#6D28D9] bg-[#EDE9FE] px-1.5 py-0.2 rounded-full font-bold">(You)</span>}
                          </p>
                          <p className="text-[10px] text-[#77738C] dark:text-[#A59DB8] font-mono">{entry.student.rollNo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 font-bold text-[#242038] dark:text-white font-mono">
                      {entry.score}
                    </td>

                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]">
                        Level {entry.level} • {entry.levelName}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.grade === 'Grade A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                        entry.grade === 'Grade B' ? 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]' :
                        entry.grade === 'Grade C' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                      }`}>
                        {entry.grade}
                      </span>
                    </td>

                    <td className="py-3.5 text-right font-semibold text-[#77738C] dark:text-[#A59DB8]">
                      {entry.badgesCount} 🏅
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* BOTTOM ROW: Upcoming Deadlines & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Deadlines */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#242038] dark:text-white flex items-center gap-2 font-heading">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              Upcoming Examinations & Deadlines
            </h3>
            <button
              onClick={() => setActiveTab('academic-calendar')}
              className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold hover:underline"
            >
              Full Calendar →
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: 'IA-2: Data Structures & Algorithms', date: 'October 24, 2026', type: 'Exam', daysLeft: '15 days' },
              { title: 'DBMS Assignment 3: Distributed 2PC', date: 'October 18, 2026', type: 'Assignment', daysLeft: '9 days' },
              { title: 'IA-2: Operating Systems Kernels', date: 'October 30, 2026', type: 'Exam', daysLeft: '21 days' },
              { title: 'KPMG National Hackathon 2026', date: 'November 14, 2026', type: 'Event', daysLeft: '36 days' }
            ].map((item, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#242038] dark:text-white">{item.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#77738C] dark:text-[#A59DB8] mt-0.5">{item.date}</p>
                </div>
                <span className="text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA] bg-white dark:bg-[#1D172E] px-2.5 py-1 rounded-xl border border-[#E9E4F5] dark:border-[#332A50]">
                  {item.daysLeft}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#242038] dark:text-white flex items-center gap-2 font-heading">
              <Activity className="w-4 h-4 text-emerald-600" />
              Recent Academic Activity Feed
            </h3>
            <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">Campus live records</span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#F4F0FF] dark:hover:bg-[#241D38] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] dark:bg-[#2E244A] text-[#7C3AED] dark:text-[#A78BFA] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#242038] dark:text-white truncate">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-[#77738C] dark:text-[#A59DB8]">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};



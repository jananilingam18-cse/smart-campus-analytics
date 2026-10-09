import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Settings2, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Info, 
  Calendar, 
  Layers, 
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  calculateStudentSuccessScore, 
  DEFAULT_WEIGHTS 
} from '../utils/scoring';
import { ScoringWeights } from '../types';

export const SuccessScorePage: React.FC = () => {
  const { currentStudent, scoringWeights, setScoringWeights } = useApp();

  const [isConfiguringWeights, setIsConfiguringWeights] = useState(false);
  const [showFormulaExplanation, setShowFormulaExplanation] = useState(true);
  const [tempWeights, setTempWeights] = useState<ScoringWeights>(scoringWeights);

  const breakdown = calculateStudentSuccessScore(currentStudent, scoringWeights);

  // Circular gauge calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (breakdown.overallScore / 100) * circumference;

  const scoreDelta = Number((breakdown.overallScore - breakdown.previousScore).toFixed(1));

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = tempWeights.attendanceWeight + tempWeights.academicWeight + tempWeights.participationWeight + tempWeights.assignmentWeight;
    if (Math.abs(sum - 1.0) > 0.01) {
      alert(`Weights must total 100% (currently ${(sum * 100).toFixed(0)}%). Please adjust the sliders.`);
      return;
    }
    setScoringWeights(tempWeights);
    setIsConfiguringWeights(false);
  };

  const handleResetWeights = () => {
    setTempWeights(DEFAULT_WEIGHTS);
    setScoringWeights(DEFAULT_WEIGHTS);
    setIsConfiguringWeights(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE] flex items-center justify-center font-bold shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#242038] dark:text-white font-heading">
              Student Success Score & Explainability Engine
            </h1>
            <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
              Mathematical evaluation of academic potential, consistency, and campus impact
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTempWeights(scoringWeights);
            setIsConfiguringWeights(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#E9E4F5] dark:border-[#332A50] bg-white dark:bg-[#1D172E] text-xs font-semibold text-[#242038] dark:text-white hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] shadow-sm transition self-start sm:self-auto"
        >
          <Settings2 className="w-4 h-4 text-[#7C3AED]" />
          <span>Configure Scoring Model</span>
        </button>
      </div>

      {/* Provisional Score Notice */}
      {breakdown.isProvisional && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold font-heading">Provisional Score Notice:</strong> {breakdown.provisionalReason}
            <p className="mt-1 text-amber-800 dark:text-amber-300">
              Campus IQ AI transparently discloses data limitations rather than arbitrarily degrading scores to zero.
            </p>
          </div>
        </div>
      )}

      {/* Main Hero Card: Circular Score Indicator & Component Contributions */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] p-6 lg:p-8 shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Prominent Circular Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-4">
            <div className="relative w-52 h-52 flex items-center justify-center">
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
                  stroke="url(#successScoreGrad)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="successScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-[#242038] dark:text-white font-heading tracking-tight">
                  {breakdown.overallScore}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8] mt-1">
                  out of 100
                </span>
                <span className={`mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold ${
                  breakdown.gradeSegment === 'Grade A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                  breakdown.gradeSegment === 'Grade B' ? 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]' :
                  breakdown.gradeSegment === 'Grade C' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                }`}>
                  {breakdown.gradeSegment}
                </span>
              </div>
            </div>

            {/* Score History Delta */}
            <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-[#77738C] dark:text-[#A59DB8]">
              <span>Previous: {breakdown.previousScore}</span>
              <span className={`flex items-center gap-0.5 ${scoreDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {scoreDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} Points
              </span>
              <span>• Synced {breakdown.calculationDate}</span>
            </div>
          </div>

          {/* Individual Components Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E4F5] dark:border-[#332A50]">
              <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
                Weighted Component Breakdown
              </h3>
              <span className="text-[11px] text-[#77738C] dark:text-[#A59DB8] font-mono">100-Point Normalized</span>
            </div>

            <div className="space-y-4">
              {[
                { 
                  name: 'Academic Performance', 
                  raw: breakdown.academicScore, 
                  weight: scoringWeights.academicWeight, 
                  contrib: (breakdown.academicScore * scoringWeights.academicWeight).toFixed(1),
                  color: 'bg-[#7C3AED]',
                  desc: 'Derived from university semester SGPA / CGPA' 
                },
                { 
                  name: 'Attendance Compliance', 
                  raw: breakdown.attendanceScore, 
                  weight: scoringWeights.attendanceWeight, 
                  contrib: (breakdown.attendanceScore * scoringWeights.attendanceWeight).toFixed(1),
                  color: 'bg-[#6D28D9]',
                  desc: 'Classroom sessions attended / conducted' 
                },
                { 
                  name: 'Coursework & Assignments', 
                  raw: breakdown.assignmentScore, 
                  weight: scoringWeights.assignmentWeight, 
                  contrib: (breakdown.assignmentScore * scoringWeights.assignmentWeight).toFixed(1),
                  color: 'bg-[#A78BFA]',
                  desc: 'Eligible assignments submitted on time' 
                },
                { 
                  name: 'Verified Event Participation', 
                  raw: breakdown.participationScore, 
                  weight: scoringWeights.participationWeight, 
                  contrib: (breakdown.participationScore * scoringWeights.participationWeight).toFixed(1),
                  color: 'bg-emerald-500',
                  desc: 'Hackathons, symposiums & co-curricular points' 
                }
              ].map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#242038] dark:text-white">{c.name}</span>
                    <span className="font-mono text-[#77738C] dark:text-[#A59DB8]">
                      <strong>{c.raw}%</strong> × {(c.weight * 100).toFixed(0)}% = <strong className="text-[#7C3AED] dark:text-[#A78BFA]">+{c.contrib} pts</strong>
                    </span>
                  </div>
                  <div className="w-full bg-[#E9E4F5] dark:bg-[#332A50] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${c.color} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.min(100, c.raw)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#77738C] dark:text-[#A59DB8] block">{c.desc}</span>
                </div>
              ))}
            </div>

            {/* Indicator Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Strongest Indicator
                </span>
                <p className="font-bold text-emerald-950 dark:text-emerald-200 mt-0.5">
                  {breakdown.strongestIndicator}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Weakest Indicator
                </span>
                <p className="font-bold text-amber-950 dark:text-amber-200 mt-0.5">
                  {breakdown.weakestIndicator}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Expandable "How is my score calculated?" Section */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] p-6 lg:p-8 shadow-card space-y-4">
        <button
          onClick={() => setShowFormulaExplanation(!showFormulaExplanation)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#2E244A] dark:text-[#EDE9FE] flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
                How is my score calculated?
              </h3>
              <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
                Formula breakdown and institutional weighting rules
              </p>
            </div>
          </div>
          {showFormulaExplanation ? <ChevronUp className="w-5 h-5 text-[#77738C]" /> : <ChevronDown className="w-5 h-5 text-[#77738C]" />}
        </button>

        {showFormulaExplanation && (
          <div className="pt-3 border-t border-[#E9E4F5] dark:border-[#332A50] space-y-4 text-xs leading-relaxed animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#EDE9FE] dark:border-[#332A50] font-mono text-xs text-[#6D28D9] dark:text-[#EDE9FE]">
              Student Success Score = (Attendance × {(scoringWeights.attendanceWeight * 100).toFixed(0)}%) + (Academics × {(scoringWeights.academicWeight * 100).toFixed(0)}%) + (Participation × {(scoringWeights.participationWeight * 100).toFixed(0)}%) + (Assignments × {(scoringWeights.assignmentWeight * 100).toFixed(0)}%)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#77738C] dark:text-[#A59DB8]">
              <div className="p-3 rounded-xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-[#332A50]">
                <strong className="text-[#242038] dark:text-white block mb-0.5">1. Academic Performance ({(scoringWeights.academicWeight * 100).toFixed(0)}%)</strong>
                Computed from verified university semester SGPA / CGPA, normalized to a percentage scale (e.g. 9.12 CGPA = 91.2%).
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-[#332A50]">
                <strong className="text-[#242038] dark:text-white block mb-0.5">2. Attendance Compliance ({(scoringWeights.attendanceWeight * 100).toFixed(0)}%)</strong>
                Evaluates aggregate attendance across all courses. If any individual course is below 75%, an attendance shortage flag is active.
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-[#332A50]">
                <strong className="text-[#242038] dark:text-white block mb-0.5">3. Assignment Submissions ({(scoringWeights.assignmentWeight * 100).toFixed(0)}%)</strong>
                Tracks on-time completion of practical problem sheets, laboratory assignments, and project deliverables.
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-[#332A50]">
                <strong className="text-[#242038] dark:text-white block mb-0.5">4. Co-Curricular Events ({(scoringWeights.participationWeight * 100).toFixed(0)}%)</strong>
                Awards verified points for hackathon wins, research publications, campus leadership, and sports competitions.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explainability Section: "Why is your score [X]?" */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] p-6 lg:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E9E4F5] dark:border-[#332A50]">
          <Sparkles className="w-5 h-5 text-[#7C3AED]" />
          <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
            Why is your score {breakdown.overallScore}?
          </h3>
        </div>
        <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
          Transparent, deterministic factors derived from your academic and co-curricular records:
        </p>

        <div className="space-y-3">
          {breakdown.explainabilityReasons.map((reason, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3.5 transition-colors ${
                reason.impact === 'positive' 
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' 
                  : reason.impact === 'negative'
                  ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                  : 'bg-[#F4F0FF] dark:bg-[#241D38] border-[#E9E4F5] dark:border-[#332A50] text-[#242038] dark:text-white'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {reason.impact === 'positive' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : reason.impact === 'negative' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : (
                  <Info className="w-4 h-4 text-[#7C3AED]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold">{reason.title}</h4>
                  <span className={`font-mono font-bold text-[11px] ${
                    reason.scoreDelta > 0 ? 'text-emerald-600' : reason.scoreDelta < 0 ? 'text-rose-600' : 'text-[#77738C]'
                  }`}>
                    {reason.scoreDelta > 0 ? `+${reason.scoreDelta.toFixed(1)} pts` : reason.scoreDelta < 0 ? `${reason.scoreDelta.toFixed(1)} pts` : 'Neutral'}
                  </span>
                </div>
                <p className="mt-1 opacity-90 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] p-6 lg:p-8 shadow-card space-y-4">
        <h3 className="text-base font-bold text-[#242038] dark:text-white flex items-center gap-2 font-heading">
          <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
          Recommended Next Actions to Advance Your Score
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {breakdown.nextActionSteps.map((action, i) => (
            <div 
              key={i} 
              className="p-4 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-[#242038] dark:text-[#FAF9FF] font-medium leading-relaxed">
                {action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Scoring Model Configuration Modal */}
      {isConfiguringWeights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-[#332A50] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E4F5] dark:border-[#332A50]">
              <div>
                <h3 className="text-base font-bold text-[#242038] dark:text-white flex items-center gap-2 font-heading">
                  <Settings2 className="w-4 h-4 text-[#7C3AED]" />
                  Institutional Scoring Weights Configuration
                </h3>
                <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
                  Adjust parameter weights for autonomous institution guidelines
                </p>
              </div>
              <button onClick={() => setIsConfiguringWeights(false)} className="text-[#77738C] hover:text-[#242038] dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#242038] dark:text-white">Academic Performance Weight:</span>
                  <span className="text-[#7C3AED] dark:text-[#A78BFA] font-mono">{(tempWeights.academicWeight * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="10" max="60" step="5"
                  value={tempWeights.academicWeight * 100}
                  onChange={(e) => setTempWeights({ ...tempWeights, academicWeight: Number(e.target.value) / 100 })}
                  className="w-full cursor-pointer accent-[#7C3AED]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#242038] dark:text-white">Attendance Weight:</span>
                  <span className="text-[#7C3AED] dark:text-[#A78BFA] font-mono">{(tempWeights.attendanceWeight * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="10" max="50" step="5"
                  value={tempWeights.attendanceWeight * 100}
                  onChange={(e) => setTempWeights({ ...tempWeights, attendanceWeight: Number(e.target.value) / 100 })}
                  className="w-full cursor-pointer accent-[#7C3AED]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#242038] dark:text-white">Assignment Completion Weight:</span>
                  <span className="text-[#7C3AED] dark:text-[#A78BFA] font-mono">{(tempWeights.assignmentWeight * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="10" max="40" step="5"
                  value={tempWeights.assignmentWeight * 100}
                  onChange={(e) => setTempWeights({ ...tempWeights, assignmentWeight: Number(e.target.value) / 100 })}
                  className="w-full cursor-pointer accent-[#7C3AED]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#242038] dark:text-white">Event Participation Weight:</span>
                  <span className="text-[#7C3AED] dark:text-[#A78BFA] font-mono">{(tempWeights.participationWeight * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="5" max="30" step="5"
                  value={tempWeights.participationWeight * 100}
                  onChange={(e) => setTempWeights({ ...tempWeights, participationWeight: Number(e.target.value) / 100 })}
                  className="w-full cursor-pointer accent-[#7C3AED]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] text-[#242038] dark:text-white flex justify-between font-bold">
                <span>Total Weights Sum:</span>
                <span className={Math.abs((tempWeights.academicWeight + tempWeights.attendanceWeight + tempWeights.assignmentWeight + tempWeights.participationWeight) - 1.0) < 0.01 ? 'text-emerald-600' : 'text-rose-600'}>
                  {((tempWeights.academicWeight + tempWeights.attendanceWeight + tempWeights.assignmentWeight + tempWeights.participationWeight) * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E9E4F5] dark:border-[#332A50]">
                <button
                  type="button"
                  onClick={handleResetWeights}
                  className="px-3.5 py-2 rounded-xl text-[#77738C] hover:bg-[#F4F0FF] dark:hover:bg-[#241D38] flex items-center gap-1.5 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfiguringWeights(false)}
                    className="px-4 py-2 rounded-xl text-[#77738C] hover:bg-[#F4F0FF] dark:hover:bg-[#241D38]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-semibold shadow-md shadow-violet-500/20"
                  >
                    Apply Weights
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

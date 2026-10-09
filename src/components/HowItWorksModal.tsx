import React from 'react';
import { 
  X, 
  Database, 
  LineChart, 
  Target, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorksModal: React.FC = () => {
  const { isHowItWorksOpen, setIsHowItWorksOpen } = useApp();

  if (!isHowItWorksOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Collect Data',
      icon: Database,
      color: 'violet',
      subtitle: 'Multi-Modal Campus Ingestion',
      details: 'Aggregates LMS submissions, RFID attendance logs, ERP examination marks, faculty mentor notes, and verified co-curricular certificates into a unified institutional schema.'
    },
    {
      step: '02',
      title: 'Analyze Performance',
      icon: LineChart,
      color: 'violet',
      subtitle: 'Multi-Dimensional Normalization',
      details: 'Normalizes disparate grading scales to standard 100-point benchmarks. Distinguishes co-curricular achievements from routine participation and detects subject-specific trend trajectories.'
    },
    {
      step: '03',
      title: 'Calculate Success Score',
      icon: Target,
      color: 'violet',
      subtitle: 'Transparent Explainable Model',
      details: 'Applies weighted scoring: Attendance (25%), Academics (40%), Events (15%), and Assignments (20%). Generates auditable mathematical factors with zero black-box obscurity.'
    },
    {
      step: '04',
      title: 'Identify Risk',
      icon: AlertTriangle,
      color: 'rose',
      subtitle: 'Early Warning Indicators',
      details: 'Flags attendance shortages below the mandatory 75% threshold, impending assignment backlogs, and anomalous divergences between high test scores and weak placement competencies.'
    },
    {
      step: '05',
      title: 'Recommend Interventions',
      icon: Sparkles,
      color: 'violet',
      subtitle: 'Personalized Adaptive Roadmap',
      details: 'AI Assistant maps individual deficit areas to targeted platforms (NPTEL, SWAYAM, LeetCode), computes required consecutive classes to reach compliance, and crafts 7-day study plans.'
    },
    {
      step: '06',
      title: 'Track Improvement',
      icon: TrendingUp,
      color: 'emerald',
      subtitle: 'Continuous Gamified Growth',
      details: 'Dynamic milestones, Candy Crush-inspired progression levels, unlockable achievement badges, and positive reinforcement inspire students to advance from Grade D to Grade A.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-heading">
                How Campus IQ AI Works
              </h2>
              <p className="text-xs text-purple-200 font-medium">
                Enterprise AI Architecture & Student Success Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHowItWorksOpen(false)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* Workflow Pipeline Graphic */}
          <div className="bg-[#FAF9FF] dark:bg-[#13101E] p-4 rounded-2xl border border-[#E9E4F5] dark:border-purple-900/40">
            <p className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-purple-300 mb-3 text-center">
              The 6-Stage Student Success Lifecycle
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-lg bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">1. Collect Data</span>
              <ArrowRight className="w-4 h-4 text-[#77738C] hidden sm:block" />
              <span className="px-3 py-1.5 rounded-lg bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">2. Analyze Performance</span>
              <ArrowRight className="w-4 h-4 text-[#77738C] hidden sm:block" />
              <span className="px-3 py-1.5 rounded-lg bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">3. Calculate Success Score</span>
              <ArrowRight className="w-4 h-4 text-[#77738C] hidden sm:block" />
              <span className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200">4. Identify Risk</span>
              <ArrowRight className="w-4 h-4 text-[#77738C] hidden sm:block" />
              <span className="px-3 py-1.5 rounded-lg bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">5. Recommend Interventions</span>
              <ArrowRight className="w-4 h-4 text-[#77738C] hidden sm:block" />
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">6. Track Improvement</span>
            </div>
          </div>

          {/* Detailed 6 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.step}
                  className="p-5 rounded-2xl border border-[#E9E4F5] dark:border-purple-900/40 bg-white dark:bg-[#13101E] hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] dark:bg-purple-900/40 flex items-center justify-center text-[#7C3AED] dark:text-purple-300 font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">
                          Stage {item.step}
                        </span>
                        <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#7C3AED] dark:text-purple-300 mb-1">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-[#77738C] dark:text-purple-300 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mathematical Formula Spotlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#242038] to-[#1D172E] text-white border border-[#E9E4F5]/20">
            <h4 className="text-sm font-bold text-purple-200 mb-2 flex items-center gap-2 font-heading">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Transparent Success Score Formula
            </h4>
            <div className="bg-white/10 rounded-xl p-3 font-mono text-xs text-purple-100 overflow-x-auto">
              Student Success Score = (Attendance × 0.25) + (Academics × 0.40) + (Participation × 0.15) + (Assignments × 0.20)
            </div>
            <p className="text-[11px] text-purple-200 mt-2">
              All factors normalized to a 0–100 scale. If prerequisite data is missing, the score is transparently marked Provisional rather than unfairly penalized with zeroes.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF9FF] dark:bg-[#13101E] border-t border-[#E9E4F5] dark:border-purple-900/40 flex justify-end shrink-0">
          <button
            onClick={() => setIsHowItWorksOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            Got It, Proceed to App
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  Award, 
  PieChart, 
  Bot, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WalkthroughModal: React.FC = () => {
  const { isWalkthroughOpen, setIsWalkthroughOpen, setActiveTab, switchStudent, setIsAdminMode } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isWalkthroughOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to Campus IQ AI!',
      subtitle: 'Student Success & Predictive Analytics',
      icon: Sparkles,
      content: 'Campus IQ AI is an enterprise-ready educational platform engineered to bridge the gap between academic records, attendance compliance, co-curricular achievements, and placement readiness.',
      highlight: 'Take this interactive walkthrough to explore how each feature works seamlessly with zero shaming and clear explainability.',
      actionTab: 'dashboard',
      actionStudent: 'stud-1'
    },
    {
      title: 'Explainable Success Score (0–100)',
      subtitle: 'No black-box obscurity',
      icon: Activity,
      content: 'Unlike opaque predictive models, our Success Score utilizes transparent weights (Attendance 25%, Academics 40%, Events 15%, Assignments 20%) with every point traced directly to underlying ground-truth records.',
      highlight: 'Test: Navigate to "Success Score" to view the interactive formula weight sliders and "Why is your score [X]?" audit breakdown.',
      actionTab: 'success-score',
      actionStudent: 'stud-1'
    },
    {
      title: 'Attendance Shortage Risk Engine',
      subtitle: 'Strict 75% threshold with consecutive class math',
      icon: AlertTriangle,
      content: 'If any individual subject dips below 75%, an immediate warning is triggered. The platform mathematically computes how many consecutive classes the student must attend to recover compliance.',
      highlight: 'Test: Switch to Rohan Verma (stud-2) to see Data Structures shortage (68%) and the warning locking the Attendance Champion badge!',
      actionTab: 'student-info',
      actionStudent: 'stud-2'
    },
    {
      title: 'Gamified Milestone Progression',
      subtitle: 'Healthy peer motivation with zero shaming',
      icon: Award,
      content: 'A milestone progression path highlights achievable next levels. High-performing students inspire others without exposing sensitive academic risks publicly.',
      highlight: 'Test: Check the class leaderboard on the main dashboard to view milestone markers and personalized motivational next steps.',
      actionTab: 'dashboard',
      actionStudent: 'stud-1'
    },
    {
      title: 'Multi-Cluster Student Segmentation',
      subtitle: 'Grade A to D & Strategic sub-clusters',
      icon: PieChart,
      content: 'Segments 32+ students into Grade A (85-100), B (70-84.99), C (50-69.99), D (0-49.99), and "Not Yet Rated". Also uncovers crucial hidden patterns like "High Academics but Low Placement Readiness".',
      highlight: 'Test: Switch to Ananya Patel (stud-3) to see CGPA 9.2 with low placement readiness (coding 38%).',
      actionTab: 'student-segmentation',
      actionStudent: 'stud-3'
    },
    {
      title: 'Contextual AI Campus Assistant',
      subtitle: 'Actionable remedial learning plans',
      icon: Bot,
      content: 'The assistant references the logged-in student\'s actual deficiencies to recommend official platforms (NPTEL, SWAYAM, LeetCode, HackerRank) and generate realistic 7-day revision schedules.',
      highlight: 'Test: Open "AI Assistant" and click "Analyze my Success Score" or "How can I improve my attendance?".',
      actionTab: 'ai-assistant',
      actionStudent: 'stud-1'
    },
    {
      title: 'Faculty & Administrator Insights',
      subtitle: 'Institution-wide decision support',
      icon: ShieldCheck,
      content: 'Empowers department heads to monitor cohort health, detect at-risk cohorts, and schedule targeted remedial interventions with audit trails.',
      highlight: 'Test: Click "Administrator Insights" in the sidebar to review department KPIs.',
      actionTab: 'admin-insights',
      actionStudent: 'stud-1',
      setAdmin: true
    }
  ];

  const current = tourSteps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      if (tourSteps[nextIdx].actionStudent) {
        switchStudent(tourSteps[nextIdx].actionStudent!);
      }
      if (tourSteps[nextIdx].setAdmin) {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
      if (tourSteps[nextIdx].actionTab) {
        setActiveTab(tourSteps[nextIdx].actionTab as any);
      }
    } else {
      setIsWalkthroughOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      if (tourSteps[prevIdx].actionStudent) {
        switchStudent(tourSteps[prevIdx].actionStudent!);
      }
      if (tourSteps[prevIdx].actionTab) {
        setActiveTab(tourSteps[prevIdx].actionTab as any);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm font-heading">Interactive Walkthrough</span>
            <span className="text-xs text-purple-200">({currentStep + 1} of {tourSteps.length})</span>
          </div>
          <button 
            onClick={() => setIsWalkthroughOpen(false)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 border border-[#E9E4F5] dark:border-purple-800/40 flex items-center justify-center text-[#7C3AED] dark:text-purple-300">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#242038] dark:text-purple-100 font-heading">
                {current.title}
              </h3>
              <p className="text-xs font-semibold text-[#7C3AED] dark:text-purple-300">
                {current.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-[#77738C] dark:text-purple-200 leading-relaxed">
            {current.content}
          </p>

          <div className="p-3.5 rounded-2xl bg-[#EDE9FE]/50 dark:bg-purple-950/40 border border-[#E9E4F5] dark:border-purple-900/50 text-xs text-[#6D28D9] dark:text-purple-300 font-medium">
            💡 <strong className="font-bold">Pro Tip:</strong> {current.highlight}
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  if (tourSteps[idx].actionTab) setActiveTab(tourSteps[idx].actionTab as any);
                  if (tourSteps[idx].actionStudent) switchStudent(tourSteps[idx].actionStudent!);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep ? 'w-6 bg-[#7C3AED]' : 'bg-[#E9E4F5] dark:bg-purple-900/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#FAF9FF] dark:bg-[#13101E] border-t border-[#E9E4F5] dark:border-purple-900/40 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              currentStep === 0 
                ? 'opacity-40 cursor-not-allowed text-[#77738C]' 
                : 'text-[#242038] dark:text-purple-200 hover:bg-[#EDE9FE]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

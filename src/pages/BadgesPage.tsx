import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ShieldAlert, 
  Crown, 
  GraduationCap, 
  Trophy, 
  Star,
  Cpu,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { evaluateBadges } from '../utils/scoring';

export const BadgesPage: React.FC = () => {
  const { currentStudent } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const badges = evaluateBadges(currentStudent);

  // Check for any subject below 75%
  const shortageSubjects = (currentStudent.attendanceRecords || []).filter(s => {
    return s.total > 0 && ((s.attended / s.total) * 100 < 75);
  });

  const categories = ['All', 'Attendance', 'Academic Performance', 'Event Participation', 'All-Rounder'];

  const filteredBadges = badges.filter(b => {
    return selectedCategory === 'All' || b.category === selectedCategory;
  });

  const earnedCount = badges.filter(b => b.earned).length;

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-7 h-7" />;
      case 'Sparkles': return <Sparkles className="w-7 h-7" />;
      case 'GraduationCap': return <GraduationCap className="w-7 h-7" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-7 h-7" />;
      case 'Cpu': return <Cpu className="w-7 h-7" />;
      case 'Trophy': return <Trophy className="w-7 h-7" />;
      case 'Crown': return <Crown className="w-7 h-7" />;
      case 'TrendingUp': return <TrendingUp className="w-7 h-7" />;
      default: return <Star className="w-7 h-7" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE] flex items-center justify-center font-bold shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#242038] dark:text-white font-heading">
              Badges & Milestone Honors
            </h1>
            <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
              Deterministic rule-based recognition across attendance, academic mastery, and co-curricular impact
            </p>
          </div>
        </div>

        {/* Earned Counter */}
        <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-sm flex items-center gap-2 self-start md:self-auto">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-[#242038] dark:text-white">
            {earnedCount} of {badges.length} Badges Unlocked
          </span>
        </div>
      </div>

      {/* Critical Attendance Warning Banner for Badges */}
      {shortageSubjects.length > 0 && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-950 dark:text-rose-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="text-sm font-bold font-heading">
              Attendance Requirement Not Met in {shortageSubjects.map(s => s.subjectName).join(', ')}
            </h3>
          </div>
          <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed font-medium">
            Improve your attendance to qualify for attendance-based achievements. The <strong>Attendance Champion</strong> and <strong>Consistency Star</strong> badges remain locked until all subjects satisfy the mandatory 75% threshold.
          </p>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E9E4F5] dark:border-[#332A50]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-violet-500/20'
                : 'bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF] dark:hover:bg-[#241D38] hover:text-[#242038] dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                badge.earned
                  ? 'bg-white dark:bg-[#1D172E] border-[#EDE9FE] dark:border-[#332A50] shadow-card hover:shadow-card-hover ring-1 ring-[#7C3AED]/10'
                  : 'bg-[#FAF9FF]/80 dark:bg-[#161224]/80 border-[#E9E4F5] dark:border-[#2D2545] opacity-85'
              }`}
            >
              <div>
                {/* Badge Top Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform ${
                    badge.earned
                      ? badge.category === 'All-Rounder'
                        ? 'bg-gradient-to-tr from-amber-500 via-[#7C3AED] to-[#6D28D9] text-white ring-4 ring-amber-400/20'
                        : badge.category === 'Attendance'
                        ? 'bg-gradient-to-tr from-[#6D28D9] to-[#7C3AED] text-white ring-4 ring-[#7C3AED]/20'
                        : badge.category === 'Academic Performance'
                        ? 'bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white ring-4 ring-[#A78BFA]/20'
                        : 'bg-gradient-to-tr from-emerald-500 to-[#7C3AED] text-white ring-4 ring-emerald-500/20'
                      : 'bg-[#EDE9FE]/50 dark:bg-[#241D38] text-[#77738C] dark:text-[#A59DB8]'
                  }`}>
                    {renderBadgeIcon(badge.icon)}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    badge.earned
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : badge.isWarningLocked
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                      : 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]'
                  }`}>
                    {badge.earned ? '✓ Unlocked' : badge.isWarningLocked ? '⚠ Shortage Locked' : '🔒 Locked'}
                  </span>
                </div>

                {/* Badge Titles */}
                <h3 className={`text-base font-bold font-heading ${badge.earned ? 'text-[#242038] dark:text-white' : 'text-[#77738C] dark:text-[#A59DB8]'}`}>
                  {badge.name}
                </h3>
                <span className="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider block mt-0.5">
                  {badge.category}
                </span>

                <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-2.5 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Badge Footer / Unlock Progress */}
              <div className="mt-6 pt-4 border-t border-[#E9E4F5] dark:border-[#332A50] text-xs">
                {badge.earned ? (
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Earned on {badge.dateEarned || 'Sep 2026'}
                    </span>
                    <span className="font-bold">100% Mastery</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-[#77738C] dark:text-[#A59DB8]">
                      <span>Requirement Progress:</span>
                      <strong className="text-[#242038] dark:text-white">{badge.unlockProgress}%</strong>
                    </div>
                    <div className="w-full bg-[#E9E4F5] dark:bg-[#332A50] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${badge.isWarningLocked ? 'bg-rose-500' : 'bg-[#7C3AED]'}`}
                        style={{ width: `${badge.unlockProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#77738C] dark:text-[#A59DB8] leading-tight">
                      <strong>To Unlock:</strong> {badge.unlockRequirement}
                    </p>
                    {badge.warningReason && (
                      <p className="text-[10px] text-rose-600 font-bold mt-1">
                        {badge.warningReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

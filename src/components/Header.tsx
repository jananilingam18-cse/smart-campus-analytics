import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Settings, 
  Moon, 
  Sun, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronDown,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateStudentSuccessScore } from '../utils/scoring';

export const Header: React.FC = () => {
  const { 
    collegeName, 
    currentStudent, 
    switchStudent, 
    notifications, 
    unreadNotificationCount, 
    markNotificationRead, 
    clearAllNotifications,
    isDarkMode, 
    toggleDarkMode, 
    activeTab,
    setActiveTab,
    setIsHowItWorksOpen,
    setIsWalkthroughOpen,
    isAdminMode,
    setIsAdminMode
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const breakdown = calculateStudentSuccessScore(currentStudent);

  const getPageTitle = () => {
    if (isAdminMode || activeTab === 'admin-insights') return 'Administrator Insights';
    switch (activeTab) {
      case 'dashboard': return 'Student Dashboard';
      case 'my-learning': return 'My Learning & Library';
      case 'academic-calendar': return 'Academic Calendar';
      case 'student-info': return 'Student Information';
      case 'your-participation': return 'Co-Curricular Participation';
      case 'success-score': return 'Student Success Score';
      case 'badges': return 'Badges & Achievements';
      case 'student-segmentation': return 'Student Segmentation';
      case 'ai-assistant': return 'AI Learning Assistant';
      case 'settings': return 'System Settings';
      default: return 'Student Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#1D172E]/85 backdrop-blur-md border-b border-[#E9E4F5] dark:border-[#332A50] transition-colors duration-200">
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Breadcrumb / Page Title & Motivational Line */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA]">
              Campus IQ
            </span>
            <span className="hidden sm:inline-block text-xs text-[#77738C] dark:text-[#A59DB8]">/</span>
            <h1 className="text-sm md:text-base font-bold text-[#242038] dark:text-white truncate font-heading">
              {getPageTitle()}
            </h1>
          </div>
          <p className="hidden md:flex items-center gap-1.5 text-[11px] text-[#77738C] dark:text-[#A59DB8] font-medium mt-0.5 truncate">
            <Sparkles className="w-3 h-3 text-[#7C3AED] shrink-0" />
            <span>“Your Future Is Built One Achievement at a Time.”</span>
          </p>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          
          {/* Selected College Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50] text-xs font-semibold text-[#242038] dark:text-[#FAF9FF] max-w-xs truncate">
            <Building2 className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
            <span className="truncate">{collegeName}</span>
          </div>

          {/* Quick How It Works button for hackathon judges */}
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#DDD6FE] dark:bg-[#2E244A] dark:text-[#EDE9FE] dark:hover:bg-[#3B2F5E] transition-all"
            title="How Campus IQ AI Works - 6 Step Framework"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>How It Works</span>
          </button>

          {/* Guided Tour Walkthrough */}
          <button
            onClick={() => setIsWalkthroughOpen(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F4F0FF] text-[#7C3AED] hover:bg-[#EDE9FE] dark:bg-[#241D38] dark:text-[#A78BFA] dark:hover:bg-[#2E244A] border border-[#E9E4F5] dark:border-[#332A50] transition-all"
            title="Guided Demo Walkthrough for Judges"
          >
            <Compass className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Judge Tour</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] hover:text-[#6D28D9] transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#7C3AED]" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] hover:text-[#6D28D9] relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#7C3AED] text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1D172E] shadow-2xl border border-[#E9E4F5] dark:border-[#332A50] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E4F5] dark:border-[#332A50]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#242038] dark:text-white font-heading">
                      Campus Notifications
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]">
                      {unreadNotificationCount} new
                    </span>
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-[#7C3AED] hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-80 overflow-y-auto space-y-2 divide-y divide-[#E9E4F5]/50 dark:divide-[#332A50]/50">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab);
                        setShowNotifications(false);
                      }}
                      className={`pt-2 first:pt-0 cursor-pointer group flex items-start gap-3 p-2 rounded-xl transition-colors ${
                        n.read ? 'opacity-70 hover:bg-[#FAF9FF] dark:hover:bg-[#241D38]' : 'bg-[#F4F0FF]/60 dark:bg-[#2E244A]/40 hover:bg-[#EDE9FE]/50'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.priority === 'high' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        ) : n.type === 'badge' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-[#7C3AED]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-semibold truncate ${n.read ? 'text-[#77738C] dark:text-[#A59DB8]' : 'text-[#242038] dark:text-white'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-[#77738C] shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#77738C] dark:text-[#A59DB8] line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Shortcut */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 rounded-xl text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] hover:text-[#6D28D9] transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Student Avatar & Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl border border-[#E9E4F5] dark:border-[#332A50] bg-white dark:bg-[#241D38] hover:bg-[#F4F0FF] dark:hover:bg-[#2E244A] transition-all text-left"
            >
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#7C3AED]/30"
              />
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-[#242038] dark:text-white leading-tight">
                  {currentStudent.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#77738C] dark:text-[#A59DB8] font-mono">
                    {currentStudent.rollNo}
                  </span>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    breakdown.gradeSegment === 'Grade A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                    breakdown.gradeSegment === 'Grade B' ? 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]' :
                    breakdown.gradeSegment === 'Grade C' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                    breakdown.gradeSegment === 'Grade D' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {breakdown.gradeSegment}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#77738C]" />
            </button>

            {/* Persona Switcher Menu */}
            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#1D172E] shadow-2xl border border-[#E9E4F5] dark:border-[#332A50] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 mb-1.5 border-b border-[#E9E4F5] dark:border-[#332A50]">
                  <p className="text-xs font-bold text-[#242038] dark:text-white font-heading">
                    Judge Persona Switcher
                  </p>
                  <p className="text-[11px] text-[#77738C] dark:text-[#A59DB8]">
                    Evaluate varying student situations instantly
                  </p>
                </div>

                <div className="space-y-1">
                  {[
                    { id: 'stud-1', name: 'Priya Sharma', desc: 'Grade A • Score 91.2 • All-Rounder' },
                    { id: 'stud-2', name: 'Rohan Verma', desc: 'Grade C • Shortage in DSA (68%)' },
                    { id: 'stud-3', name: 'Ananya Patel', desc: 'Grade B • CGPA 9.2 • Low Placement' },
                    { id: 'stud-4', name: 'Amit Kumar', desc: 'Grade D • Score 44.5 • Shortages' },
                    { id: 'stud-5', name: 'Sneha Reddy', desc: 'Grade B • 95% Att. • Low Exams' },
                    { id: 'stud-6', name: 'Vikram Malhotra', desc: 'Grade B • Continuous Improver' },
                    { id: 'stud-7', name: 'Arpan Banerjee', desc: 'Not Yet Rated • Insufficient Data' }
                  ].map((persona) => {
                    const isSelected = currentStudent.id === persona.id && !isAdminMode;
                    return (
                      <button
                        key={persona.id}
                        onClick={() => {
                          switchStudent(persona.id);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected 
                            ? 'bg-[#EDE9FE] dark:bg-[#2E244A] text-[#6D28D9] dark:text-[#EDE9FE] font-bold border border-[#A78BFA]/40' 
                            : 'hover:bg-[#F4F0FF] dark:hover:bg-[#241D38] text-[#242038] dark:text-[#FAF9FF]'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">
                            {persona.name}
                          </div>
                          <div className="text-[10px] text-[#77738C] dark:text-[#A59DB8]">
                            {persona.desc}
                          </div>
                        </div>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>}
                      </button>
                    );
                  })}

                  <div className="pt-2 border-t border-[#E9E4F5] dark:border-[#332A50]">
                    <button
                      onClick={() => {
                        setIsAdminMode(true);
                        setActiveTab('admin-insights');
                        setShowPersonaMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 text-[#7C3AED] dark:text-[#A78BFA] hover:bg-[#F4F0FF] dark:hover:bg-[#241D38] font-bold"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Switch to Faculty / Admin Mode</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

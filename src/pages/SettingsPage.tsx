import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Type, 
  Palette, 
  Sun, 
  Moon, 
  Laptop,
  Globe, 
  Bell, 
  Shield, 
  User, 
  LogOut, 
  CheckCircle2, 
  Check,
  Building2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeType, AppearanceMode, FontSizeScale } from '../types';

export const SettingsPage: React.FC = () => {
  const { 
    collegeName, 
    currentStudent, 
    theme, 
    setTheme, 
    appearanceMode,
    setAppearanceMode,
    fontSize, 
    setFontSize, 
    resetToDefaultSettings,
    logout 
  } = useApp();

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [examReminders, setExamReminders] = useState(true);
  const [attendanceWarnings, setAttendanceWarnings] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);
  const [savedBanner, setSavedBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('Settings saved successfully');

  const themesList: Array<{ 
    id: ThemeType; 
    name: string; 
    primaryHex: string; 
    secondaryHex: string; 
    desc: string; 
    isDefault?: boolean;
  }> = [
    { 
      id: 'royal-purple', 
      name: 'Royal Purple', 
      primaryHex: '#7C3AED', 
      secondaryHex: '#6D28D9', 
      desc: 'Deep Violet & Soft Lavender Mist (Default signature palette)',
      isDefault: true 
    },
    { 
      id: 'ocean-blue', 
      name: 'Ocean Blue', 
      primaryHex: '#0284C7', 
      secondaryHex: '#0369A1', 
      desc: 'Deep Azure and Cyan highlights for technical clarity' 
    },
    { 
      id: 'emerald-green', 
      name: 'Emerald Green', 
      primaryHex: '#059669', 
      secondaryHex: '#047857', 
      desc: 'Modern Forest Green and Teal accents' 
    },
    { 
      id: 'sunset-orange', 
      name: 'Sunset Orange', 
      primaryHex: '#EA580C', 
      secondaryHex: '#C2410C', 
      desc: 'Energizing Amber and Terracotta glow' 
    }
  ];

  const appearanceModes: Array<{ id: AppearanceMode; label: string; desc: string; icon: React.ReactNode }> = [
    { 
      id: 'light', 
      label: 'Light Mode', 
      desc: 'Mist white & soft lilac editorial surfaces', 
      icon: <Sun className="w-5 h-5 text-amber-500" /> 
    },
    { 
      id: 'dark', 
      label: 'Dark Mode', 
      desc: 'Charcoal purple night palette', 
      icon: <Moon className="w-5 h-5 text-[#A78BFA]" /> 
    },
    { 
      id: 'system', 
      label: 'System Sync', 
      desc: 'Adapts automatically to OS preference', 
      icon: <Laptop className="w-5 h-5 text-[#7C3AED] dark:text-[#A78BFA]" /> 
    }
  ];

  const fontSizes: Array<{ id: FontSizeScale; label: string; desc: string; sample: string }> = [
    { id: 'sm', label: 'Small', desc: 'Compact font for data-dense dashboards', sample: 'Text size 13px' },
    { id: 'md', label: 'Medium (Default)', desc: 'Standard balanced typography', sample: 'Text size 15px' },
    { id: 'lg', label: 'Large', desc: 'Enhanced visibility for presentations', sample: 'Text size 17px' },
    { id: 'xl', label: 'Extra Large', desc: 'High-contrast accessible display', sample: 'Text size 19px' }
  ];

  const languages = [
    { code: 'en', name: 'English', status: 'Default Active' },
    { code: 'hi', name: 'Hindi (हिंदी)', status: 'Beta' },
    { code: 'ta', name: 'Tamil (தமிழ்)', status: 'Beta' },
    { code: 'te', name: 'Telugu (తెలుగు)', status: 'Beta' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', status: 'Beta' }
  ];

  const triggerSaveNotification = (msg = 'Settings saved successfully') => {
    setBannerMessage(msg);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2400);
  };

  const handleResetToDefault = () => {
    resetToDefaultSettings();
    setSelectedLanguage('English');
    setEmailAlerts(true);
    setExamReminders(true);
    setAttendanceWarnings(true);
    setLeaderboardVisible(true);
    triggerSaveNotification('System reset to default Royal Purple & Medium font');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center font-bold shadow-sm">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
              System Settings & Preferences
            </h1>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Personalize interface themes, display appearance, typography, and notification rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedBanner && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{bannerMessage}</span>
            </div>
          )}

          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-white dark:bg-[#1D172E] hover:border-[#7C3AED] text-[#6D28D9] dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            title="Reset theme, appearance, and fonts to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Appearance Mode (Light / Dark / System) */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED] dark:text-purple-300">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                Appearance Mode
              </h3>
              <p className="text-xs text-[#77738C] dark:text-purple-300">Choose between light mist, charcoal purple dark, or system match</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 capitalize">
            {appearanceMode} Mode Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {appearanceModes.map((mode) => {
            const isSelected = appearanceMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setAppearanceMode(mode.id);
                  triggerSaveNotification(`Appearance set to ${mode.label}`);
                }}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#7C3AED] bg-[#EDE9FE]/50 dark:bg-purple-950/40 ring-2 ring-[#7C3AED]/20 shadow-sm'
                    : 'border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-[#7C3AED]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/50 flex items-center justify-center shadow-xs">
                    {mode.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#242038] dark:text-purple-100">{mode.label}</p>
                    <p className="text-[10px] text-[#77738C] dark:text-purple-300 mt-0.5">{mode.desc}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#7C3AED] dark:text-purple-300 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Accent Color Themes (Royal Purple Default) */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED] dark:text-purple-300">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                Visual Theme Swatches
              </h3>
              <p className="text-xs text-[#77738C] dark:text-purple-300">Select your preferred color identity across all screens and components</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300">
            4 Cohesive Palettes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themesList.map((t) => {
            const isSelected = theme === t.id || (t.isDefault && (theme === 'classic' || theme === 'violet' || theme === 'royal-purple'));
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  triggerSaveNotification(`Theme updated to ${t.name}`);
                }}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#7C3AED] bg-[#EDE9FE]/50 dark:bg-purple-950/40 ring-2 ring-[#7C3AED]/20 shadow-sm'
                    : 'border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-[#7C3AED]/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Swatch preview */}
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-xl shadow-sm flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: `linear-gradient(135deg, ${t.primaryHex}, ${t.secondaryHex})` }}
                    >
                      {t.name[0]}
                    </div>
                    {t.isDefault && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs" title="Default signature theme">
                        ★
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#242038] dark:text-purple-100">{t.name}</p>
                      {t.isDefault && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#77738C] dark:text-purple-300 mt-0.5 leading-snug">{t.desc}</p>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#7C3AED] dark:text-purple-300 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Font Size Scaling */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED] dark:text-purple-300">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                Interface Typography Scaling
              </h3>
              <p className="text-xs text-[#77738C] dark:text-purple-300">Scales font sizes across all headings, cards, and data tables</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 uppercase">
            {fontSize} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {fontSizes.map((f) => {
            const isSelected = fontSize === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setFontSize(f.id);
                  triggerSaveNotification(`Font size updated to ${f.label}`);
                }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#7C3AED] bg-[#EDE9FE]/50 dark:bg-purple-950/40 ring-2 ring-[#7C3AED]/20 shadow-sm'
                    : 'border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] hover:border-[#7C3AED]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#242038] dark:text-purple-100">{f.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#7C3AED] dark:text-purple-300" />}
                  </div>
                  <p className="text-[10px] text-[#77738C] dark:text-purple-300 mt-1 leading-snug">{f.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E9E4F5] dark:border-purple-900/40 text-[11px] font-mono text-[#77738C] dark:text-purple-400">
                  {f.sample}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Language Selection */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED] dark:text-purple-300">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                Language & Localization
              </h3>
              <p className="text-xs text-[#77738C] dark:text-purple-300">English is active; additional regional languages ready for rollout</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300">
            {selectedLanguage} Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.name;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLanguage(lang.name);
                  triggerSaveNotification(`Language set to ${lang.name}`);
                }}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  isSelected
                    ? 'border-[#7C3AED] bg-[#EDE9FE]/60 dark:bg-purple-950/40 font-bold text-[#6D28D9] dark:text-purple-300 shadow-sm'
                    : 'border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-200 hover:border-[#7C3AED]/50'
                }`}
              >
                <p className="text-xs">{lang.name}</p>
                <span className="text-[9px] text-[#77738C] dark:text-purple-400 block mt-0.5">{lang.status}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: Notification & Privacy Preferences */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED] dark:text-purple-300">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
              Notification & Privacy Preferences
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300">Configure alert channels and peer leaderboard visibility</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/30 cursor-pointer">
            <div>
              <span className="font-bold text-[#242038] dark:text-purple-100">Critical Attendance Shortage Email/SMS Alerts</span>
              <p className="text-[10px] text-[#77738C] dark:text-purple-300 mt-0.5">Receive immediate warnings if any course attendance drops below 75% threshold</p>
            </div>
            <input 
              type="checkbox" 
              checked={attendanceWarnings} 
              onChange={(e) => { setAttendanceWarnings(e.target.checked); triggerSaveNotification('Attendance alerts preference updated'); }} 
              className="w-4 h-4 rounded text-[#7C3AED] accent-[#7C3AED] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/30 cursor-pointer">
            <div>
              <span className="font-bold text-[#242038] dark:text-purple-100">Upcoming Exam & Project Submission Deadlines</span>
              <p className="text-[10px] text-[#77738C] dark:text-purple-300 mt-0.5">Daily digests of internal tests, quizzes, and project milestones</p>
            </div>
            <input 
              type="checkbox" 
              checked={examReminders} 
              onChange={(e) => { setExamReminders(e.target.checked); triggerSaveNotification('Exam reminders preference updated'); }} 
              className="w-4 h-4 rounded text-[#7C3AED] accent-[#7C3AED] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/30 cursor-pointer">
            <div>
              <span className="font-bold text-[#242038] dark:text-purple-100">Gamified Class Leaderboard Profile Visibility</span>
              <p className="text-[10px] text-[#77738C] dark:text-purple-300 mt-0.5">Allow classmates to view your progression milestones (academic risk details remain strictly private)</p>
            </div>
            <input 
              type="checkbox" 
              checked={leaderboardVisible} 
              onChange={(e) => { setLeaderboardVisible(e.target.checked); triggerSaveNotification('Leaderboard visibility updated'); }} 
              className="w-4 h-4 rounded text-[#7C3AED] accent-[#7C3AED] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* SECTION 6: Connected Account & Sign Out */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-900/30 flex items-center justify-center text-[#7C3AED] dark:text-purple-300">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
              Connected Institutional Profile
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300">Active student session and college association</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-[#242038] dark:text-purple-100">{currentStudent.name} ({currentStudent.rollNo})</p>
            <p className="text-[#77738C] dark:text-purple-300">{currentStudent.email}</p>
            <p className="text-[#6D28D9] dark:text-purple-300 font-semibold mt-0.5">{collegeName}</p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Campus IQ</span>
          </button>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  Trophy, 
  Activity, 
  Award, 
  PieChart, 
  Sparkles, 
  LogOut, 
  BarChart3,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  mobileOpen, 
  setMobileOpen,
  collapsed: externalCollapsed,
  setCollapsed: externalSetCollapsed
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentStudent,
    logout, 
    isAdminMode, 
    setIsAdminMode 
  } = useApp();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setCollapsed = externalSetCollapsed || setInternalCollapsed;

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'my-learning', label: '1. My Learning', icon: BookOpen },
    { id: 'academic-calendar', label: '2. Academic Calendar', icon: Calendar },
    { id: 'student-info', label: '3. Student Info', icon: UserCheck },
    { id: 'your-participation', label: '4. Your Participation', icon: Trophy },
    { id: 'success-score', label: '5. Success Score', icon: Activity },
    { id: 'badges', label: '6. Badges', icon: Award },
    { id: 'student-segmentation', label: '7. Student Segmentation', icon: PieChart },
    { id: 'ai-assistant', label: '8. AI Assistant', icon: Sparkles },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsAdminMode(false);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-[#242038]/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 bg-white/95 dark:bg-[#1D172E]/95 backdrop-blur-xl border-r border-[#E9E4F5] dark:border-[#332A50] 
        flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'w-20' : 'w-64 md:w-72'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E9E4F5] dark:border-[#332A50] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white shadow-md shadow-violet-500/25 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-[#242038] dark:text-white tracking-tight font-heading">
                    Campus IQ
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white tracking-wide">
                    AI
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#77738C] dark:text-[#A59DB8] truncate mt-0.5">
                  Student Success Platform
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-xl text-[#77738C] hover:text-[#6D28D9] dark:hover:text-[#A78BFA] hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar width"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">
              Platform Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !isAdminMode;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-[#EDE9FE] dark:bg-[#2E244A] text-[#6D28D9] dark:text-[#EDE9FE] font-bold shadow-sm'
                    : 'text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] hover:text-[#242038] dark:hover:text-white font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#7C3AED] dark:text-[#A78BFA]' : 'text-[#77738C] dark:text-[#A59DB8]'
                }`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* Administrator Mode */}
          <div className="pt-4">
            {!collapsed && (
              <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8]">
                Governance
              </div>
            )}
            <button
              onClick={() => {
                setIsAdminMode(true);
                setActiveTab('admin-insights');
                setMobileOpen(false);
              }}
              title={collapsed ? "Administrator Insights" : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                collapsed ? 'justify-center' : ''
              } ${
                isAdminMode || activeTab === 'admin-insights'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-bold shadow-md shadow-violet-500/20'
                  : 'text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] hover:text-[#242038] dark:hover:text-white font-medium'
              }`}
            >
              <BarChart3 className={`w-4 h-4 shrink-0 ${isAdminMode ? 'text-white' : 'text-[#77738C] dark:text-[#A59DB8]'}`} />
              {!collapsed && <span className="truncate">Administrator Insights</span>}
            </button>
          </div>
        </div>

        {/* Footer: Logged In Student Avatar & Sign Out */}
        <div className="p-4 border-t border-[#E9E4F5] dark:border-[#332A50] space-y-3 shrink-0 bg-white/50 dark:bg-[#1D172E]/50">
          {!collapsed ? (
            <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50]">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#7C3AED]/30 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#242038] dark:text-white truncate">
                    {currentStudent.name}
                  </p>
                  <p className="text-[10px] text-[#77738C] dark:text-[#A59DB8] font-mono truncate">
                    {currentStudent.rollNo}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#7C3AED]/30"
                title={`${currentStudent.name} (${currentStudent.rollNo})`}
              />
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

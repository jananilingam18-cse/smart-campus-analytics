import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CollegeSetupModal } from './components/CollegeSetupModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { WalkthroughModal } from './components/WalkthroughModal';

import { Dashboard } from './pages/Dashboard';
import { MyLearning } from './pages/MyLearning';
import { AcademicCalendar } from './pages/AcademicCalendar';
import { StudentInfo } from './pages/StudentInfo';
import { YourParticipation } from './pages/YourParticipation';
import { SuccessScorePage } from './pages/SuccessScorePage';
import { BadgesPage } from './pages/BadgesPage';
import { SegmentationPage } from './pages/SegmentationPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminInsightsPage } from './pages/AdminInsightsPage';
import { LoginPage } from './pages/LoginPage';
import { Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeTab, isAdminMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    if (isAdminMode || activeTab === 'admin-insights') {
      return <AdminInsightsPage />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-learning':
        return <MyLearning />;
      case 'academic-calendar':
        return <AcademicCalendar />;
      case 'student-info':
        return <StudentInfo />;
      case 'your-participation':
        return <YourParticipation />;
      case 'success-score':
        return <SuccessScorePage />;
      case 'badges':
        return <BadgesPage />;
      case 'student-segmentation':
        return <SegmentationPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-[#FAF9FF] flex transition-colors duration-200 relative selection:bg-[#7C3AED] selection:text-white">
      
      {/* Subtle Atmospheric Mist Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-36 -left-36 w-[34rem] h-[34rem] rounded-full bg-violet-200/35 dark:bg-violet-900/15 blur-3xl" />
        <div className="absolute top-1/4 -right-36 w-[36rem] h-[36rem] rounded-full bg-purple-200/30 dark:bg-purple-950/20 blur-3xl" />
        <div className="absolute -bottom-36 left-1/4 w-[34rem] h-[34rem] rounded-full bg-indigo-200/25 dark:bg-indigo-950/20 blur-3xl" />
      </div>

      {/* Persistent Left Sidebar */}
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        setMobileOpen={setMobileMenuOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64 md:lg:pl-72'
      }`}>
        
        {/* Mobile Header Bar with Hamburger */}
        <div className="lg:hidden bg-white/90 dark:bg-[#1D172E]/90 backdrop-blur-md border-b border-[#E9E4F5] dark:border-[#332A50] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF] dark:hover:bg-[#26203B] hover:text-[#6D28D9] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-[#242038] dark:text-white font-heading">
              Campus IQ
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white">
              AI
            </span>
          </div>
          <div className="w-8" />
        </div>

        {/* Top Navigation */}
        <Header />

        {/* Main Routed Page Content */}
        <main className="flex-1 pb-16">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals */}
      <CollegeSetupModal />
      <HowItWorksModal />
      <WalkthroughModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;

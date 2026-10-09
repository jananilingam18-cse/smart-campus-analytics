import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  NavigationTab, 
  ThemeType, 
  AppearanceMode,
  FontSizeScale, 
  ScoringWeights, 
  LearningResource, 
  CalendarEvent, 
  NotificationItem, 
  EventRecord,
  InstitutionalMetrics
} from '../types';
import { 
  MOCK_STUDENTS, 
  MOCK_LEARNING_RESOURCES, 
  MOCK_CALENDAR_EVENTS, 
  MOCK_NOTIFICATIONS, 
  DEFAULT_COLLEGE_NAME 
} from '../data/mockData';
import { DEFAULT_WEIGHTS, calculateStudentSuccessScore } from '../utils/scoring';

interface AppContextType {
  collegeName: string;
  setCollegeName: (name: string) => void;
  currentStudent: Student;
  allStudents: Student[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  appearanceMode: AppearanceMode;
  setAppearanceMode: (mode: AppearanceMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;
  resetToDefaultSettings: () => void;
  scoringWeights: ScoringWeights;
  setScoringWeights: (weights: ScoringWeights) => void;
  learningResources: LearningResource[];
  calendarEvents: CalendarEvent[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  isAuthenticated: boolean;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  isCollegeSetupOpen: boolean;
  setIsCollegeSetupOpen: (open: boolean) => void;
  isWalkthroughOpen: boolean;
  setIsWalkthroughOpen: (open: boolean) => void;
  isHowItWorksOpen: boolean;
  setIsHowItWorksOpen: (open: boolean) => void;
  switchStudent: (studentId: string) => void;
  updateStudentProfile: (updated: Partial<Student>) => void;
  uploadCertificate: (event: EventRecord) => void;
  uploadLearningResource: (resource: LearningResource) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  login: (college: string, studentId?: string, asAdmin?: boolean) => void;
  logout: () => void;
  institutionalMetrics: InstitutionalMetrics;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collegeName, setCollegeNameState] = useState<string>(() => {
    return localStorage.getItem('campusiq_college') || DEFAULT_COLLEGE_NAME;
  });

  const [allStudents, setAllStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [currentStudentId, setCurrentStudentId] = useState<string>('stud-1'); // Priya Sharma
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('campusiq_theme');
    if (saved === 'ocean' || saved === 'ocean-blue') return 'ocean-blue';
    if (saved === 'emerald' || saved === 'emerald-green') return 'emerald-green';
    if (saved === 'sunset-orange') return 'sunset-orange';
    return 'royal-purple';
  });

  const [appearanceMode, setAppearanceModeState] = useState<AppearanceMode>(() => {
    return (localStorage.getItem('campusiq_appearance_mode') as AppearanceMode) || 'light';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('campusiq_appearance_mode');
    if (savedMode === 'dark') return true;
    if (savedMode === 'system') return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    return localStorage.getItem('campusiq_dark') === 'true';
  });

  const [fontSize, setFontSizeState] = useState<FontSizeScale>(() => {
    return (localStorage.getItem('campusiq_fontsize') as FontSizeScale) || 'md';
  });

  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [learningResources, setLearningResources] = useState<LearningResource[]>(MOCK_LEARNING_RESOURCES);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('campusiq_auth') === 'true';
  });
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isCollegeSetupOpen, setIsCollegeSetupOpen] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Sync appearanceMode to isDarkMode
  useEffect(() => {
    const updateDarkState = () => {
      if (appearanceMode === 'dark') {
        setIsDarkMode(true);
      } else if (appearanceMode === 'light') {
        setIsDarkMode(false);
      } else {
        const matchesDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(matchesDark || false);
      }
    };

    updateDarkState();

    if (appearanceMode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [appearanceMode]);

  // Sync theme to body and root classes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Dark mode
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('campusiq_dark', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('campusiq_dark', 'false');
    }

    // Font size scaling
    root.classList.remove('font-sm', 'font-md', 'font-lg', 'font-xl');
    root.classList.add(`font-${fontSize}`);
    localStorage.setItem('campusiq_fontsize', fontSize);

    // Color theme
    body.classList.remove('theme-royal-purple', 'theme-ocean-blue', 'theme-emerald-green', 'theme-sunset-orange', 'theme-ocean', 'theme-violet', 'theme-emerald', 'theme-neutral', 'theme-classic');
    body.classList.add(`theme-${theme}`);
    localStorage.setItem('campusiq_theme', theme);
  }, [theme, isDarkMode, fontSize]);

  const setCollegeName = (name: string) => {
    setCollegeNameState(name);
    localStorage.setItem('campusiq_college', name);
  };

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const setAppearanceMode = (mode: AppearanceMode) => {
    setAppearanceModeState(mode);
    localStorage.setItem('campusiq_appearance_mode', mode);
    if (mode === 'dark') {
      setIsDarkMode(true);
    } else if (mode === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches || false);
    }
  };

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    setAppearanceMode(nextDark ? 'dark' : 'light');
  };

  const setFontSize = (size: FontSizeScale) => {
    setFontSizeState(size);
  };

  const resetToDefaultSettings = () => {
    setThemeState('royal-purple');
    localStorage.setItem('campusiq_theme', 'royal-purple');
    setAppearanceMode('light');
    setFontSizeState('md');
    localStorage.setItem('campusiq_fontsize', 'md');
    setScoringWeights(DEFAULT_WEIGHTS);
  };

  const currentStudent = allStudents.find(s => s.id === currentStudentId) || allStudents[0];

  const switchStudent = (studentId: string) => {
    const target = allStudents.find(s => s.id === studentId);
    if (target) {
      setCurrentStudentId(studentId);
      setIsAdminMode(false);
    }
  };

  const updateStudentProfile = (updated: Partial<Student>) => {
    setAllStudents(prev => prev.map(s => {
      if (s.id === currentStudentId) {
        return { ...s, ...updated };
      }
      return s;
    }));
  };

  const uploadCertificate = (event: EventRecord) => {
    setAllStudents(prev => prev.map(s => {
      if (s.id === currentStudentId) {
        return {
          ...s,
          eventParticipations: [event, ...(s.eventParticipations || [])]
        };
      }
      return s;
    }));

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Certificate Uploaded Successfully',
      message: `${event.name} certificate has been sent to faculty for verification.`,
      timestamp: 'Just now',
      type: 'event',
      priority: 'normal',
      read: false,
      linkTab: 'your-participation'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const uploadLearningResource = (resource: LearningResource) => {
    setLearningResources(prev => [resource, ...prev]);
  };

  const addCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const login = (college: string, studentId?: string, asAdmin?: boolean) => {
    setCollegeName(college);
    setIsAuthenticated(true);
    localStorage.setItem('campusiq_auth', 'true');
    if (asAdmin) {
      setIsAdminMode(true);
      setActiveTab('admin-insights');
    } else {
      setIsAdminMode(false);
      if (studentId) {
        setCurrentStudentId(studentId);
      }
      setActiveTab('dashboard');
    }
    setIsCollegeSetupOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('campusiq_auth');
    setIsCollegeSetupOpen(true);
  };

  // Compute institutional metrics across entire cohort
  const institutionalMetrics: InstitutionalMetrics = (() => {
    let totalScoreSum = 0;
    let scoredCount = 0;
    let atRisk = 0;
    let shortageCount = 0;
    let assignmentTotal = 0;
    let validAssignmentStudents = 0;
    let cgpaSum = 0;
    let validCgpaStudents = 0;

    const segments = {
      gradeA: 0,
      gradeB: 0,
      gradeC: 0,
      gradeD: 0,
      notRated: 0
    };

    allStudents.forEach(student => {
      const breakdown = calculateStudentSuccessScore(student, scoringWeights);
      
      if (breakdown.gradeSegment === 'Not Yet Rated') {
        segments.notRated += 1;
      } else {
        scoredCount += 1;
        totalScoreSum += breakdown.overallScore;

        if (breakdown.gradeSegment === 'Grade A') segments.gradeA += 1;
        else if (breakdown.gradeSegment === 'Grade B') segments.gradeB += 1;
        else if (breakdown.gradeSegment === 'Grade C') segments.gradeC += 1;
        else if (breakdown.gradeSegment === 'Grade D') segments.gradeD += 1;
      }

      if (breakdown.overallScore < 50 && !student.hasInsufficientData) {
        atRisk += 1;
      }

      const hasShortage = (student.attendanceRecords || []).some(s => {
        return s.total > 0 && ((s.attended / s.total) * 100 < 75);
      });
      if (hasShortage) {
        shortageCount += 1;
      }

      if (student.assignments && student.assignments.length > 0) {
        const completed = student.assignments.filter(a => a.status === 'Submitted').length;
        assignmentTotal += (completed / student.assignments.length) * 100;
        validAssignmentStudents += 1;
      }

      if (student.academicHistory && student.academicHistory.length > 0) {
        const avgSgpa = student.academicHistory.reduce((sum, h) => sum + h.sgpa, 0) / student.academicHistory.length;
        cgpaSum += avgSgpa;
        validCgpaStudents += 1;
      }
    });

    return {
      totalStudents: allStudents.length,
      averageSuccessScore: scoredCount > 0 ? Number((totalScoreSum / scoredCount).toFixed(1)) : 0,
      atRiskCount: atRisk,
      attendanceShortageCount: shortageCount,
      assignmentCompletionAvg: validAssignmentStudents > 0 ? Number((assignmentTotal / validAssignmentStudents).toFixed(1)) : 0,
      academicAverageCgpa: validCgpaStudents > 0 ? Number((cgpaSum / validCgpaStudents).toFixed(2)) : 0,
      segmentDistribution: segments
    };
  })();

  return (
    <AppContext.Provider
      value={{
        collegeName,
        setCollegeName,
        currentStudent,
        allStudents,
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        appearanceMode,
        setAppearanceMode,
        isDarkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        resetToDefaultSettings,
        scoringWeights,
        setScoringWeights,
        learningResources,
        calendarEvents,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        clearAllNotifications,
        isAuthenticated,
        isAdminMode,
        setIsAdminMode,
        isCollegeSetupOpen,
        setIsCollegeSetupOpen,
        isWalkthroughOpen,
        setIsWalkthroughOpen,
        isHowItWorksOpen,
        setIsHowItWorksOpen,
        switchStudent,
        updateStudentProfile,
        uploadCertificate,
        uploadLearningResource,
        addCalendarEvent,
        login,
        logout,
        institutionalMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {fconst [allStudents, setAllStudents]

  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

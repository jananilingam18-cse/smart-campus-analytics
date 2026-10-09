export type NavigationTab = 
  | 'dashboard'
  | 'my-learning'
  | 'academic-calendar'
  | 'student-info'
  | 'your-participation'
  | 'success-score'
  | 'badges'
  | 'student-segmentation'
  | 'ai-assistant'
  | 'settings'
  | 'admin-insights';

export type StudentGradeSegment = 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D' | 'Not Yet Rated';

export type ThemeType = 'royal-purple' | 'ocean-blue' | 'emerald-green' | 'sunset-orange' | 'violet' | 'classic' | 'ocean' | 'emerald' | 'neutral';
export type AppearanceMode = 'light' | 'dark' | 'system';
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  facultyName: string;
  credits: number;
}

export interface Assignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  dueDate: string;
  status: 'Submitted' | 'Pending' | 'Overdue';
  marksObtained?: number;
  maxMarks: number;
  completionPercentage: number;
  submissionDate?: string;
  feedback?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  facultyName: string;
}

export interface ExamScheduleItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  time: string;
  venue: string;
  examType: 'Internal Assessment' | 'Practical Exam' | 'Semester End Exam';
}

export interface SubjectGrade {
  subjectCode: string;
  subjectName: string;
  grade: string;
  marks: number;
  maxMarks: number;
  credits: number;
  resultStatus: 'Pass' | 'Fail' | 'Backlog';
}

export interface AcademicResultSemester {
  semester: number;
  sgpa: number;
  creditsEarned: number;
  totalCredits: number;
  subjects: SubjectGrade[];
}

export interface RevaluationItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  initialGrade: string;
  applicationStatus: 'Eligible' | 'Applied' | 'Under Review' | 'Result Published';
  deadline: string;
  revisedGrade?: string;
  appliedDate?: string;
  feePaid: boolean;
}

export interface EventRecord {
  id: string;
  name: string;
  category: 'Technical' | 'Non-Technical';
  subcategory: string;
  date: string;
  status: 'Winner' | '1st Runner Up' | 'Finalist' | 'Participant' | 'Organizer';
  certificateUrl?: string;
  certificateName?: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected';
  pointsAwarded: number;
  description: string;
  certificateIssuedBy?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'Attendance' | 'Academic Performance' | 'Event Participation' | 'All-Rounder';
  icon: string;
  earned: boolean;
  dateEarned?: string;
  unlockProgress: number; // 0 to 100
  unlockRequirement: string;
  isWarningLocked?: boolean;
  warningReason?: string;
}

export interface PlacementReadiness {
  assessed: boolean;
  overallPercent: number;
  codingScore: number;
  aptitudeScore: number;
  mockInterviewScore: number;
  projectsCount: number;
  status: 'High' | 'Moderate' | 'Low' | 'Needs Attention' | 'Not Assessed';
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  avatarUrl: string;
  department: string;
  course: string;
  branch: string;
  year: number;
  semester: number;
  classSection: string;
  mentorName: string;
  mentorEmail: string;
  mentorCabin: string;
  phone: string;
  attendanceRecords: SubjectAttendance[];
  assignments: Assignment[];
  timetable: TimetableSlot[];
  examSchedule: ExamScheduleItem[];
  academicHistory: AcademicResultSemester[];
  revaluations: RevaluationItem[];
  eventParticipations: EventRecord[];
  placementReadiness: PlacementReadiness;
  hasInsufficientData?: boolean;
}

export interface ScoringWeights {
  attendanceWeight: number; // default 0.25
  academicWeight: number;   // default 0.40
  participationWeight: number; // default 0.15
  assignmentWeight: number; // default 0.20
}

export interface ExplainabilityFactor {
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  scoreDelta: number;
  category: 'attendance' | 'academic' | 'participation' | 'assignment';
}

export interface SuccessScoreBreakdown {
  overallScore: number;
  previousScore: number;
  attendanceScore: number;
  academicScore: number;
  participationScore: number;
  assignmentScore: number;
  isProvisional: boolean;
  provisionalReason?: string;
  calculationDate: string;
  strongestIndicator: string;
  weakestIndicator: string;
  level: number;
  levelName: string;
  pointsToNextLevel: number;
  nextMilestone: string;
  nextActionSteps: string[];
  explainabilityReasons: ExplainabilityFactor[];
  gradeSegment: StudentGradeSegment;
}

export interface LearningResource {
  id: string;
  title: string;
  subject: string;
  description: string;
  uploadDate: string;
  fileSize: string;
  fileType: 'pdf' | 'notes' | 'slides' | 'lab';
  uploadedBy: string;
  sampleDocumentTitle: string;
  sampleContent: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Internal' | 'Semester' | 'Assignment' | 'Practical' | 'Revaluation' | 'Event' | 'Holiday';
  description: string;
  time?: string;
  venue?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'exam' | 'deadline' | 'attendance_warning' | 'result' | 'revaluation' | 'badge' | 'score' | 'event';
  priority: 'high' | 'medium' | 'normal';
  read: boolean;
  linkTab?: NavigationTab;
}

export interface InstitutionalMetrics {
  totalStudents: number;
  averageSuccessScore: number;
  atRiskCount: number;
  attendanceShortageCount: number;
  assignmentCompletionAvg: number;
  academicAverageCgpa: number;
  segmentDistribution: {
    gradeA: number;
    gradeB: number;
    gradeC: number;
    gradeD: number;
    notRated: number;
  };
}

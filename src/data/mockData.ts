import { 
  Student, 
  LearningResource, 
  CalendarEvent, 
  NotificationItem, 
  TimetableSlot, 
  ExamScheduleItem, 
  SubjectAttendance, 
  Assignment, 
  AcademicResultSemester,
  RevaluationItem,
  EventRecord
} from '../types';

export const DEFAULT_COLLEGE_NAME = "KPMG Institute of Technology & Advanced Analytics";

const standardTimetable: TimetableSlot[] = [
  { id: 'tt-1', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', room: 'L-301', facultyName: 'Dr. Ramesh Sengupta' },
  { id: 'tt-2', day: 'Monday', startTime: '10:15 AM', endTime: '11:15 AM', subjectCode: 'CS502', subjectName: 'Database Management Systems', room: 'L-302', facultyName: 'Prof. Meenakshi Iyer' },
  { id: 'tt-3', day: 'Monday', startTime: '11:30 AM', endTime: '01:30 PM', subjectCode: 'CS505', subjectName: 'AI & Machine Learning Lab', room: 'Computing Lab 4', facultyName: 'Dr. Swaminathan N.' },
  { id: 'tt-4', day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', room: 'L-301', facultyName: 'Dr. K. Varma' },
  { id: 'tt-5', day: 'Tuesday', startTime: '10:15 AM', endTime: '11:15 AM', subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', room: 'L-205', facultyName: 'Prof. Anupama Roy' },
  { id: 'tt-6', day: 'Tuesday', startTime: '02:00 PM', endTime: '04:00 PM', subjectCode: 'CS506', subjectName: 'DSA Practical Lab', room: 'Computing Lab 2', facultyName: 'Dr. Ramesh Sengupta' },
  { id: 'tt-7', day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', room: 'L-301', facultyName: 'Dr. Ramesh Sengupta' },
  { id: 'tt-8', day: 'Wednesday', startTime: '10:15 AM', endTime: '11:15 AM', subjectCode: 'CS507', subjectName: 'Soft Skills & Corporate Aptitude', room: 'Auditorium 2', facultyName: 'Ms. Preeti Kapoor' },
  { id: 'tt-9', day: 'Thursday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS502', subjectName: 'Database Management Systems', room: 'L-302', facultyName: 'Prof. Meenakshi Iyer' },
  { id: 'tt-10', day: 'Thursday', startTime: '11:30 AM', endTime: '12:30 PM', subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', room: 'L-205', facultyName: 'Prof. Anupama Roy' },
  { id: 'tt-11', day: 'Friday', startTime: '10:15 AM', endTime: '11:15 AM', subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', room: 'L-301', facultyName: 'Dr. K. Varma' },
  { id: 'tt-12', day: 'Friday', startTime: '02:00 PM', endTime: '03:30 PM', subjectCode: 'CS508', subjectName: 'Industry Capstone & Mentorship', room: 'Seminar Hall 1', facultyName: 'KPMG Industry Mentors' }
];

const standardExams: ExamScheduleItem[] = [
  { id: 'ex-1', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', date: '2026-10-24', time: '10:00 AM - 01:00 PM', venue: 'Exam Hall A (Block 3)', examType: 'Internal Assessment' },
  { id: 'ex-2', subjectCode: 'CS502', subjectName: 'Database Management Systems', date: '2026-10-27', time: '10:00 AM - 01:00 PM', venue: 'Exam Hall B (Block 3)', examType: 'Internal Assessment' },
  { id: 'ex-3', subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', date: '2026-10-30', time: '02:00 PM - 05:00 PM', venue: 'Exam Hall A (Block 3)', examType: 'Internal Assessment' },
  { id: 'ex-4', subjectCode: 'CS505', subjectName: 'AI & Machine Learning Lab', date: '2026-11-08', time: '09:00 AM - 12:00 PM', venue: 'Computing Lab 4', examType: 'Practical Exam' },
  { id: 'ex-5', subjectCode: 'CS506', subjectName: 'DSA Practical Lab', date: '2026-11-10', time: '02:00 PM - 05:00 PM', venue: 'Computing Lab 2', examType: 'Practical Exam' },
  { id: 'ex-6', subjectCode: 'CS501', subjectName: 'Data Structures End-Term', date: '2026-12-05', time: '09:30 AM - 12:30 PM', venue: 'Main Auditorium', examType: 'Semester End Exam' }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Priya Sharma',
    rollNo: '23CS101',
    email: 'priya.sharma@campusiq.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & AI',
    branch: 'AI & Analytics (KPMG Track)',
    year: 3,
    semester: 5,
    classSection: 'CSE-A',
    mentorName: 'Dr. Ramesh Sengupta',
    mentorEmail: 'r.sengupta@campusiq.edu.in',
    mentorCabin: 'Faculty Tower Room 412',
    phone: '+91 98765 43210',
    attendanceRecords: [
      { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', attended: 47, total: 50, facultyName: 'Dr. Ramesh Sengupta', credits: 4 },
      { subjectCode: 'CS502', subjectName: 'Database Management Systems', attended: 44, total: 46, facultyName: 'Prof. Meenakshi Iyer', credits: 4 },
      { subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', attended: 40, total: 42, facultyName: 'Dr. K. Varma', credits: 4 },
      { subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', attended: 37, total: 38, facultyName: 'Prof. Anupama Roy', credits: 3 },
      { subjectCode: 'CS505', subjectName: 'AI & ML Lab', attended: 23, total: 24, facultyName: 'Dr. Swaminathan N.', credits: 2 }
    ],
    assignments: [
      { id: 'as-1', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', title: 'AVL Tree & Red-Black Tree Implementation', dueDate: '2026-10-14', status: 'Submitted', marksObtained: 29, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-11' },
      { id: 'as-2', subjectCode: 'CS502', subjectName: 'Database Management Systems', title: 'Distributed Transaction & 2PC Protocol Simulation', dueDate: '2026-10-18', status: 'Submitted', marksObtained: 28, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-15' },
      { id: 'as-3', subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', title: 'Linux Kernel Semaphore & Deadlock Detection', dueDate: '2026-10-22', status: 'Submitted', marksObtained: 30, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-19' },
      { id: 'as-4', subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', title: 'Kubernetes Cluster Helm Chart Deployment', dueDate: '2026-10-29', status: 'Submitted', marksObtained: 27, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-25' }
    ],
    timetable: standardTimetable,
    examSchedule: standardExams,
    academicHistory: [
      { semester: 1, sgpa: 9.15, creditsEarned: 22, totalCredits: 22, subjects: [] },
      { semester: 2, sgpa: 9.30, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 3, sgpa: 9.45, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 4, sgpa: 9.55, creditsEarned: 26, totalCredits: 26, subjects: [
        { subjectCode: 'CS401', subjectName: 'Object Oriented Design', grade: 'O (Outstanding)', marks: 96, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS402', subjectName: 'Theory of Computation', grade: 'A+ (Excellent)', marks: 91, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS403', subjectName: 'Computer Networks', grade: 'O (Outstanding)', marks: 95, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS404', subjectName: 'Software Engineering', grade: 'A+ (Excellent)', marks: 92, maxMarks: 100, credits: 4, resultStatus: 'Pass' }
      ]}
    ],
    revaluations: [
      { id: 'rev-1', subjectCode: 'CS402', subjectName: 'Theory of Computation', semester: 4, initialGrade: 'A', applicationStatus: 'Result Published', deadline: '2026-08-30', revisedGrade: 'A+', feePaid: true }
    ],
    eventParticipations: [
      { id: 'ev-1', name: 'Smart India Hackathon 2026 - Regional Finals', category: 'Technical', subcategory: 'Hackathon', date: '2026-09-12', status: 'Winner', verificationStatus: 'Verified', pointsAwarded: 25, description: 'Built an AI predictive civic infrastructure monitoring pipeline.', certificateUrl: '/certificates/sih-winner.pdf', certificateName: 'SIH_2026_Winner_Priya.pdf' },
      { id: 'ev-2', name: 'KPMG GenAI Case Challenge 2026', category: 'Technical', subcategory: 'Case Competition', date: '2026-09-28', status: '1st Runner Up', verificationStatus: 'Verified', pointsAwarded: 20, description: 'Engineered an automated ESG compliance audit co-pilot.', certificateUrl: '/certificates/kpmg-challenge.pdf', certificateName: 'KPMG_Case_Challenge_Cert.pdf' },
      { id: 'ev-3', name: 'National Collegiate Debate Championship', category: 'Non-Technical', subcategory: 'Debate', date: '2026-08-15', status: 'Finalist', verificationStatus: 'Verified', pointsAwarded: 15, description: 'Represented institute on Ethics in Autonomous Systems in Delhi.' },
      { id: 'ev-4', name: 'ACM ICPC Regional Preliminary Round', category: 'Technical', subcategory: 'Coding Competition', date: '2026-10-02', status: 'Winner', verificationStatus: 'Verified', pointsAwarded: 25, description: 'Ranked top 5 in state coding league.' }
    ],
    placementReadiness: {
      assessed: true,
      overallPercent: 94,
      codingScore: 96,
      aptitudeScore: 92,
      mockInterviewScore: 95,
      projectsCount: 5,
      status: 'High'
    }
  },
  {
    id: 'stud-2',
    name: 'Rohan Verma',
    rollNo: '23CS102',
    email: 'rohan.verma@campusiq.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    branch: 'Software Systems',
    year: 3,
    semester: 5,
    classSection: 'CSE-A',
    mentorName: 'Dr. Ramesh Sengupta',
    mentorEmail: 'r.sengupta@campusiq.edu.in',
    mentorCabin: 'Faculty Tower Room 412',
    phone: '+91 98451 12345',
    attendanceRecords: [
      { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', attended: 34, total: 50, facultyName: 'Dr. Ramesh Sengupta', credits: 4 }, // 68.0% -> ATTENDANCE SHORTAGE!
      { subjectCode: 'CS502', subjectName: 'Database Management Systems', attended: 36, total: 46, facultyName: 'Prof. Meenakshi Iyer', credits: 4 }, // 78.2%
      { subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', attended: 33, total: 42, facultyName: 'Dr. K. Varma', credits: 4 }, // 78.5%
      { subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', attended: 31, total: 38, facultyName: 'Prof. Anupama Roy', credits: 3 }, // 81.5%
      { subjectCode: 'CS505', subjectName: 'AI & ML Lab', attended: 19, total: 24, facultyName: 'Dr. Swaminathan N.', credits: 2 } // 79.1%
    ],
    assignments: [
      { id: 'as-201', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', title: 'AVL Tree & Red-Black Tree Implementation', dueDate: '2026-10-14', status: 'Submitted', marksObtained: 21, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-13' },
      { id: 'as-202', subjectCode: 'CS502', subjectName: 'Database Management Systems', title: 'Distributed Transaction & 2PC Protocol Simulation', dueDate: '2026-10-18', status: 'Overdue', marksObtained: 0, maxMarks: 30, completionPercentage: 40 },
      { id: 'as-203', subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', title: 'Linux Kernel Semaphore & Deadlock Detection', dueDate: '2026-10-22', status: 'Pending', marksObtained: 0, maxMarks: 30, completionPercentage: 60 }
    ],
    timetable: standardTimetable,
    examSchedule: standardExams,
    academicHistory: [
      { semester: 1, sgpa: 7.2, creditsEarned: 22, totalCredits: 22, subjects: [] },
      { semester: 2, sgpa: 7.0, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 3, sgpa: 7.1, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 4, sgpa: 6.9, creditsEarned: 26, totalCredits: 26, subjects: [
        { subjectCode: 'CS401', subjectName: 'Object Oriented Design', grade: 'B+ (Good)', marks: 74, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS402', subjectName: 'Theory of Computation', grade: 'B (Above Average)', marks: 66, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS403', subjectName: 'Computer Networks', grade: 'B+ (Good)', marks: 72, maxMarks: 100, credits: 4, resultStatus: 'Pass' }
      ]}
    ],
    revaluations: [
      { id: 'rev-201', subjectCode: 'CS402', subjectName: 'Theory of Computation', semester: 4, initialGrade: 'B', applicationStatus: 'Under Review', deadline: '2026-10-31', feePaid: true }
    ],
    eventParticipations: [
      { id: 'ev-201', name: 'Inter-College Football Tournament', category: 'Non-Technical', subcategory: 'Sports', date: '2026-09-05', status: 'Participant', verificationStatus: 'Verified', pointsAwarded: 10, description: 'Forward striker in zonal campus championship.' }
    ],
    placementReadiness: {
      assessed: true,
      overallPercent: 62,
      codingScore: 65,
      aptitudeScore: 60,
      mockInterviewScore: 60,
      projectsCount: 2,
      status: 'Moderate'
    }
  },
  {
    id: 'stud-3',
    name: 'Ananya Patel',
    rollNo: '23CS103',
    email: 'ananya.patel@campusiq.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & AI',
    branch: 'AI & Machine Learning',
    year: 3,
    semester: 5,
    classSection: 'CSE-A',
    mentorName: 'Prof. Meenakshi Iyer',
    mentorEmail: 'm.iyer@campusiq.edu.in',
    mentorCabin: 'Faculty Tower Room 308',
    phone: '+91 97234 56789',
    attendanceRecords: [
      { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', attended: 43, total: 50, facultyName: 'Dr. Ramesh Sengupta', credits: 4 }, // 86%
      { subjectCode: 'CS502', subjectName: 'Database Management Systems', attended: 42, total: 46, facultyName: 'Prof. Meenakshi Iyer', credits: 4 }, // 91.3%
      { subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', attended: 39, total: 42, facultyName: 'Dr. K. Varma', credits: 4 }, // 92.8%
      { subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', attended: 35, total: 38, facultyName: 'Prof. Anupama Roy', credits: 3 }, // 92.1%
      { subjectCode: 'CS505', subjectName: 'AI & ML Lab', attended: 22, total: 24, facultyName: 'Dr. Swaminathan N.', credits: 2 } // 91.6%
    ],
    assignments: [
      { id: 'as-301', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', title: 'AVL Tree & Red-Black Tree Implementation', dueDate: '2026-10-14', status: 'Submitted', marksObtained: 28, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-12' },
      { id: 'as-302', subjectCode: 'CS502', subjectName: 'Database Management Systems', title: 'Distributed Transaction & 2PC Protocol Simulation', dueDate: '2026-10-18', status: 'Submitted', marksObtained: 29, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-16' },
      { id: 'as-303', subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', title: 'Linux Kernel Semaphore & Deadlock Detection', dueDate: '2026-10-22', status: 'Submitted', marksObtained: 27, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-20' }
    ],
    timetable: standardTimetable,
    examSchedule: standardExams,
    academicHistory: [
      { semester: 1, sgpa: 9.0, creditsEarned: 22, totalCredits: 22, subjects: [] },
      { semester: 2, sgpa: 9.1, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 3, sgpa: 9.25, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 4, sgpa: 9.20, creditsEarned: 26, totalCredits: 26, subjects: [
        { subjectCode: 'CS401', subjectName: 'Object Oriented Design', grade: 'O (Outstanding)', marks: 94, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS402', subjectName: 'Theory of Computation', grade: 'A+ (Excellent)', marks: 90, maxMarks: 100, credits: 4, resultStatus: 'Pass' }
      ]}
    ],
    revaluations: [],
    eventParticipations: [
      { id: 'ev-301', name: 'IEEE International Conference on Big Data', category: 'Technical', subcategory: 'Paper Presentation', date: '2026-07-20', status: 'Participant', verificationStatus: 'Verified', pointsAwarded: 10, description: 'Presented research on federated analytics in healthcare.' }
    ],
    // High Academic Performance but Low Placement Readiness!
    placementReadiness: {
      assessed: true,
      overallPercent: 42,
      codingScore: 38,
      aptitudeScore: 45,
      mockInterviewScore: 40,
      projectsCount: 1,
      status: 'Low'
    }
  },
  {
    id: 'stud-4',
    name: 'Amit Kumar',
    rollNo: '23CS104',
    email: 'amit.kumar@campusiq.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    branch: 'Computer Science',
    year: 3,
    semester: 5,
    classSection: 'CSE-A',
    mentorName: 'Dr. Ramesh Sengupta',
    mentorEmail: 'r.sengupta@campusiq.edu.in',
    mentorCabin: 'Faculty Tower Room 412',
    phone: '+91 99123 45678',
    attendanceRecords: [
      { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', attended: 28, total: 50, facultyName: 'Dr. Ramesh Sengupta', credits: 4 }, // 56% -> SHORTAGE!
      { subjectCode: 'CS502', subjectName: 'Database Management Systems', attended: 29, total: 46, facultyName: 'Prof. Meenakshi Iyer', credits: 4 }, // 63% -> SHORTAGE!
      { subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', attended: 25, total: 42, facultyName: 'Dr. K. Varma', credits: 4 }, // 59.5% -> SHORTAGE!
      { subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', attended: 26, total: 38, facultyName: 'Prof. Anupama Roy', credits: 3 }, // 68.4% -> SHORTAGE!
      { subjectCode: 'CS505', subjectName: 'AI & ML Lab', attended: 14, total: 24, facultyName: 'Dr. Swaminathan N.', credits: 2 } // 58.3% -> SHORTAGE!
    ],
    assignments: [
      { id: 'as-401', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', title: 'AVL Tree & Red-Black Tree Implementation', dueDate: '2026-10-14', status: 'Overdue', marksObtained: 0, maxMarks: 30, completionPercentage: 0 },
      { id: 'as-402', subjectCode: 'CS502', subjectName: 'Database Management Systems', title: 'Distributed Transaction & 2PC Protocol Simulation', dueDate: '2026-10-18', status: 'Overdue', marksObtained: 0, maxMarks: 30, completionPercentage: 20 },
      { id: 'as-403', subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', title: 'Linux Kernel Semaphore & Deadlock Detection', dueDate: '2026-10-22', status: 'Pending', marksObtained: 0, maxMarks: 30, completionPercentage: 30 }
    ],
    timetable: standardTimetable,
    examSchedule: standardExams,
    academicHistory: [
      { semester: 1, sgpa: 6.2, creditsEarned: 22, totalCredits: 22, subjects: [] },
      { semester: 2, sgpa: 5.8, creditsEarned: 20, totalCredits: 24, subjects: [] },
      { semester: 3, sgpa: 5.6, creditsEarned: 20, totalCredits: 24, subjects: [] },
      { semester: 4, sgpa: 5.4, creditsEarned: 22, totalCredits: 26, subjects: [
        { subjectCode: 'CS401', subjectName: 'Object Oriented Design', grade: 'C (Average)', marks: 52, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS402', subjectName: 'Theory of Computation', grade: 'F (Backlog)', marks: 34, maxMarks: 100, credits: 4, resultStatus: 'Backlog' }
      ]}
    ],
    revaluations: [
      { id: 'rev-401', subjectCode: 'CS402', subjectName: 'Theory of Computation', semester: 4, initialGrade: 'F', applicationStatus: 'Applied', deadline: '2026-10-20', feePaid: true }
    ],
    eventParticipations: [],
    placementReadiness: {
      assessed: true,
      overallPercent: 32,
      codingScore: 28,
      aptitudeScore: 35,
      mockInterviewScore: 30,
      projectsCount: 0,
      status: 'Needs Attention'
    }
  },
  {
    id: 'stud-5',
    name: 'Sneha Reddy',
    rollNo: '23CS105',
    email: 'sneha.reddy@campusiq.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    branch: 'Information Technology',
    year: 3,
    semester: 5,
    classSection: 'CSE-A',
    mentorName: 'Prof. Anupama Roy',
    mentorEmail: 'a.roy@campusiq.edu.in',
    mentorCabin: 'Faculty Tower Room 204',
    phone: '+91 98111 22334',
    attendanceRecords: [
      { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', attended: 48, total: 50, facultyName: 'Dr. Ramesh Sengupta', credits: 4 }, // 96%
      { subjectCode: 'CS502', subjectName: 'Database Management Systems', attended: 44, total: 46, facultyName: 'Prof. Meenakshi Iyer', credits: 4 }, // 95.6%
      { subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', attended: 40, total: 42, facultyName: 'Dr. K. Varma', credits: 4 }, // 95.2%
      { subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', attended: 36, total: 38, facultyName: 'Prof. Anupama Roy', credits: 3 }, // 94.7%
      { subjectCode: 'CS505', subjectName: 'AI & ML Lab', attended: 23, total: 24, facultyName: 'Dr. Swaminathan N.', credits: 2 } // 95.8%
    ], // Strong Attendance 95%+ but Exam Results Weak (CGPA 6.4)
    assignments: [
      { id: 'as-501', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', title: 'AVL Tree & Red-Black Tree Implementation', dueDate: '2026-10-14', status: 'Submitted', marksObtained: 22, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-13' },
      { id: 'as-502', subjectCode: 'CS502', subjectName: 'Database Management Systems', title: 'Distributed Transaction & 2PC Protocol Simulation', dueDate: '2026-10-18', status: 'Submitted', marksObtained: 20, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-17' }
    ],
    timetable: standardTimetable,
    examSchedule: standardExams,
    academicHistory: [
      { semester: 1, sgpa: 6.6, creditsEarned: 22, totalCredits: 22, subjects: [] },
      { semester: 2, sgpa: 6.4, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 3, sgpa: 6.5, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 4, sgpa: 6.3, creditsEarned: 26, totalCredits: 26, subjects: [
        { subjectCode: 'CS401', subjectName: 'Object Oriented Design', grade: 'B (Above Average)', marks: 64, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS402', subjectName: 'Theory of Computation', grade: 'C (Average)', marks: 56, maxMarks: 100, credits: 4, resultStatus: 'Pass' }
      ]}
    ],
    revaluations: [],
    eventParticipations: [
      { id: 'ev-501', name: 'Youth Red Cross Blood Donation Camp', category: 'Non-Technical', subcategory: 'Volunteering', date: '2026-08-12', status: 'Organizer', verificationStatus: 'Verified', pointsAwarded: 12, description: 'Led student registration drive.' }
    ],
    placementReadiness: {
      assessed: true,
      overallPercent: 55,
      codingScore: 50,
      aptitudeScore: 65,
      mockInterviewScore: 55,
      projectsCount: 2,
      status: 'Moderate'
    }
  },
  {
    id: 'stud-6',
    name: 'Vikram Malhotra',
    rollNo: '23CS106',
    email: 'vikram.m@campusiq.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science & AI',
    branch: 'AI & Analytics',
    year: 3,
    semester: 5,
    classSection: 'CSE-A',
    mentorName: 'Dr. Swaminathan N.',
    mentorEmail: 's.swaminathan@campusiq.edu.in',
    mentorCabin: 'Faculty Tower Room 114',
    phone: '+91 98334 45566',
    attendanceRecords: [
      { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', attended: 44, total: 50, facultyName: 'Dr. Ramesh Sengupta', credits: 4 },
      { subjectCode: 'CS502', subjectName: 'Database Management Systems', attended: 41, total: 46, facultyName: 'Prof. Meenakshi Iyer', credits: 4 },
      { subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', attended: 37, total: 42, facultyName: 'Dr. K. Varma', credits: 4 },
      { subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', attended: 34, total: 38, facultyName: 'Prof. Anupama Roy', credits: 3 },
      { subjectCode: 'CS505', subjectName: 'AI & ML Lab', attended: 21, total: 24, facultyName: 'Dr. Swaminathan N.', credits: 2 }
    ],
    assignments: [
      { id: 'as-601', subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', title: 'AVL Tree & Red-Black Tree Implementation', dueDate: '2026-10-14', status: 'Submitted', marksObtained: 27, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-13' },
      { id: 'as-602', subjectCode: 'CS502', subjectName: 'Database Management Systems', title: 'Distributed Transaction & 2PC Protocol Simulation', dueDate: '2026-10-18', status: 'Submitted', marksObtained: 26, maxMarks: 30, completionPercentage: 100, submissionDate: '2026-10-16' }
    ],
    timetable: standardTimetable,
    examSchedule: standardExams,
    academicHistory: [
      { semester: 1, sgpa: 7.4, creditsEarned: 22, totalCredits: 22, subjects: [] },
      { semester: 2, sgpa: 7.8, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 3, sgpa: 8.2, creditsEarned: 24, totalCredits: 24, subjects: [] },
      { semester: 4, sgpa: 8.6, creditsEarned: 26, totalCredits: 26, subjects: [
        { subjectCode: 'CS401', subjectName: 'Object Oriented Design', grade: 'A+ (Excellent)', marks: 88, maxMarks: 100, credits: 4, resultStatus: 'Pass' },
        { subjectCode: 'CS402', subjectName: 'Theory of Computation', grade: 'A (Very Good)', marks: 83, maxMarks: 100, credits: 4, resultStatus: 'Pass' }
      ]}
    ],
    revaluations: [],
    eventParticipations: [
      { id: 'ev-601', name: 'Google Cloud Study Jam', category: 'Technical', subcategory: 'Workshop', date: '2026-09-08', status: 'Participant', verificationStatus: 'Verified', pointsAwarded: 10, description: 'Completed Kubernetes & Vertex AI skill badges.' },
      { id: 'ev-602', name: 'Campus Startup Pitch Expo', category: 'Technical', subcategory: 'Project Expo', date: '2026-09-22', status: 'Finalist', verificationStatus: 'Verified', pointsAwarded: 15, description: 'Pitched IoT Smart Irrigation startup prototype.' }
    ],
    placementReadiness: {
      assessed: true,
      overallPercent: 82,
      codingScore: 84,
      aptitudeScore: 80,
      mockInterviewScore: 82,
      projectsCount: 3,
      status: 'High'
    }
  },
  {
    id: 'stud-7',
    name: 'Arpan Banerjee',
    rollNo: '23CS107',
    email: 'arpan.b@campusiq.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    branch: 'Cybersecurity',
    year: 3,
    semester: 5,
    classSection: 'CSE-A',
    mentorName: 'Dr. K. Varma',
    mentorEmail: 'k.varma@campusiq.edu.in',
    mentorCabin: 'Faculty Tower Room 310',
    phone: '+91 98777 88990',
    attendanceRecords: [],
    assignments: [],
    timetable: standardTimetable,
    examSchedule: standardExams,
    academicHistory: [],
    revaluations: [],
    eventParticipations: [],
    placementReadiness: {
      assessed: false,
      overallPercent: 0,
      codingScore: 0,
      aptitudeScore: 0,
      mockInterviewScore: 0,
      projectsCount: 0,
      status: 'Not Assessed'
    },
    hasInsufficientData: true // Insufficient Data Persona -> "Not Yet Rated"
  },
  // Additional synthetic students for rich 32-student roster
  ...Array.from({ length: 25 }, (_, i) => {
    const idx = i + 8;
    const names = [
      'Meera Krishnan', 'Rahul Nair', 'Pooja Hegde', 'Karthik Sundaram', 'Divya Balaji',
      'Siddharth Joshi', 'Aditi Rao', 'Nikhil Deshmukh', 'Tanvi Sengupta', 'Manish Chawla',
      'Shreya Goswami', 'Abhishek Saxena', 'Kavya Nair', 'Harish Menon', 'Swati Kulshrestha',
      'Gaurav Mehta', 'Aishwarya Sen', 'Varun Kapoor', 'Ritu Bhattacharya', 'Pranav Anand',
      'Ishaan Khurana', 'Bhavna Kulkarni', 'Tarun Nambiar', 'Rhea Chakraborty', 'Deepak Verma'
    ];
    const name = names[i % names.length];
    const rollNo = `23CS${100 + idx}`;
    
    // Vary profiles across performance segments
    const isTop = idx % 5 === 0;
    const isMedium = idx % 3 === 0 && !isTop;
    const isShortage = idx % 7 === 0;
    
    const dsaAtt = isShortage ? 33 : isTop ? 48 : isMedium ? 41 : 38;
    const cgpaBase = isTop ? 9.2 : isMedium ? 7.6 : isShortage ? 6.2 : 8.1;
    
    return {
      id: `stud-${idx}`,
      name,
      rollNo,
      email: `${name.toLowerCase().replace(' ', '.')}@campusiq.edu.in`,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (idx * 123456) % 999999999}?auto=format&fit=crop&q=80&w=250`,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science & AI',
      branch: idx % 2 === 0 ? 'AI & Analytics (KPMG Track)' : 'Cloud & Systems',
      year: 3,
      semester: 5,
      classSection: idx % 2 === 0 ? 'CSE-A' : 'CSE-B',
      mentorName: idx % 2 === 0 ? 'Dr. Ramesh Sengupta' : 'Prof. Meenakshi Iyer',
      mentorEmail: idx % 2 === 0 ? 'r.sengupta@campusiq.edu.in' : 'm.iyer@campusiq.edu.in',
      mentorCabin: 'Faculty Tower Room 412',
      phone: `+91 98${idx}10 2345${idx % 10}`,
      attendanceRecords: [
        { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', attended: dsaAtt, total: 50, facultyName: 'Dr. Ramesh Sengupta', credits: 4 },
        { subjectCode: 'CS502', subjectName: 'Database Management Systems', attended: Math.round(dsaAtt * 0.92), total: 46, facultyName: 'Prof. Meenakshi Iyer', credits: 4 },
        { subjectCode: 'CS503', subjectName: 'Operating Systems & Kernels', attended: Math.round(dsaAtt * 0.84), total: 42, facultyName: 'Dr. K. Varma', credits: 4 },
        { subjectCode: 'CS504', subjectName: 'Cloud Computing & DevOps', attended: Math.round(dsaAtt * 0.76), total: 38, facultyName: 'Prof. Anupama Roy', credits: 3 },
        { subjectCode: 'CS505', subjectName: 'AI & ML Lab', attended: Math.round(dsaAtt * 0.48), total: 24, facultyName: 'Dr. Swaminathan N.', credits: 2 }
      ],
      assignments: [
        { id: `as-${idx}-1`, subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', title: 'AVL Tree Implementation', dueDate: '2026-10-14', status: isShortage ? 'Overdue' : 'Submitted', marksObtained: isTop ? 29 : 24, maxMarks: 30, completionPercentage: isShortage ? 30 : 100 },
        { id: `as-${idx}-2`, subjectCode: 'CS502', subjectName: 'Database Management Systems', title: 'Distributed Transaction Simulation', dueDate: '2026-10-18', status: 'Submitted', marksObtained: isTop ? 28 : 22, maxMarks: 30, completionPercentage: 100 }
      ],
      timetable: standardTimetable,
      examSchedule: standardExams,
      academicHistory: [
        { semester: 1, sgpa: cgpaBase - 0.2, creditsEarned: 22, totalCredits: 22, subjects: [] },
        { semester: 2, sgpa: cgpaBase - 0.1, creditsEarned: 24, totalCredits: 24, subjects: [] },
        { semester: 3, sgpa: cgpaBase, creditsEarned: 24, totalCredits: 24, subjects: [] },
        { semester: 4, sgpa: cgpaBase + 0.1, creditsEarned: 26, totalCredits: 26, subjects: [] }
      ],
      revaluations: [],
      eventParticipations: isTop ? [
        { id: `ev-${idx}-1`, name: 'National Hackathon Series', category: 'Technical' as const, subcategory: 'Hackathon', date: '2026-09-10', status: 'Finalist' as const, verificationStatus: 'Verified' as const, pointsAwarded: 15, description: 'Built intelligent agent pipeline.' },
        { id: `ev-${idx}-2`, name: 'KPMG Tech Conclave', category: 'Technical' as const, subcategory: 'Exposition', date: '2026-09-24', status: 'Participant' as const, verificationStatus: 'Verified' as const, pointsAwarded: 10, description: 'Exhibited enterprise cloud deployment.' }
      ] : [
        { id: `ev-${idx}-1`, name: 'Campus Sports Fest', category: 'Non-Technical' as const, subcategory: 'Athletics', date: '2026-08-20', status: 'Participant' as const, verificationStatus: 'Verified' as const, pointsAwarded: 10, description: 'Relay sprint participant.' }
      ],
      placementReadiness: {
        assessed: true,
        overallPercent: isTop ? 91 : isMedium ? 68 : 52,
        codingScore: isTop ? 94 : isMedium ? 65 : 48,
        aptitudeScore: isTop ? 88 : isMedium ? 70 : 55,
        mockInterviewScore: isTop ? 90 : isMedium ? 68 : 50,
        projectsCount: isTop ? 4 : 2,
        status: isTop ? 'High' : isMedium ? 'Moderate' : 'Low'
      }
    };
  })
];

export const MOCK_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Algorithmic Complexity: Master Handbook',
    subject: 'Data Structures & Algorithms',
    description: 'Comprehensive guide covering Balanced Trees, Red-Black Trees, Dynamic Programming, and Graph Traversals with C++ and Python implementations.',
    uploadDate: '2026-09-28',
    fileSize: '14.2 MB',
    fileType: 'pdf',
    uploadedBy: 'Dr. Ramesh Sengupta (Professor, CSE)',
    sampleDocumentTitle: 'DSA_Comprehensive_Master_Handbook_v5.pdf',
    sampleContent: [
      'CHAPTER 1: ASYMPTOTIC NOTATION AND RECURRENCE RELATIONS',
      '1.1 Big-O, Big-Omega, and Big-Theta formal mathematical definitions.',
      '1.2 Master Theorem for divide-and-conquer recurrences: T(n) = aT(n/b) + f(n).',
      'CHAPTER 2: BALANCED SEARCH TREES',
      '2.1 AVL Tree Self-Balancing Invariants: Height balance factor in {-1, 0, 1}.',
      '2.2 Single Left (LL) and Single Right (RR) Rotations.',
      '2.3 Double Rotations: Left-Right (LR) and Right-Left (RL) implementations.',
      '2.4 Red-Black Tree Properties and Color Balancing invariants.',
      'CHAPTER 3: GRAPH ALGORITHMS IN HIGH PERFORMANCE SYSTEMS',
      '3.1 Dijkstra Shortest Path with Fibonacci Heaps O(V log V + E).',
      '3.2 Bellman-Ford Negative Cycle Detection and Floyd-Warshall Dynamic Matrix.',
      '3.3 Tarjan Strongly Connected Components using DFS low-link values.'
    ]
  },
  {
    id: 'res-2',
    title: 'Operating Systems & Kernel Architecture: Concurrency & Virtual Memory',
    subject: 'Operating Systems & Kernels',
    description: 'Kernel level insights: Thread synchronization, Semaphores, Deadlock prevention, Paging, and Inverted Page Tables.',
    uploadDate: '2026-10-02',
    fileSize: '9.8 MB',
    fileType: 'pdf',
    uploadedBy: 'Dr. K. Varma (Associate Professor)',
    sampleDocumentTitle: 'OS_Kernel_Virtual_Memory_Architecture.pdf',
    sampleContent: [
      'MODULE 1: PROCESS SCHEDULING AND MULTI-CORE AFFINITY',
      '1.1 CFS (Completely Fair Scheduler) in Linux using Red-Black Trees of virtual runtime.',
      '1.2 Real-time scheduling policies: SCHED_FIFO vs SCHED_RR.',
      'MODULE 2: CONCURRENCY AND RACE CONDITION MITIGATION',
      '2.1 Hardware primitives: Test-and-Set, Compare-and-Swap (CAS), Memory Barriers.',
      '2.2 Classical synchronization problems: Dining Philosophers, Reader-Writer with Writer Priority.',
      '2.3 Deadlock characterization (Coffman conditions) and Bankers Algorithm verification.'
    ]
  },
  {
    id: 'res-3',
    title: 'Enterprise Database Systems: ACID, Distributed Transactions & 2PC',
    subject: 'Database Management Systems',
    description: 'Complete syllabus guide for relational normalization (BCNF, 4NF), WAL logging, query optimization, and distributed consensus.',
    uploadDate: '2026-09-15',
    fileSize: '11.5 MB',
    fileType: 'pdf',
    uploadedBy: 'Prof. Meenakshi Iyer (HOD, Data Systems)',
    sampleDocumentTitle: 'DBMS_Distributed_Transactions_ACID.pdf',
    sampleContent: [
      'SECTION 1: TRANSACTION RECOVERY AND WRITE-AHEAD LOGGING (WAL)',
      '1.1 ARIES Recovery Algorithm: Analysis, Redo, and Undo passes.',
      '1.2 Checkpoint strategies: Fuzzy checkpointing and active transaction table.',
      'SECTION 2: DISTRIBUTED CONCURRENCY CONTROL',
      '2.1 Two-Phase Commit Protocol (2PC): Prepare phase, Commit phase, Coordinator crash recovery.',
      '2.2 Paxos and Raft Consensus comparison for distributed leader election.'
    ]
  },
  {
    id: 'res-4',
    title: 'Enterprise Cloud Architecture & DevOps Pipeline Blueprint',
    subject: 'Cloud Computing & DevOps',
    description: 'KPMG Industry Specialization module on microservice resilience, Kubernetes orchestration, Docker containers, and CI/CD pipelines.',
    uploadDate: '2026-10-05',
    fileSize: '16.1 MB',
    fileType: 'pdf',
    uploadedBy: 'Prof. Anupama Roy & KPMG Industry Lab',
    sampleDocumentTitle: 'KPMG_Enterprise_Cloud_DevOps_Syllabus.pdf',
    sampleContent: [
      'PILLAR 1: CONTAINER RUNTIMES AND ORCHESTRATION',
      '1.1 OCI Container specifications and Linux namespaces (cgroups, network namespace).',
      '1.2 Kubernetes Architecture: API Server, etcd, Kubelet, Kube-Proxy, Controller Manager.',
      'PILLAR 2: RESILIENCY PATTERNS IN DISTRIBUTED ENTERPRISE SAAS',
      '1.3 Circuit Breakers, Retry with Exponential Backoff, Bulkhead isolation pattern.'
    ]
  },
  {
    id: 'res-5',
    title: 'Deep Learning & Applied Machine Learning Foundations',
    subject: 'AI & ML Lab',
    description: 'PyTorch practical guide for convolutional networks, Transformers, self-attention mechanisms, and model evaluation metrics.',
    uploadDate: '2026-09-10',
    fileSize: '19.4 MB',
    fileType: 'pdf',
    uploadedBy: 'Dr. Swaminathan N. (AI Lead)',
    sampleDocumentTitle: 'Deep_Learning_Transformers_PyTorch_Lab.pdf',
    sampleContent: [
      'LAB UNIT 1: TENSOR OPERATIONS AND BACKPROPAGATION',
      '1.1 Computational graphs in PyTorch: autograd engine and tensor manipulation.',
      '1.2 Gradient descent optimizers: AdamW, RMSProp, learning rate schedulers.',
      'LAB UNIT 2: ATTENTION MECHANISMS AND TRANSFORMERS',
      '2.1 Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V.',
      '2.2 Multi-head attention implementation and residual normalization layer.'
    ]
  },
  {
    id: 'res-6',
    title: 'Campus Placement & Corporate Aptitude Preparation Toolkit',
    subject: 'Soft Skills & Corporate Aptitude',
    description: 'Quantitative aptitude, logical reasoning, behavioral interview STAR method questions, and technical presentation frameworks.',
    uploadDate: '2026-09-01',
    fileSize: '7.5 MB',
    fileType: 'pdf',
    uploadedBy: 'Ms. Preeti Kapoor (Head of Placements)',
    sampleDocumentTitle: 'Corporate_Placement_Aptitude_Toolkit.pdf',
    sampleContent: [
      'MODULE 1: QUANTITATIVE REASONING SHORTCUTS',
      '1.1 Speed Math techniques: Permutations & Combinations, Probability, Time & Work.',
      '1.2 Data Interpretation caselets and chart analysis.',
      'MODULE 2: INTERVIEW SIMULATION & STAR FRAMEWORK',
      '2.1 Structuring answers: Situation, Task, Action, Result with quantifiable metrics.'
    ]
  }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'cal-1', title: 'Internal Assessment 2: Data Structures & Algorithms', date: '2026-10-24', type: 'Internal', description: 'Written test on AVL Trees, Heaps, and Graph Traversals.', time: '10:00 AM - 01:00 PM', venue: 'Exam Hall A' },
  { id: 'cal-2', title: 'Internal Assessment 2: DBMS', date: '2026-10-27', type: 'Internal', description: 'Query Optimization, Normalization, and Indexing.', time: '10:00 AM - 01:00 PM', venue: 'Exam Hall B' },
  { id: 'cal-3', title: 'Assignment 3 Submission Deadline: Distributed 2PC', date: '2026-10-18', type: 'Assignment', description: 'Upload verified Python/Java simulation to LMS portal.', time: '11:59 PM' },
  { id: 'cal-4', title: 'Operating Systems Kernel IA 2', date: '2026-10-30', type: 'Internal', description: 'Processes, Memory Paging, and File Systems.', time: '02:00 PM - 05:00 PM', venue: 'Exam Hall A' },
  { id: 'cal-5', title: 'AI & Machine Learning Practical Lab Examination', date: '2026-11-08', type: 'Practical', description: 'Hands-on coding exam in Computing Lab 4.', time: '09:00 AM - 12:00 PM', venue: 'Computing Lab 4' },
  { id: 'cal-6', title: 'DSA Practical Lab Examination', date: '2026-11-10', type: 'Practical', description: 'External viva and coding implementation test.', time: '02:00 PM - 05:00 PM', venue: 'Computing Lab 2' },
  { id: 'cal-7', title: 'Semester 4 Revaluation Application Deadline', date: '2026-10-31', type: 'Revaluation', description: 'Final date to submit photocopy verification and re-totaling requests.', time: '05:00 PM', venue: 'Academic Office' },
  { id: 'cal-8', title: 'KPMG India Smart Campus Hackathon & Conclave', date: '2026-11-14', type: 'Event', description: 'Flagship national college innovation hackathon presented to KPMG leadership.', time: '09:00 AM - 06:00 PM', venue: 'Convention Center' },
  { id: 'cal-9', title: 'Diwali Institutional Holiday Break', date: '2026-11-01', type: 'Holiday', description: 'Campus closed for festival holiday.' },
  { id: 'cal-10', title: 'Semester End Theory Examinations Begin', date: '2026-12-05', type: 'Semester', description: 'End-term theory papers commence across all departments.', time: '09:30 AM', venue: 'Central Examination Hall' }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Internal Assessment: Data Structures',
    message: 'IA-2 scheduled for CS501 on October 24, 2026 in Exam Hall A. Revise AVL Trees and Graphs.',
    timestamp: '2 hours ago',
    type: 'exam',
    priority: 'high',
    read: false,
    linkTab: 'academic-calendar'
  },
  {
    id: 'notif-2',
    title: 'Assignment Deadline Approaching: DBMS',
    message: 'Distributed Transaction 2PC Simulation assignment is due in 4 days (October 18).',
    timestamp: '5 hours ago',
    type: 'deadline',
    priority: 'high',
    read: false,
    linkTab: 'student-info'
  },
  {
    id: 'notif-3',
    title: 'New Achievement Unlocked: All-Rounder',
    message: 'Congratulations! You unlocked the All-Rounder Badge for excellence across attendance, academics, and events.',
    timestamp: '1 day ago',
    type: 'badge',
    priority: 'normal',
    read: false,
    linkTab: 'badges'
  },
  {
    id: 'notif-4',
    title: 'Success Score Recalculated: +2.8 Points',
    message: 'Your Success Score increased to 91.2 following verified hackathon points and full assignment submissions.',
    timestamp: '2 days ago',
    type: 'score',
    priority: 'normal',
    read: true,
    linkTab: 'success-score'
  },
  {
    id: 'notif-5',
    title: 'Semester 4 Revaluation Status Updated',
    message: 'Theory of Computation revaluation has been processed. Revised Grade: A+ (Published).',
    timestamp: '3 days ago',
    type: 'revaluation',
    priority: 'medium',
    read: true,
    linkTab: 'student-info'
  },
  {
    id: 'notif-6',
    title: 'KPMG India Hackathon Registration Open',
    message: 'Register your 3-member team for the KPMG Smart Campus Analytics Challenge before November 5.',
    timestamp: '4 days ago',
    type: 'event',
    priority: 'normal',
    read: true,
    linkTab: 'your-participation'
  }
];

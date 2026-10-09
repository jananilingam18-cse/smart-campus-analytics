import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ShieldAlert, 
  Filter, 
  Calendar, 
  GraduationCap, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  PieChart as PieIcon,
  HelpCircle,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { useApp } from '../context/AppContext';
import { calculateStudentSuccessScore } from '../utils/scoring';

export const AdminInsightsPage: React.FC = () => {
  const { institutionalMetrics, allStudents, switchStudent, setActiveTab } = useApp();

  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);

  // Filter students based on selection
  const filteredCohort = allStudents.filter(s => {
    const matchDept = selectedDept === 'All' || s.department.includes(selectedDept);
    const matchSem = selectedSemester === 'All' || String(s.semester) === selectedSemester;
    return matchDept && matchSem;
  });

  // Students requiring academic support (Score < 55 or Attendance shortage)
  const atRiskCohort = filteredCohort.filter(s => {
    const b = calculateStudentSuccessScore(s);
    const hasShortage = (s.attendanceRecords || []).some(rec => rec.total > 0 && ((rec.attended / rec.total) * 100 < 75));
    return (b.overallScore < 55 && !s.hasInsufficientData) || hasShortage;
  });

  // High academic but low placement readiness
  const highAcademicsLowPlacement = filteredCohort.filter(s => {
    const b = calculateStudentSuccessScore(s);
    return s.placementReadiness.assessed && b.academicScore >= 85 && s.placementReadiness.overallPercent < 50;
  });

  // Cohort Performance by Subject
  const subjectPerformanceData = [
    { subject: 'Data Structures', avgAttendance: 76.4, passRate: 88, atRiskCount: 6 },
    { subject: 'Database Systems', avgAttendance: 84.1, passRate: 94, atRiskCount: 2 },
    { subject: 'Operating Systems', avgAttendance: 78.9, passRate: 86, atRiskCount: 5 },
    { subject: 'Cloud Computing', avgAttendance: 89.2, passRate: 96, atRiskCount: 1 },
    { subject: 'AI & ML Lab', avgAttendance: 91.5, passRate: 98, atRiskCount: 0 }
  ];

  const handleTriggerAction = (actionTitle: string) => {
    setActiveActionModal(actionTitle);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center font-bold shadow-sm">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
                Faculty & Administrator Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">
                Institutional Mode
              </span>
            </div>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Department-wide predictive indicators, early retention risk, and faculty-led interventions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-white dark:bg-[#1D172E] text-[#242038] dark:text-purple-200 font-medium focus:ring-2 focus:ring-[#7C3AED] outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science & Engineering</option>
            <option value="AI">AI & Data Analytics</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-white dark:bg-[#1D172E] text-[#242038] dark:text-purple-200 font-medium focus:ring-2 focus:ring-[#7C3AED] outline-none"
          >
            <option value="All">All Semesters</option>
            <option value="5">Semester 5 (Current Cohort)</option>
            <option value="6">Semester 6</option>
          </select>
        </div>
      </div>

      {/* KPI Institutional Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Total Cohort</span>
          <p className="text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading mt-1">
            {filteredCohort.length}
          </p>
          <p className="text-[11px] text-[#77738C] dark:text-purple-400 mt-0.5">Enrolled Students</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Average Success Score</span>
          <p className="text-2xl font-bold text-[#7C3AED] dark:text-purple-300 font-heading mt-1">
            {institutionalMetrics.averageSuccessScore}
          </p>
          <p className="text-[11px] text-[#77738C] dark:text-purple-400 mt-0.5">Scale of 0 to 100</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">At-Risk Students</span>
          <p className="text-2xl font-bold text-rose-600 font-heading mt-1">
            {atRiskCohort.length}
          </p>
          <p className="text-[11px] text-rose-500 font-semibold mt-0.5">Requires academic support</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Attendance Shortages</span>
          <p className="text-2xl font-bold text-amber-600 font-heading mt-1">
            {institutionalMetrics.attendanceShortageCount}
          </p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">&lt; 75% in at least 1 subject</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Assignment Rate</span>
          <p className="text-2xl font-bold text-emerald-600 font-heading mt-1">
            {institutionalMetrics.assignmentCompletionAvg}%
          </p>
          <p className="text-[11px] text-[#77738C] dark:text-purple-400 mt-0.5">On-time course submissions</p>
        </div>

      </div>

      {/* Actionable Faculty Recommendations (Evidence-Backed) */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div>
            <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7C3AED]" />
              Actionable Institutional Interventions
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300 mt-0.5">
              Evidence-based faculty decision recommendations with zero automated punitive measures.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#77738C] dark:text-purple-400">Campus IQ Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Action 1: Remedial Classes in DSA */}
          <div className="p-5 rounded-2xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
                  Remedial Intervention
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                  High Priority
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 mt-1">
                Arrange Subject-Specific Remedial Classes for Data Structures (CS501)
              </h4>
              <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1 leading-relaxed">
                <strong>Evidence:</strong> 6 students currently fall below the 75% attendance threshold with an average mid-term IA score of 58%. Balanced tree algorithms show the steepest learning gap.
              </p>
            </div>
            <button
              onClick={() => handleTriggerAction('Remedial Classes for Data Structures')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Schedule Remedial Cohort →
            </button>
          </div>

          {/* Action 2: Placement Bootcamp for High Academics Cohort */}
          <div className="p-5 rounded-2xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 uppercase">
                  Placement Enhancement
                </span>
                <span className="text-[10px] bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  {highAcademicsLowPlacement.length} Students Identified
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 mt-1">
                Organize Coding & Mock Interview Bootcamps for High Academic Achievers
              </h4>
              <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1 leading-relaxed">
                <strong>Evidence:</strong> {highAcademicsLowPlacement.length} students (e.g. Ananya Patel) have CGPA &gt; 9.0 but test below 50% in LeetCode/aptitude assessments.
              </p>
            </div>
            <button
              onClick={() => handleTriggerAction('Placement Bootcamp for High CGPA Cohort')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Enroll Cohort in Coding Bootcamp →
            </button>
          </div>

          {/* Action 3: Attendance Counselling */}
          <div className="p-5 rounded-2xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Faculty Mentor Session
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {institutionalMetrics.attendanceShortageCount} Students
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 mt-1">
                Conduct Structured Attendance Counselling Sessions
              </h4>
              <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1 leading-relaxed">
                <strong>Evidence:</strong> Students with attendance shortages require mapped consecutive class attendance agreements before semester end-term hall tickets are blocked.
              </p>
            </div>
            <button
              onClick={() => handleTriggerAction('Attendance Counselling Notification')}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Trigger Mentor Meeting Invites →
            </button>
          </div>

          {/* Action 4: Hackathon Sponsorship */}
          <div className="p-5 rounded-2xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  National Hackathon Drive
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Grade A Vanguard
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 mt-1">
                Sponsor Top 15% Students for National Innovation Conclave
              </h4>
              <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1 leading-relaxed">
                <strong>Evidence:</strong> High-performing students (e.g. Priya Sharma) exhibit all-rounder excellence and are ready for corporate case presentations.
              </p>
            </div>
            <button
              onClick={() => handleTriggerAction('National Hackathon Nominations')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Approve Team Registrations →
            </button>
          </div>

        </div>
      </div>

      {/* Subject-Wise Pass & At-Risk Chart */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 md:p-8 shadow-sm">
        <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading mb-4">
          Subject Attendance vs Academic Pass Rate Overview
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9E4F5" />
              <XAxis dataKey="subject" stroke="#77738C" fontSize={11} />
              <YAxis stroke="#77738C" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1D172E', borderColor: '#7C3AED', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="avgAttendance" name="Avg Attendance %" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              <Bar dataKey="passRate" name="Exam Pass Rate %" fill="#A78BFA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cohort Requiring Support Roster */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E9E4F5] dark:border-purple-900/40 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
              Students Identified for Academic Support ({atRiskCohort.length})
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300 mt-0.5">
              Subject shortages or overall score below benchmark threshold
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200">
            Action Recommended
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9FF] dark:bg-[#13101E] text-[#77738C] dark:text-purple-400 uppercase tracking-wider border-b border-[#E9E4F5] dark:border-purple-900/40">
                <th className="p-3.5 font-semibold">Student</th>
                <th className="p-3.5 font-semibold">Roll No</th>
                <th className="p-3.5 font-semibold">Success Score</th>
                <th className="p-3.5 font-semibold">Shortage Subjects</th>
                <th className="p-3.5 font-semibold">Assigned Mentor</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E4F5] dark:divide-purple-900/40">
              {atRiskCohort.map((student) => {
                const b = calculateStudentSuccessScore(student);
                const shortages = (student.attendanceRecords || []).filter(s => s.total > 0 && ((s.attended / s.total) * 100 < 75));

                return (
                  <tr key={student.id} className="hover:bg-[#FAF9FF] dark:hover:bg-[#13101E] transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={student.avatarUrl} 
                          alt={student.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-[#EDE9FE]" 
                        />
                        <span className="font-bold text-[#242038] dark:text-purple-100">{student.name}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[#77738C]">
                      {student.rollNo}
                    </td>

                    <td className="p-3.5 font-bold text-rose-600">
                      {b.overallScore} / 100
                    </td>

                    <td className="p-3.5 text-rose-600 font-medium">
                      {shortages.length > 0 ? shortages.map(s => s.subjectName).join(', ') : 'None (Academic Delta)'}
                    </td>

                    <td className="p-3.5 text-[#77738C] dark:text-purple-300">
                      {student.mentorName}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          switchStudent(student.id);
                          setActiveTab('dashboard');
                        }}
                        className="px-3 py-1 rounded-xl bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300 hover:bg-[#DDD6FE] font-semibold text-[11px] cursor-pointer"
                      >
                        Inspect Student →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculty Action Trigger Confirmation Modal */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#1D172E] rounded-3xl p-6 shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading">
                Institutional Workflow Initiated
              </h3>
              <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1">
                "{activeActionModal}" has been registered in the Academic Governance system. Notifications sent to department coordinators.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Close Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

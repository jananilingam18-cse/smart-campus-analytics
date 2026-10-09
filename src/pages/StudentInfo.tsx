import React, { useState } from 'react';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileCheck, 
  GraduationCap, 
  Edit3, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  X,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  calculateOverallAttendance, 
  calculateClassesNeededFor75 
} from '../utils/scoring';

export const StudentInfo: React.FC = () => {
  const { currentStudent, updateStudentProfile } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'assignments' | 'timetable' | 'exams' | 'results' | 'revaluation'>('attendance');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentStudent.name);
  const [editEmail, setEditEmail] = useState(currentStudent.email);
  const [editPhone, setEditPhone] = useState(currentStudent.phone);

  const { attended: totalAttended, total: totalConducted, percentage: overallAttPct } = calculateOverallAttendance(currentStudent);

  // Check for any subject below 75%
  const shortageSubjects = (currentStudent.attendanceRecords || []).filter(s => {
    return s.total > 0 && ((s.attended / s.total) * 100 < 75);
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name: editName,
      email: editEmail,
      phone: editPhone
    });
    setIsEditingProfile(false);
  };

  const subTabs = [
    { id: 'attendance', label: 'A. Attendance', badge: shortageSubjects.length > 0 ? `${shortageSubjects.length} Shortage` : undefined, isDanger: shortageSubjects.length > 0 },
    { id: 'assignments', label: 'B. Assignments' },
    { id: 'timetable', label: 'C. Timetable' },
    { id: 'exams', label: 'D. Exam Schedule' },
    { id: 'results', label: 'E. Final Results' },
    { id: 'revaluation', label: 'F. Revaluation' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center font-bold shadow-sm">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
              Student Information & Academic Dossier
            </h1>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Verified institutional profile, attendance, coursework, and grades
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditName(currentStudent.name);
            setEditEmail(currentStudent.email);
            setEditPhone(currentStudent.phone);
            setIsEditingProfile(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-white dark:bg-[#1D172E] text-xs font-semibold text-[#6D28D9] dark:text-purple-300 hover:border-[#7C3AED] transition self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#EDE9FE] dark:ring-purple-900/50 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-[#242038] dark:text-purple-100 font-heading">
                  {currentStudent.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">
                  {currentStudent.rollNo}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 text-[#77738C] dark:text-purple-300">
                  Year {currentStudent.year} • Sem {currentStudent.semester} ({currentStudent.classSection})
                </span>
              </div>
              <p className="text-xs font-semibold text-[#7C3AED] dark:text-purple-300 mt-1">
                {currentStudent.course} — {currentStudent.branch}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#77738C] dark:text-purple-300 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#77738C]" />
                  {currentStudent.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#77738C]" />
                  {currentStudent.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#77738C]" />
                  {currentStudent.department}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Faculty Mentor Box */}
          <div className="w-full lg:w-auto p-4 rounded-2xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#77738C] dark:text-purple-400">
              Assigned Faculty Mentor
            </span>
            <p className="text-xs font-bold text-[#242038] dark:text-purple-100 mt-1">
              {currentStudent.mentorName}
            </p>
            <p className="text-[11px] text-[#77738C] dark:text-purple-300">
              {currentStudent.mentorEmail}
            </p>
            <p className="text-[11px] text-[#77738C] dark:text-purple-300 font-medium">
              Cabin: {currentStudent.mentorCabin}
            </p>
          </div>
        </div>
      </div>

      {/* Subsections Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E9E4F5] dark:border-purple-900/40">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-sm'
                : 'text-[#77738C] dark:text-purple-300 hover:text-[#6D28D9] hover:bg-[#EDE9FE]/40 dark:hover:bg-purple-900/20'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                tab.isDanger 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/20 text-white'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SUBSECTION A: Attendance */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6">
          {/* Overall Attendance Summary Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-purple-400">
                Institutional Cumulative Attendance
              </span>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className={`text-3xl font-bold font-heading ${overallAttPct < 75 ? 'text-rose-600' : 'text-[#242038] dark:text-purple-100'}`}>
                  {overallAttPct}%
                </span>
                <span className="text-xs text-[#77738C] dark:text-purple-300 font-medium">
                  ({totalAttended} of {totalConducted} total class sessions attended)
                </span>
              </div>
              <p className="text-xs text-[#77738C] dark:text-purple-400 mt-1 font-mono">
                Formula: Attendance % = (Classes Attended / Total Classes Conducted) × 100
              </p>
            </div>

            <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              shortageSubjects.length > 0 
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-800' 
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
            }`}>
              {shortageSubjects.length > 0 ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Attendance Shortage Active ({shortageSubjects.length} Subject)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Attendance Requirement Fulfilled (&ge; 75%)</span>
                </>
              )}
            </div>
          </div>

          {/* Subject-Wise Attendance Breakdown Table */}
          <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E9E4F5] dark:border-purple-900/40 flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                Subject-Wise Attendance Breakdown
              </h3>
              <span className="text-xs text-[#77738C] dark:text-purple-300">Mandatory Threshold: 75.0%</span>
            </div>

            <div className="divide-y divide-[#E9E4F5] dark:divide-purple-900/40">
              {(currentStudent.attendanceRecords || []).map((sub) => {
                const pct = sub.total > 0 ? Number(((sub.attended / sub.total) * 100).toFixed(1)) : 0;
                const isShortage = pct < 75;
                const neededClasses = isShortage ? calculateClassesNeededFor75(sub.attended, sub.total) : 0;

                return (
                  <div key={sub.subjectCode} className="p-5 transition hover:bg-[#FAF9FF] dark:hover:bg-[#13101E]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Subject Name & Faculty */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDE9FE] dark:bg-purple-900/50 text-[#6D28D9] dark:text-purple-300 font-mono">
                            {sub.subjectCode}
                          </span>
                          <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100">
                            {sub.subjectName}
                          </h4>
                          <span className="text-xs text-[#77738C] dark:text-purple-400 font-medium">({sub.credits} Credits)</span>
                        </div>
                        <p className="text-xs text-[#77738C] dark:text-purple-300 mt-0.5">
                          Faculty: {sub.facultyName}
                        </p>
                      </div>

                      {/* Numbers */}
                      <div className="flex items-center gap-6 self-start lg:self-auto">
                        <div className="text-right">
                          <span className="text-xs text-[#77738C] dark:text-purple-400 block font-medium">Attended / Total</span>
                          <span className="text-sm font-bold text-[#242038] dark:text-purple-100">
                            {sub.attended} / {sub.total} classes
                          </span>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="text-xs text-[#77738C] dark:text-purple-400 block font-medium">Percentage</span>
                          <span className={`text-base font-bold ${isShortage ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {pct}%
                          </span>
                        </div>

                        <div>
                          {isShortage ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200">
                              Shortage
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                              Eligible
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Prominent Warning If Below 75% */}
                    {isShortage && (
                      <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <strong className="font-bold">
                            Attendance shortage: {sub.subjectName} is below the 75% attendance requirement.
                          </strong>
                          <p className="mt-0.5 text-rose-700 dark:text-rose-300">
                            To reach the mandatory 75% threshold, you need to attend the next <strong>{neededClasses} consecutive classes</strong> in this subject without missing any session.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION B: Assignments */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(currentStudent.assignments || []).map((as) => (
              <div 
                key={as.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDE9FE] dark:bg-purple-900/50 text-[#6D28D9] dark:text-purple-300 font-mono">
                      {as.subjectCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      as.status === 'Submitted' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200' :
                      as.status === 'Overdue' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                    }`}>
                      {as.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 line-clamp-2">
                    {as.title}
                  </h4>
                  <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1">
                    {as.subjectName}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E9E4F5] dark:border-purple-900/40 text-xs text-[#77738C] dark:text-purple-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <strong className="text-[#242038] dark:text-purple-100">{as.dueDate}</strong>
                  </div>
                  {as.marksObtained !== undefined && (
                    <div className="flex justify-between">
                      <span>Marks:</span>
                      <strong className="text-[#7C3AED] dark:text-purple-300">{as.marksObtained} / {as.maxMarks}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <strong className="text-[#242038] dark:text-purple-100">{as.completionPercentage}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION C: Timetable */}
      {activeSubTab === 'timetable' && (
        <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E9E4F5] dark:border-purple-900/40">
            <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
              Weekly Class & Laboratory Schedule
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Section {currentStudent.classSection} ({currentStudent.branch})
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF9FF] dark:bg-[#13101E] text-[#77738C] dark:text-purple-400 uppercase tracking-wider border-b border-[#E9E4F5] dark:border-purple-900/40">
                  <th className="p-3.5 font-semibold">Day</th>
                  <th className="p-3.5 font-semibold">Time Slot</th>
                  <th className="p-3.5 font-semibold">Subject</th>
                  <th className="p-3.5 font-semibold">Room / Venue</th>
                  <th className="p-3.5 font-semibold">Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E4F5] dark:divide-purple-900/40">
                {(currentStudent.timetable || []).map((slot) => (
                  <tr key={slot.id} className="hover:bg-[#FAF9FF] dark:hover:bg-[#13101E]">
                    <td className="p-3.5 font-bold text-[#242038] dark:text-purple-100">
                      {slot.day}
                    </td>
                    <td className="p-3.5 font-mono text-[#77738C] dark:text-purple-300">
                      {slot.startTime} – {slot.endTime}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#242038] dark:text-purple-100">
                        {slot.subjectName}
                      </div>
                      <div className="text-[10px] text-[#77738C] dark:text-purple-400 font-mono">
                        {slot.subjectCode}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#77738C] dark:text-purple-300">
                      {slot.room}
                    </td>
                    <td className="p-3.5 text-[#77738C] dark:text-purple-300">
                      {slot.facultyName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSECTION D: Exam Schedule */}
      {activeSubTab === 'exams' && (
        <div className="space-y-3">
          {(currentStudent.examSchedule || []).map((ex) => (
            <div
              key={ex.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 border border-[#E9E4F5] dark:border-purple-800/40 flex flex-col items-center justify-center text-[#6D28D9] dark:text-purple-300 shrink-0">
                  <span className="text-[10px] font-bold uppercase leading-none">
                    {new Date(ex.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-base font-black leading-none mt-0.5">
                    {ex.date.split('-')[2]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDE9FE] dark:bg-purple-900/50 text-[#6D28D9] dark:text-purple-300 font-mono">
                      {ex.subjectCode}
                    </span>
                    <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100">
                      {ex.subjectName}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#77738C] dark:text-purple-300 mt-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#77738C]" />
                      {ex.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#77738C]" />
                      {ex.venue}
                    </span>
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300 border border-[#E9E4F5] dark:border-purple-800/40 self-start sm:self-auto">
                {ex.examType}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* SUBSECTION E: Final Results */}
      {activeSubTab === 'results' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
              <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase">Cumulative CGPA</span>
              <p className="text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading mt-1">
                {currentStudent.academicHistory?.length ? (currentStudent.academicHistory.reduce((a, b) => a + b.sgpa, 0) / currentStudent.academicHistory.length).toFixed(2) : 'N/A'}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
              <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase">Total Credits Earned</span>
              <p className="text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading mt-1">96 / 96</p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
              <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase">Active Backlogs</span>
              <p className="text-2xl font-bold text-emerald-600 font-heading mt-1">0</p>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
              <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase">Academic Standing</span>
              <p className="text-base font-bold text-[#7C3AED] dark:text-purple-300 font-heading mt-1">First Class Distinction</p>
            </div>
          </div>

          <div className="space-y-4">
            {(currentStudent.academicHistory || []).map((sem) => (
              <div key={sem.semester} className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40 mb-3">
                  <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                    Semester {sem.semester} Academic Performance
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#77738C] dark:text-purple-300 font-medium">Credits: {sem.creditsEarned} / {sem.totalCredits}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">
                      SGPA: {sem.sgpa}
                    </span>
                  </div>
                </div>

                {sem.subjects && sem.subjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {sem.subjects.map(s => (
                      <div key={s.subjectCode} className="p-2.5 rounded-xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/30 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-[#242038] dark:text-purple-100">{s.subjectName}</span>
                          <span className="text-[10px] text-[#77738C] dark:text-purple-400 ml-1.5 font-mono">{s.subjectCode}</span>
                        </div>
                        <span className="font-bold text-[#7C3AED] dark:text-purple-300">{s.grade}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#77738C] dark:text-purple-400">Detailed transcript subject rows verified and stored in central ERP database.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION F: Revaluation */}
      {activeSubTab === 'revaluation' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#EDE9FE]/50 dark:bg-purple-950/40 border border-[#E9E4F5] dark:border-purple-900/50 text-xs text-[#6D28D9] dark:text-purple-300">
            <strong>Official University Notice:</strong> Revaluation applications are subject to university autonomous examination ordinances. All updates shown here reflect verified database synchronizations.
          </div>

          {(currentStudent.revaluations || []).length > 0 ? (
            (currentStudent.revaluations || []).map((rev) => (
              <div 
                key={rev.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDE9FE] dark:bg-purple-900/50 text-[#6D28D9] dark:text-purple-300 font-mono">
                      {rev.subjectCode}
                    </span>
                    <h4 className="text-sm font-bold text-[#242038] dark:text-purple-100 font-heading">
                      {rev.subjectName} (Semester {rev.semester})
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#77738C] dark:text-purple-300 mt-2">
                    <span>Initial Grade: <strong className="text-[#242038] dark:text-purple-100">{rev.initialGrade}</strong></span>
                    {rev.revisedGrade && (
                      <span>Revised Grade: <strong className="text-emerald-600">{rev.revisedGrade}</strong></span>
                    )}
                    <span>Deadline: {rev.deadline}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                  rev.applicationStatus === 'Result Published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200' :
                  rev.applicationStatus === 'Under Review' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200' :
                  'bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300 border border-[#E9E4F5]'
                }`}>
                  {rev.applicationStatus}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 text-[#77738C] text-xs">
              No active revaluation applications logged for current term.
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#1D172E] rounded-3xl p-6 shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
              <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading">Edit Student Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-[#77738C] hover:text-[#242038] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#242038] dark:text-purple-200 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#242038] dark:text-purple-200 mb-1">College Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#242038] dark:text-purple-200 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E9E4F5] dark:border-purple-900/40">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-2 rounded-xl text-[#77738C] hover:bg-[#FAF9FF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

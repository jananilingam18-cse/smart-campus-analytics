import React, { useState } from 'react';
import { 
  PieChart as PieIcon, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  ChevronRight,
  X,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { 
  calculateStudentSuccessScore, 
  calculateOverallAttendance, 
  calculateAcademicScore, 
  calculateAssignmentRate 
} from '../utils/scoring';
import { Student } from '../types';

export const SegmentationPage: React.FC = () => {
  const { allStudents, switchStudent, setActiveTab } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Analyze all students
  const analyzedStudents = allStudents.map(student => {
    const scoreData = calculateStudentSuccessScore(student);
    const { percentage: attPct } = calculateOverallAttendance(student);
    const { cgpa } = calculateAcademicScore(student);
    const { percentage: assignPct } = calculateAssignmentRate(student);

    // Identify Meaningful Sub-Cluster Groups
    let cluster = 'Standard Cohort';
    if (student.hasInsufficientData) {
      cluster = 'Insufficient Baseline Data';
    } else if (student.placementReadiness.assessed && cgpa >= 8.5 && student.placementReadiness.overallPercent < 50) {
      cluster = 'High Academics / Low Placement Readiness';
    } else if (attPct >= 90 && cgpa < 6.8) {
      cluster = 'Strong Attendance / Weak Exam Results';
    } else if (assignPct >= 95 && cgpa < 6.5) {
      cluster = 'High Assignments / Low Exam Results';
    } else if (attPct < 75 && cgpa < 6.5) {
      cluster = 'Low Attendance & At-Risk Results';
    } else if (scoreData.overallScore >= 85) {
      cluster = 'High Performance & Strong Engagement';
    } else if (student.academicHistory.length >= 2 && student.academicHistory[student.academicHistory.length - 1].sgpa >= student.academicHistory[student.academicHistory.length - 2].sgpa) {
      cluster = 'Consistent Improver';
    }

    return {
      student,
      scoreData,
      attPct,
      cgpa,
      assignPct,
      grade: scoreData.gradeSegment,
      cluster
    };
  });

  // Grade Counts
  const gradeCounts = {
    'Grade A': analyzedStudents.filter(s => s.grade === 'Grade A').length,
    'Grade B': analyzedStudents.filter(s => s.grade === 'Grade B').length,
    'Grade C': analyzedStudents.filter(s => s.grade === 'Grade C').length,
    'Grade D': analyzedStudents.filter(s => s.grade === 'Grade D').length,
    'Not Yet Rated': analyzedStudents.filter(s => s.grade === 'Not Yet Rated').length
  };

  const pieChartData = [
    { name: 'Grade A (85–100)', value: gradeCounts['Grade A'], color: '#10b981' },
    { name: 'Grade B (70–84.9)', value: gradeCounts['Grade B'], color: '#7C3AED' },
    { name: 'Grade C (50–69.9)', value: gradeCounts['Grade C'], color: '#f59e0b' },
    { name: 'Grade D (0–49.9)', value: gradeCounts['Grade D'], color: '#ef4444' },
    { name: 'Not Yet Rated', value: gradeCounts['Not Yet Rated'], color: '#A78BFA' }
  ];

  const clustersList = [
    'All',
    'High Academics / Low Placement Readiness',
    'Strong Attendance / Weak Exam Results',
    'High Assignments / Low Exam Results',
    'Low Attendance & At-Risk Results',
    'High Performance & Strong Engagement',
    'Consistent Improver'
  ];

  // Filtering
  const filteredList = analyzedStudents.filter(item => {
    const matchesSearch = item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || item.grade === selectedGrade;
    const matchesCluster = selectedCluster === 'All' || item.cluster === selectedCluster;
    const matchesDept = selectedDepartment === 'All' || item.student.department === selectedDepartment;
    return matchesSearch && matchesGrade && matchesCluster && matchesDept;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE] flex items-center justify-center font-bold shadow-sm">
            <PieIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#242038] dark:text-white font-heading">
              Student Segmentation & Multi-Cluster Analytics
            </h1>
            <p className="text-xs text-[#77738C] dark:text-[#A59DB8]">
              Grade classification, early intervention cohorts, and placement readiness profiling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-semibold text-[#77738C] dark:text-[#A59DB8] bg-white dark:bg-[#1D172E] px-4 py-2 rounded-2xl border border-[#E9E4F5] dark:border-[#332A50] shadow-sm">
          <span>Active Roster: {allStudents.length} Students</span>
        </div>
      </div>

      {/* Segment Metrics & Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Distribution Pie Chart */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
              Cohort Performance Grade Distribution
            </h3>
            <p className="text-xs text-[#77738C] dark:text-[#A59DB8] mt-0.5">
              Configurable institutional benchmark tiers
            </p>
          </div>

          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} Students`, name]}
                  contentStyle={{ backgroundColor: '#1D172E', borderColor: '#332A50', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieChartData.map(p => (
              <div key={p.name} className="flex items-center gap-2 p-2 rounded-xl bg-[#F4F0FF] dark:bg-[#241D38] border border-[#E9E4F5] dark:border-[#332A50]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-[#242038] dark:text-[#FAF9FF] font-medium truncate">{p.name}: <strong>{p.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Breakdown Cards & Interventions */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Grade A */}
          <div 
            onClick={() => setSelectedGrade(selectedGrade === 'Grade A' ? 'All' : 'Grade A')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm ${
              selectedGrade === 'Grade A' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20' : 'bg-white dark:bg-[#1D172E] border-[#E9E4F5] dark:border-[#332A50] hover:border-[#7C3AED]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-heading">Grade A (85–100)</span>
              <span className="text-base font-black text-emerald-600 font-heading">{gradeCounts['Grade A']} Students</span>
            </div>
            <p className="text-[11px] text-[#77738C] dark:text-[#A59DB8] mt-1 font-semibold">Exemplary Cohort</p>
            <p className="text-xs text-[#242038] dark:text-[#FAF9FF] mt-2.5 leading-relaxed">
              <strong>Intervention:</strong> Peer mentorship roles, national hackathon sponsorships, KPMG leadership conclave.
            </p>
          </div>

          {/* Grade B */}
          <div 
            onClick={() => setSelectedGrade(selectedGrade === 'Grade B' ? 'All' : 'Grade B')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm ${
              selectedGrade === 'Grade B' ? 'border-[#7C3AED] bg-[#EDE9FE]/50 dark:bg-[#2E244A]/40 ring-2 ring-[#7C3AED]/20' : 'bg-white dark:bg-[#1D172E] border-[#E9E4F5] dark:border-[#332A50] hover:border-[#7C3AED]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6D28D9] dark:text-[#EDE9FE] font-heading">Grade B (70–84.99)</span>
              <span className="text-base font-black text-[#7C3AED] font-heading">{gradeCounts['Grade B']} Students</span>
            </div>
            <p className="text-[11px] text-[#77738C] dark:text-[#A59DB8] mt-1 font-semibold">Strong Progress</p>
            <p className="text-xs text-[#242038] dark:text-[#FAF9FF] mt-2.5 leading-relaxed">
              <strong>Intervention:</strong> Targeted mock coding assessments, advanced lab electives, co-curricular point boosts.
            </p>
          </div>

          {/* Grade C */}
          <div 
            onClick={() => setSelectedGrade(selectedGrade === 'Grade C' ? 'All' : 'Grade C')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm ${
              selectedGrade === 'Grade C' ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 ring-2 ring-amber-500/20' : 'bg-white dark:bg-[#1D172E] border-[#E9E4F5] dark:border-[#332A50] hover:border-[#7C3AED]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-heading">Grade C (50–69.99)</span>
              <span className="text-base font-black text-amber-600 font-heading">{gradeCounts['Grade C']} Students</span>
            </div>
            <p className="text-[11px] text-[#77738C] dark:text-[#A59DB8] mt-1 font-semibold">Developing Consistency</p>
            <p className="text-xs text-[#242038] dark:text-[#FAF9FF] mt-2.5 leading-relaxed">
              <strong>Intervention:</strong> Attendance recovery tracking, subject-wise tutorial hours, faculty mentor check-in.
            </p>
          </div>

          {/* Grade D */}
          <div 
            onClick={() => setSelectedGrade(selectedGrade === 'Grade D' ? 'All' : 'Grade D')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm ${
              selectedGrade === 'Grade D' ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30 ring-2 ring-rose-500/20' : 'bg-white dark:bg-[#1D172E] border-[#E9E4F5] dark:border-[#332A50] hover:border-[#7C3AED]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 font-heading">Grade D (0–49.99)</span>
              <span className="text-base font-black text-rose-600 font-heading">{gradeCounts['Grade D']} Students</span>
            </div>
            <p className="text-[11px] text-[#77738C] dark:text-[#A59DB8] mt-1 font-semibold">Needs Academic Support</p>
            <p className="text-xs text-[#242038] dark:text-[#FAF9FF] mt-2.5 leading-relaxed">
              <strong>Intervention:</strong> Structured remedial coaching, parent-faculty counselling, assignment catch-up roadmaps.
            </p>
          </div>

        </div>

      </div>

      {/* Strategic Behavioral Cohort Clusters */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#77738C] dark:text-[#A59DB8] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            Strategic Behavioral Cohort Clusters
          </span>
          <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">Filter student roster</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {clustersList.map(cluster => (
            <button
              key={cluster}
              onClick={() => setSelectedCluster(cluster)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCluster === cluster
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-violet-500/20'
                  : 'bg-[#F4F0FF] dark:bg-[#241D38] text-[#77738C] dark:text-[#A59DB8] hover:bg-[#EDE9FE] dark:hover:bg-[#2E244A] hover:text-[#242038]'
              }`}
            >
              {cluster}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Grade Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#77738C] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or roll no..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-[#332A50] bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-white focus:ring-2 focus:ring-[#7C3AED] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Grade A', 'Grade B', 'Grade C', 'Grade D', 'Not Yet Rated'].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedGrade === g
                  ? 'bg-[#EDE9FE] dark:bg-[#2E244A] text-[#6D28D9] dark:text-[#EDE9FE] font-bold border border-[#A78BFA]/30'
                  : 'bg-[#FAF9FF] dark:bg-[#241D38] text-[#77738C] dark:text-[#A59DB8] hover:bg-[#F4F0FF]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Segmented Student Cohort Table */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-[#332A50] shadow-card overflow-hidden">
        <div className="p-5 border-b border-[#E9E4F5] dark:border-[#332A50] flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#242038] dark:text-white font-heading">
            Segmented Student Cohort ({filteredList.length} Students)
          </h3>
          <span className="text-xs text-[#77738C] dark:text-[#A59DB8]">Click any row to inspect profile</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9FF] dark:bg-[#161224] text-[#77738C] dark:text-[#A59DB8] uppercase tracking-wider border-b border-[#E9E4F5] dark:border-[#332A50]">
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Roll No</th>
                <th className="p-4 font-semibold">Success Score</th>
                <th className="p-4 font-semibold">Grade</th>
                <th className="p-4 font-semibold">Attendance</th>
                <th className="p-4 font-semibold">CGPA</th>
                <th className="p-4 font-semibold">Placement Readiness</th>
                <th className="p-4 font-semibold">Identified Behavioral Cluster</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E4F5] dark:divide-[#332A50]">
              {filteredList.map((item) => {
                const isInsufficient = item.student.hasInsufficientData;

                return (
                  <tr 
                    key={item.student.id}
                    className="hover:bg-[#F4F0FF]/80 dark:hover:bg-[#241D38]/80 transition cursor-pointer"
                    onClick={() => setSelectedStudentForModal(item.student)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={item.student.avatarUrl} 
                          alt={item.student.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-[#7C3AED]/20"
                        />
                        <div>
                          <p className="font-bold text-[#242038] dark:text-white">{item.student.name}</p>
                          <p className="text-[10px] text-[#77738C] dark:text-[#A59DB8]">{item.student.branch}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[#77738C] dark:text-[#A59DB8]">
                      {item.student.rollNo}
                    </td>

                    <td className="p-4 font-bold text-[#242038] dark:text-white font-mono">
                      {isInsufficient ? '—' : item.scoreData.overallScore}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.grade === 'Grade A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                        item.grade === 'Grade B' ? 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE]' :
                        item.grade === 'Grade C' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                        item.grade === 'Grade D' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.grade}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`font-semibold ${item.attPct < 75 && !isInsufficient ? 'text-rose-600' : 'text-[#242038] dark:text-white'}`}>
                        {isInsufficient ? 'Pending' : `${item.attPct}%`}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-[#242038] dark:text-white">
                      {isInsufficient ? 'Pending' : item.cgpa}
                    </td>

                    <td className="p-4">
                      {item.student.placementReadiness.assessed ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.student.placementReadiness.status === 'High' ? 'bg-emerald-100 text-emerald-800' :
                          item.student.placementReadiness.status === 'Moderate' ? 'bg-[#EDE9FE] text-[#6D28D9]' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.student.placementReadiness.status} ({item.student.placementReadiness.overallPercent}%)
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#77738C]">Not Assessed</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="text-[11px] font-medium text-[#7C3AED] dark:text-[#A78BFA]">
                        {item.cluster}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchStudent(item.student.id);
                          setActiveTab('dashboard');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#2E244A] dark:text-[#EDE9FE] hover:bg-[#DDD6FE] font-bold text-xs transition"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Student Profile View Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-[#332A50] p-6 md:p-8 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#E9E4F5] dark:border-[#332A50]">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedStudentForModal.avatarUrl} 
                  alt={selectedStudentForModal.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#7C3AED]/30"
                />
                <div>
                  <h3 className="text-base font-bold text-[#242038] dark:text-white font-heading">
                    {selectedStudentForModal.name}
                  </h3>
                  <p className="text-xs text-[#77738C] dark:text-[#A59DB8] font-mono">
                    {selectedStudentForModal.rollNo} • {selectedStudentForModal.branch}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudentForModal(null)} 
                className="text-[#77738C] hover:text-[#242038] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38]">
                <span className="text-[#77738C] dark:text-[#A59DB8] block">Semester & Section:</span>
                <strong className="text-[#242038] dark:text-white">Semester {selectedStudentForModal.semester} ({selectedStudentForModal.classSection})</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38]">
                <span className="text-[#77738C] dark:text-[#A59DB8] block">Assigned Mentor:</span>
                <strong className="text-[#242038] dark:text-white">{selectedStudentForModal.mentorName}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38]">
                <span className="text-[#77738C] dark:text-[#A59DB8] block">Email:</span>
                <strong className="text-[#242038] dark:text-white truncate block">{selectedStudentForModal.email}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-[#F4F0FF] dark:bg-[#241D38]">
                <span className="text-[#77738C] dark:text-[#A59DB8] block">Placement Readiness:</span>
                <strong className="text-[#7C3AED] dark:text-[#A78BFA]">{selectedStudentForModal.placementReadiness.status} ({selectedStudentForModal.placementReadiness.overallPercent}%)</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-[#242038] dark:text-white font-heading">Enrolled Course Attendance:</h4>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {(selectedStudentForModal.attendanceRecords || []).map(s => {
                  const pct = s.total > 0 ? ((s.attended / s.total) * 100).toFixed(1) : '0';
                  return (
                    <div key={s.subjectCode} className="p-2 rounded-xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-[#332A50] flex justify-between items-center text-[11px]">
                      <span>{s.subjectName} ({s.subjectCode})</span>
                      <span className={`font-bold ${Number(pct) < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {pct}% ({s.attended}/{s.total})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#77738C] hover:bg-[#F4F0FF] dark:hover:bg-[#241D38]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  switchStudent(selectedStudentForModal.id);
                  setSelectedStudentForModal(null);
                  setActiveTab('dashboard');
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-violet-500/20"
              >
                Switch to this Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

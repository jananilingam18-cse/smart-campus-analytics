import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  calculateStudentSuccessScore, 
  calculateOverallAttendance, 
  calculateAcademicScore, 
  calculateAssignmentRate,
  calculateClassesNeededFor75,
  evaluateBadges
} from '../utils/scoring';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  platforms?: Array<{ name: string; url: string; type: 'Free' | 'Freemium' | 'Paid'; desc: string }>;
  suggestedActions?: string[];
}

export const AIAssistantPage: React.FC = () => {
  const { currentStudent } = useApp();

  const breakdown = calculateStudentSuccessScore(currentStudent);
  const { attended, total, percentage: attendancePct } = calculateOverallAttendance(currentStudent);
  const { cgpa } = calculateAcademicScore(currentStudent);
  const { completed, total: totalAssignments, percentage: assignPct } = calculateAssignmentRate(currentStudent);
  const badges = evaluateBadges(currentStudent);

  // Check low attendance subjects
  const lowAttendanceSubjects = (currentStudent.attendanceRecords || []).filter(s => {
    return s.total > 0 && ((s.attended / s.total) * 100 < 75);
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hi! I'm your Campus IQ AI Assistant. Let's work together to improve your academic performance, build your skills, and achieve your goals.\n\nI have reviewed your current records for Semester ${currentStudent.semester} (${currentStudent.branch}). Your current Success Score is ${breakdown.overallScore}/100 (${breakdown.gradeSegment}). How can I assist your learning today?`,
      timestamp: 'Just now',
      suggestedActions: [
        'Analyze my Success Score',
        'How can I improve my attendance?',
        'Create a 7-day study plan',
        'Which subjects need more attention?'
      ]
    }
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Knowledge base of external learning platforms
  const PLATFORMS_MAP = {
    swayam: { name: 'SWAYAM', url: 'https://swayam.gov.in', type: 'Free' as const, desc: 'Government of India national online education portal for credit transfer & university exams.' },
    nptel: { name: 'NPTEL', url: 'https://nptel.ac.in', type: 'Free' as const, desc: 'IIT & IISc certified engineering video lectures and graded assignments.' },
    freecodecamp: { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', type: 'Free' as const, desc: 'Interactive curriculum covering Data Structures, Web, and Python.' },
    leetcode: { name: 'LeetCode', url: 'https://leetcode.com', type: 'Freemium' as const, desc: 'Algorithmic problem solving, dynamic programming patterns, and interview roadmaps.' },
    hackerrank: { name: 'HackerRank', url: 'https://www.hackerrank.com', type: 'Free' as const, desc: 'Core language proficiency certifications in Python, C++, SQL, and problem solving.' },
    coursera: { name: 'Coursera', url: 'https://www.coursera.org', type: 'Freemium' as const, desc: 'University verified specializations in Deep Learning, Cloud Architecture, and DevOps.' },
    linkedin: { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning', type: 'Paid' as const, desc: 'Executive communication, corporate presentation skills, and behavioral interview coaching.' }
  };

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      generateResponse(promptText);
      setIsThinking(false);
    }, 600);
  };

  const generateResponse = (prompt: string) => {
    const q = prompt.toLowerCase();
    let replyText = '';
    let platformsList: ChatMessage['platforms'] = undefined;
    let actionsList: string[] = [];

    if (q.includes('success score') || q.includes('score')) {
      replyText = `### Success Score Diagnostic (${breakdown.overallScore}/100 — ${breakdown.gradeSegment})\n\n` +
        `Your score is mathematically calculated as:\n` +
        `• Academic Component (40% weight): ${breakdown.academicScore}% derived from CGPA ${cgpa}/10 (+${(breakdown.academicScore * 0.4).toFixed(1)} pts)\n` +
        `• Attendance Compliance (25% weight): ${breakdown.attendanceScore}% overall (+${(breakdown.attendanceScore * 0.25).toFixed(1)} pts)\n` +
        `• Assignment Completion (20% weight): ${breakdown.assignmentScore}% completed on-time (+${(breakdown.assignmentScore * 0.2).toFixed(1)} pts)\n` +
        `• Co-Curricular Events (15% weight): ${breakdown.participationScore}% normalized points (+${(breakdown.participationScore * 0.15).toFixed(1)} pts)\n\n` +
        `Strongest Indicator: ${breakdown.strongestIndicator}\n` +
        `Weakest Indicator: ${breakdown.weakestIndicator}\n\n` +
        `Next Step: ${breakdown.nextActionSteps[0]}`;
      actionsList = ['How can I earn my next badge?', 'Which subjects need more attention?'];
    } 
    else if (q.includes('attendance') || q.includes('shortage')) {
      if (lowAttendanceSubjects.length > 0) {
        const sub = lowAttendanceSubjects[0];
        const needed = calculateClassesNeededFor75(sub.attended, sub.total);
        replyText = `### ⚠️ Attendance Recovery Plan: ${sub.subjectName}\n\n` +
          `• Current Standing: Attended ${sub.attended} out of ${sub.total} conducted sessions (${((sub.attended / sub.total) * 100).toFixed(1)}%).\n` +
          `• Shortage Gap: You are currently below the university 75.0% compliance threshold.\n` +
          `• Recovery Formula: Assuming no further absences, you must attend the next ${needed} consecutive classes in ${sub.subjectName} to reach 75%.\n\n` +
          `Practical Recommendations:\n` +
          `1. Check your timetable: Next class is on your schedule with ${sub.facultyName}.\n` +
          `2. Request an attendance audit meeting with faculty mentor ${currentStudent.mentorName} in ${currentStudent.mentorCabin}.\n` +
          `3. Submit medical or college representation duty slips if applicable.`;
      } else {
        replyText = `### Attendance Status: Excellent Compliance (${attendancePct}%)\n\n` +
          `Congratulations! You have satisfied institutional criteria across all enrolled subjects with zero active attendance shortages.\n\n` +
          `• Total Sessions Attended: ${attended} / ${total}\n` +
          `• Attendance Champion Badge status: Eligible & Qualified.\n\n` +
          `Keep up this punctuality to maximize internal assessment and lab eligibility marks.`;
      }
      actionsList = ['Create a 7-day study plan', 'Help me prepare for placements'];
    }
    else if (q.includes('study plan') || q.includes('7-day') || q.includes('revision')) {
      replyText = `### Personalized 7-Day Academic Revision Roadmap\n\n` +
        `Designed for ${currentStudent.name} based on upcoming Internal Assessment:\n\n` +
        `• Day 1 (Mon): Data Structures & Algorithms — Balanced Trees (AVL Rotations, Red-Black Trees). Solve 3 LeetCode Medium tree problems.\n` +
        `• Day 2 (Tue): DBMS — Distributed 2-Phase Commit & WAL Logging. Review course handout from Prof. Meenakshi Iyer.\n` +
        `• Day 3 (Wed): Operating Systems — Process scheduling (CFS) & Semaphore deadlocks. Practice Bankers Algorithm problem sets.\n` +
        `• Day 4 (Thu): AI & ML Lab — PyTorch Autograd tensors & backpropagation review for lab practical.\n` +
        `• Day 5 (Fri): DSA & Mock Exam — Graph Traversals (Dijkstra, DFS low-link). Timed 90-minute IA practice paper.\n` +
        `• Day 6 (Sat): Placement Coding & Aptitude — 2 LeetCode questions + 20 Quantitative Aptitude speed math drills.\n` +
        `• Day 7 (Sun): Rest & Peer Review — Review error logs, consolidate notes, and prepare for upcoming week.`;
      platformsList = [PLATFORMS_MAP.nptel, PLATFORMS_MAP.leetcode, PLATFORMS_MAP.swayam];
      actionsList = ['Suggest learning platforms for my weak subjects', 'Help me prepare for placements'];
    }
    else if (q.includes('attention') || q.includes('weak') || q.includes('subject')) {
      const records = currentStudent.attendanceRecords || [];
      const lowestAtt = [...records].sort((a, b) => (a.attended / a.total) - (b.attended / b.total))[0];
      replyText = `### Subject Priority Matrix for Semester ${currentStudent.semester}\n\n` +
        `1. Priority 1: ${lowestAtt?.subjectName || 'Data Structures'}\n` +
        `   • Factor: Low attendance compliance (${((lowestAtt?.attended / lowestAtt?.total) * 100).toFixed(1)}%) & upcoming written exam.\n` +
        `   • Action: Attend all upcoming classes and download Chapter 2 lecture notes from My Learning.\n\n` +
        `2. Priority 2: Database Management Systems (CS502)\n` +
        `   • Factor: Assignment 3 deadline approaching on October 18.\n` +
        `   • Action: Complete distributed transaction simulation before portal closes.\n\n` +
        `3. Priority 3: Operating Systems & Kernels (CS503)\n` +
        `   • Factor: Heavy conceptual depth on Linux kernel concurrency.\n` +
        `   • Action: Study NPTEL lecture modules 4 & 5.`;
      platformsList = [PLATFORMS_MAP.nptel, PLATFORMS_MAP.swayam];
      actionsList = ['Create a 7-day study plan', 'Suggest learning platforms for my weak subjects'];
    }
    else if (q.includes('placement') || q.includes('career') || q.includes('interview')) {
      const p = currentStudent.placementReadiness;
      replyText = `### Campus Placement Readiness Blueprint\n\n` +
        `• Overall Readiness Index: ${p.overallPercent}% (${p.status})\n` +
        `• Coding Proficiency: ${p.codingScore}% | Quantitative Aptitude: ${p.aptitudeScore}%\n` +
        `• Technical Interview Score: ${p.mockInterviewScore}% | Verified Projects: ${p.projectsCount}\n\n` +
        `High-Impact Intervention Strategy:\n` +
        `1. Data Structures Problem Solving: Aim for 75+ solved questions on LeetCode covering Arrays, Trees, and DP.\n` +
        `2. Mock Interviews: Schedule a session with campus placement officer Ms. Preeti Kapoor.\n` +
        `3. Industry Capstone: Feature your KPMG GenAI case challenge on GitHub and LinkedIn.`;
      platformsList = [PLATFORMS_MAP.leetcode, PLATFORMS_MAP.hackerrank, PLATFORMS_MAP.freecodecamp, PLATFORMS_MAP.linkedin];
      actionsList = ['Create a 7-day study plan', 'How can I earn my next badge?'];
    }
    else if (q.includes('badge') || q.includes('achievement')) {
      const lockedBadges = badges.filter(b => !b.earned);
      const nextBadge = lockedBadges[0] || badges[0];
      replyText = `### Next Unlockable Achievement: ${nextBadge.name}\n\n` +
        `• Category: ${nextBadge.category}\n` +
        `• Current Progress: ${nextBadge.unlockProgress}%\n` +
        `• Unlock Requirement: ${nextBadge.unlockRequirement}\n\n` +
        (nextBadge.warningReason ? `⚠️ Blocker Note: ${nextBadge.warningReason}\n\n` : '') +
        `Unlocking this badge will add direct credibility to your profile and inspire your peers on the Class Leaderboard!`;
      actionsList = ['Analyze my Success Score', 'How can I improve my attendance?'];
    }
    else if (q.includes('platform') || q.includes('learn')) {
      replyText = `### Recommended Online Learning Platforms for Your Profile\n\n` +
        `Here are official academic and technical repositories mapped to your course syllabus:`;
      platformsList = [
        PLATFORMS_MAP.swayam,
        PLATFORMS_MAP.nptel,
        PLATFORMS_MAP.leetcode,
        PLATFORMS_MAP.freecodecamp,
        PLATFORMS_MAP.coursera
      ];
      actionsList = ['Create a 7-day study plan', 'Which subjects need more attention?'];
    }
    else {
      replyText = `Thank you for your question. Based on your profile (${currentStudent.name}, ${currentStudent.rollNo}, Success Score ${breakdown.overallScore}/100):\n\n` +
        `• Your strongest area is ${breakdown.strongestIndicator}.\n` +
        `• Your primary focus area is ${breakdown.weakestIndicator}.\n\n` +
        `I recommend prioritizing upcoming deadlines in your Academic Calendar and maintaining attendance above 75%. Let me know if you would like a targeted 7-day revision plan or placement roadmap!`;
      actionsList = ['Analyze my Success Score', 'Create a 7-day study plan'];
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: replyText,
      timestamp: 'Just now',
      platforms: platformsList,
      suggestedActions: actionsList
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const defaultPrompts = [
    'Analyze my Success Score',
    'How can I improve my attendance?',
    'Create a 7-day study plan',
    'Which subjects need more attention?',
    'Help me improve my assignment completion',
    'Suggest learning platforms for my weak subjects',
    'Help me prepare for placements',
    'How can I earn my next badge?'
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6D28D9] to-[#7C3AED] text-white flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
              Campus IQ AI Assistant
            </h1>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Personalized, explainable academic coaching connected to your live records
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-white dark:bg-[#1D172E] text-[#6D28D9] dark:text-purple-300 text-xs font-semibold hover:border-[#7C3AED] transition self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Conversation</span>
        </button>
      </div>

      {/* AI Privacy & Accuracy Guardrail Banner */}
      <div className="p-3.5 rounded-2xl bg-[#F4F0FF] dark:bg-purple-950/30 border border-[#E9E4F5] dark:border-purple-900/40 text-[11px] text-[#6D28D9] dark:text-purple-300 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0" />
        <span>
          <strong>AI Safety & Privacy Protocol:</strong> Recommendations use verified institutional records without exposing peer privacy. Suggestions do not replace official faculty mentoring.
        </span>
      </div>

      {/* Chat Conversation Container */}
      <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#EDE9FE] dark:bg-purple-900/50 text-[#6D28D9] dark:text-purple-200'
                  : 'bg-gradient-to-tr from-[#6D28D9] to-[#7C3AED] text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-[#EDE9FE] dark:bg-purple-900/40 text-[#242038] dark:text-purple-100 border border-[#E9E4F5] dark:border-purple-800/40 font-medium'
                  : 'bg-white dark:bg-[#13101E] text-[#242038] dark:text-purple-100 border border-[#E9E4F5] dark:border-purple-900/40 shadow-xs'
              }`}>
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Recommended Official Platforms */}
                {msg.platforms && msg.platforms.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E9E4F5] dark:border-purple-900/40 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#77738C] dark:text-purple-300 block">
                      Recommended Learning Repositories
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.platforms.map(p => (
                        <a
                          key={p.name}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-[#FAF9FF] dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 hover:border-[#7C3AED] flex items-start justify-between gap-2 group transition cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-[#242038] dark:text-purple-100 group-hover:text-[#6D28D9]">
                              <span>{p.name}</span>
                              <ExternalLink className="w-3 h-3 text-[#77738C]" />
                            </div>
                            <p className="text-[10px] text-[#77738C] dark:text-purple-300 line-clamp-1">{p.desc}</p>
                          </div>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                            p.type === 'Free' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            p.type === 'Freemium' ? 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/50 dark:text-purple-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {p.type}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested follow up buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 flex flex-wrap gap-1.5 border-t border-[#E9E4F5] dark:border-purple-900/40">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendPrompt(action)}
                        className="px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#DDD6FE] dark:bg-purple-900/40 dark:text-purple-300 text-[11px] font-semibold transition cursor-pointer"
                      >
                        {action} →
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] ${msg.sender === 'user' ? 'text-[#77738C] dark:text-purple-300 text-right' : 'text-[#77738C] dark:text-purple-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 text-xs text-[#77738C] dark:text-purple-300 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#7C3AED] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-spin" />
                <span>Analyzing {currentStudent.name}'s academic records...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts Quick Bar */}
        <div className="p-2.5 bg-[#FAF9FF] dark:bg-[#13101E] border-t border-[#E9E4F5] dark:border-purple-900/40 overflow-x-auto flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-[#77738C] dark:text-purple-400 shrink-0 ml-1">Suggestions:</span>
          {defaultPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(p)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 hover:border-[#7C3AED] text-[#242038] dark:text-purple-200 hover:text-[#6D28D9] text-[11px] font-medium whitespace-nowrap transition cursor-pointer shadow-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="p-3 bg-white dark:bg-[#1D172E] border-t border-[#E9E4F5] dark:border-purple-900/40 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask Campus IQ AI Assistant about attendance, exams, study plan...`}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 placeholder-[#77738C]/60 focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isThinking}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] disabled:opacity-40 text-white shadow-sm transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};

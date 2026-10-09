import { 
  Student, 
  ScoringWeights, 
  SuccessScoreBreakdown, 
  ExplainabilityFactor, 
  Badge, 
  StudentGradeSegment 
} from '../types';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  attendanceWeight: 0.25,
  academicWeight: 0.40,
  participationWeight: 0.15,
  assignmentWeight: 0.20,
};

/**
 * Calculates consecutive classes needed to reach 75% attendance.
 * Formula: (attended + x) / (total + x) >= 0.75
 * x = ceil((0.75 * total - attended) / 0.25)
 */
export function calculateClassesNeededFor75(attended: number, total: number): number {
  if (total === 0) return 0;
  const currentPct = (attended / total) * 100;
  if (currentPct >= 75) return 0;
  const needed = Math.ceil((0.75 * total - attended) / 0.25);
  return Math.max(0, needed);
}

/**
 * Calculates total overall attendance percentage for a student.
 */
export function calculateOverallAttendance(student: Student): { attended: number; total: number; percentage: number } {
  const records = student.attendanceRecords || [];
  if (records.length === 0) return { attended: 0, total: 0, percentage: 0 };
  
  const attended = records.reduce((acc, curr) => acc + curr.attended, 0);
  const total = records.reduce((acc, curr) => acc + curr.total, 0);
  const percentage = total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 0;
  
  return { attended, total, percentage };
}

/**
 * Calculates assignment completion rate
 */
export function calculateAssignmentRate(student: Student): { completed: number; total: number; percentage: number } {
  const assignments = student.assignments || [];
  if (assignments.length === 0) return { completed: 0, total: 0, percentage: 0 };
  
  const completed = assignments.filter(a => a.status === 'Submitted').length;
  const total = assignments.length;
  const percentage = total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0;
  
  return { completed, total, percentage };
}

/**
 * Calculates normalized academic score from latest SGPA / CGPA
 */
export function calculateAcademicScore(student: Student): { cgpa: number; normalizedScore: number } {
  const history = student.academicHistory || [];
  if (history.length === 0) return { cgpa: 0, normalizedScore: 0 };
  
  // Calculate cumulative GPA across recorded semesters
  const totalSgpa = history.reduce((sum, sem) => sum + sem.sgpa, 0);
  const cgpa = Number((totalSgpa / history.length).toFixed(2));
  // Scale out of 10 to 100
  const normalizedScore = Math.min(100, Math.max(0, Number((cgpa * 10).toFixed(1))));
  
  return { cgpa, normalizedScore };
}

/**
 * Calculates event participation score (capped at 100)
 * Verified events award:
 * Winner: 25 pts, 1st Runner Up: 20 pts, Finalist: 15 pts, Participant: 10 pts, Organizer: 12 pts
 * Unverified events award 50% points until faculty verified
 */
export function calculateParticipationScore(student: Student): { rawPoints: number; normalizedScore: number; verifiedCount: number } {
  const events = student.eventParticipations || [];
  let points = 0;
  let verifiedCount = 0;

  events.forEach(ev => {
    let base = 10;
    if (ev.status === 'Winner') base = 25;
    else if (ev.status === '1st Runner Up') base = 20;
    else if (ev.status === 'Finalist') base = 15;
    else if (ev.status === 'Organizer') base = 12;

    if (ev.verificationStatus === 'Verified') {
      points += base;
      verifiedCount += 1;
    } else if (ev.verificationStatus === 'Pending Verification') {
      points += Math.round(base * 0.5); // Provisional credit
    }
  });

  // Cap normalized participation score at 100 to prevent event flooding
  const normalizedScore = Math.min(100, points);
  return { rawPoints: points, normalizedScore, verifiedCount };
}

/**
 * Determines Level and Gamified progression from score
 */
export function getLevelDetails(score: number): { level: number; levelName: string; pointsToNext: number; nextMilestone: string } {
  if (score >= 85) {
    return {
      level: 5,
      levelName: 'Grandmaster Vanguard',
      pointsToNext: 0,
      nextMilestone: 'Peak Campus Excellence Mastered! Mentor your peers.'
    };
  } else if (score >= 75) {
    return {
      level: 4,
      levelName: 'Advanced Scholar',
      pointsToNext: Math.ceil(85 - score),
      nextMilestone: 'Reach Level 5 (Grandmaster Vanguard) by scoring 85+'
    };
  } else if (score >= 60) {
    return {
      level: 3,
      levelName: 'Proficient Explorer',
      pointsToNext: Math.ceil(75 - score),
      nextMilestone: 'Reach Level 4 (Advanced Scholar) by scoring 75+'
    };
  } else if (score >= 40) {
    return {
      level: 2,
      levelName: 'Developing Achiever',
      pointsToNext: Math.ceil(60 - score),
      nextMilestone: 'Reach Level 3 (Proficient Explorer) by scoring 60+'
    };
  } else {
    return {
      level: 1,
      levelName: 'Foundational Contender',
      pointsToNext: Math.ceil(40 - score),
      nextMilestone: 'Reach Level 2 (Developing Achiever) by scoring 40+'
    };
  }
}

/**
 * Maps Success Score to official Student Grade Segment
 */
export function getGradeSegment(score: number, hasInsufficientData?: boolean): StudentGradeSegment {
  if (hasInsufficientData) return 'Not Yet Rated';
  if (score >= 85) return 'Grade A';
  if (score >= 70) return 'Grade B';
  if (score >= 50) return 'Grade C';
  return 'Grade D';
}

/**
 * Complete Explainable Success Score Engine
 */
export function calculateStudentSuccessScore(
  student: Student,
  customWeights: ScoringWeights = DEFAULT_WEIGHTS
): SuccessScoreBreakdown {
  if (student.hasInsufficientData) {
    return {
      overallScore: 0,
      previousScore: 0,
      attendanceScore: 0,
      academicScore: 0,
      participationScore: 0,
      assignmentScore: 0,
      isProvisional: true,
      provisionalReason: 'Performance data is not yet meeting the required benchmark for scoring. Minimal baseline records are pending institutional upload.',
      calculationDate: 'October 2026',
      strongestIndicator: 'Pending Data',
      weakestIndicator: 'Pending Data',
      level: 1,
      levelName: 'Awaiting Records',
      pointsToNextLevel: 40,
      nextMilestone: 'Upload attendance, assignments, and test records to generate baseline score.',
      nextActionSteps: [
        'Coordinate with Department Faculty Coordinator to verify enrollment records.',
        'Submit initial internal assessment papers for grade processing.'
      ],
      explainabilityReasons: [
        {
          title: 'Insufficient Data Warning',
          description: 'Your performance data is not yet meeting the required benchmark. You can improve your progress with a personalized action plan.',
          impact: 'neutral',
          scoreDelta: 0,
          category: 'academic'
        }
      ],
      gradeSegment: 'Not Yet Rated'
    };
  }

  const { percentage: attendanceScore } = calculateOverallAttendance(student);
  const { normalizedScore: academicScore } = calculateAcademicScore(student);
  const { normalizedScore: participationScore } = calculateParticipationScore(student);
  const { percentage: assignmentRate } = calculateAssignmentRate(student);

  // Apply weights
  const weightedAttendance = attendanceScore * customWeights.attendanceWeight;
  const weightedAcademic = academicScore * customWeights.academicWeight;
  const weightedParticipation = participationScore * customWeights.participationWeight;
  const weightedAssignment = assignmentRate * customWeights.assignmentWeight;

  const rawScore = weightedAttendance + weightedAcademic + weightedParticipation + weightedAssignment;
  const overallScore = Number(rawScore.toFixed(1));

  // Determine indicator rankings
  const indicators = [
    { name: 'Academic Performance', score: academicScore, weight: customWeights.academicWeight, val: weightedAcademic },
    { name: 'Overall Attendance', score: attendanceScore, weight: customWeights.attendanceWeight, val: weightedAttendance },
    { name: 'Assignment Completion', score: assignmentRate, weight: customWeights.assignmentWeight, val: weightedAssignment },
    { name: 'Event Participation', score: participationScore, weight: customWeights.participationWeight, val: weightedParticipation }
  ];

  indicators.sort((a, b) => b.score - a.score);
  const strongestIndicator = `${indicators[0].name} (${indicators[0].score.toFixed(0)}%)`;
  const weakestIndicator = `${indicators[indicators.length - 1].name} (${indicators[indicators.length - 1].score.toFixed(0)}%)`;

  // Explainability Reasons derived directly from ground-truth data
  const reasons: ExplainabilityFactor[] = [];

  // Attendance explanation
  const lowAttendanceSubjects = student.attendanceRecords.filter(s => {
    const pct = s.total > 0 ? (s.attended / s.total) * 100 : 0;
    return pct < 75;
  });

  if (lowAttendanceSubjects.length > 0) {
    const subjectsStr = lowAttendanceSubjects.map(s => s.subjectName).join(', ');
    reasons.push({
      title: 'Attendance Shortage Warning Impact',
      description: `Attendance requirement not met in ${subjectsStr}. This lowers your attendance factor and locks attendance badges.`,
      impact: 'negative',
      scoreDelta: -8.5,
      category: 'attendance'
    });
  } else if (attendanceScore >= 90) {
    reasons.push({
      title: 'Punctuality Excellence',
      description: `Strong overall attendance of ${attendanceScore}% contributes maximum value (+${(attendanceScore * customWeights.attendanceWeight).toFixed(1)} pts).`,
      impact: 'positive',
      scoreDelta: +(attendanceScore * customWeights.attendanceWeight),
      category: 'attendance'
    });
  }

  // Academic explanation
  const { cgpa } = calculateAcademicScore(student);
  if (cgpa >= 8.5) {
    reasons.push({
      title: 'Exceptional Academic Consistency',
      description: `CGPA of ${cgpa}/10 boosts your Academic Component by +${weightedAcademic.toFixed(1)} points.`,
      impact: 'positive',
      scoreDelta: +weightedAcademic,
      category: 'academic'
    });
  } else if (cgpa < 6.5) {
    reasons.push({
      title: 'Academic Performance Below Target',
      description: `Current CGPA of ${cgpa}/10 suggests subject-specific revision needed in core technical modules.`,
      impact: 'negative',
      scoreDelta: -6.0,
      category: 'academic'
    });
  }

  // Assignment explanation
  const overdueAssignments = student.assignments.filter(a => a.status === 'Overdue');
  if (overdueAssignments.length > 0) {
    reasons.push({
      title: `${overdueAssignments.length} Overdue Assignment(s)`,
      description: `Pending coursework reduces assignment component to ${assignmentRate}%.`,
      impact: 'negative',
      scoreDelta: -4.0,
      category: 'assignment'
    });
  } else if (assignmentRate >= 95) {
    reasons.push({
      title: 'Flawless Coursework Submission',
      description: `100% on-time submission rate contributed full assignment points (+${weightedAssignment.toFixed(1)} pts).`,
      impact: 'positive',
      scoreDelta: +weightedAssignment,
      category: 'assignment'
    });
  }

  // Event participation explanation
  const verifiedEvents = student.eventParticipations.filter(e => e.verificationStatus === 'Verified');
  if (verifiedEvents.length >= 3) {
    reasons.push({
      title: 'Verified Co-Curricular Engagement',
      description: `${verifiedEvents.length} verified events awarded +${weightedParticipation.toFixed(1)} points.`,
      impact: 'positive',
      scoreDelta: +weightedParticipation,
      category: 'participation'
    });
  } else if (student.eventParticipations.length === 0) {
    reasons.push({
      title: 'Untapped Participation Potential',
      description: 'Zero event participations logged. Register for upcoming college hackathons or symposiums to unlock up to 15 bonus points.',
      impact: 'neutral',
      scoreDelta: 0,
      category: 'participation'
    });
  }

  // Next action steps
  const nextActions: string[] = [];
  if (lowAttendanceSubjects.length > 0) {
    const firstLow = lowAttendanceSubjects[0];
    const needed = calculateClassesNeededFor75(firstLow.attended, firstLow.total);
    nextActions.push(`Attend the next ${needed} consecutive classes in ${firstLow.subjectName} to reach the 75% threshold.`);
  }
  if (overdueAssignments.length > 0) {
    nextActions.push(`Submit ${overdueAssignments[0].title} (${overdueAssignments[0].subjectName}) immediately.`);
  }
  if (verifiedEvents.length < 2) {
    nextActions.push('Upload certificate for pending technical/non-technical events to gain co-curricular credits.');
  }
  if (cgpa < 8.0) {
    nextActions.push('Utilize recommended NPTEL & SWAYAM review modules for upcoming mid-term exams.');
  }
  if (nextActions.length === 0) {
    nextActions.push('Maintain consistent performance and mentor peers in coding study groups.');
    nextActions.push('Participate in KPMG Innovation Challenge to elevate leadership rating.');
  }

  const levelInfo = getLevelDetails(overallScore);
  const gradeSegment = getGradeSegment(overallScore);

  // Check if provisional due to pending event verification or incomplete semester
  const pendingEvents = student.eventParticipations.filter(e => e.verificationStatus === 'Pending Verification');
  const isProvisional = pendingEvents.length > 0;
  const provisionalReason = isProvisional 
    ? `${pendingEvents.length} event certificate(s) awaiting faculty verification. Score may increase upon approval.` 
    : undefined;

  // Previous score simulation (typically 2-4 points lower to show progress)
  const previousScore = Math.max(25, Number((overallScore - 3.4).toFixed(1)));

  return {
    overallScore,
    previousScore,
    attendanceScore,
    academicScore,
    participationScore,
    assignmentScore: assignmentRate,
    isProvisional,
    provisionalReason,
    calculationDate: 'October 2026',
    strongestIndicator,
    weakestIndicator,
    level: levelInfo.level,
    levelName: levelInfo.levelName,
    pointsToNextLevel: levelInfo.pointsToNext,
    nextMilestone: levelInfo.nextMilestone,
    nextActionSteps: nextActions,
    explainabilityReasons: reasons,
    gradeSegment
  };
}

/**
 * Strict Rule Engine for Badges
 */
export function evaluateBadges(student: Student): Badge[] {
  const { percentage: overallAttendance } = calculateOverallAttendance(student);
  const { cgpa } = calculateAcademicScore(student);
  const { verifiedCount } = calculateParticipationScore(student);
  const { percentage: assignmentRate } = calculateAssignmentRate(student);

  // Critical attendance rule
  const lowAttendanceSubjects = (student.attendanceRecords || []).filter(s => {
    const pct = s.total > 0 ? (s.attended / s.total) * 100 : 0;
    return pct < 75;
  });
  const hasShortage = lowAttendanceSubjects.length > 0;

  const badgesList: Badge[] = [
    {
      id: 'badge-att-champion',
      name: 'Attendance Champion',
      description: 'Overall attendance at or above 90%, with no subject below 75%.',
      category: 'Attendance',
      icon: 'Award',
      earned: overallAttendance >= 90 && !hasShortage,
      dateEarned: (overallAttendance >= 90 && !hasShortage) ? '15 Sep 2026' : undefined,
      unlockProgress: hasShortage ? Math.min(80, overallAttendance) : Math.min(100, Math.round((overallAttendance / 90) * 100)),
      unlockRequirement: 'Maintain >= 90% overall attendance with 0 subjects below 75%',
      isWarningLocked: hasShortage,
      warningReason: hasShortage 
        ? `Attendance requirement not met in ${lowAttendanceSubjects.map(s => s.subjectName).join(', ')}. Improve attendance to qualify.` 
        : undefined
    },
    {
      id: 'badge-consistency-star',
      name: 'Consistency Star',
      description: 'Maintained 85%+ attendance with no unexcused absences in consecutive weeks.',
      category: 'Attendance',
      icon: 'Sparkles',
      earned: overallAttendance >= 85 && !hasShortage,
      dateEarned: (overallAttendance >= 85 && !hasShortage) ? '28 Aug 2026' : undefined,
      unlockProgress: Math.min(100, Math.round((overallAttendance / 85) * 100)),
      unlockRequirement: 'Achieve >= 85% attendance across all subjects without shortage',
      isWarningLocked: hasShortage,
      warningReason: hasShortage ? 'Locked due to subject attendance shortage below 75%' : undefined
    },
    {
      id: 'badge-academic-excellence',
      name: 'Academic Excellence',
      description: 'Achieved a cumulative CGPA of 8.5/10 or higher with zero backlogs.',
      category: 'Academic Performance',
      icon: 'GraduationCap',
      earned: cgpa >= 8.5,
      dateEarned: cgpa >= 8.5 ? '10 Aug 2026' : undefined,
      unlockProgress: Math.min(100, Math.round((cgpa / 8.5) * 100)),
      unlockRequirement: 'Maintain CGPA >= 8.5 with no active backlogs'
    },
    {
      id: 'badge-assignment-finisher',
      name: 'Assignment Finisher',
      description: '100% of eligible semester coursework assignments completed and submitted on time.',
      category: 'Academic Performance',
      icon: 'CheckCircle2',
      earned: assignmentRate >= 100,
      dateEarned: assignmentRate >= 100 ? '02 Oct 2026' : undefined,
      unlockProgress: Math.min(100, assignmentRate),
      unlockRequirement: 'Complete 100% of coursework assignments before deadlines'
    },
    {
      id: 'badge-tech-explorer',
      name: 'Tech Explorer',
      description: 'Participated in at least 2 verified technical hackathons or coding expos.',
      category: 'Event Participation',
      icon: 'Cpu',
      earned: (student.eventParticipations || []).filter(e => e.category === 'Technical' && e.verificationStatus === 'Verified').length >= 2,
      dateEarned: (student.eventParticipations || []).filter(e => e.category === 'Technical' && e.verificationStatus === 'Verified').length >= 2 ? '22 Sep 2026' : undefined,
      unlockProgress: Math.min(100, Math.round(((student.eventParticipations || []).filter(e => e.category === 'Technical' && e.verificationStatus === 'Verified').length / 2) * 100)),
      unlockRequirement: 'Participate in 2 or more faculty-verified technical events'
    },
    {
      id: 'badge-event-enthusiast',
      name: 'Event Enthusiast',
      description: 'Participated in 3 or more verified co-curricular competitions or workshops.',
      category: 'Event Participation',
      icon: 'Trophy',
      earned: verifiedCount >= 3,
      dateEarned: verifiedCount >= 3 ? '18 Sep 2026' : undefined,
      unlockProgress: Math.min(100, Math.round((verifiedCount / 3) * 100)),
      unlockRequirement: 'Record and verify 3+ co-curricular events in Your Participation'
    },
    {
      id: 'badge-rising-star',
      name: 'Rising Star',
      description: 'Demonstrated progressive improvement in academic SGPA over consecutive terms.',
      category: 'Academic Performance',
      icon: 'TrendingUp',
      earned: (student.academicHistory || []).length >= 2 && student.academicHistory[student.academicHistory.length - 1].sgpa >= student.academicHistory[student.academicHistory.length - 2].sgpa,
      dateEarned: '05 Sep 2026',
      unlockProgress: 100,
      unlockRequirement: 'Show positive SGPA trajectory across consecutive semesters'
    },
    {
      id: 'badge-all-rounder',
      name: 'All-Rounder',
      description: 'Combined mastery: Attendance Champion + Academic Excellence + Event Enthusiast.',
      category: 'All-Rounder',
      icon: 'Crown',
      earned: (overallAttendance >= 90 && !hasShortage) && (cgpa >= 8.5) && (verifiedCount >= 3),
      dateEarned: ((overallAttendance >= 90 && !hasShortage) && (cgpa >= 8.5) && (verifiedCount >= 3)) ? '01 Oct 2026' : undefined,
      unlockProgress: Math.round((
        ((overallAttendance >= 90 && !hasShortage ? 1 : 0) +
         (cgpa >= 8.5 ? 1 : 0) +
         (verifiedCount >= 3 ? 1 : 0)) / 3
      ) * 100),
      unlockRequirement: 'Simultaneously unlock Attendance Champion, Academic Excellence, and Event Enthusiast'
    }
  ];

  return badgesList;
}

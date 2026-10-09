import { getDb, transaction } from './connection.js';
import { runMigrations } from './migrate.js';
import { hashPassword } from '../auth/password.js';

// Seeded PRNG (Mulberry32) for 100% deterministic reproducibility
function createPrng(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SeedResult {
  collegesCount: number;
  studentsCount: number;
  facultyCount: number;
  usersCount: number;
  attendanceRecordsCount: number;
  assignmentsCount: number;
  resultsCount: number;
  eventsCount: number;
  badgesCount: number;
}

export function seedDatabase(customPath?: string): SeedResult {
  // Ensure schema exists first
  runMigrations(customPath);
  const db = getDb(customPath);

  const rand = createPrng(0xCA7B005); // Fixed deterministic seed
  const defaultPassword = 'CampusIQ2026!';
  const { hash: passwordHash, salt: passwordSalt } = hashPassword(defaultPassword);

  // 10 Configurable Synthetic Colleges
  const collegesConfig = [
    { id: 'col_kpmg_01', name: 'KPMG Institute of Technology & Advanced Analytics', code: 'KPMG-TECH', domain: 'kpmg.campusiq.edu.in', state: 'Karnataka', city: 'Bengaluru' },
    { id: 'col_iiit_02', name: 'Indian Institute of Information Technology & Management', code: 'IIIT-HYD', domain: 'iiit.campusiq.edu.in', state: 'Telangana', city: 'Hyderabad' },
    { id: 'col_rvce_03', name: 'RV Institute of Smart Computing & Analytics', code: 'RV-TECH', domain: 'rvce.campusiq.edu.in', state: 'Karnataka', city: 'Bengaluru' },
    { id: 'col_coep_04', name: 'College of Engineering & Smart Systems', code: 'COEP-PUN', domain: 'coep.campusiq.edu.in', state: 'Maharashtra', city: 'Pune' },
    { id: 'col_vjti_05', name: 'Victoria Jubilee Technological Institute of AI', code: 'VJTI-MUM', domain: 'vjti.campusiq.edu.in', state: 'Maharashtra', city: 'Mumbai' },
    { id: 'col_psg_06', name: 'PSG Advanced Institute of Technology', code: 'PSG-CBE', domain: 'psg.campusiq.edu.in', state: 'Tamil Nadu', city: 'Coimbatore' },
    { id: 'col_thapar_07', name: 'Thapar School of Computer Science & Analytics', code: 'TIET-PAT', domain: 'thapar.campusiq.edu.in', state: 'Punjab', city: 'Patiala' },
    { id: 'col_manipal_08', name: 'Manipal Institute of Data Intelligence', code: 'MIT-MAN', domain: 'manipal.campusiq.edu.in', state: 'Karnataka', city: 'Manipal' },
    { id: 'col_bms_09', name: 'BMS Center for Applied Artificial Intelligence', code: 'BMS-BLR', domain: 'bms.campusiq.edu.in', state: 'Karnataka', city: 'Bengaluru' },
    { id: 'col_dtu_10', name: 'Delhi Technological Institute of Advanced Computing', code: 'DTU-DEL', domain: 'dtu.campusiq.edu.in', state: 'Delhi', city: 'New Delhi' }
  ];

  const firstNames = [
    'Aarav', 'Aditi', 'Advait', 'Aishwarya', 'Amit', 'Ananya', 'Anik', 'Anushka',
    'Arjun', 'Arpan', 'Ayush', 'Bhavna', 'Chetan', 'Dev', 'Divya', 'Gaurav',
    'Harish', 'Ishaan', 'Karan', 'Karthik', 'Kavya', 'Manish', 'Meera', 'Neha',
    'Nikhil', 'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rhea', 'Ritu', 'Rohan',
    'Sahil', 'Sameer', 'Sanjay', 'Shreya', 'Siddharth', 'Sneha', 'Swati', 'Tanvi',
    'Tarun', 'Varun', 'Vikram', 'Yash', 'Zoya', 'Aditya', 'Akash', 'Aniket'
  ];

  const lastNames = [
    'Sharma', 'Verma', 'Patel', 'Kumar', 'Reddy', 'Malhotra', 'Banerjee', 'Nair',
    'Hegde', 'Sundaram', 'Krishnan', 'Balaji', 'Joshi', 'Rao', 'Deshmukh', 'Sengupta',
    'Chawla', 'Goswami', 'Saxena', 'Menon', 'Kulshrestha', 'Mehta', 'Sen', 'Kapoor',
    'Bhattacharya', 'Anand', 'Khurana', 'Kulkarni', 'Nambiar', 'Chakraborty', 'Iyer', 'Gupta'
  ];

  return transaction(db => {
    // Clean old data to guarantee exact counts
    db.exec(`
      DELETE FROM audit_logs;
      DELETE FROM student_badges;
      DELETE FROM success_scores;
      DELETE FROM placement_readiness;
      DELETE FROM event_participations;
      DELETE FROM revaluations;
      DELETE FROM subject_grades;
      DELETE FROM academic_results;
      DELETE FROM assignment_submissions;
      DELETE FROM assignments;
      DELETE FROM subject_attendance;
      DELETE FROM subjects;
      DELETE FROM students;
      DELETE FROM faculty_profiles;
      DELETE FROM courses;
      DELETE FROM departments;
      DELETE FROM users;
      DELETE FROM colleges;
    `);

    let totalUsers = 0;
    let totalFaculty = 0;
    let totalStudents = 0;
    let totalAttendance = 0;
    let totalAssignments = 0;
    let totalResults = 0;
    let totalEvents = 0;
    let totalBadges = 0;

    // Prepared statements for high performance batch seeding
    const insertCollegeStmt = db.prepare(`
      INSERT INTO colleges (id, name, code, domain, state, city, attendance_threshold, scoring_weights_json)
      VALUES (?, ?, ?, ?, ?, ?, 75.0, '{"attendance":0.25,"academic":0.40,"participation":0.15,"assignment":0.20}')
    `);

    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, college_id, email, password_hash, salt, role, name, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDeptStmt = db.prepare(`
      INSERT INTO departments (id, college_id, name, code)
      VALUES (?, ?, ?, ?)
    `);

    const insertCourseStmt = db.prepare(`
      INSERT INTO courses (id, college_id, department_id, name, code, duration_years)
      VALUES (?, ?, ?, ?, ?, 4)
    `);

    const insertFacultyStmt = db.prepare(`
      INSERT INTO faculty_profiles (id, user_id, college_id, department_id, designation, cabin_location, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertStudentStmt = db.prepare(`
      INSERT INTO students (id, user_id, college_id, department_id, course_id, roll_no, branch, current_year, current_semester, class_section, mentor_faculty_id, phone, has_insufficient_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSubjectStmt = db.prepare(`
      INSERT INTO subjects (id, college_id, department_id, code, name, semester, credits, faculty_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertAttendanceStmt = db.prepare(`
      INSERT INTO subject_attendance (id, college_id, student_id, subject_id, classes_attended, total_classes_conducted, attendance_percentage, is_shortage, consecutive_classes_needed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertAssignmentStmt = db.prepare(`
      INSERT INTO assignments (id, college_id, subject_id, title, description, due_date, max_marks)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSubmissionStmt = db.prepare(`
      INSERT INTO assignment_submissions (id, college_id, assignment_id, student_id, status, marks_obtained, submission_date, completion_percentage, feedback)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertResultStmt = db.prepare(`
      INSERT INTO academic_results (id, college_id, student_id, semester, sgpa, credits_earned, total_credits, backlogs_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertEventStmt = db.prepare(`
      INSERT INTO event_participations (id, college_id, student_id, name, category, subcategory, date, status, points_awarded, certificate_url, certificate_name, verification_status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertPlacementStmt = db.prepare(`
      INSERT INTO placement_readiness (id, college_id, student_id, is_assessed, overall_percentage, coding_score, aptitude_score, mock_interview_score, verified_projects_count, readiness_tier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertScoreStmt = db.prepare(`
      INSERT INTO success_scores (id, college_id, student_id, overall_score, previous_score, attendance_score, academic_score, participation_score, assignment_score, performance_grade, progression_level, level_name, points_to_next, strongest_indicator, weakest_indicator, is_provisional, provisional_reason, calculation_date, explainability_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertBadgeStmt = db.prepare(`
      INSERT INTO student_badges (id, college_id, student_id, badge_key, badge_name, category, is_earned, earned_date, unlock_progress, is_warning_locked, warning_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Iterate through all 10 colleges
    for (let cIdx = 0; cIdx < collegesConfig.length; cIdx++) {
      const col = collegesConfig[cIdx];
      insertCollegeStmt.run(col.id, col.name, col.code, col.domain, col.state, col.city);

      // 1. College Administrator User
      const adminUserId = `u_${col.id}_admin`;
      insertUserStmt.run(
        adminUserId,
        col.id,
        `admin@${col.domain}`,
        passwordHash,
        passwordSalt,
        'admin',
        `${col.code} Dean & Academic Administrator`,
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
      );
      totalUsers++;

      // 2. Academic Departments
      const cseDeptId = `dept_${col.id}_cse`;
      const aimlDeptId = `dept_${col.id}_aiml`;
      insertDeptStmt.run(cseDeptId, col.id, 'Computer Science & Engineering', 'CSE');
      insertDeptStmt.run(aimlDeptId, col.id, 'Artificial Intelligence & Machine Learning', 'AIML');

      // 3. Courses
      const cseCourseId = `course_${col.id}_cs`;
      const aimlCourseId = `course_${col.id}_ai`;
      insertCourseStmt.run(cseCourseId, col.id, cseDeptId, 'B.Tech Computer Science & Engineering', 'BTECH-CSE');
      insertCourseStmt.run(aimlCourseId, col.id, aimlDeptId, 'B.Tech Artificial Intelligence & Data Science', 'BTECH-AIML');

      // 4. Faculty Profiles (4 faculty per college)
      const facultyList = [
        { id: `fac_${col.id}_1`, name: 'Dr. Ramesh Sengupta', email: `r.sengupta@${col.domain}`, deptId: cseDeptId, desig: 'Professor & HOD', cabin: 'Faculty Tower 401' },
        { id: `fac_${col.id}_2`, name: 'Prof. Meenakshi Iyer', email: `m.iyer@${col.domain}`, deptId: cseDeptId, desig: 'Associate Professor', cabin: 'Faculty Tower 405' },
        { id: `fac_${col.id}_3`, name: 'Dr. K. Varma', email: `k.varma@${col.domain}`, deptId: aimlDeptId, desig: 'Professor', cabin: 'AI Tower 201' },
        { id: `fac_${col.id}_4`, name: 'Prof. Anupama Roy', email: `a.roy@${col.domain}`, deptId: aimlDeptId, desig: 'Assistant Professor', cabin: 'AI Tower 208' },
      ];

      for (const fac of facultyList) {
        const facUserId = `u_${fac.id}`;
        insertUserStmt.run(
          facUserId,
          col.id,
          fac.email,
          passwordHash,
          passwordSalt,
          'faculty',
          fac.name,
          `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150`
        );
        insertFacultyStmt.run(fac.id, facUserId, col.id, fac.deptId, fac.desig, fac.cabin, '+91 98765 00000');
        totalUsers++;
        totalFaculty++;
      }

      // 5. Subjects (6 subjects for Semester 5)
      const subjects = [
        { id: `sub_${col.id}_501`, code: 'CS501', name: 'Data Structures & Algorithms', deptId: cseDeptId, credits: 4, facId: facultyList[0].id },
        { id: `sub_${col.id}_502`, code: 'CS502', name: 'Database Management Systems', deptId: cseDeptId, credits: 4, facId: facultyList[1].id },
        { id: `sub_${col.id}_503`, code: 'CS503', name: 'Operating Systems & Kernels', deptId: cseDeptId, credits: 4, facId: facultyList[2].id },
        { id: `sub_${col.id}_504`, code: 'CS504', name: 'Cloud Computing & DevOps', deptId: cseDeptId, credits: 3, facId: facultyList[3].id },
        { id: `sub_${col.id}_505`, code: 'CS505', name: 'AI & Machine Learning Lab', deptId: aimlDeptId, credits: 2, facId: facultyList[2].id },
        { id: `sub_${col.id}_506`, code: 'CS506', name: 'Soft Skills & Corporate Aptitude', deptId: cseDeptId, credits: 2, facId: facultyList[0].id }
      ];

      for (const s of subjects) {
        insertSubjectStmt.run(s.id, col.id, s.deptId, s.code, s.name, 5, s.credits, s.facId);

        // Seed 2 assignments per subject
        for (let aIdx = 1; aIdx <= 2; aIdx++) {
          const assignId = `as_${s.id}_${aIdx}`;
          insertAssignmentStmt.run(
            assignId,
            col.id,
            s.id,
            `${s.name} Assignment ${aIdx}: Applied Simulation`,
            `Complete theoretical analysis and practical implementation for unit ${aIdx}.`,
            `2026-10-${15 + aIdx * 7}`,
            30.0
          );
        }
      }

      // 6. EXACTLY 100 Students per College (1,000 students total)
      for (let sIdx = 1; sIdx <= 100; sIdx++) {
        const studentNum = String(sIdx).padStart(3, '0');
        const studentId = `s_${col.id}_${studentNum}`;
        const studentUserId = `u_${studentId}`;

        const isCse = sIdx <= 50;
        const targetDeptId = isCse ? cseDeptId : aimlDeptId;
        const targetCourseId = isCse ? cseCourseId : aimlCourseId;
        const rollNo = `23${isCse ? 'CS' : 'AI'}${studentNum}`;

        const fName = firstNames[(cIdx * 7 + sIdx * 3) % firstNames.length];
        const lName = lastNames[(cIdx * 5 + sIdx * 2) % lastNames.length];
        const fullName = `${fName} ${lName}`;
        const studentEmail = `${fName.toLowerCase()}.${lName.toLowerCase()}.${studentNum}@${col.domain}`;
        const mentor = facultyList[sIdx % facultyList.length];

        // Specific Performance Archetype assignment:
        // Student 1: Top All-Rounder (Grade A)
        // Student 2: Attendance Shortage in DSA (Grade C)
        // Student 3: High Academics, Low Placement (Grade B)
        // Student 4: At-Risk Multiple Shortages (Grade D)
        // Student 5: High Attendance, Low Exams (Grade B)
        // Student 100: Insufficient Data persona
        const isInsufficient = (sIdx === 100);
        const isArchetypeShortage = (sIdx === 2 || (sIdx % 11 === 0 && !isInsufficient));
        const isArchetypeHighLowPlacement = (sIdx === 3 || (sIdx % 13 === 0 && !isInsufficient));
        const isArchetypeAtRisk = (sIdx === 4 || (sIdx % 17 === 0 && !isInsufficient));
        const isArchetypeTop = (sIdx === 1 || (sIdx % 8 === 0 && !isInsufficient));

        insertUserStmt.run(
          studentUserId,
          col.id,
          studentEmail,
          passwordHash,
          passwordSalt,
          'student',
          fullName,
          `https://images.unsplash.com/photo-${1500000000000 + (sIdx * 456789) % 999999999}?w=150`
        );
        totalUsers++;

        insertStudentStmt.run(
          studentId,
          studentUserId,
          col.id,
          targetDeptId,
          targetCourseId,
          rollNo,
          isCse ? 'Computer Science & AI (KPMG Track)' : 'AI & Intelligent Systems',
          3,
          5,
          sIdx % 2 === 0 ? 'A' : 'B',
          mentor.id,
          `+91 98${(cIdx * 10 + sIdx) % 89 + 10} 12345`,
          isInsufficient ? 1 : 0
        );
        totalStudents++;

        if (isInsufficient) {
          // Insufficient Data Student: No attendance/marks yet
          insertScoreStmt.run(
            `score_${studentId}`,
            col.id,
            studentId,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            'Not Yet Rated',
            1,
            'Awaiting Records',
            40.0,
            'Pending Data',
            'Pending Data',
            1,
            'Performance data is not yet meeting the required benchmark. Minimal baseline records are pending institutional upload.',
            'October 2026',
            JSON.stringify([{ title: 'Insufficient Data Warning', impact: 'neutral', scoreDelta: 0 }])
          );

          insertPlacementStmt.run(
            `place_${studentId}`,
            col.id,
            studentId,
            0,
            0.0,
            0.0,
            0.0,
            0.0,
            0,
            'Not Assessed'
          );
          continue;
        }

        // Attendance Generation
        let totalClassesAll = 0;
        let totalAttendedAll = 0;
        let hasAnyShortage = false;

        for (let subIdx = 0; subIdx < subjects.length; subIdx++) {
          const sub = subjects[subIdx];
          const totalConducted = 40 + (subIdx * 2);
          let attendedClasses = Math.round(totalConducted * 0.86);

          if (isArchetypeShortage && subIdx === 0) {
            // DSA Shortage: 68%
            attendedClasses = Math.round(totalConducted * 0.68);
          } else if (isArchetypeAtRisk) {
            // Multiple shortages: 55-65%
            attendedClasses = Math.round(totalConducted * (0.55 + rand() * 0.12));
          } else if (isArchetypeTop) {
            // Top attendance: 92-98%
            attendedClasses = Math.round(totalConducted * (0.92 + rand() * 0.06));
          } else {
            // Normal distribution: 76-92%
            attendedClasses = Math.round(totalConducted * (0.76 + rand() * 0.16));
          }

          const pct = Number(((attendedClasses / totalConducted) * 100).toFixed(1));
          const isShortage = pct < 75.0 ? 1 : 0;
          if (isShortage) hasAnyShortage = true;

          const needed = isShortage ? Math.max(0, Math.ceil((0.75 * totalConducted - attendedClasses) / 0.25)) : 0;

          totalClassesAll += totalConducted;
          totalAttendedAll += attendedClasses;

          insertAttendanceStmt.run(
            `att_${studentId}_${sub.id}`,
            col.id,
            studentId,
            sub.id,
            attendedClasses,
            totalConducted,
            pct,
            isShortage,
            needed
          );
          totalAttendance++;

          // Assignment Submissions (2 assignments per subject)
          for (let aIdx = 1; aIdx <= 2; aIdx++) {
            const assignId = `as_${sub.id}_${aIdx}`;
            const submisId = `subm_${assignId}_${studentId}`;
            const isSubmitted = isArchetypeAtRisk && aIdx === 2 ? 0 : 1;
            const marks = isSubmitted ? Math.round(22 + rand() * 8) : 0;

            insertSubmissionStmt.run(
              submisId,
              col.id,
              assignId,
              studentId,
              isSubmitted ? 'Submitted' : 'Pending',
              marks,
              isSubmitted ? '2026-10-14' : null,
              isSubmitted ? 100.0 : 40.0,
              isSubmitted ? 'Well structured implementation.' : null
            );
            totalAssignments++;
          }
        }

        const overallAttPct = Number(((totalAttendedAll / totalClassesAll) * 100).toFixed(1));

        // Semester Results (Sem 1 to 4)
        let totalSgpa = 0;
        const semCount = 4;
        let cgpa = 7.5;

        if (isArchetypeTop || isArchetypeHighLowPlacement) {
          cgpa = 9.2 + rand() * 0.5;
        } else if (isArchetypeAtRisk) {
          cgpa = 5.4 + rand() * 0.8;
        } else if (isArchetypeShortage) {
          cgpa = 6.8 + rand() * 0.6;
        } else {
          cgpa = 7.2 + rand() * 1.2;
        }
        cgpa = Math.min(10.0, Number(cgpa.toFixed(2)));

        for (let sem = 1; sem <= semCount; sem++) {
          const semSgpa = Math.min(10.0, Number((cgpa + (sem - 2) * 0.1 + (rand() * 0.2 - 0.1)).toFixed(2)));
          totalSgpa += semSgpa;
          const resultId = `res_${studentId}_sem${sem}`;
          insertResultStmt.run(
            resultId,
            col.id,
            studentId,
            sem,
            semSgpa,
            24,
            24,
            isArchetypeAtRisk && sem === 4 ? 1 : 0
          );
          totalResults++;
        }

        // Event Participations
        const eventCount = isArchetypeTop ? 4 : isArchetypeAtRisk ? 0 : Math.floor(rand() * 3) + 1;
        let eventPoints = 0;
        let verifiedEvents = 0;

        for (let evI = 1; evI <= eventCount; evI++) {
          const isTech = evI % 2 === 1;
          const isWinner = evI === 1 && isArchetypeTop;
          const status = isWinner ? 'Winner' : 'Participant';
          const points = isWinner ? 25.0 : 10.0;
          eventPoints += points;
          verifiedEvents++;

          insertEventStmt.run(
            `ev_${studentId}_${evI}`,
            col.id,
            studentId,
            isTech ? `National Collegiate Hackathon ${evI}` : `Inter-College Sports Fest ${evI}`,
            isTech ? 'Technical' : 'Non-Technical',
            isTech ? 'Hackathon' : 'Sports',
            `2026-09-${10 + evI * 4}`,
            status,
            points,
            `/certificates/cert_${studentId}_${evI}.pdf`,
            `Cert_${evI}.pdf`,
            'Verified',
            'Demonstrated solid teamwork and problem solving.'
          );
          totalEvents++;
        }

        // Placement Readiness
        let placementPct = 65;
        let codingScore = 60;
        let aptitudeScore = 65;
        let readinessTier: 'High' | 'Moderate' | 'Low' | 'Needs Attention' = 'Moderate';

        if (isArchetypeHighLowPlacement) {
          placementPct = 42;
          codingScore = 38;
          aptitudeScore = 44;
          readinessTier = 'Low';
        } else if (isArchetypeTop) {
          placementPct = 94;
          codingScore = 96;
          aptitudeScore = 92;
          readinessTier = 'High';
        } else if (isArchetypeAtRisk) {
          placementPct = 32;
          codingScore = 28;
          aptitudeScore = 35;
          readinessTier = 'Needs Attention';
        }

        insertPlacementStmt.run(
          `place_${studentId}`,
          col.id,
          studentId,
          1,
          placementPct,
          codingScore,
          aptitudeScore,
          placementPct,
          isArchetypeTop ? 5 : 2,
          readinessTier
        );

        // Success Score Calculation (Master Formula)
        // Success Score = (Attendance × 0.25) + (Academic × 0.40) + (Participation × 0.15) + (Assignment × 0.20)
        const academicScore = Math.min(100, cgpa * 10);
        const attendanceScore = Math.min(100, overallAttPct);
        const participationScore = Math.min(100, eventPoints);
        const assignmentScore = isArchetypeAtRisk ? 75.0 : 100.0;

        const rawOverall = (attendanceScore * 0.25) + (academicScore * 0.40) + (participationScore * 0.15) + (assignmentScore * 0.20);
        const overallScore = Number(rawOverall.toFixed(1));
        const previousScore = Number((overallScore - 3.2).toFixed(1));

        let grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D' = 'Grade B';
        if (overallScore >= 85) grade = 'Grade A';
        else if (overallScore >= 70) grade = 'Grade B';
        else if (overallScore >= 50) grade = 'Grade C';
        else grade = 'Grade D';

        let level = 3;
        let levelName = 'Proficient Explorer';
        let pointsToNext = 12.0;

        if (overallScore >= 85) {
          level = 5;
          levelName = 'Grandmaster Vanguard';
          pointsToNext = 0;
        } else if (overallScore >= 75) {
          level = 4;
          levelName = 'Advanced Scholar';
          pointsToNext = Number((85 - overallScore).toFixed(1));
        } else if (overallScore >= 60) {
          level = 3;
          levelName = 'Proficient Explorer';
          pointsToNext = Number((75 - overallScore).toFixed(1));
        } else if (overallScore >= 40) {
          level = 2;
          levelName = 'Developing Achiever';
          pointsToNext = Number((60 - overallScore).toFixed(1));
        } else {
          level = 1;
          levelName = 'Foundational Contender';
          pointsToNext = Number((40 - overallScore).toFixed(1));
        }

        insertScoreStmt.run(
          `score_${studentId}`,
          col.id,
          studentId,
          overallScore,
          previousScore,
          attendanceScore,
          academicScore,
          participationScore,
          assignmentScore,
          grade,
          level,
          levelName,
          pointsToNext,
          cgpa >= 8.5 ? 'Academic Excellence (CGPA)' : 'Coursework Submission Rate',
          hasAnyShortage ? 'Subject Attendance Shortage' : 'Co-Curricular Participation Gap',
          0,
          null,
          'October 2026',
          JSON.stringify([
            { title: 'Academic CGPA Factor', scoreDelta: Number((academicScore * 0.4).toFixed(1)), impact: cgpa >= 7.5 ? 'positive' : 'negative' },
            { title: 'Attendance Factor', scoreDelta: Number((attendanceScore * 0.25).toFixed(1)), impact: hasAnyShortage ? 'negative' : 'positive' }
          ])
        );

        // Student Badges Evaluation
        const badgesConfig = [
          { key: 'att_champion', name: 'Attendance Champion', category: 'Attendance', earned: overallAttPct >= 90 && !hasAnyShortage, lockedShortage: hasAnyShortage },
          { key: 'consistency_star', name: 'Consistency Star', category: 'Attendance', earned: overallAttPct >= 85 && !hasAnyShortage, lockedShortage: hasAnyShortage },
          { key: 'acad_excellence', name: 'Academic Excellence', category: 'Academic Performance', earned: cgpa >= 8.5, lockedShortage: false },
          { key: 'assign_finisher', name: 'Assignment Finisher', category: 'Academic Performance', earned: assignmentScore >= 95, lockedShortage: false },
          { key: 'tech_explorer', name: 'Tech Explorer', category: 'Event Participation', earned: eventCount >= 2, lockedShortage: false },
          { key: 'all_rounder', name: 'All-Rounder', category: 'All-Rounder', earned: overallAttPct >= 90 && !hasAnyShortage && cgpa >= 8.5 && eventCount >= 3, lockedShortage: hasAnyShortage }
        ];

        for (const b of badgesConfig) {
          insertBadgeStmt.run(
            `badge_${studentId}_${b.key}`,
            col.id,
            studentId,
            b.key,
            b.name,
            b.category,
            b.earned ? 1 : 0,
            b.earned ? '2026-09-20' : null,
            b.earned ? 100.0 : 60.0,
            b.lockedShortage ? 1 : 0,
            b.lockedShortage ? 'Attendance requirement not met in core subjects (<75%).' : null
          );
          totalBadges++;
        }
      }
    }

    return {
      collegesCount: collegesConfig.length,
      studentsCount: totalStudents,
      facultyCount: totalFaculty,
      usersCount: totalUsers,
      attendanceRecordsCount: totalAttendance,
      assignmentsCount: totalAssignments,
      resultsCount: totalResults,
      eventsCount: totalEvents,
      badgesCount: totalBadges
    };
  });
}

// Allow standalone execution
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  try {
    console.log('[CampusIQ AI Seed] Seeding 10 colleges and 1,000 students...');
    const result = seedDatabase();
    console.log('[CampusIQ AI Seed] Database successfully seeded with deterministic data:');
    console.table(result);
  } catch (err) {
    console.error('[CampusIQ AI Seed] Seeding failed:', err);
    process.exit(1);
  }
}

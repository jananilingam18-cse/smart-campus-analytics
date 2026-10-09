import React, { useEffect, useState } from 'react';
import { fetchBackendStudents, type ApiStudent } from '../services/backendApi';

export const BackendStudentsPanel: React.FC = () => {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBackendStudents()
      .then(setStudents)
      .catch(() => setError('Backend connection failed. Check whether the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-3xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Backend Students</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Data fetched from Campus IQ API</p>
        </div>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-200">API</span>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading student data...</p>
      ) : error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <div key={student.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {student.department} · CGPA {student.cgpa} · Attendance {student.attendance}%
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-violet-700 dark:text-violet-300">{student.successScore}/100</p>
                <p className="text-xs text-slate-500">Risk: {student.riskLevel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

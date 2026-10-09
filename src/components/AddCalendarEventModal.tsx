import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';

interface AddCalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCalendarEventModal: React.FC<AddCalendarEventModalProps> = ({ isOpen, onClose }) => {
  const { addCalendarEvent } = useApp();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<CalendarEvent['type']>('Internal');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [venue, setVenue] = useState('Exam Hall A (Block 3)');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please specify event title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter an event description.');
      return;
    }

    const newEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title,
      date,
      type,
      time,
      venue,
      description
    };

    addCalendarEvent(newEvent);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 p-6 md:p-8 overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div>
            <h3 className="text-lg font-bold text-[#242038] dark:text-purple-100 font-heading flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#7C3AED]" />
              Schedule Academic Entry
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Add assessment, deadline, holiday or campus event
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#77738C] hover:text-[#242038] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading">
              Calendar Event Scheduled!
            </h4>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              The entry is now visible on the monthly calendar and agenda list.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                Event / Exam Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. End Semester Practical Viva: Distributed OS"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Event Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none font-medium"
                >
                  <option value="Internal">Internal Assessment</option>
                  <option value="Semester">Semester Theory Exam</option>
                  <option value="Assignment">Assignment Deadline</option>
                  <option value="Practical">Practical Examination</option>
                  <option value="Revaluation">Revaluation Deadline</option>
                  <option value="Event">College Conclave / Event</option>
                  <option value="Holiday">Institutional Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 01:00 PM"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Exam Hall B, Computing Lab 3"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                Description & Instructions
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Syllabus units covered, admit card requirement..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E4F5] dark:border-purple-900/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#77738C] hover:bg-[#FAF9FF] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-sm transition cursor-pointer"
              >
                Save Event
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

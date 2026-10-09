import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Filter, 
  AlertCircle,
  FileText,
  Trophy,
  CheckCircle2,
  CalendarDays,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';
import { AddCalendarEventModal } from '../components/AddCalendarEventModal';

export const AcademicCalendar: React.FC = () => {
  const { calendarEvents } = useApp();

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const eventTypes: Array<{ type: CalendarEvent['type'] | 'All'; label: string }> = [
    { type: 'All', label: 'All Entries' },
    { type: 'Internal', label: 'Internal Assessments' },
    { type: 'Semester', label: 'Semester Exams' },
    { type: 'Assignment', label: 'Assignment Deadlines' },
    { type: 'Practical', label: 'Practical Exams' },
    { type: 'Revaluation', label: 'Revaluation Deadlines' },
    { type: 'Event', label: 'College Events' },
    { type: 'Holiday', label: 'Holidays' }
  ];

  const filteredEvents = calendarEvents.filter(ev => {
    return selectedType === 'All' || ev.type === selectedType;
  });

  // Calendar calculations for month grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentMonth(new Date(2026, 9, 1));

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Event chip color helper with violet/lavender harmony
  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'Internal':
        return 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/50 dark:text-purple-300 border-[#E9E4F5] dark:border-purple-800/40';
      case 'Semester':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-200 dark:border-purple-800';
      case 'Assignment':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Practical':
        return 'bg-violet-50 text-[#7C3AED] dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800';
      case 'Revaluation':
        return 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300 border-[#E9E4F5]';
      case 'Event':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Holiday':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-[#FAF9FF] text-[#242038] border-[#E9E4F5]';
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center font-bold shadow-sm">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
              Academic Calendar & Agenda
            </h1>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Exam schedules, deadlines, assessment windows, and campus milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* View Mode Toggle */}
          <div className="bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white dark:bg-[#1D172E] text-[#6D28D9] dark:text-purple-200 shadow-xs' : 'text-[#77738C] dark:text-purple-300'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'agenda' ? 'bg-white dark:bg-[#1D172E] text-[#6D28D9] dark:text-purple-200 shadow-xs' : 'text-[#77738C] dark:text-purple-300'
              }`}
            >
              Agenda List
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-[#77738C] shrink-0 ml-1 hidden sm:block" />
        {eventTypes.map((t) => (
          <button
            key={t.type}
            onClick={() => setSelectedType(t.type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedType === t.type
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-xs'
                : 'bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 text-[#77738C] dark:text-purple-300 hover:text-[#6D28D9]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Calendar Month Navigation Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 hover:bg-[#FAF9FF] dark:hover:bg-[#13101E] text-[#77738C] dark:text-purple-300 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 hover:bg-[#FAF9FF] dark:hover:bg-[#13101E] text-[#77738C] dark:text-purple-300 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-base md:text-lg font-bold text-[#242038] dark:text-purple-100 font-heading ml-2">
            {monthName}
          </span>
        </div>

        <button
          onClick={goToToday}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[#E9E4F5] dark:border-purple-900/40 hover:border-[#7C3AED] text-[#6D28D9] dark:text-purple-300 transition cursor-pointer"
        >
          Today (Oct 2026)
        </button>
      </div>

      {/* VIEW MODE 1: Interactive Monthly Grid */}
      {viewMode === 'calendar' && (
        <div className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] text-center text-xs font-bold text-[#77738C] dark:text-purple-300 py-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#E9E4F5] dark:divide-purple-900/40 min-h-[500px]">
            {/* Blank padding days for previous month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="p-2 bg-[#FAF9FF]/40 dark:bg-[#13101E]/30 text-slate-300 dark:text-purple-900/20 min-h-[90px]" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = filteredEvents.filter(ev => ev.date === dateString);
              const isToday = dayNum === 9 && month === 9 && year === 2026;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`p-2 min-h-[90px] flex flex-col justify-between transition-colors hover:bg-[#FAF9FF] dark:hover:bg-[#13101E] ${
                    isToday ? 'bg-[#EDE9FE]/40 dark:bg-purple-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${
                      isToday 
                        ? 'w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold' 
                        : 'text-[#242038] dark:text-purple-200'
                    }`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-[#7C3AED] font-bold font-mono">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Day Events preview chips */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate cursor-pointer hover:opacity-85 transition border ${getEventBadge(ev.type)}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span 
                        onClick={() => setSelectedEvent(dayEvents[2])}
                        className="text-[9px] text-[#77738C] dark:text-purple-400 font-bold block cursor-pointer"
                      >
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Agenda List View */}
      {viewMode === 'agenda' && (
        <div className="space-y-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="p-4 md:p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 border border-[#E9E4F5] dark:border-purple-800/40 flex flex-col items-center justify-center text-[#6D28D9] dark:text-purple-300 shrink-0">
                  <span className="text-[10px] font-bold uppercase leading-none">
                    {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-base font-bold leading-none mt-0.5">
                    {ev.date.split('-')[2]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100">
                      {ev.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getEventBadge(ev.type)}`}>
                      {ev.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1">
                    {ev.description}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-[#77738C] dark:text-purple-400 mt-2">
                    {ev.time && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#77738C]" />
                        {ev.time}
                      </span>
                    )}
                    {ev.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#77738C]" />
                        {ev.venue}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#7C3AED] hover:bg-[#EDE9FE]/50 self-end sm:self-center transition cursor-pointer"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 p-6 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getEventBadge(selectedEvent.type)}`}>
                  {selectedEvent.type}
                </span>
                <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading mt-2">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-[#77738C] hover:text-[#242038] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#242038] dark:text-purple-200 leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="space-y-2 p-3.5 rounded-2xl bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#77738C]">Date:</span>
                <strong className="text-[#242038] dark:text-purple-100">{selectedEvent.date}</strong>
              </div>
              {selectedEvent.time && (
                <div className="flex items-center justify-between">
                  <span className="text-[#77738C]">Time:</span>
                  <strong className="text-[#242038] dark:text-purple-100">{selectedEvent.time}</strong>
                </div>
              )}
              {selectedEvent.venue && (
                <div className="flex items-center justify-between">
                  <span className="text-[#77738C]">Venue:</span>
                  <strong className="text-[#242038] dark:text-purple-100">{selectedEvent.venue}</strong>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Calendar Event Modal */}
      <AddCalendarEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
};

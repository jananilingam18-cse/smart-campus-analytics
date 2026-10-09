import React, { useState } from 'react';
import { 
  Trophy, 
  Cpu, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Calendar, 
  Award, 
  ShieldCheck,
  FileText,
  Filter,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventRecord } from '../types';
import { UploadCertificateModal } from '../components/UploadCertificateModal';

export const YourParticipation: React.FC = () => {
  const { currentStudent } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Technical' | 'Non-Technical'>('All');
  const [selectedCertificate, setSelectedCertificate] = useState<EventRecord | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const events = currentStudent.eventParticipations || [];

  const technicalEvents = events.filter(e => e.category === 'Technical');
  const nonTechnicalEvents = events.filter(e => e.category === 'Non-Technical');

  const filteredEvents = events.filter(e => {
    return activeCategory === 'All' || e.category === activeCategory;
  });

  // Accurate Participation Statistics
  const totalEventsCount = events.length;
  const achievementCount = events.filter(e => e.status === 'Winner' || e.status === '1st Runner Up' || e.status === 'Finalist').length;
  const verifiedCount = events.filter(e => e.verificationStatus === 'Verified').length;
  const pendingCount = events.filter(e => e.verificationStatus === 'Pending Verification').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center font-bold shadow-sm">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
              Your Participation & Co-Curricular Portfolio
            </h1>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Track hackathons, symposiums, sports, leadership, and verified credentials
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white text-xs font-semibold shadow-sm transition self-start md:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* Verified vs Pending Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Total Recorded</span>
          <p className="text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading mt-1">{totalEventsCount}</p>
          <p className="text-[11px] text-[#77738C] dark:text-purple-400 mt-0.5">Co-curricular activities</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Major Achievements</span>
          <p className="text-2xl font-bold text-amber-600 font-heading mt-1">{achievementCount}</p>
          <p className="text-[11px] text-[#77738C] dark:text-purple-400 mt-0.5">Winners & Finalists</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Faculty Verified</span>
          <p className="text-2xl font-bold text-emerald-600 font-heading mt-1">{verifiedCount}</p>
          <p className="text-[11px] text-[#77738C] dark:text-purple-400 mt-0.5">Full Success Score credit</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm">
          <span className="text-xs font-bold text-[#77738C] dark:text-purple-400 uppercase tracking-wider">Pending Verification</span>
          <p className="text-2xl font-bold text-[#7C3AED] dark:text-purple-300 font-heading mt-1">{pendingCount}</p>
          <p className="text-[11px] text-[#77738C] dark:text-purple-400 mt-0.5">Provisional credit awarded</p>
        </div>
      </div>

      {/* Two Large Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Category 1: Technical Events */}
        <div 
          onClick={() => setActiveCategory('Technical')}
          className={`p-6 rounded-3xl border transition cursor-pointer shadow-sm hover:shadow-md group ${
            activeCategory === 'Technical'
              ? 'bg-[#EDE9FE]/50 dark:bg-purple-950/40 border-[#7C3AED] ring-2 ring-[#7C3AED]/20'
              : 'bg-white dark:bg-[#1D172E] border-[#E9E4F5] dark:border-purple-900/40 hover:border-[#7C3AED]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/50 dark:text-purple-300 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6 group-hover:scale-105 transition-transform" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">
              {technicalEvents.length} Events Logged
            </span>
          </div>

          <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading">
            Technical Events & Hackathons
          </h3>
          <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1 leading-relaxed">
            Hackathons, coding competitions, technical paper presentations, project expos, and hands-on workshops.
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {['Hackathons', 'Coding Competitions', 'Paper Presentations', 'Project Expos', 'Cloud Workshops'].map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 text-[#77738C] dark:text-purple-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Category 2: Non-Technical Events */}
        <div 
          onClick={() => setActiveCategory('Non-Technical')}
          className={`p-6 rounded-3xl border transition cursor-pointer shadow-sm hover:shadow-md group ${
            activeCategory === 'Non-Technical'
              ? 'bg-[#EDE9FE]/50 dark:bg-purple-950/40 border-[#7C3AED] ring-2 ring-[#7C3AED]/20'
              : 'bg-white dark:bg-[#1D172E] border-[#E9E4F5] dark:border-purple-900/40 hover:border-[#7C3AED]/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/50 dark:text-purple-300 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 group-hover:scale-105 transition-transform" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">
              {nonTechnicalEvents.length} Events Logged
            </span>
          </div>

          <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading">
            Non-Technical & Leadership
          </h3>
          <p className="text-xs text-[#77738C] dark:text-purple-300 mt-1 leading-relaxed">
            Sports tournaments, cultural fests, national debates, community volunteering, and arts competitions.
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {['Sports & Athletics', 'Cultural Festivals', 'Debates & MUNs', 'Volunteering & NSS', 'Arts'].map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 text-[#77738C] dark:text-purple-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9E4F5] dark:border-purple-900/40 pb-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeCategory === 'All' 
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-xs' 
              : 'text-[#77738C] dark:text-purple-300 hover:text-[#6D28D9]'
          }`}
        >
          All Categories ({events.length})
        </button>
        <button
          onClick={() => setActiveCategory('Technical')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeCategory === 'Technical' 
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-xs' 
              : 'text-[#77738C] dark:text-purple-300 hover:text-[#6D28D9]'
          }`}
        >
          Technical ({technicalEvents.length})
        </button>
        <button
          onClick={() => setActiveCategory('Non-Technical')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeCategory === 'Non-Technical' 
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-xs' 
              : 'text-[#77738C] dark:text-purple-300 hover:text-[#6D28D9]'
          }`}
        >
          Non-Technical ({nonTechnicalEvents.length})
        </button>
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">
                    {ev.subcategory}
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    ev.verificationStatus === 'Verified'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                  }`}>
                    {ev.verificationStatus === 'Verified' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {ev.verificationStatus}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 line-clamp-2 mt-1">
                  {ev.name}
                </h3>

                <p className="text-xs text-[#77738C] dark:text-purple-300 mt-2 line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    ev.status === 'Winner' ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200' :
                    ev.status === '1st Runner Up' ? 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/50 dark:text-purple-300' :
                    'bg-[#FAF9FF] text-[#242038] dark:bg-[#13101E] dark:text-purple-300 border border-[#E9E4F5]'
                  }`}>
                    🏆 {ev.status}
                  </span>
                  <span className="text-[11px] text-[#77738C] dark:text-purple-400">
                    +{ev.pointsAwarded} Score Pts
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E9E4F5] dark:border-purple-900/40 flex items-center justify-between text-xs">
                <span className="text-[#77738C] dark:text-purple-400 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.date}
                </span>

                <button
                  onClick={() => setSelectedCertificate(ev)}
                  className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] dark:bg-purple-900/50 dark:hover:bg-purple-900/70 text-[#6D28D9] dark:text-purple-200 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Cert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-6 text-xs text-[#77738C]">
          No events found in this category. Click "Upload Certificate" above to record a new competition.
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 p-6 md:p-8 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#E9E4F5] dark:border-purple-900/40">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                  Faculty-Verified Certificate Record
                </span>
                <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading mt-0.5">
                  {selectedCertificate.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="p-1.5 rounded-lg text-[#77738C] hover:text-[#242038] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Visual Certificate Rendering */}
            <div className="border-4 border-amber-400/30 bg-gradient-to-br from-amber-50/40 via-white to-purple-50/30 p-6 rounded-2xl text-center space-y-3 shadow-inner">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-base font-serif font-black tracking-wide text-[#242038]">
                CERTIFICATE OF MERIT & PARTICIPATION
              </h2>
              <p className="text-xs text-[#77738C] font-serif">
                This document officially recognizes the accomplishment of
              </p>
              <h3 className="text-base font-bold text-[#6D28D9] uppercase tracking-wider">
                {currentStudent.name} ({currentStudent.rollNo})
              </h3>
              <p className="text-xs text-[#77738C] font-serif max-w-sm mx-auto">
                for achieving <strong>{selectedCertificate.status}</strong> in the event <br />
                <em>"{selectedCertificate.name}"</em>
              </p>
              <div className="pt-4 flex justify-between items-center text-[10px] text-[#77738C] border-t border-[#E9E4F5] font-sans">
                <span>Date: {selectedCertificate.date}</span>
                <span className="font-bold text-emerald-700">Status: {selectedCertificate.verificationStatus}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-[#77738C]">File: {selectedCertificate.certificateName || 'Uploaded_Proof.pdf'}</span>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-semibold cursor-pointer shadow-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      <UploadCertificateModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultCategory={activeCategory === 'All' ? 'Technical' : activeCategory}
      />

    </div>
  );
};

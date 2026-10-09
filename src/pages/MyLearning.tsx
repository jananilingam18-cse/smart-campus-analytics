import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LearningResource } from '../types';
import { PDFViewerModal } from '../components/PDFViewerModal';
import { UploadResourceModal } from '../components/UploadResourceModal';

export const MyLearning: React.FC = () => {
  const { learningResources } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activePreviewResource, setActivePreviewResource] = useState<LearningResource | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Subject categories
  const subjects = ['All', ...Array.from(new Set(learningResources.map(r => r.subject)))];

  const filteredResources = learningResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E9E4F5] dark:border-purple-900/40">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] dark:bg-purple-900/40 text-[#6D28D9] dark:text-purple-300 flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#242038] dark:text-purple-100 font-heading">
                My Learning & Digital Library
              </h1>
              <p className="text-xs text-[#77738C] dark:text-purple-300">
                Course syllabi, lecture presentations, lab manuals, and faculty handbooks
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white text-xs font-semibold shadow-sm transition self-start md:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Course Material</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#77738C] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents, topics, or faculty..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 placeholder-[#77738C]/60 focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] outline-none transition"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#77738C] shrink-0 mr-1 hidden sm:block" />
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-xs'
                  : 'bg-[#FAF9FF] dark:bg-[#13101E] border border-[#E9E4F5] dark:border-purple-900/40 text-[#77738C] dark:text-purple-300 hover:text-[#6D28D9]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6D28D9] dark:bg-purple-900/60 dark:text-purple-300">
                    {res.subject}
                  </span>
                  <span className="text-[10px] font-mono text-[#77738C] dark:text-purple-400 uppercase">
                    {res.fileType} • {res.fileSize}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#242038] dark:text-purple-100 group-hover:text-[#6D28D9] transition-colors line-clamp-2">
                  {res.title}
                </h3>

                <p className="text-xs text-[#77738C] dark:text-purple-300 mt-2 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E9E4F5] dark:border-purple-900/40">
                <div className="flex items-center justify-between text-[11px] text-[#77738C] dark:text-purple-400 mb-3">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <User className="w-3 h-3 text-[#77738C]" />
                    {res.uploadedBy.split('(')[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#77738C]" />
                    {res.uploadDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActivePreviewResource(res)}
                    className="w-full py-2 px-3 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] dark:bg-purple-900/50 dark:hover:bg-purple-900/70 text-[#6D28D9] dark:text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read / Preview</span>
                  </button>

                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([
                        `=== ${res.title} ===\nSubject: ${res.subject}\nAuthor: ${res.uploadedBy}\nDate: ${res.uploadDate}\n\n` +
                        (res.sampleContent || []).join("\n\n")
                      ], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `${res.sampleDocumentTitle || 'document'}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-[#E9E4F5] dark:border-purple-900/40 bg-white dark:bg-[#1D172E] hover:bg-[#FAF9FF] dark:hover:bg-[#13101E] text-[#242038] dark:text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#77738C]" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#1D172E] border border-[#E9E4F5] dark:border-purple-900/40 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#EDE9FE] dark:bg-purple-900/40 flex items-center justify-center text-[#6D28D9] dark:text-purple-300 mx-auto mb-3">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#242038] dark:text-purple-100 font-heading">
            No course materials match your search
          </h3>
          <p className="text-xs text-[#77738C] dark:text-purple-300 max-w-sm mx-auto mt-1">
            Try adjusting your subject filter or search keyword, or upload a new syllabus document.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedSubject('All'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs font-semibold shadow-sm cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        resource={activePreviewResource}
        onClose={() => setActivePreviewResource(null)}
      />

      {/* Upload Modal */}
      <UploadResourceModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

    </div>
  );
};

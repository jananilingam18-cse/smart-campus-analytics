import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { LearningResource } from '../types';

interface PDFViewerModalProps {
  resource: LearningResource | null;
  onClose: () => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ resource, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!resource) return null;

  const contentPages = resource.sampleContent || [
    'No preview content generated for this module.'
  ];

  const handleDownload = () => {
    // Generate clean downloadable file
    const element = document.createElement("a");
    const file = new Blob([
      `=== ${resource.title} ===\nSubject: ${resource.subject}\nAuthor: ${resource.uploadedBy}\nDate: ${resource.uploadDate}\n\n` +
      contentPages.join("\n\n")
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${resource.sampleDocumentTitle || 'document'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#242038]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 flex flex-col overflow-hidden">
        
        {/* PDF Top Toolbar */}
        <div className="px-4 py-3 bg-[#242038] text-white flex items-center justify-between border-b border-[#342D50] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#EDE9FE]/20 text-[#A78BFA] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs md:text-sm font-bold truncate max-w-xs md:max-w-md">
                {resource.sampleDocumentTitle || resource.title}
              </h3>
              <p className="text-[10px] text-purple-200 truncate">
                {resource.subject} • {resource.uploadedBy}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center bg-[#1D172E] rounded-lg p-0.5 border border-purple-900/40">
              <button
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                className="p-1.5 hover:bg-purple-900/40 rounded text-purple-200 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-purple-200">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1.5 hover:bg-purple-900/40 rounded text-purple-200 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-1.5 hover:bg-purple-900/40 rounded-lg text-purple-200 cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Download Material"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-purple-900/40 rounded-lg text-purple-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Reader Canvas Area */}
        <div className="flex-1 bg-[#FAF9FF] dark:bg-[#13101E] p-4 md:p-8 overflow-y-auto flex justify-center">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-white text-[#242038] shadow-lg rounded-2xl p-8 md:p-12 transition-transform duration-150 min-h-[600px] flex flex-col justify-between border border-[#E9E4F5]"
          >
            {/* Document Header Page */}
            <div>
              <div className="border-b-2 border-[#6D28D9]/20 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#7C3AED]">
                    Official Course Material • Campus IQ
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-[#242038] font-heading mt-1 leading-snug">
                    {resource.title}
                  </h1>
                  <p className="text-xs text-[#77738C] mt-1">
                    Department of Computer Science & Engineering
                  </p>
                </div>
                <div className="text-right text-[11px] text-[#77738C] font-mono">
                  <p>Rev 2026.1</p>
                  <p>{resource.fileSize}</p>
                </div>
              </div>

              {/* Document Body */}
              <div className="space-y-4 text-xs md:text-sm text-[#242038] leading-relaxed font-serif">
                {contentPages.map((paragraph, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl ${
                      paragraph.startsWith('CHAPTER') || paragraph.startsWith('MODULE') || paragraph.startsWith('PILLAR') || paragraph.startsWith('SECTION')
                        ? 'bg-[#FAF9FF] border border-[#E9E4F5] font-sans font-bold text-[#6D28D9] text-xs tracking-wide uppercase'
                        : ''
                    }`}
                  >
                    {paragraph}
                  </div>
                ))}
              </div>
            </div>

            {/* Document Footer */}
            <div className="pt-8 mt-8 border-t border-[#E9E4F5] flex items-center justify-between text-[11px] text-[#77738C] font-sans">
              <div>
                Instructor: <strong className="text-[#242038]">{resource.uploadedBy}</strong>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Academic Syllabus Resource</span>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Bottom Page Bar */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#1D172E] border-t border-[#E9E4F5] dark:border-purple-900/40 flex items-center justify-between text-xs text-[#77738C] dark:text-purple-300 shrink-0">
          <div>
            Format: <span className="font-semibold text-[#242038] dark:text-purple-100 uppercase">{resource.fileType}</span> ({resource.fileSize})
          </div>
          <div className="flex items-center gap-2">
            <span>Page 1 of 1</span>
          </div>
          <div>
            Upload Date: {resource.uploadDate}
          </div>
        </div>

      </div>
    </div>
  );
};

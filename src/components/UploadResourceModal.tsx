import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LearningResource } from '../types';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({ isOpen, onClose }) => {
  const { uploadLearningResource } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'notes' | 'slides' | 'lab'>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Max 25MB check
      if (file.size > 25 * 1024 * 1024) {
        setErrorMsg('File exceeds 25 MB limit.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please specify the resource title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description.');
      return;
    }

    const newResource: LearningResource = {
      id: `res-${Date.now()}`,
      title,
      subject,
      description,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '4.5 MB',
      fileType,
      uploadedBy: 'Course Faculty Coordinator',
      sampleDocumentTitle: selectedFile ? selectedFile.name : `${title.replace(/\s+/g, '_')}.pdf`,
      sampleContent: [
        `COURSE MODULE: ${title.toUpperCase()}`,
        `Subject: ${subject} | Verified Syllabus Upload`,
        `1.1 Overview and key foundational principles.`,
        `1.2 Theoretical derivations, algorithmic pseudocode, and system architecture.`,
        `1.3 Case studies, assignment prompts, and practice review questions.`
      ]
    };

    uploadLearningResource(newResource);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242038]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1D172E] rounded-3xl shadow-2xl border border-[#E9E4F5] dark:border-purple-900/50 p-6 md:p-8 overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E4F5] dark:border-purple-900/40">
          <div>
            <h3 className="text-lg font-bold text-[#242038] dark:text-purple-100 font-heading">
              Upload Learning Material
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Publish textbooks, lecture handouts, or lab manuals
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
              Resource Published Successfully!
            </h4>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              The material is now immediately available in My Learning.
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
                Resource Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Database Architecture Lecture Slides"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                >
                  <option>Data Structures & Algorithms</option>
                  <option>Database Management Systems</option>
                  <option>Operating Systems & Kernels</option>
                  <option>Cloud Computing & DevOps</option>
                  <option>AI & ML Lab</option>
                  <option>Soft Skills & Corporate Aptitude</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Resource Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="notes">Lecture Notes</option>
                  <option value="slides">Presentation Slides</option>
                  <option value="lab">Lab Manual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                Brief Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Key concepts, syllabus unit coverage, and references..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none resize-none"
              />
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                Attach File (PDF, DOCX, PPTX)
              </label>
              <div className="border-2 border-dashed border-[#E9E4F5] dark:border-purple-900/50 rounded-2xl p-4 text-center hover:bg-[#FAF9FF] dark:hover:bg-[#13101E] transition relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-8 h-8 text-[#7C3AED] mx-auto mb-1.5" />
                <p className="text-xs font-medium text-[#242038] dark:text-purple-100">
                  {selectedFile ? selectedFile.name : 'Click to select or drag and drop material'}
                </p>
                <p className="text-[10px] text-[#77738C] dark:text-purple-400 mt-0.5">
                  Supported formats: PDF, DOCX, PPTX (Max 25 MB)
                </p>
              </div>
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
                Publish Resource
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

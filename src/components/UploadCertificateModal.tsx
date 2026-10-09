import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Trophy, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventRecord } from '../types';

interface UploadCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'Technical' | 'Non-Technical';
}

export const UploadCertificateModal: React.FC<UploadCertificateModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultCategory = 'Technical' 
}) => {
  const { uploadCertificate } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Technical' | 'Non-Technical'>(defaultCategory);
  const [subcategory, setSubcategory] = useState('Hackathon');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Winner' | '1st Runner Up' | 'Finalist' | 'Participant' | 'Organizer'>('Winner');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

      if (!validTypes.includes(file.type)) {
        setErrorMsg('Invalid file format. Please upload PDF, JPG, PNG or WEBP certificate.');
        return;
      }

      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File size exceeds the 10 MB limit.');
        return;
      }

      setErrorMsg('');
      setSelectedFile(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please specify the event name.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter a brief description of your contribution.');
      return;
    }

    const newEvent: EventRecord = {
      id: `ev-${Date.now()}`,
      name,
      category,
      subcategory,
      date,
      status,
      verificationStatus: 'Pending Verification',
      pointsAwarded: status === 'Winner' ? 25 : status === '1st Runner Up' ? 20 : status === 'Finalist' ? 15 : 10,
      description,
      certificateName: selectedFile ? selectedFile.name : `${name.replace(/\s+/g, '_')}_Certificate.pdf`,
      certificateUrl: previewUrl || '/certificates/sample-certificate.pdf'
    };

    uploadCertificate(newEvent);
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
            <h3 className="text-lg font-bold text-[#242038] dark:text-purple-100 font-heading flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Upload Event Certificate
            </h3>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Submit proof for faculty verification & co-curricular points
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
              Certificate Uploaded & Queued for Verification!
            </h4>
            <p className="text-xs text-[#77738C] dark:text-purple-300">
              Your record has been updated with "Pending Verification" status.
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
                Event / Competition Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. KPMG India National Analytics Hackathon 2026"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                >
                  <option value="Technical">Technical Event</option>
                  <option value="Non-Technical">Non-Technical Event</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Sub-Type
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                >
                  {category === 'Technical' ? (
                    <>
                      <option>Hackathon</option>
                      <option>Coding Competition</option>
                      <option>Paper Presentation</option>
                      <option>Project Expo</option>
                      <option>Technical Workshop</option>
                    </>
                  ) : (
                    <>
                      <option>Sports Tournament</option>
                      <option>Cultural Festival</option>
                      <option>Debate</option>
                      <option>Volunteering & NSS</option>
                      <option>Leadership Activity</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Participation / Achievement Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none font-medium"
                >
                  <option value="Winner">Winner (1st Place)</option>
                  <option value="1st Runner Up">1st Runner Up (2nd Place)</option>
                  <option value="Finalist">Finalist</option>
                  <option value="Participant">Participant</option>
                  <option value="Organizer">Organizer / Volunteer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                Description of Role / Achievement
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Built full stack predictive prototype, team lead..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E9E4F5] dark:border-purple-900/50 bg-[#FAF9FF] dark:bg-[#13101E] text-[#242038] dark:text-purple-100 focus:ring-2 focus:ring-[#7C3AED] outline-none resize-none"
              />
            </div>

            {/* Certificate File Drag/Drop */}
            <div>
              <label className="block text-xs font-semibold text-[#242038] dark:text-purple-200 mb-1">
                Upload Certificate Proof (PDF, JPG, PNG)
              </label>
              <div className="border-2 border-dashed border-[#E9E4F5] dark:border-purple-900/50 rounded-2xl p-4 text-center hover:bg-[#FAF9FF] dark:hover:bg-[#13101E] transition relative">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-[#7C3AED] mx-auto mb-1.5" />
                <p className="text-xs font-medium text-[#242038] dark:text-purple-100">
                  {selectedFile ? selectedFile.name : 'Select certificate file or drag & drop'}
                </p>
                <p className="text-[10px] text-[#77738C] dark:text-purple-400 mt-0.5">
                  Supported formats: PDF, PNG, JPG (Max 10 MB)
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
                Submit Certificate
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

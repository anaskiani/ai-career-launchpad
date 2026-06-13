import { useState, useEffect } from 'react';
import { useResumeStore } from '../../context/resumeStore';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ExperienceSection } from './ExperienceSection';
import { ResumeEducationSection } from './ResumeEducationSection';
import { ResumeSkillsSection } from './ResumeSkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificationsSection } from './CertificationsSection';
import { ResumePreview } from './ResumePreview';
import { ResumeTipsPanel } from './ResumeTipsPanel';
import { generateResumePDF } from '../../utils/generateResumePDF';
import {
  Save, Download, Eye, EyeOff, Loader2, CheckCircle, AlertCircle,
  FileText, ChevronDown, ChevronUp,
} from 'lucide-react';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
];

export const ResumeBuilder = () => {
  const {
    form, isLoading, isSaving, error, successMessage, hasChanges,
    fetchResume, saveResume, updateField, updateSection, clearMessages,
  } = useResumeStore();

  const [showPreview, setShowPreview] = useState(true);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => { fetchResume(); }, [fetchResume]);

  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(clearMessages, 5000);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, clearMessages]);

  const toggleSection = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    await saveResume();
  };

  const handleExportPDF = () => {
    generateResumePDF(form);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-500 font-medium">Loading resume...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <ResumeTipsPanel form={form} />
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-sm text-gray-500">Build and export your ATS-friendly resume</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download size={16} /> Export PDF
          </button>
          <button
            type="button"
            data-testid="resume-save-btn"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              hasChanges
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
          </button>
        </div>
      </div>

      {/* Toast messages */}
      {successMessage && (
        <div
          data-testid="resume-success-message"
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4 animate-fadeIn"
        >
          <CheckCircle size={18} /> <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 mb-4 animate-fadeIn">
          <AlertCircle size={18} /> <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Two-column layout: Form | Preview */}
      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-3xl'}`}>
        {/* Left — Form */}
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">{section.label}</span>
                {collapsed[section.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronUp size={18} className="text-gray-400" />}
              </button>

              {!collapsed[section.id] && (
                <div className="px-6 pb-6">
                  {section.id === 'personal' && (
                    <PersonalInfoSection data={form.personalInfo} onChange={updateField} />
                  )}
                  {section.id === 'experience' && (
                    <ExperienceSection data={form.experiences} onChange={(v) => updateSection('experiences', v)} />
                  )}
                  {section.id === 'education' && (
                    <ResumeEducationSection data={form.education} onChange={(v) => updateSection('education', v)} />
                  )}
                  {section.id === 'skills' && (
                    <ResumeSkillsSection data={form.skills} onChange={(v) => updateSection('skills', v)} />
                  )}
                  {section.id === 'projects' && (
                    <ProjectsSection data={form.projects} onChange={(v) => updateSection('projects', v)} />
                  )}
                  {section.id === 'certifications' && (
                    <CertificationsSection data={form.certifications} onChange={(v) => updateSection('certifications', v)} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right — Live Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">Live Preview</span>
                <span className="text-xs text-gray-400">ATS-Friendly Template</span>
              </div>
              <div className="transform origin-top scale-[0.85] lg:scale-[0.75] xl:scale-[0.85]" style={{ transformOrigin: 'top center' }}>
                <ResumePreview form={form} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

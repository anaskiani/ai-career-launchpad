import { useState, useEffect } from 'react';
import { useProfileStore } from '../../context/profileStore';
import { SkillsInput } from './SkillsInput';
import { EducationSection } from './EducationSection';
import { WorkExperienceSection } from './WorkExperienceSection';
import {
  User, Briefcase, GraduationCap, Link2, CheckCircle,
  AlertCircle, Loader2, Save
} from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'career', label: 'Career', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Work Experience', icon: Briefcase },
  { id: 'links', label: 'Links', icon: Link2 },
];

export const ProfileForm = () => {
  const {
    profile, isLoading, isSaving, error, successMessage,
    fetchProfile, updateProfile, clearMessages,
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        targetRole: profile.targetRole || '',
        experience: profile.experience || 0,
        skills: profile.skills || [],
        university: profile.university || '',
        graduationYear: profile.graduationYear || '',
        education: profile.education || [],
        workExperience: profile.workExperience || [],
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        portfolio: profile.portfolio || '',
      });
      setHasChanges(false);
    }
  }, [profile]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(clearMessages, 5000);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, clearMessages]);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleInput = (e) => {
    let { name, value } = e.target;

    if (name === 'name' || name === 'targetRole') {
      value = value.replace(/[^a-zA-Z\s\-']/g, ''); // allow spaces, hyphens, apostrophes
      if (value.length > 0 && !/^[a-zA-Z]/.test(value)) {
        value = value.replace(/^[^a-zA-Z]+/, '');
      }
    } else if (name === 'phone') {
      value = value.replace(/[^\d\s+()-]/g, '');
      if (value.length > 0 && !/^[\d+]/.test(value)) {
        value = value.replace(/^[^(\d+)]+/, '');
      }
      if (value.length > 20) value = value.substring(0, 20);
    } else if (name === 'location' || name === 'bio') {
      if (value.length > 0 && !/^[a-zA-Z0-9]/.test(value)) {
        value = value.replace(/^[^a-zA-Z0-9]+/, '');
      }
    } else if (name === 'experience') {
      value = value.replace(/[^\d]/g, '');
      if (value !== '' && parseInt(value) > 50) value = '50';
    } else if (name === 'graduationYear') {
      value = value.replace(/[^\d]/g, '');
      if (value !== '' && value.length > 4) value = value.slice(0, 4);
    }

    updateField(name, value);
  };

  const handleUrlBlur = (e) => {
    const { name, value } = e.target;
    if (value && !/^https?:\/\//i.test(value)) {
      updateField(name, `https://${value}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = await updateProfile(form);
    if (success) setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-500 font-medium">Loading profile...</span>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white';

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Toast messages */}
      {successMessage && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 animate-fadeIn">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 animate-fadeIn">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Tab navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name || ''} onChange={handleInput} className={inputClass} placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input type="tel" name="phone" value={form.phone || ''} onChange={handleInput} className={inputClass} placeholder="+92 300 1234567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input type="text" name="location" value={form.location || ''} onChange={handleInput} className={inputClass} placeholder="e.g. Islamabad, Pakistan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea name="bio" value={form.bio || ''} onChange={handleInput} className={`${inputClass} resize-none`} rows="4" placeholder="A brief introduction about yourself..." maxLength={500} />
                <p className="text-xs text-gray-400 mt-1 text-right">{(form.bio || '').length}/500</p>
              </div>
            </div>
          )}

          {/* Career Tab */}
          {activeTab === 'career' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Role</label>
                <input type="text" name="targetRole" value={form.targetRole || ''} onChange={handleInput} className={inputClass} placeholder="e.g. Full Stack Developer, ML Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                <input type="number" name="experience" value={form.experience || 0} onChange={handleInput} className={inputClass} min="0" max="50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
                <SkillsInput skills={form.skills || []} onChange={(skills) => updateField('skills', skills)} />
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">University</label>
                  <input type="text" name="university" value={form.university || ''} onChange={handleInput} className={inputClass} placeholder="Primary university" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Graduation Year</label>
                  <input type="number" name="graduationYear" value={form.graduationYear || ''} onChange={handleInput} className={inputClass} placeholder="2025" min="1950" max="2040" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Education History</h3>
              <EducationSection education={form.education || []} onChange={(education) => updateField('education', education)} />
            </div>
          )}

          {/* Work Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
              <WorkExperienceSection workExperience={form.workExperience || []} onChange={(workExperience) => updateField('workExperience', workExperience)} />
            </div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub</label>
                <input type="url" name="github" value={form.github || ''} onChange={handleInput} onBlur={handleUrlBlur} className={inputClass} placeholder="https://github.com/username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label>
                <input type="url" name="linkedin" value={form.linkedin || ''} onChange={handleInput} onBlur={handleUrlBlur} className={inputClass} placeholder="https://linkedin.com/in/username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Portfolio</label>
                <input type="url" name="portfolio" value={form.portfolio || ''} onChange={handleInput} onBlur={handleUrlBlur} className={inputClass} placeholder="https://yourportfolio.com" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save button — sticky bottom */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={isSaving || !hasChanges}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
            hasChanges
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-gray-300 cursor-not-allowed shadow-none'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

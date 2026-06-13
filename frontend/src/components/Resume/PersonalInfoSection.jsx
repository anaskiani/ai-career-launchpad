import { User, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

export const PersonalInfoSection = ({ data, onChange }) => {
  const update = (field, value) => onChange(`personalInfo.${field}`, value);

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <User size={16} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="resume-full-name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input
            id="resume-full-name"
            type="text"
            value={data.fullName || ''}
            onChange={(e) => update('fullName', e.target.value)}
            className={inputClass}
            placeholder="Muhammad Anas Zamir"
          />
        </div>
        <div>
          <label htmlFor="resume-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            id="resume-email"
            type="email"
            value={data.email || ''}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="resume-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <input
            id="resume-phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
            placeholder="+92 300 1234567"
          />
        </div>
        <div>
          <label htmlFor="resume-location" className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
          <input
            id="resume-location"
            type="text"
            value={data.location || ''}
            onChange={(e) => update('location', e.target.value)}
            className={inputClass}
            placeholder="Islamabad, Pakistan"
          />
        </div>
        <div>
          <label htmlFor="resume-linkedin" className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
          <input
            id="resume-linkedin"
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => update('linkedin', e.target.value)}
            className={inputClass}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div>
          <label htmlFor="resume-github" className="block text-sm font-medium text-gray-700 mb-1.5">GitHub URL</label>
          <input
            id="resume-github"
            type="url"
            value={data.github || ''}
            onChange={(e) => update('github', e.target.value)}
            className={inputClass}
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      <div>
        <label htmlFor="resume-summary" className="block text-sm font-medium text-gray-700 mb-1.5">Professional Summary</label>
        <textarea
          id="resume-summary"
          value={data.summary || ''}
          onChange={(e) => update('summary', e.target.value)}
          className={`${inputClass} resize-none`}
          rows="4"
          placeholder="A brief professional summary highlighting your key strengths and career goals..."
          maxLength={500}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{(data.summary || '').length}/500</p>
      </div>
    </div>
  );
};

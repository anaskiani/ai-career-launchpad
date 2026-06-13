import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const ResumePreview = ({ form }) => {
  const { personalInfo = {}, experiences = [], education = [], skills = [], projects = [], certifications = [] } = form || {};

  return (
    <div
      id="resume-preview"
      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
      style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: '11px', lineHeight: '1.5', color: '#1a1a1a' }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-5 border-b-2 border-gray-800">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
          {personalInfo.email && (
            <span className="inline-flex items-center gap-1"><Mail size={10} /> {personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="inline-flex items-center gap-1"><Phone size={10} /> {personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span className="inline-flex items-center gap-1"><MapPin size={10} /> {personalInfo.location}</span>
          )}
          {personalInfo.linkedin && (
            <span className="inline-flex items-center gap-1"><Linkedin size={10} /> {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
          )}
          {personalInfo.github && (
            <span className="inline-flex items-center gap-1"><Github size={10} /> {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
          )}
        </div>
      </div>

      <div className="px-8 py-5 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Experience
            </h2>
            <div className="space-y-3">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-gray-900">{exp.position}</span>
                      <span className="text-gray-500"> — {exp.company}</span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)} – {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                    <span className="text-gray-500"> — {edu.institution}</span>
                    {edu.gpa && <span className="text-gray-400 text-xs ml-2">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.graduationDate && (
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{formatDate(edu.graduationDate)}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-x-1 gap-y-0.5 text-xs text-gray-700">
              {skills.map((s, i) => (
                <span key={i}>
                  <span className="font-medium">{s.name}</span>
                  {i < skills.length - 1 && <span className="text-gray-400 mx-1">•</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-2">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900">{proj.title}</span>
                    {proj.url && <span className="text-xs text-blue-600">{proj.url}</span>}
                  </div>
                  {proj.description && <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>}
                  {proj.technologies?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      <span className="font-medium">Tech:</span> {proj.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              Certifications
            </h2>
            <div className="space-y-1">
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-gray-900">{cert.title}</span>
                    {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                  </div>
                  {cert.issueDate && <span className="text-xs text-gray-500 ml-4">{formatDate(cert.issueDate)}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export const resumeTips = [
  {
    id: 'summary',
    title: 'Professional summary',
    tip: 'Write 2–3 lines: target role + years of experience + top 2 skills. Avoid generic phrases like "hard-working team player."',
  },
  {
    id: 'bullets',
    title: 'Experience bullets',
    tip: 'Start with action verbs (Built, Led, Improved) and add metrics when possible (%, users, time saved).',
  },
  {
    id: 'skills',
    title: 'Skills section',
    tip: 'List skills that appear in job posts for your target role. Group by category (Languages, Tools, Frameworks).',
  },
  {
    id: 'projects',
    title: 'Projects',
    tip: 'Include 1–2 projects with a live link or GitHub repo. Describe your role and the tech stack.',
  },
  {
    id: 'length',
    title: 'Length',
    tip: 'Students and juniors: aim for one page. Remove outdated or irrelevant entries.',
  },
  {
    id: 'format',
    title: 'Formatting',
    tip: 'Use consistent dates (e.g. Jan 2024 – Present), aligned headings, and readable font size for PDF export.',
  },
];

export const getResumeChecklistScore = (form = {}) => {
  let score = 0;
  const personal = form.personalInfo || {};

  if (personal.fullName && personal.email) score += 15;
  if (personal.summary?.trim().length > 40) score += 15;
  if ((form.experiences || []).length > 0) score += 20;
  if ((form.education || []).length > 0) score += 15;
  if ((form.skills || []).length >= 3) score += 15;
  if ((form.projects || []).length > 0) score += 10;
  if ((form.certifications || []).length > 0) score += 10;

  return Math.min(100, score);
};

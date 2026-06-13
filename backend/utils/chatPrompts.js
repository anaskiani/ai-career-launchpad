export const topicPromptMap = {
  resume: 'Give resume feedback with concrete improvement suggestions, stronger phrasing, and missing sections to add.',
  interview: 'Act as an interview coach. Give concise, practical guidance with sample talking points and common mistakes to avoid.',
  'skill-roadmap': 'Create a practical skill roadmap with short-term and medium-term actions, prioritizing beginner-friendly steps.',
  'job-advice': 'Recommend job search actions, portfolio improvements, and application strategies relevant to the user query.',
  'career-guidance': 'Provide supportive, practical career guidance with clear next steps.',
};

export const detectTopic = (message = '') => {
  const text = message.toLowerCase();

  if (text.includes('resume') || text.includes('cv')) return 'resume';
  if (text.includes('interview')) return 'interview';
  if (text.includes('roadmap') || text.includes('skill')) return 'skill-roadmap';
  if (text.includes('job') || text.includes('internship') || text.includes('apply')) return 'job-advice';
  return 'career-guidance';
};

const topicLabels = {
  resume: 'Resume feedback',
  interview: 'Interview prep',
  'skill-roadmap': 'Skill roadmap',
  'job-advice': 'Job search',
  'career-guidance': 'Career guidance',
};

const contextualTips = {
  resume: [
    'Lead each bullet with a strong verb (built, improved, led) and add a number where possible.',
    'Match your skills section to keywords from job descriptions you are targeting.',
    'Keep the summary to 2–3 lines focused on role + top strengths.',
  ],
  interview: [
    'Use STAR: Situation → Task → Action → Result for behavioral questions.',
    'For technical questions, explain your approach before the final answer.',
    'Prepare 3 stories: teamwork, failure/learning, and a project you are proud of.',
  ],
  'skill-roadmap': [
    'Pick one target role and list its top 5 required skills from real job posts.',
    'Learn one skill at a time with a small project that proves you can use it.',
    'Re-run skill analysis after updating your profile skills.',
  ],
  'job-advice': [
    'Apply to roles where you match at least 60% of listed requirements.',
    'Customize your resume summary for each application batch (same role family).',
    'Follow up politely one week after applying if you have a contact.',
  ],
  'career-guidance': [
    'Set a 4-week goal with one measurable outcome (e.g. finish resume + 5 applications).',
    'Balance learning, building projects, and applying—do not only watch tutorials.',
    'Review progress every Sunday and adjust your plan.',
  ],
};

const pickTips = (topic, count = 2) => {
  const pool = contextualTips[topic] || contextualTips['career-guidance'];
  return pool.slice(0, count);
};

const detectQuestionType = (message = '') => {
  const text = message.toLowerCase();
  if (text.includes('how') || text.includes('what should')) return 'how-to';
  if (text.includes('example') || text.includes('sample')) return 'example';
  if (text.includes('improve') || text.includes('better')) return 'improve';
  return 'general';
};

export const buildFallbackReply = ({ topic, message }) => {
  const label = topicLabels[topic] || 'Career guidance';
  const questionType = detectQuestionType(message);
  const tips = pickTips(topic, 3);

  const introByType = {
    'how-to': `Here is a practical ${label.toLowerCase()} plan for your question:`,
    example: `Here are example-style pointers for ${label.toLowerCase()}:`,
    improve: `Ways to improve based on your question:`,
    general: `Offline career coach (${label}) — guidance for your question:`,
  };

  const closing =
    'This reply uses built-in coaching tips (no paid AI API). For deeper answers, add an OpenRouter key in backend `.env`.';

  return [
    introByType[questionType] || introByType.general,
    `"${message.trim()}"`,
    '',
    ...tips.map((tip, index) => `${index + 1}. ${tip}`),
    '',
    closing,
  ].join('\n');
};

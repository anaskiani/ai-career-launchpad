/**
 * Static skill-role dataset for Skill Gap Analysis
 * Maps target roles to required skills with categories and learning resources
 */

const roleSkillsMap = {
  'Frontend Developer': {
    skills: [
      { name: 'HTML', category: 'Core', priority: 'essential' },
      { name: 'CSS', category: 'Core', priority: 'essential' },
      { name: 'JavaScript', category: 'Core', priority: 'essential' },
      { name: 'TypeScript', category: 'Core', priority: 'recommended' },
      { name: 'React', category: 'Framework', priority: 'essential' },
      { name: 'Next.js', category: 'Framework', priority: 'recommended' },
      { name: 'Tailwind CSS', category: 'Styling', priority: 'recommended' },
      { name: 'Git', category: 'Tools', priority: 'essential' },
      { name: 'REST APIs', category: 'Integration', priority: 'essential' },
      { name: 'Responsive Design', category: 'Core', priority: 'essential' },
      { name: 'Testing', category: 'Quality', priority: 'recommended' },
      { name: 'Webpack', category: 'Tools', priority: 'optional' },
      { name: 'Figma', category: 'Design', priority: 'optional' },
      { name: 'Redux', category: 'State Management', priority: 'recommended' },
    ],
  },
  'Backend Developer': {
    skills: [
      { name: 'Node.js', category: 'Runtime', priority: 'essential' },
      { name: 'Express', category: 'Framework', priority: 'essential' },
      { name: 'Python', category: 'Language', priority: 'recommended' },
      { name: 'SQL', category: 'Database', priority: 'essential' },
      { name: 'MongoDB', category: 'Database', priority: 'essential' },
      { name: 'REST APIs', category: 'Architecture', priority: 'essential' },
      { name: 'GraphQL', category: 'Architecture', priority: 'optional' },
      { name: 'Authentication', category: 'Security', priority: 'essential' },
      { name: 'Docker', category: 'DevOps', priority: 'recommended' },
      { name: 'Git', category: 'Tools', priority: 'essential' },
      { name: 'Testing', category: 'Quality', priority: 'recommended' },
      { name: 'Redis', category: 'Cache', priority: 'optional' },
      { name: 'Linux', category: 'Systems', priority: 'recommended' },
    ],
  },
  'Full Stack Developer': {
    skills: [
      { name: 'HTML', category: 'Frontend', priority: 'essential' },
      { name: 'CSS', category: 'Frontend', priority: 'essential' },
      { name: 'JavaScript', category: 'Core', priority: 'essential' },
      { name: 'TypeScript', category: 'Core', priority: 'recommended' },
      { name: 'React', category: 'Frontend', priority: 'essential' },
      { name: 'Node.js', category: 'Backend', priority: 'essential' },
      { name: 'Express', category: 'Backend', priority: 'essential' },
      { name: 'MongoDB', category: 'Database', priority: 'essential' },
      { name: 'SQL', category: 'Database', priority: 'recommended' },
      { name: 'REST APIs', category: 'Architecture', priority: 'essential' },
      { name: 'Git', category: 'Tools', priority: 'essential' },
      { name: 'Docker', category: 'DevOps', priority: 'recommended' },
      { name: 'AWS', category: 'Cloud', priority: 'optional' },
      { name: 'Testing', category: 'Quality', priority: 'recommended' },
      { name: 'CI/CD', category: 'DevOps', priority: 'optional' },
    ],
  },
  'Data Scientist': {
    skills: [
      { name: 'Python', category: 'Core', priority: 'essential' },
      { name: 'Statistics', category: 'Math', priority: 'essential' },
      { name: 'Machine Learning', category: 'Core', priority: 'essential' },
      { name: 'Pandas', category: 'Library', priority: 'essential' },
      { name: 'NumPy', category: 'Library', priority: 'essential' },
      { name: 'Scikit-learn', category: 'Library', priority: 'essential' },
      { name: 'TensorFlow', category: 'Deep Learning', priority: 'recommended' },
      { name: 'SQL', category: 'Database', priority: 'essential' },
      { name: 'Data Visualization', category: 'Core', priority: 'essential' },
      { name: 'Matplotlib', category: 'Library', priority: 'recommended' },
      { name: 'Deep Learning', category: 'Advanced', priority: 'recommended' },
      { name: 'NLP', category: 'Specialization', priority: 'optional' },
      { name: 'R', category: 'Language', priority: 'optional' },
      { name: 'Big Data', category: 'Infrastructure', priority: 'optional' },
    ],
  },
  'ML Engineer': {
    skills: [
      { name: 'Python', category: 'Core', priority: 'essential' },
      { name: 'Machine Learning', category: 'Core', priority: 'essential' },
      { name: 'Deep Learning', category: 'Core', priority: 'essential' },
      { name: 'TensorFlow', category: 'Framework', priority: 'essential' },
      { name: 'PyTorch', category: 'Framework', priority: 'recommended' },
      { name: 'MLOps', category: 'Operations', priority: 'essential' },
      { name: 'Docker', category: 'DevOps', priority: 'essential' },
      { name: 'Kubernetes', category: 'DevOps', priority: 'recommended' },
      { name: 'AWS', category: 'Cloud', priority: 'recommended' },
      { name: 'SQL', category: 'Database', priority: 'essential' },
      { name: 'Git', category: 'Tools', priority: 'essential' },
      { name: 'Data Pipelines', category: 'Infrastructure', priority: 'recommended' },
      { name: 'Computer Vision', category: 'Specialization', priority: 'optional' },
      { name: 'NLP', category: 'Specialization', priority: 'optional' },
    ],
  },
  'DevOps Engineer': {
    skills: [
      { name: 'Linux', category: 'Core', priority: 'essential' },
      { name: 'Docker', category: 'Containerization', priority: 'essential' },
      { name: 'Kubernetes', category: 'Orchestration', priority: 'essential' },
      { name: 'AWS', category: 'Cloud', priority: 'essential' },
      { name: 'CI/CD', category: 'Automation', priority: 'essential' },
      { name: 'Terraform', category: 'IaC', priority: 'essential' },
      { name: 'Ansible', category: 'Configuration', priority: 'recommended' },
      { name: 'Git', category: 'Tools', priority: 'essential' },
      { name: 'Python', category: 'Scripting', priority: 'recommended' },
      { name: 'Bash', category: 'Scripting', priority: 'essential' },
      { name: 'Monitoring', category: 'Observability', priority: 'recommended' },
      { name: 'Networking', category: 'Infrastructure', priority: 'recommended' },
      { name: 'Jenkins', category: 'CI/CD', priority: 'optional' },
    ],
  },
  'Mobile Developer': {
    skills: [
      { name: 'React Native', category: 'Framework', priority: 'essential' },
      { name: 'JavaScript', category: 'Core', priority: 'essential' },
      { name: 'TypeScript', category: 'Core', priority: 'recommended' },
      { name: 'Flutter', category: 'Framework', priority: 'optional' },
      { name: 'iOS', category: 'Platform', priority: 'recommended' },
      { name: 'Android', category: 'Platform', priority: 'recommended' },
      { name: 'REST APIs', category: 'Integration', priority: 'essential' },
      { name: 'Git', category: 'Tools', priority: 'essential' },
      { name: 'Firebase', category: 'Backend', priority: 'recommended' },
      { name: 'UI/UX', category: 'Design', priority: 'recommended' },
      { name: 'App Store', category: 'Deployment', priority: 'recommended' },
      { name: 'Testing', category: 'Quality', priority: 'recommended' },
    ],
  },
  'Cybersecurity Analyst': {
    skills: [
      { name: 'Networking', category: 'Core', priority: 'essential' },
      { name: 'Linux', category: 'Systems', priority: 'essential' },
      { name: 'Python', category: 'Scripting', priority: 'essential' },
      { name: 'Security Fundamentals', category: 'Core', priority: 'essential' },
      { name: 'Penetration Testing', category: 'Offensive', priority: 'essential' },
      { name: 'SIEM', category: 'Monitoring', priority: 'recommended' },
      { name: 'Incident Response', category: 'Defense', priority: 'essential' },
      { name: 'Cryptography', category: 'Core', priority: 'recommended' },
      { name: 'Cloud Security', category: 'Cloud', priority: 'recommended' },
      { name: 'Compliance', category: 'Governance', priority: 'recommended' },
      { name: 'Forensics', category: 'Investigation', priority: 'optional' },
      { name: 'Malware Analysis', category: 'Advanced', priority: 'optional' },
    ],
  },
  'UI/UX Designer': {
    skills: [
      { name: 'Figma', category: 'Tools', priority: 'essential' },
      { name: 'UI Design', category: 'Core', priority: 'essential' },
      { name: 'UX Research', category: 'Core', priority: 'essential' },
      { name: 'Wireframing', category: 'Core', priority: 'essential' },
      { name: 'Prototyping', category: 'Core', priority: 'essential' },
      { name: 'Design Systems', category: 'Advanced', priority: 'recommended' },
      { name: 'HTML', category: 'Development', priority: 'recommended' },
      { name: 'CSS', category: 'Development', priority: 'recommended' },
      { name: 'Typography', category: 'Design', priority: 'recommended' },
      { name: 'User Testing', category: 'Research', priority: 'recommended' },
      { name: 'Accessibility', category: 'Standards', priority: 'recommended' },
      { name: 'Adobe XD', category: 'Tools', priority: 'optional' },
    ],
  },
  'Cloud Architect': {
    skills: [
      { name: 'AWS', category: 'Cloud', priority: 'essential' },
      { name: 'Azure', category: 'Cloud', priority: 'recommended' },
      { name: 'GCP', category: 'Cloud', priority: 'optional' },
      { name: 'Docker', category: 'Containerization', priority: 'essential' },
      { name: 'Kubernetes', category: 'Orchestration', priority: 'essential' },
      { name: 'Terraform', category: 'IaC', priority: 'essential' },
      { name: 'Networking', category: 'Infrastructure', priority: 'essential' },
      { name: 'Security', category: 'Core', priority: 'essential' },
      { name: 'Microservices', category: 'Architecture', priority: 'essential' },
      { name: 'CI/CD', category: 'DevOps', priority: 'recommended' },
      { name: 'Serverless', category: 'Architecture', priority: 'recommended' },
      { name: 'Cost Optimization', category: 'Management', priority: 'recommended' },
      { name: 'Linux', category: 'Systems', priority: 'essential' },
    ],
  },
};

// Learning resource templates per skill
const learningResources = {
  'HTML': { url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', platform: 'MDN', duration: '1–2 weeks' },
  'CSS': { url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS', platform: 'MDN', duration: '2–3 weeks' },
  'JavaScript': { url: 'https://javascript.info/', platform: 'JavaScript.info', duration: '4–6 weeks' },
  'TypeScript': { url: 'https://www.typescriptlang.org/docs/', platform: 'TypeScript Docs', duration: '2–3 weeks' },
  'React': { url: 'https://react.dev/learn', platform: 'React.dev', duration: '3–4 weeks' },
  'Next.js': { url: 'https://nextjs.org/learn', platform: 'Next.js', duration: '2–3 weeks' },
  'Node.js': { url: 'https://nodejs.org/en/learn', platform: 'Node.js', duration: '3–4 weeks' },
  'Express': { url: 'https://expressjs.com/en/starter/installing.html', platform: 'Express.js', duration: '1–2 weeks' },
  'Python': { url: 'https://docs.python.org/3/tutorial/', platform: 'Python Docs', duration: '4–6 weeks' },
  'MongoDB': { url: 'https://university.mongodb.com/', platform: 'MongoDB University', duration: '2–3 weeks' },
  'SQL': { url: 'https://www.w3schools.com/sql/', platform: 'W3Schools', duration: '2–3 weeks' },
  'Git': { url: 'https://learngitbranching.js.org/', platform: 'Learn Git Branching', duration: '1 week' },
  'Docker': { url: 'https://docs.docker.com/get-started/', platform: 'Docker Docs', duration: '2–3 weeks' },
  'Kubernetes': { url: 'https://kubernetes.io/docs/tutorials/', platform: 'K8s Docs', duration: '3–4 weeks' },
  'AWS': { url: 'https://aws.amazon.com/training/', platform: 'AWS Training', duration: '4–8 weeks' },
  'Machine Learning': { url: 'https://www.coursera.org/learn/machine-learning', platform: 'Coursera', duration: '8–10 weeks' },
  'Deep Learning': { url: 'https://www.deeplearning.ai/', platform: 'DeepLearning.AI', duration: '6–8 weeks' },
  'TensorFlow': { url: 'https://www.tensorflow.org/tutorials', platform: 'TensorFlow', duration: '3–4 weeks' },
  'REST APIs': { url: 'https://restfulapi.net/', platform: 'RESTful API Guide', duration: '1–2 weeks' },
  'Testing': { url: 'https://jestjs.io/docs/getting-started', platform: 'Jest Docs', duration: '2–3 weeks' },
  'Tailwind CSS': { url: 'https://tailwindcss.com/docs', platform: 'Tailwind Docs', duration: '1–2 weeks' },
  'Redux': { url: 'https://redux.js.org/tutorials/essentials/part-1-overview-concepts', platform: 'Redux', duration: '1–2 weeks' },
  'GraphQL': { url: 'https://graphql.org/learn/', platform: 'GraphQL.org', duration: '2–3 weeks' },
  'Figma': { url: 'https://help.figma.com/hc/en-us', platform: 'Figma Learn', duration: '2–3 weeks' },
  'React Native': { url: 'https://reactnative.dev/docs/getting-started', platform: 'React Native', duration: '3–4 weeks' },
  'Flutter': { url: 'https://flutter.dev/docs', platform: 'Flutter Docs', duration: '4–6 weeks' },
  'Linux': { url: 'https://linuxjourney.com/', platform: 'Linux Journey', duration: '3–4 weeks' },
  'Terraform': { url: 'https://developer.hashicorp.com/terraform/tutorials', platform: 'HashiCorp', duration: '2–3 weeks' },
  'CI/CD': { url: 'https://docs.github.com/en/actions', platform: 'GitHub Actions', duration: '1–2 weeks' },
  'Firebase': { url: 'https://firebase.google.com/docs', platform: 'Firebase Docs', duration: '2–3 weeks' },
};

/**
 * Get all available roles
 */
export const getAvailableRoles = () => {
  return Object.keys(roleSkillsMap);
};

/**
 * Get required skills for a role
 */
export const getSkillsForRole = (role) => {
  return roleSkillsMap[role] || null;
};

/**
 * Run skill gap analysis
 * @param {string[]} userSkills - user's current skills
 * @param {string} targetRole - target role name
 * @returns {object} analysis result
 */
export const analyzeSkillGap = (userSkills, targetRole) => {
  const roleData = roleSkillsMap[targetRole];
  if (!roleData) return null;

  const userSkillsLower = userSkills.map((s) => s.toLowerCase().trim());
  const requiredSkills = roleData.skills;

  const matching = [];
  const missing = [];

  requiredSkills.forEach((skill) => {
    const isMatch = userSkillsLower.some(
      (us) => us === skill.name.toLowerCase() || us.includes(skill.name.toLowerCase()) || skill.name.toLowerCase().includes(us)
    );

    if (isMatch) {
      matching.push(skill);
    } else {
      missing.push({
        ...skill,
        resource: learningResources[skill.name] || {
          url: `https://www.google.com/search?q=learn+${encodeURIComponent(skill.name)}`,
          platform: 'Google Search',
          duration: '2–4 weeks',
        },
      });
    }
  });

  const matchPercentage = Math.round((matching.length / requiredSkills.length) * 100);

  // Sort missing: essential first, then recommended, then optional
  const priorityOrder = { essential: 0, recommended: 1, optional: 2 };
  missing.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

  // Generate roadmap phases
  const roadmap = generateRoadmap(missing, matching.length, requiredSkills.length);

  return {
    targetRole,
    totalRequired: requiredSkills.length,
    matchingSkills: matching.map((s) => s.name),
    missingSkills: missing.map((s) => s.name),
    matchPercentage,
    missingDetails: missing,
    matchingDetails: matching,
    roadmap,
    recommendations: generateRecommendations(matchPercentage, missing),
  };
};

/**
 * Generate learning roadmap from missing skills
 */
function generateRoadmap(missing, matchedCount, totalCount) {
  const essential = missing.filter((s) => s.priority === 'essential');
  const recommended = missing.filter((s) => s.priority === 'recommended');
  const optional = missing.filter((s) => s.priority === 'optional');

  const phases = [];

  if (essential.length > 0) {
    phases.push({
      phase: 1,
      title: 'Foundation — Must-Have Skills',
      duration: `${essential.length * 2}–${essential.length * 3} weeks`,
      skills: essential.map((s) => ({
        name: s.name,
        category: s.category,
        resource: s.resource,
      })),
    });
  }

  if (recommended.length > 0) {
    phases.push({
      phase: phases.length + 1,
      title: 'Growth — Recommended Skills',
      duration: `${recommended.length * 2}–${recommended.length * 3} weeks`,
      skills: recommended.map((s) => ({
        name: s.name,
        category: s.category,
        resource: s.resource,
      })),
    });
  }

  if (optional.length > 0) {
    phases.push({
      phase: phases.length + 1,
      title: 'Advanced — Nice-to-Have Skills',
      duration: `${optional.length}–${optional.length * 2} weeks`,
      skills: optional.map((s) => ({
        name: s.name,
        category: s.category,
        resource: s.resource,
      })),
    });
  }

  return phases;
}

/**
 * Generate text recommendations based on match percentage
 */
function generateRecommendations(matchPct, missing) {
  const recs = [];

  if (matchPct >= 80) {
    recs.push('You are well-positioned for this role! Focus on the remaining skills to be fully competitive.');
  } else if (matchPct >= 50) {
    recs.push('Good foundation! Prioritize the essential skills first, then work on recommended ones.');
  } else {
    recs.push('Start with the essential skills to build a strong foundation for this role.');
  }

  const essentialMissing = missing.filter((s) => s.priority === 'essential');
  if (essentialMissing.length > 0) {
    recs.push(`Focus on these ${essentialMissing.length} essential skill(s) first: ${essentialMissing.slice(0, 3).map(s => s.name).join(', ')}.`);
  }

  if (matchPct < 100) {
    recs.push('Build projects that combine multiple required skills for practical experience.');
    recs.push('Consider online certifications to validate your newly acquired skills.');
  }

  return recs;
}

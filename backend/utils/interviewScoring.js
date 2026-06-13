const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'in', 'on', 'for', 'of', 'is', 'are', 'was', 'were',
  'what', 'how', 'why', 'when', 'do', 'does', 'did', 'you', 'your', 'i', 'my', 'me', 'it',
  'this', 'that', 'with', 'from', 'as', 'at', 'be', 'by', 'can', 'would', 'should',
]);

const extractKeywords = (question = '') =>
  question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));

const scoreSingleAnswer = (question, answer, category) => {
  const text = (answer || '').trim();
  const tips = [];

  if (!text) {
    return {
      score: 0,
      feedback: 'No answer provided. Try using a short structure: context → action → result.',
    };
  }

  let score = 0;
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 15) {
    tips.push('Your answer is quite short. Aim for 3–5 sentences with a concrete example.');
    score += 10;
  } else if (wordCount < 35) {
    tips.push('Good start. Add one specific example or metric to strengthen the answer.');
    score += 35;
  } else if (wordCount < 80) {
    score += 55;
  } else {
    score += 45;
    tips.push('Solid depth. Keep answers focused—trim any repetition.');
  }

  const keywords = extractKeywords(question);
  const matched = keywords.filter((keyword) => text.toLowerCase().includes(keyword));
  const keywordRatio = keywords.length ? matched.length / keywords.length : 0;
  score += Math.round(keywordRatio * 30);

  if (keywordRatio < 0.25 && keywords.length > 0) {
    tips.push(`Try addressing concepts from the question (e.g. ${matched.length ? 'expand on' : 'mention'} ${keywords.slice(0, 3).join(', ')}).`);
  } else if (keywordRatio >= 0.5) {
    tips.push('You addressed key terms from the question well.');
  }

  const structureSignals = [
    /\b(for example|e\.g\.|such as)\b/i,
    /\b(i (built|created|developed|led|implemented|designed))\b/i,
    /\b(result|outcome|impact|learned)\b/i,
    /\b(we|team|collaborat)/i,
  ];
  const structureHits = structureSignals.filter((pattern) => pattern.test(text)).length;
  score += structureHits * 5;

  if (category === 'Technical' && /\b(code|api|database|function|component|test|debug)\b/i.test(text)) {
    score += 5;
  }

  if (category === 'HR' && /\b(team|challenge|learned|communicat|goal)\b/i.test(text)) {
    score += 5;
  }

  const finalScore = Math.min(100, Math.max(0, score));

  if (tips.length === 0) {
    if (finalScore >= 75) {
      tips.push('Strong answer. Practice saying it aloud in under 90 seconds.');
    } else {
      tips.push('Use the STAR method: Situation, Task, Action, Result.');
    }
  }

  return {
    score: finalScore,
    feedback: tips.join(' '),
  };
};

export const scoreInterviewSession = (questions = []) => {
  const scoredQuestions = questions.map((item) => {
    const { score, feedback } = scoreSingleAnswer(item.question, item.answer, item.category);
    return {
      ...item,
      score,
      feedback,
    };
  });

  const answered = scoredQuestions.filter((item) => (item.answer || '').trim());
  const overallScore =
    answered.length === 0
      ? 0
      : Math.round(answered.reduce((sum, item) => sum + (item.score || 0), 0) / answered.length);

  const unanswered = scoredQuestions.length - answered.length;
  const summaryParts = [
    `Overall score: ${overallScore}/100 based on ${answered.length} answered question(s).`,
  ];

  if (unanswered > 0) {
    summaryParts.push(`${unanswered} question(s) were left blank.`);
  }

  if (overallScore >= 75) {
    summaryParts.push('Great practice session—focus on concise delivery for interviews.');
  } else if (overallScore >= 50) {
    summaryParts.push('Good effort. Add more examples and tie answers back to the role.');
  } else {
    summaryParts.push('Review each question feedback and rehearse with the STAR format.');
  }

  return {
    questions: scoredQuestions,
    score: overallScore,
    feedback: summaryParts.join(' '),
  };
};

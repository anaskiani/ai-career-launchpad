/**
 * Unit tests for backend/utils/chatPrompts.js
 * Tests: detectTopic, buildFallbackReply, topicPromptMap
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { detectTopic, buildFallbackReply, topicPromptMap } from '../utils/chatPrompts.js';

// ─── detectTopic ────────────────────────────────────────────

test('detectTopic returns "resume" for resume-related messages', () => {
  assert.equal(detectTopic('How can I improve my resume?'), 'resume');
  assert.equal(detectTopic('Can you review my CV?'), 'resume');
});

test('detectTopic returns "interview" for interview-related messages', () => {
  assert.equal(detectTopic('Help me prepare for an interview'), 'interview');
  assert.equal(detectTopic('What are common interview questions?'), 'interview');
});

test('detectTopic returns "skill-roadmap" for skill-related messages', () => {
  assert.equal(detectTopic('What skills should I learn?'), 'skill-roadmap');
  assert.equal(detectTopic('Give me a learning roadmap'), 'skill-roadmap');
});

test('detectTopic returns "job-advice" for job-related messages', () => {
  assert.equal(detectTopic('How do I find a job?'), 'job-advice');
  assert.equal(detectTopic('Any tips for applying to internships?'), 'job-advice');
  assert.equal(detectTopic('Where should I apply?'), 'job-advice');
});

test('detectTopic returns "career-guidance" for general messages', () => {
  assert.equal(detectTopic('What should I do after graduation?'), 'career-guidance');
  assert.equal(detectTopic('Help me plan my future'), 'career-guidance');
  assert.equal(detectTopic(''), 'career-guidance');
});

// ─── topicPromptMap ─────────────────────────────────────────

test('topicPromptMap has all five expected topics', () => {
  const expectedTopics = ['resume', 'interview', 'skill-roadmap', 'job-advice', 'career-guidance'];
  for (const topic of expectedTopics) {
    assert.ok(topicPromptMap[topic], `topicPromptMap should contain "${topic}"`);
    assert.ok(topicPromptMap[topic].length > 10, `"${topic}" prompt should be a meaningful string`);
  }
});

// ─── buildFallbackReply ─────────────────────────────────────

test('buildFallbackReply returns a non-empty string with tips', () => {
  const reply = buildFallbackReply({ topic: 'resume', message: 'Improve my resume' });
  assert.ok(reply.length > 50, 'Reply should be a meaningful response');
  assert.ok(reply.includes('Improve my resume'), 'Reply should echo the user message');
});

test('buildFallbackReply mentions offline mode disclaimer', () => {
  const reply = buildFallbackReply({ topic: 'career-guidance', message: 'Help me' });
  assert.ok(reply.includes('built-in coaching tips'), 'Reply should mention offline fallback');
});

test('buildFallbackReply uses "how-to" intro for how-type questions', () => {
  const reply = buildFallbackReply({ topic: 'interview', message: 'How do I prepare?' });
  assert.ok(reply.includes('practical'), 'Should have a how-to style intro');
});

test('buildFallbackReply uses "example" intro for example-type questions', () => {
  const reply = buildFallbackReply({ topic: 'resume', message: 'Give me an example resume' });
  assert.ok(reply.includes('example'), 'Should have example-style intro');
});

test('buildFallbackReply uses "improve" intro for improvement questions', () => {
  const reply = buildFallbackReply({ topic: 'resume', message: 'How to improve my skills?' });
  assert.ok(reply.includes('improve'), 'Should have improve-style intro');
});

test('buildFallbackReply handles all topics without errors', () => {
  const topics = ['resume', 'interview', 'skill-roadmap', 'job-advice', 'career-guidance'];
  for (const topic of topics) {
    const reply = buildFallbackReply({ topic, message: 'Test question' });
    assert.ok(reply.length > 0, `Should produce a reply for topic "${topic}"`);
  }
});

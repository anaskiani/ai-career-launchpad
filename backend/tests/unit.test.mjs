import test from 'node:test';
import assert from 'node:assert/strict';

import { scoreInterviewSession } from '../utils/interviewScoring.js';
import {
  validateEmail,
  validatePassword,
  validateForm,
} from '../../frontend/src/utils/validators.js';

test('email validator accepts normal valid addresses', () => {
  const validEmails = [
    'student@example.com',
    'anas.zamir@university.edu',
    'career+test@launchpad.pk',
  ];

  for (const email of validEmails) {
    assert.equal(validateEmail(email), true, `${email} should be valid`);
  }
});

test('email validator rejects invalid and boundary inputs', () => {
  const invalidEmails = [
    '',
    'student',
    'student@',
    '@example.com',
    'student@example',
    'student example@example.com',
  ];

  for (const email of invalidEmails) {
    assert.equal(validateEmail(email), false, `${email} should be invalid`);
  }
});

test('password validator enforces minimum length boundary', () => {
  assert.equal(validatePassword('12345'), false);
  assert.equal(validatePassword('123456'), true);
  assert.equal(validatePassword('1234567'), true);
});

test('form validator reports required fields and invalid formats', () => {
  const errors = validateForm(
    { name: '  ', email: 'wrong-email', password: '123' },
    ['name', 'email', 'password'],
  );

  assert.equal(errors.name, 'name is required');
  assert.equal(errors.email, 'Invalid email format');
  assert.equal(errors.password, 'Password must be at least 6 characters');
});

test('interview scoring returns zero when all answers are blank', () => {
  const result = scoreInterviewSession([
    {
      question: 'Explain how you debug a React component.',
      category: 'Technical',
      answer: '',
    },
  ]);

  assert.equal(result.score, 0);
  assert.equal(result.questions[0].score, 0);
  assert.match(result.feedback, /left blank/i);
});

test('interview scoring gives higher feedback for relevant structured answers', () => {
  const blank = scoreInterviewSession([
    {
      question: 'Explain how you debug a React component.',
      category: 'Technical',
      answer: '',
    },
  ]);

  const relevant = scoreInterviewSession([
    {
      question: 'Explain how you debug a React component.',
      category: 'Technical',
      answer:
        'For example, I debug a React component by checking props, reading console errors, writing a small test, and isolating the API call. The result is usually a smaller reproducible issue that I can fix safely.',
    },
  ]);

  assert.ok(relevant.score > blank.score);
  assert.ok(relevant.questions[0].feedback.length > 0);
});

test('property: password validation is true exactly when length is at least six', () => {
  for (let length = 0; length <= 30; length += 1) {
    const password = 'a'.repeat(length);
    assert.equal(validatePassword(password), length >= 6);
  }
});

test('property: interview scores always stay between 0 and 100', () => {
  const words = ['react', 'api', 'database', 'team', 'result', 'test', 'debug', 'component'];

  for (let count = 0; count <= 120; count += 7) {
    const answer = Array.from({ length: count }, (_, index) => words[index % words.length]).join(' ');
    const result = scoreInterviewSession([
      {
        question: 'How do you debug an API component with a database issue?',
        category: count % 2 === 0 ? 'Technical' : 'HR',
        answer,
      },
    ]);

    assert.ok(result.score >= 0, `score ${result.score} should not be negative`);
    assert.ok(result.score <= 100, `score ${result.score} should not exceed 100`);
    assert.ok(result.questions[0].score >= 0);
    assert.ok(result.questions[0].score <= 100);
  }
});

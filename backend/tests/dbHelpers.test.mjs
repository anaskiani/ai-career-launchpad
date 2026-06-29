/**
 * Unit tests for backend/utils/dbHelpers.js
 * Tests: newId, toJson, fromJson, calculateProfileCompletion, mapUserPublic
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { newId, toJson, fromJson, calculateProfileCompletion, mapUserPublic } from '../utils/dbHelpers.js';

// ─── newId ──────────────────────────────────────────────────

test('newId returns a valid UUID v4 string', () => {
  const id = newId();
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('newId generates unique IDs on every call', () => {
  const ids = new Set(Array.from({ length: 50 }, () => newId()));
  assert.equal(ids.size, 50, 'All 50 IDs should be unique');
});

// ─── toJson ─────────────────────────────────────────────────

test('toJson serializes arrays to JSON strings', () => {
  const result = toJson(['JavaScript', 'React']);
  assert.equal(result, '["JavaScript","React"]');
});

test('toJson uses fallback when value is null or undefined', () => {
  assert.equal(toJson(null), '[]');
  assert.equal(toJson(undefined), '[]');
  assert.equal(toJson(null, {}), '{}');
});

test('toJson serializes objects correctly', () => {
  const result = toJson({ name: 'Test', score: 95 });
  assert.equal(JSON.parse(result).name, 'Test');
  assert.equal(JSON.parse(result).score, 95);
});

// ─── fromJson ───────────────────────────────────────────────

test('fromJson parses a valid JSON string', () => {
  const result = fromJson('["React", "Node.js"]');
  assert.deepEqual(result, ['React', 'Node.js']);
});

test('fromJson returns fallback for null/undefined', () => {
  assert.deepEqual(fromJson(null), []);
  assert.deepEqual(fromJson(undefined), []);
  assert.deepEqual(fromJson(null, ['default']), ['default']);
});

test('fromJson returns fallback for invalid JSON strings', () => {
  assert.deepEqual(fromJson('not valid json{'), []);
  assert.deepEqual(fromJson('{broken', ['fallback']), ['fallback']);
});

test('fromJson returns the value directly if already parsed (not a string)', () => {
  const arr = ['a', 'b'];
  assert.deepEqual(fromJson(arr), arr);
  const obj = { key: 'value' };
  assert.deepEqual(fromJson(obj), obj);
});

// ─── calculateProfileCompletion ─────────────────────────────

test('calculateProfileCompletion returns 0 for a completely empty user', () => {
  const emptyUser = {
    name: '',
    phone: '',
    bio: '',
    skills_json: '[]',
    experience: 0,
    github: '',
    linkedin: '',
    portfolio: '',
    profile_image: '',
    location: '',
    target_role: '',
    education_json: '[]',
    work_experience_json: '[]',
    university: '',
  };
  assert.equal(calculateProfileCompletion(emptyUser), 0);
});

test('calculateProfileCompletion returns 100 for a fully filled user', () => {
  const fullUser = {
    name: 'Anas',
    phone: '03001234567',
    bio: 'Full-stack developer',
    skills_json: '["JavaScript"]',
    experience: 2,
    github: 'https://github.com/anas',
    linkedin: '',
    portfolio: '',
    profile_image: 'avatar.jpg',
    location: 'Lahore',
    target_role: 'Frontend Developer',
    education_json: '[{"institution":"FAST"}]',
    work_experience_json: '[{"company":"Google"}]',
    university: 'FAST NUCES',
  };
  assert.equal(calculateProfileCompletion(fullUser), 100);
});

test('calculateProfileCompletion returns correct partial percentage', () => {
  const partialUser = {
    name: 'Anas',
    phone: '',
    bio: 'Test bio',
    skills_json: '["React"]',
    experience: 0,
    github: '',
    linkedin: '',
    portfolio: '',
    profile_image: '',
    location: '',
    target_role: '',
    education_json: '[]',
    work_experience_json: '[]',
    university: '',
  };
  // name + bio + skills = 3 out of 12 = 25%
  assert.equal(calculateProfileCompletion(partialUser), 25);
});

test('calculateProfileCompletion counts social links as one field', () => {
  const userWithLinkedIn = {
    name: 'Test',
    phone: '',
    bio: '',
    skills_json: '[]',
    experience: 0,
    github: '',
    linkedin: 'https://linkedin.com/in/test',
    portfolio: '',
    profile_image: '',
    location: '',
    target_role: '',
    education_json: '[]',
    work_experience_json: '[]',
    university: '',
  };
  // name + linkedin = 2 out of 12 ≈ 17%
  assert.equal(calculateProfileCompletion(userWithLinkedIn), 17);
});

// ─── mapUserPublic ──────────────────────────────────────────

test('mapUserPublic maps MySQL row to public user shape', () => {
  const row = {
    id: 'abc-123',
    name: 'Anas',
    email: 'anas@test.com',
    phone: '03001234567',
    bio: 'Developer',
    skills_json: '["React"]',
    experience: 2,
    github: 'https://github.com/anas',
    linkedin: '',
    portfolio: '',
    profile_image: 'avatar.jpg',
    location: 'Lahore',
    university: 'FAST',
    graduation_year: 2025,
    target_role: 'Frontend Dev',
    education_json: '[]',
    work_experience_json: '[]',
    email_verified: 1,
    created_at: '2025-01-01',
    updated_at: '2025-06-01',
  };

  const result = mapUserPublic(row);

  assert.equal(result.id, 'abc-123');
  assert.equal(result._id, 'abc-123');
  assert.equal(result.name, 'Anas');
  assert.equal(result.email, 'anas@test.com');
  assert.deepEqual(result.skills, ['React']);
  assert.equal(result.experience, 2);
  assert.equal(result.emailVerified, true);
  assert.equal(result.profileImage, 'avatar.jpg');
  assert.equal(typeof result.profileCompletion, 'number');
});

test('mapUserPublic returns defaults for missing fields', () => {
  const minimalRow = {
    id: 'xyz',
    name: 'Min',
    email: 'min@test.com',
  };

  const result = mapUserPublic(minimalRow);
  assert.equal(result.phone, '');
  assert.equal(result.bio, '');
  assert.deepEqual(result.skills, []);
  assert.equal(result.experience, 0);
  assert.equal(result.emailVerified, false);
});

/**
 * Unit tests for backend/utils/simpleCache.js
 * Tests: getCache, setCache, deleteCache, clearCacheByPrefix
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { getCache, setCache, deleteCache, clearCacheByPrefix } from '../utils/simpleCache.js';

// ─── setCache + getCache ────────────────────────────────────

test('setCache stores a value and getCache retrieves it', () => {
  setCache('test:key:1', { data: 'hello' }, 60_000);
  const result = getCache('test:key:1');
  assert.deepEqual(result, { data: 'hello' });
});

test('getCache returns null for a key that was never set', () => {
  const result = getCache('nonexistent:key:xyz');
  assert.equal(result, null);
});

test('getCache returns null for an expired entry', async () => {
  setCache('test:expiry', 'will-expire', 1); // 1ms TTL
  await new Promise((resolve) => setTimeout(resolve, 10));
  const result = getCache('test:expiry');
  assert.equal(result, null);
});

test('setCache overwrites existing values for the same key', () => {
  setCache('test:overwrite', 'first', 60_000);
  setCache('test:overwrite', 'second', 60_000);
  assert.equal(getCache('test:overwrite'), 'second');
});

test('setCache stores various data types', () => {
  setCache('test:string', 'hello', 60_000);
  setCache('test:number', 42, 60_000);
  setCache('test:array', [1, 2, 3], 60_000);
  setCache('test:bool', true, 60_000);

  assert.equal(getCache('test:string'), 'hello');
  assert.equal(getCache('test:number'), 42);
  assert.deepEqual(getCache('test:array'), [1, 2, 3]);
  assert.equal(getCache('test:bool'), true);
});

// ─── deleteCache ────────────────────────────────────────────

test('deleteCache removes a specific key', () => {
  setCache('test:delete:1', 'value', 60_000);
  assert.equal(getCache('test:delete:1'), 'value');

  deleteCache('test:delete:1');
  assert.equal(getCache('test:delete:1'), null);
});

test('deleteCache does not throw for non-existent keys', () => {
  assert.doesNotThrow(() => deleteCache('test:never:existed'));
});

// ─── clearCacheByPrefix ─────────────────────────────────────

test('clearCacheByPrefix removes all keys with the given prefix', () => {
  setCache('prefix:a', 1, 60_000);
  setCache('prefix:b', 2, 60_000);
  setCache('prefix:c', 3, 60_000);
  setCache('other:d', 4, 60_000);

  clearCacheByPrefix('prefix:');

  assert.equal(getCache('prefix:a'), null);
  assert.equal(getCache('prefix:b'), null);
  assert.equal(getCache('prefix:c'), null);
  assert.equal(getCache('other:d'), 4); // should NOT be removed
});

test('clearCacheByPrefix does nothing when no keys match', () => {
  setCache('keep:this', 'safe', 60_000);
  clearCacheByPrefix('nomatches:');
  assert.equal(getCache('keep:this'), 'safe');
});

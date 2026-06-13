const cache = new Map();

export const getCache = (key) => {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};

export const setCache = (key, value, ttlMs = 5 * 60 * 1000) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
};

export const deleteCache = (key) => {
  cache.delete(key);
};

export const clearCacheByPrefix = (prefix) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};

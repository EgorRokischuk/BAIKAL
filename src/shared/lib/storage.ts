export const getFromStorage = (key: string) => localStorage.getItem(key);

export const setToStorage = (key: string, value: unknown) => {
  const normalized = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, normalized);
};

export const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const getJsonFromStorage = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

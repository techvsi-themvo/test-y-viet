export const saveDataToLocalStorage = (key: string, data: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, data);
  }
};
export const getDataFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const removeDataFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

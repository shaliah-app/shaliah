
/**
 * Intended to be used on client-side only code.
 * 
 * Service for interacting with the browser's local storage.
 * It provides methods to save, load, and remove data associated with a specific key.
 *
 * @param key - The key used to identify the data in local storage.
 * @returns An object containing the `save`, `load`, and `remove` methods.
 */
export const LocalStorageService = <T>(key: string, initialValue?: T) => {
  const save = (data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const load = () => {
    const data = localStorage.getItem(key);
    if (data) return (JSON.parse(data) as T);

    return initialValue;
  };

  const remove = (): void => {
    localStorage.removeItem(key);
  };

  return { save, load, remove };
};

const DB_NAME = 'shaliah_slides_db';
const STORE_NAME = 'slides';
const DB_VERSION = 1;

/**
 * Opens (and upgrades) the IndexedDB database.
 */
export const openSlidesDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Saves a slide file blob in IndexedDB using the slide id as the key.
 *
 * @param slideId - Unique identifier for the slide.
 * @param file - The file blob to be stored.
 */
export const saveSlideFile = async (
  slideId: number,
  file: Blob
): Promise<void> => {
  const db = await openSlidesDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    // Only storing the file blob, keyed by slide id
    const data = { id: slideId, file };
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Retrieves the file blob associated with the given slide id.
 *
 * @param id - The slide id to look up.
 * @returns A promise that resolves with the file blob.
 */
export const getSlideFile = async (id: number): Promise<Blob> => {
  const db = await openSlidesDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.file);
      } else {
        reject(new Error('Slide not found'));
      }
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Retrieves all slides from the IndexedDB.
 *
 * @returns A promise that resolves with an array of all slide objects.
 */
export const getAllSlides = async (): Promise<{ id: number; file: File }[]> => {
  const db = await openSlidesDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
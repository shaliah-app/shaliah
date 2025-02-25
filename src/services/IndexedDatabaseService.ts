const DB_NAME = "shaliah_db";

export const IndexedDatabaseService = (store: string) => {
  const open = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const save = async (id: string, data: object) => {
    const db = await open();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(data, id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const remove = async (id: string): Promise<void> => {
    const db = await open();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const index = async (): Promise<File[]> => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return { save, remove, index };
};

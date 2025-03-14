import { LocalStorageService } from "./LocalStorageService";

const DB_NAME = "shaliah_db";
const version = LocalStorageService<number>(`${DB_NAME}_version`, 1);

// I MIGHT CREATE A HIGHER LEVEL ABSTRACTION DATABASE ONLY FOR SLIDES

export const IndexedDatabaseService = <T>(store?: string) => {
  const _update = () => version.save(version.load()! + 1);

  const open = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, version.load());
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (store && !db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const save = async (id: string, data: object) => {
    if (!store) {
      throw new Error("Store name is required for saving data.");
    }
    const db = await open();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(data, id);
      _update();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const remove = async (id: string): Promise<void> => {
    if (!store) {
      throw new Error("Store name is required for removing data.");
    }
    const db = await open();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(id);
      _update();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const index = async (limit?: number): Promise<T[]> => {
    if (!store) {
      throw new Error("Store name is required for indexing data.");
    }
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, "readonly");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.openCursor();
      const results: T[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && (!limit || results.length < limit)) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  };

  const getObjectStores = async (): Promise<string[]> => {
    const db = await open();
    return new Promise((resolve, reject) => {
      try {
        const storeNames = Array.from(db.objectStoreNames);
        resolve(storeNames);
      } catch (error) {
        reject(error);
      }
    });
  };

  return { save, remove, index, getObjectStores };
};

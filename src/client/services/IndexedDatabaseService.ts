import { LocalStorageService } from "./LocalStorageService";
import type { FileRecord } from "../../types/Records";

const DB_NAME = "shaliah_db";

const databaseVersionManager = () => {
  const _version = LocalStorageService<number>(`${DB_NAME}_version`, 1);

  const get = () => _version.load();

  const update = () => _version.save(get()! + 1);

  return { get, update };
};

export const IndexedDatabaseService = <T extends FileRecord = FileRecord>(store?: string) => {
  const version = databaseVersionManager();

  const open = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, version.get());
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (store && !db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const save = async (data: T) => {
    if (!store) {
      throw new Error("Store name is required for saving data.");
    }
    const db = await open();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const update = async (data: T) => {
    if (!store) {
      throw new Error("Store name is required for updating data.");
    }
    if (!data.id) {
      throw new Error("Data must have an 'id' property for updating.");
    }
    const db = await open();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const remove = async (id: T["id"]): Promise<void> => {
    if (!store) {
      throw new Error("Store name is required for removing data.");
    }
    const db = await open();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(store, "readwrite");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(id);
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

  const getById = async (id: T["id"]): Promise<T | undefined> => {
    if (!store) {
      throw new Error("Store name is required for getting data by ID.");
    }
    const db = await open();
    return new Promise<T | undefined>((resolve, reject) => {
      const transaction = db.transaction(store, "readonly");
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(id);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  };

  return { save, update, remove, index, getObjectStores, version, getById };
};

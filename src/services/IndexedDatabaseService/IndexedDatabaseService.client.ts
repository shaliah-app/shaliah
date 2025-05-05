import type { IndexedDatabaseVersionManager } from "./IndexedDatabaseVersionManager";
import type { FileRecord } from "../../types/Records";

export class IndexedDatabaseService<T extends FileRecord = FileRecord> {
  private dbName: string;
  private storeName: string;
  public version: IndexedDatabaseVersionManager;

  constructor(dbName: string, versionManager: IndexedDatabaseVersionManager) {
    this.dbName = dbName;
    this.storeName = dbName;
    this.version = versionManager;
  }

  // Helper to wrap any IDBRequest into a Promise
  private wrapRequest<R>(request: IDBRequest<R>): Promise<R> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Open a database connection and ensure the object store exists
  private async open(): Promise<IDBDatabase> {
    const versionNumber = await this.version.get();
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, versionNumber);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };
      this.wrapRequest(request).then(resolve).catch(reject);
    });
  }

  // Generalized transaction executor to reduce repetition
  private async executeTransaction<R>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<R>
  ): Promise<R> {
    const db = await this.open();
    const transaction = db.transaction(this.storeName, mode);
    const objectStore = transaction.objectStore(this.storeName);
    const request = operation(objectStore);
    return this.wrapRequest(request);
  }

  // Helper to iterate over an object store's cursor and gather results.
  private iterateCursor<R>(
    store: IDBObjectStore,
    limit?: number
  ): Promise<R[]> {
    const results: R[] = [];
    return new Promise((resolve, reject) => {
      const request = store.openCursor();
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
  }

  public async save(data: T): Promise<void> {
    await this.executeTransaction("readwrite", (store) => store.put(data));
  }

  public async update(data: T): Promise<void> {
    if (!data.id) {
      throw new Error("Data must have an 'id' property for updating.");
    }
    await this.save(data);
  }

  public async remove(id: T["id"]): Promise<void> {
    await this.executeTransaction("readwrite", (store) => store.delete(id));
  }

  public async getById(id: T["id"]): Promise<T | undefined> {
    return this.executeTransaction("readonly", (store) => store.get(id));
  }

  public async index(limit?: number): Promise<T[]> {
    const db = await this.open();
    const transaction = db.transaction(this.storeName, "readonly");
    const store = transaction.objectStore(this.storeName);
    return this.iterateCursor<T>(store, limit);
  }

  public async getObjectStores(): Promise<string[]> {
    const db = await this.open();
    return Promise.resolve(Array.from(db.objectStoreNames));
  }
}

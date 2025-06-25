export interface IndexedDatabaseRecord {
  /**
   * The unique identifier of the file record.
   */
  id: string;
}

/**
 * Represents an IndexedDB record of a file.
 */
export interface FileRecord extends IndexedDatabaseRecord {
  /**
   * The actual File object.
   */
  file: File;
}

/**
 * Represents an IndexedDB record of a file.
 */
export interface FileRecord {
  /**
   * The unique identifier of the file record.
   */
  id: number;
  /**
   * The actual File object.
   */
  file: File;
}

/**
 * Represents an IndexedDB record of an image file.
 */
export interface ImageFileRecord extends FileRecord {
  /**
   * The type of the file, which is "image".
   */
  type: "image";
}

/**
 * Represents an IndexedDB record of a video file.
 */
export interface VideoFileRecord extends FileRecord {
  type: "video";
  /** Indicates whether the video file has audio. */
  hasAudio?: boolean;
}

/** Represents an IndexedDB media file record, which can be either an image or a video. */
export type MediaFileRecord = ImageFileRecord | VideoFileRecord;

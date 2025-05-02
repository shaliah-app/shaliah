import type { ImageMetadata, MediaMetadata, VideoMetadata } from "./MediaMetadata";

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
  /**
   * Metadata of the file.
   */
  meta: MediaMetadata;
}

/**
 * Represents an IndexedDB record of an image file.
 */
export interface ImageFileRecord extends FileRecord {
  meta: ImageMetadata;
}

/**
 * Represents an IndexedDB record of a video file.
 */
export interface VideoFileRecord extends FileRecord {
  meta: VideoMetadata;
}

/** Represents an IndexedDB media file record, which can be either an image or a video. */
export type MediaFileRecord = ImageFileRecord | VideoFileRecord;

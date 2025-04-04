export interface MediaMetadata {
  type: "image" | "video";
  url: string;
}

export interface VideoMetadata extends MediaMetadata {
  type: "video";
  hasAudio?: boolean;
}

export interface ImageMetadata extends MediaMetadata {
  type: "image";
}

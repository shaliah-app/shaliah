import { noSerialize, type NoSerialize } from "@qwik.dev/core";
import type { FileRecord } from "./Records";

// should be renamed to SlideEntity.ts
export interface SlideModel {
  id: string;
  name: string;
  file: NoSerialize<FileRecord>;
  type: "image" | "video"; // will also accept "versicle" and others in the future
  meta: SlideMetadata;
}

export interface VideoSlideModel extends SlideModel {
  type: "video";
  meta: VideoSlideMetadata;
}

export interface SlideMetadata {
  blurHash: string;
  url: string;
}

export interface VideoSlideMetadata extends SlideMetadata {
  poster: string;
  hasAudio: boolean;
}

export const blankSlide: SlideModel = {
  id: "0",
  name: "blank",
  file: noSerialize({
    id: "0",
    file: new Blob(),
  } as FileRecord),
  type: "image",
  meta: {
    blurHash: "",
    url: "",
  },
};

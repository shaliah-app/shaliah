export interface SlideEntity {
  id: string;
  fileName: string;
  preview: string;
  type: "video" | "image";
  hasAudio?: boolean;
}

export const blankSlide: SlideEntity = {
  id: "null",
  fileName: "black.jpg",
  preview: "",
  type: "image",
};

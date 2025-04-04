export interface SlideEntity {
  id: number;
  fileName: string;
  preview: string;
  type: "video" | "image";
  hasAudio?: boolean;
}

export const blankSlide: SlideEntity = {
  id: -1,
  fileName: "black.jpg",
  preview: "",
  type: "image",
};

export interface SlideEntity {
  id: number;
  fileName: string;
  preview: string;
  type: "video" | "image";
}

export const blankSlide: SlideEntity = {
  id: -1,
  fileName: "black.jpg",
  preview: "",
  type: "image",
};

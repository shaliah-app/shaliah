export interface SlideEntity {
  id: number;
  fileName: string;
  preview: string;
}

export const blankSlide: SlideEntity = {
  id: -1,
  fileName: "black.jpg",
  preview: "",
};

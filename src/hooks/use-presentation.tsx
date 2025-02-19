import { $, useContext } from "@builder.io/qwik";
import { SlidesContextId } from "~/contexts/slides-context";
import { IndexedDBService } from "~/db/idb";

export const usePresentation = () => {
  const slides = useContext(SlidesContextId);
  const addSlideFromFiles = $(async (files: File[]) => {
    for (const file of files) {
      const id = Date.now();
      await IndexedDBService.saveSlideFile(id, file);

      const slide = {
        id,
        fileName: file.name,
        preview: URL.createObjectURL(file),
      };

      slides.array.push(slide);
    }
  });

  const removeSlide = $(async (id: number) => {
    const index = slides.array.findIndex((slide) => slide.id === id);
    if (index === -1) throw new Error(`Slide with id ${id} not found`);
    slides.array.splice(index, 1);
    await IndexedDBService.removeSlide(id);
  })


  return { addSlideFromFiles, removeSlide };
};

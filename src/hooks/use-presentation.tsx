import { $, useContext } from "@builder.io/qwik";
import { SlidesContextId } from "~/contexts/slides-context";
import { saveSlideFile } from "~/db/idb";

export const usePresentation = () => {
  const slides = useContext(SlidesContextId);
  const addSlideFromFiles = $(async (files: File[]) => {
    for (const file of files) {
      const id = Date.now();
      await saveSlideFile(id, file);

      const slide = {
        id,
        fileName: file.name,
        preview: URL.createObjectURL(file),
      };

      slides.array.push(slide);
    }
  });
  return { addSlideFromFiles };
};

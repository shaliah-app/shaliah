import type { QRL } from "@builder.io/qwik";
import {
  $,
  component$,
  createContextId,
  Slot,
  useContext,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";

// import array from "~/utils/slides.json";
import { type SlideEntity } from "~/types/SlideEntity";
import { PresentationContextId } from "./PresentationContext";
import { IndexedDatabaseService } from "~/services/IndexedDatabaseService";
import { useLocalStorage } from "~/hooks/useLocalStorage";

interface SlidesStore {
  state: {
    active: SlideEntity;
    list: SlideEntity[];
  };
  actions: {
    display: QRL<(slide: SlideEntity) => void>;
    remove: QRL<(id: number) => Promise<void>>;
    add: QRL<(files: File[]) => Promise<void>>;
  };
}

export const SlidesContextId = createContextId<SlidesStore>("slides");

export const SlidesContextProvider = component$(() => {
  const presentation = useContext(PresentationContextId);

  const blankSlide = {
    id: -1,
    fileName: "black.jpg",
    preview: "",
  };

  const state = useStore<SlidesStore["state"]>({
    active: blankSlide,
    list: [],
  });

  const _displayNearest = $((index: number) => {
    state.active =
      state.list[index + 1] || state.list[index - 1] || blankSlide;
  })

  const actions = useStore<SlidesStore["actions"]>(() => ({
    add: $(async (files: File[]) => {
      const table = String(await presentation.getters.id());
      const db = IndexedDatabaseService(table);

      const newSlides = await Promise.all(
        files.map(async (file, i) => {
          const id = Date.now() + i;
          await db.save(String(id), file);
          return {
            id,
            fileName: file.name,
            preview: URL.createObjectURL(file),
          };
        })
      );

      state.list.push(...newSlides);
    }),
    remove: $(async (id: number) => {
      const table = String(await presentation.getters.id());
      const db = IndexedDatabaseService(table);
      const index = state.list.findIndex((slide) => slide.id === id);

      if (index === -1) throw new Error(`Slide with id ${id} not found`);

      if (state.active.id === id) _displayNearest(index);

      state.list = state.list.filter((s) => s.id != id);
      await db.remove(String(id));
    }),
    display: $((slide) => {
      state.active = slide;
    }),
  }));

  useLocalStorage("state", state);

  useContextProvider(SlidesContextId, { state, actions });
  return <Slot />;
});

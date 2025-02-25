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
    remove: QRL<(id: number) => Promise<void>>;
    add: QRL<(files: File[]) => Promise<void>>;
  };
}

export const SlidesContextId = createContextId<SlidesStore>("slides");

export const SlidesContextProvider = component$(() => {
  const presentation = useContext(PresentationContextId);

  const state = useStore<SlidesStore["state"]>({
    active: {
      id: 0,
      fileName: "black.jpg",
      preview: "",
    },
    list: [],
  });

  const actions = useStore<SlidesStore["actions"]>(() => ({
    add: $(async (files: File[]) => {
      const table = String(await presentation.getters.id());
      const db = IndexedDatabaseService(table);

      for (const file of files) {
        const id = Date.now();
        await db.save(String(id), file);
        state.list.push({
          id,
          fileName: file.name,
          preview: URL.createObjectURL(file),
        });
      }
    }),
    remove: $(async (id: number) => {
      const table = String(await presentation.getters.id());
      const db = IndexedDatabaseService(table);
      const index = state.list.findIndex((slide) => slide.id === id);
      if (index === -1) throw new Error(`Slide with id ${id} not found`);
      state.list.splice(index, 1);
      await db.remove(String(id));
    }),
  }));

  useLocalStorage("state", state);

  useContextProvider(SlidesContextId, { state, actions });
  return <Slot />;
});

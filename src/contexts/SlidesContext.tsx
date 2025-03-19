import type { QRL } from "@qwik.dev/core";
import {
  $,
  component$,
  createContextId,
  Slot,
  useContext,
  useContextProvider,
  useStore,
  useTask$,
} from "@qwik.dev/core";

// import array from "~/utils/slides.json";
import { type SlideEntity } from "~/types/SlideEntity";
import { PresentationContextId } from "./PresentationContext";
import { IndexedDatabaseService } from "~/services/IndexedDatabaseService";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { SlideFile } from "~/types/SlideFile";

interface SlidesStore {
  state: {
    active: SlideEntity;
    list: SlideEntity[];
  };
  actions: {
    display: QRL<(slide: SlideEntity) => void>;
    remove: QRL<(id: number) => Promise<void>>;
    load: QRL<(files: SlideFile[] | File[]) => void>;
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

  const _database = useStore(() => ({
    save: $(async (files: SlideFile[]) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService(table);
      for (let i = 0; i < files.length; i++) {
        await db.save(files[i]);
      }
    }),
  }));

  const _displayNearest = $((index: number) => {
    state.active = state.list[index + 1] || state.list[index - 1] || blankSlide;
  });

  const _filesToSlideFiles = $((files: File[]): SlideFile[] =>
    files.map((file, i) => ({
      id: Date.now() + i,
      file,
    }))
  );

  const state = useStore<SlidesStore["state"]>({
    active: blankSlide,
    list: [],
  });

  const actions = useStore<SlidesStore["actions"]>(() => ({
    load: $(async (files: SlideFile[] | File[]) => {
      if (files.length === 0) return;
      const slideFiles: SlideFile[] =
        files[0] instanceof File
          ? await _filesToSlideFiles(files as File[])
          : (files as SlideFile[]);

      const slides = slideFiles.map(({ id, file }) => ({
        id,
        fileName: file.name,
        preview: URL.createObjectURL(file),
      }));

      state.list.push(...slides);

      _database.save(slideFiles);
    }),
    remove: $(async (id: number) => {
      const table = await presentation.getters.id();
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

  useTask$(async ({ track }) => {
    const p = track(() => presentation.state.id);
    if (p == "0") return;
    const slideFiles = await IndexedDatabaseService<SlideFile>(p).index();
    actions.load(slideFiles);
  });

  useLocalStorage("slides_store", state);

  useContextProvider(SlidesContextId, { state, actions });
  return <Slot />;
});

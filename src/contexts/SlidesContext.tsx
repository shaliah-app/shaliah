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
import { blankSlide, type SlideEntity } from "~/types/SlideEntity";
import { PresentationContextId } from "./PresentationContext";
import { useLocalStorage } from "~/hooks";
import type { MediaFileRecord } from "~/types/FileRecord";
import { IndexedDatabaseService } from "~/client/services";

export interface SlidesStore {
  state: {
    active: SlideEntity;
    list: SlideEntity[];
  };
  actions: {
    display: QRL<(slide: SlideEntity) => void>;
    remove: QRL<(id: MediaFileRecord['id']) => Promise<void>>;
    load: QRL<(files: MediaFileRecord[]) => void>;
  };
}

export const SlidesContextId = createContextId<SlidesStore>("slides");

export const SlidesContextProvider = component$(() => {
  const presentation = useContext(PresentationContextId);

  const state = useStore<SlidesStore["state"]>({
    active: blankSlide,
    list: [],
  });

  const _database = useStore(() => ({
    save: $(async (files: MediaFileRecord[]) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService<MediaFileRecord>(table);
      for (let i = 0; i < files.length; i++) {
        await db.save(files[i]);
      }
    }),
    update: $(async (file: MediaFileRecord) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService<MediaFileRecord>(table);
      await db.update(file);
    }),
    get: $(async (id: MediaFileRecord['id']) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService<MediaFileRecord>(table);
      return await db.getById(id);
    }),
    delete: $(async (id: MediaFileRecord['id']) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService<MediaFileRecord>(table);
      await db.remove(id);
    }),
  }));

  const _displayNearest = $((index: number) => {
    state.active = state.list[index + 1] || state.list[index - 1] || blankSlide;
  });

  const actions = useStore<SlidesStore["actions"]>(() => ({
    load: $(async (files: MediaFileRecord[]) => {
      if (files.length === 0) return;
      // TODO: it might be of MediaFileRecord type directly, not SlideEntity
      const slides = files.map((slide) => ({
        id: slide.id,
        fileName: slide.file.name,
        preview: URL.createObjectURL(slide.file),
        type: slide.meta.type,
        hasAudio: slide.meta.type === "video" && slide.meta.hasAudio,
      }));

      state.list.push(...slides);

      _database.save(files);
    }),
    remove: $(async (id: MediaFileRecord['id']) => {
      const index = state.list.findIndex((slide) => slide.id === id);

      if (index === -1) throw new Error(`Slide with id ${id} not found`);

      if (state.active.id === id) _displayNearest(index);

      state.list.splice(index, 1);

      await _database.delete(id);
    }),
    display: $((slide) => {
      state.active = slide;
    }),
  }));

  useTask$(async ({ track }) => {
    const p = track(() => presentation.state.id);
    if (p == "0") return;
    const mediaFiles = await IndexedDatabaseService<MediaFileRecord>(p).index();
    actions.load(mediaFiles);
  });

  useLocalStorage("slides_store", state);

  useContextProvider(SlidesContextId, { state, actions });
  return <Slot />;
});

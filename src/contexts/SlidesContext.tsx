import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from "@qwik.dev/core";

// import array from "~/utils/slides.json";
import { useSharedState } from "~/hooks/useSharedState";
import { type SlideModel } from "~/types/SlideModel";

export const SlidesContextId = createContextId<SlideModel[]>("slides");

export const SlidesContextProvider = component$(() => {

  const slides = useStore<SlideModel[]>([]);

  // const _displayNearest = $((index: number) => {
  //   state.active = state.list[index + 1] || state.list[index - 1] || blankSlide;
  // });

  // useTask$(async ({ track }) => {
  //   const p = track(() => presentation.state.id);
  //   if (p == "0" || isServer) return;
  //   const mediaFiles = await IndexedDatabaseService<MediaFileRecord>(p).index();
  //   actions.load(mediaFiles);
  // });

  useSharedState("slides", slides);

  useContextProvider(SlidesContextId, slides);
  return <Slot />;
});

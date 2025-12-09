import { component$ } from "@builder.io/qwik";
import {
  $,
  useContext,
  useSignal,
  useVisibleTask$,
  type PropsOf,
} from "@qwik.dev/core";
import { VideoPlayerControlsContextId } from "~/contexts/VideoPlayerControlsContext";
import { useEventListener } from "~/hooks";

export const VideoPlayer = component$<PropsOf<"video">>(
  (props) => {
    const element = useSignal<HTMLVideoElement | undefined>();

    const controls = useContext(VideoPlayerControlsContextId);

    useEventListener(
      element,
      "canplay",
      $(async () => await controls.refresh())
    );

    useEventListener(
      element,
      "ended",
      $(async () => await controls.togglePlay())
    )

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async ({ track }) => {
      const state = track(controls);
      const video = element.value;
      if (!video) return;

      if (!state.playing) video.pause();
      else {
        await video.play().catch((error) => {
          console.error("Error attempting to play video:", error);
        });
      }

      video.muted = state.muted;
      video.loop = state.loop;
    });

    return <video preload="auto" ref={element} {...props}></video>;
  }
);

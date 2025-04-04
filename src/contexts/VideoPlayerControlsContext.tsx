import type { QRL } from "@qwik.dev/core";
import {
  component$,
  Slot,
  useContextProvider,
  $,
  createContextId,
  useStore,
} from "@qwik.dev/core";
import { useLocalStorage } from "~/hooks/useLocalStorage";

export interface VideoPlayerControlsStore {
  playing: boolean;
  muted: boolean;
  loop: boolean;
  currentTime?: number;
  togglePlay: QRL<(this: VideoPlayerControlsStore) => void>;
  toggleMute: QRL<(this: VideoPlayerControlsStore) => void>;
  toggleLoop: QRL<(this: VideoPlayerControlsStore) => void>;
  refresh: QRL<(this: VideoPlayerControlsStore) => boolean>;
  seek?: QRL<(seconds: number) => void>;
}

export const VideoPlayerControlsContextId =
  createContextId<VideoPlayerControlsStore>("video-player-controls");

export const VideoPlayerControlsContextProvider = component$(() => {
  const ctx = useStore<VideoPlayerControlsStore>({
    playing: false,
    muted: false,
    loop: false,
    togglePlay: $(function (this) {
      this.playing = !this.playing;
    }),
    toggleMute: $(function (this) {
      this.muted = !this.muted;
    }),
    toggleLoop: $(function (this) {
      this.loop = !this.loop;
    }),
    refresh: $(function (this) {
      this.playing = false;
      return true;
    }),
  });

  useLocalStorage("video_controls_store", ctx);

  useContextProvider(VideoPlayerControlsContextId, ctx);
  return <Slot />;
});

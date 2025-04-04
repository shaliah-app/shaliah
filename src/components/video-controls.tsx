import { component$ } from "@builder.io/qwik";
import { Button } from "./ui/button";
import { useContext, useStylesScoped$ } from "@qwik.dev/core";
import { css } from "~/utils/css";
import { VideoPlayerControlsContextId } from "~/contexts/VideoPlayerControlsContext";
import { SlidesContextId } from "~/contexts/SlidesContext";

export const VideoControls = component$(() => {
  useStylesScoped$(css`
    nav {
      display: flex;
      gap: 0.625rem;
      padding: 0.625rem;

      place-self: center;
    }
  `);

  const controls = useContext(VideoPlayerControlsContextId);
  const slides = useContext(SlidesContextId);

  return (
    <nav>
      <Button
        onClick$={() => controls.toggleMute()}
        icon={
          controls.muted || slides.state.active.hasAudio === false
            ? "volume_off"
            : "volume_up"
        }
        disabled={slides.state.active.hasAudio === false}
        color="transparent"
      />
      {/* NEEDS TO  BE IMPLEMENTED <Button icon="replay_10" color="transparent" /> */}
      <Button
        onClick$={() => controls.togglePlay()}
        icon={controls.playing ? "pause" : "play_arrow"}
        color="transparent"
      />
      {/* NEEDS TO  BE IMPLEMENTED <Button icon="forward_10" color="transparent" /> */}
      <Button
        onClick$={() => controls.toggleLoop()}
        class={{ active: controls.loop }}
        icon="repeat"
        color="transparent"
        boolean
      />
    </nav>
  );
});

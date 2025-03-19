import {
  type PropsOf,
  component$,
  useContext,
  useStylesScoped$,
  useComputed$,
} from "@qwik.dev/core";
import { css } from "~/utils/css";
import { Image } from "@unpic/qwik";
import { SlidesContextId } from "~/contexts/SlidesContext";

export const PresentationScreen = component$<
  PropsOf<"figure"> & {
    fit?: "cover" | "fill" | "scale-down";
  }
>((props) => {
  useStylesScoped$(css`
    figure {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: black;
      position: relative;

      --fit: contain;

      > img,
      > video {
        width: 100%;
        height: 100%;
        object-fit: var(--fit);
        object-position: center;
      }

      &[fit="cover"] {
        --fit: cover;
      }

      &[fit="fill"] {
        --fit: fill;
      }

      &[fit="scale-down"] {
        --fit: scale-down;
      }
    }
  `);

  const slides = useContext(SlidesContextId);

  const slide = useComputed$(() => slides.state.active)
  

  return (
    <figure {...props}>
      {slide.value.type === "video" ? (
        <video
          src={slide.value.preview}
        />
      ) : (
        slide.value.preview && (
          <Image src={slide.value.preview} />
        )
      )}
    </figure>
  );
});

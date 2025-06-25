import type { PropsOf, QRL } from "@qwik.dev/core";
import { component$, useStyles$ } from "@qwik.dev/core";
import { Image } from "@unpic/qwik";
import { css } from "~/utils/css";
import transitions from "./slides-transitions.css?inline";
import { Button, Carousel } from "~/components/ui";
import type { SlideModel } from "~/types/SlideModel";
import { useBlurhashPlaceholder } from "~/hooks/useBlurhashPlaceholder";

type SlideProps = Omit<PropsOf<"div">, "align"> & {
  slide: SlideModel;
  onRemove$: QRL<() => void>;
};

export const Slide = component$<SlideProps>(({ onRemove$, slide, ...rest }) => {
  useStyles$(transitions);
  useStyles$(css`
    .slide-root {
      flex-shrink: 0;
    }

    .slide-content {
      max-width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      user-select: none;

      > span {
        width: 100%;
        height: 1.1rem;
        margin-bottom: -0.1rem;
        margin-inline: 1rem;
        font-weight: 500;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
        &:empty::before {
          content: "default-file.png";
        }
      }

      & img,
      & .video-wrapper {
        width: 25%;
        aspect-ratio: 1;
        object-position: center;
        object-fit: contain !important;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;
      }

      .video-wrapper {
        border-radius: 1.25rem;

        & video {
          width: 100%;
        }

        > i {
          color: var(--primary-color);
          font-size: 2.5rem;
        }
      }
    }

    .slide-controls {
      display: flex;
      width: fit-content;
      padding: 1rem;
      flex-basis: content;
    }
  `);

  const { name, meta } = slide;

  const placeholder = useBlurhashPlaceholder(meta.blurHash);

  return (
    <Carousel
      class="slide-root"
      flex-basis="fit-content"
      options={{ disableRubberband: true }}
      {...rest}
    >
      <section class="slide-content">
        <span>{name}</span>
        <Image
          layout="fixed"
          src={"poster" in meta ? meta.poster : meta.url}
          draggable={false}
          style={placeholder}
        />
      </section>
      <aside class="slide-controls" role="toolbar" aria-label="Slide controls">
        <Button
          onClick$={() => onRemove$()}
          color="red"
          size="lg"
          tabIndex={-1}
          icon="delete"
          aria-label="Delete slide"
        />
      </aside>
    </Carousel>
  );
});

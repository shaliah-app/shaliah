import type { PropsOf } from "@qwik.dev/core";
import {
  $,
  component$,
  useContext,
  useStyles$,
} from "@qwik.dev/core";
import { Image } from "@unpic/qwik";
import { css } from "~/utils/css";
import transitions from "./slides-transitions.css?inline";
import { useDoubleClick } from "~/hooks/useDoubleClick";
import type { SlideEntity } from "~/types/SlideEntity";
import { SlidesContextId } from "~/contexts/SlidesContext";
import { Button, Carousel, Icon } from "~/components/ui";

type SlideProps = Omit<PropsOf<"div">, "align"> & {
  slide: SlideEntity;
};

export const Slide = component$<SlideProps>(({ slide, ...rest }) => {
  useStyles$(transitions);
  useStyles$(css`
    .slide-content {
      max-width: 100%;
      flex-grow: 1;
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

  const slides = useContext(SlidesContextId);

  const handleDoubleClick$ = useDoubleClick(
    $(() => {
      slides.actions.display(slide);
    })
  );

  return (
    <Carousel
      flex-basis="fit-content"
      options={{ disableRubberband: true }}
      class={{ "slide-active": slide.id == slides.state.active.id }}
      {...rest}
    >
      <section onClick$={handleDoubleClick$} class="slide-content">
        <span>{slide.fileName}</span>
        {slide.type === "video" ? (
          <div class="video-wrapper">
            <video controls={false} src={slide.preview} />
            <Icon class="center-absolute">play_circle</Icon>
          </div>
        ) : (
          <Image layout="fixed" src={slide.preview} draggable={false} />
        )}
      </section>
      <aside class="slide-controls" role="toolbar" aria-label="Slide controls">
        <Button
          onClick$={() => slides.actions.remove(slide.id)}
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

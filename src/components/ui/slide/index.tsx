import type { PropsOf } from "@qwik.dev/core";
import { $, component$, useContext, useStyles$ } from "@qwik.dev/core";
import { Image } from "@unpic/qwik";
import { css } from "~/utils/css";
import { Button } from "../button";
import { Carousel } from "@qwik-ui/headless";
import transitions from "./slides-transitions.css?inline";
import { useDoubleClick } from "~/hooks/use-double-click";
import type { SlideEntity } from "~/types/SlideEntity";
import { SlidesContextId } from "~/contexts/SlidesContext";

type SlideProps = Omit<PropsOf<"div">, "align"> & {
  slide: SlideEntity;
};

export const Slide = component$<SlideProps>((props) => {
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
        margin-bottom: -0.1rem; /* magic margin needed to remove vertical overflow made by overflow-x property */
        margin-inline: 1rem;

        font-weight: 500;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;

        &:empty::before {
          content: "default-file.png";
        }
      }

      & img {
        width: 25%;
        aspect-ratio: 1;
        object-position: center;
        object-fit: contain !important;
        flex-shrink: 0;
        overflow: hidden;
      }
    }

    .slide-controls {
      display: flex;
      width: fit-content;
      padding: 1rem;
      flex-basis: content;
      /* background-color: var(--primary-color); */
    }
  `);

  const { slide, ...rest } = props;

  const slides = useContext(SlidesContextId);

  const handleDoubleClick$ = useDoubleClick(
    $(() => {
      slides.actions.display(slide);
    })
  );

  return (
    <Carousel.Root {...rest}>
      <Carousel.Scroller class="slide-scroller">
        <Carousel.Slide
          onClick$={handleDoubleClick$}
          class="slide-content"
        >
          <span>{slide.fileName}</span>
          <Image layout="fixed" src={slide.preview} draggable={false} />
        </Carousel.Slide>
        <Carousel.Slide class="slide-controls">
          <aside role="toolbar" aria-label="Slide controls">
            <Button
              onClick$={() => slides.actions.remove(slide.id)}
              color="red"
              size="lg"
              tabIndex={-1}
              icon="delete"
              aria-label="Delete slide"
            />
          </aside>
        </Carousel.Slide>
      </Carousel.Scroller>
    </Carousel.Root>
  );
});

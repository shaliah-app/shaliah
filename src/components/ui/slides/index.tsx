import {
  component$,
  useContext,
  useStyles$,
} from "@builder.io/qwik";
import { type Slide, SlidesContextId } from "~/contexts/slides-context";
import { Image } from "@unpic/qwik";
import { css } from "~/utils/css";
import { Button } from "../button";
import { Carousel } from "@qwik-ui/headless";
import transitions from "./slides-transitions.css?inline";


export const Item = component$<{ slide: Slide }>((props) => {
  useStyles$(transitions);
  useStyles$(css`
    .slide-content {
      max-width: 100%;
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;

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

  const slides = useContext(SlidesContextId);

  return (
    <Carousel.Root>
      <Carousel.Scroller class="scroller">
        <Carousel.Slide class={`slide-content ${slides.active == props.slide && 'active'}`}>
          <span>{props.slide.file_name}</span>
          <Image layout="fixed" src={props.slide.preview} />
        </Carousel.Slide>
        <Carousel.Slide class="slide-controls">
        <aside role="toolbar" aria-label="Slide controls">
          <Button
            onClick$={() =>
              (slides.array = slides.array.filter(
                (s) => s.id != props.slide.id
              ))
            }
            class="red size-lg"
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

export const Slides = { Item };

import type { Swiper, SwiperOptions } from "swiper/types";
import type { PropsOf } from "@builder.io/qwik";
import {
  $,
  component$,
  Slot,
  useContext,
  useId,
  useOnDocument,
  useSignal,
  useStyles$,
  useStylesScoped$,
  useTask$,
} from "@builder.io/qwik";
import { type Slide, SlidesContextId } from "~/contexts/slides-context";
import { Image } from "@unpic/qwik";
import { css } from "~/utils/css";
import { lettersAndNumbers } from "~/utils/letters-and-numbers-substring";
import { Button } from "../button";
import { isBrowser } from "@builder.io/qwik/build";
import { Carousel as Car } from "@qwik-ui/headless";
import transitions from "./slides-transitions.css?inline";

type Carousel = PropsOf<"div"> &
  SwiperOptions & {
    onMovementToggleClass?: string;
  };
type SwiperElement = HTMLElement & { swiper: Swiper };

export const Carousel = component$<Carousel>((props) => {
  useStylesScoped$(css`
    swiper-container {
      height: 50%;
    }
  `);

  const swiper = useSignal<SwiperElement>();

  const slides = useContext(SlidesContextId);

  const id = lettersAndNumbers(useId());

  useOnDocument(
    `${id}slidechange`,
    $((e) => {
      const { swiper } = e.target as SwiperElement;
      const index = swiper.activeIndex;
      slides.active = slides.array[index];
    })
  );

  useOnDocument(
    `DOMContentLoaded`,
    $(() => {
      if (props.onMovementToggleClass) {
        document.addEventListener(`${id}sliderfirstmove`, (e) => {
          const s = e.target as SwiperElement;
          s.classList.add(props.onMovementToggleClass!);
        });

        document.addEventListener(`${id}transitionend`, (e) => {
          const s = e.target as SwiperElement;
          s.classList.remove(props.onMovementToggleClass!);
        });
      }
    })
  );

  useTask$(({ track }) => {
    const active = track(() => slides.active);
    if (isBrowser && active) {
      const s = swiper.value!;
      const index = slides.array.findIndex((s) => s.id == active.id);
      s.swiper.slideTo(index);
    }
  });

  return (
    <swiper-container ref={swiper} events-prefix={id} {...props}>
      <Slot />
    </swiper-container>
  );
});

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
    <Car.Root>
      <Car.Scroller class="scroller">
        <Car.Slide class={`slide-content ${slides.active == props.slide && 'active'}`}>
          <span>{props.slide.file_name}</span>
          <Image layout="fixed" src={props.slide.preview} />
        </Car.Slide>
        <Car.Slide class="slide-controls">
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
      </Car.Slide>
      </Car.Scroller>
    </Car.Root>
  );
});

export const Slides = { Carousel, Item };

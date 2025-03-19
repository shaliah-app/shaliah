import { component$ } from "@builder.io/qwik";
import type { PropsOf } from "@qwik.dev/core";
import {
  Slot,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@qwik.dev/core";
import { css } from "~/utils/css";

import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";

interface CarouselProps {
  "flex-basis"?: string;
  options?: {
    disableRubberband: boolean;
  };
}

export const Carousel = component$<PropsOf<"div"> & CarouselProps>(
  ({ "flex-basis": flexBasis, options, ...rest }) => {
    useStylesScoped$(css`
      .embla {
        overflow: hidden;
      }
      .embla__container {
        display: flex;

        > * {
          flex: 0 0 var(--flex-basis);
          min-width: 0;
        }
      }
    `);

    const ref = useSignal<HTMLElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      if (ref.value) {
        const carousel = EmblaCarousel(ref.value);
        if (options) carousel.on("scroll", disableRubberband);
      }
    });

    return (
      <div
        ref={ref}
        class={`embla`}
        style={`--flex-basis: ${flexBasis || `100%`}`}
        {...rest}
      >
        <div class="embla__container">
          <Slot />
        </div>
      </div>
    );
  }
);

/**
 * Deactivates rubberband effects on carousel edges
 * @see https://github.com/davidjerleke/embla-carousel/issues/42#issuecomment-2185341475
 * @param embla EmblaCarousel
 */
const disableRubberband = (embla: EmblaCarouselType) => {
  const {
    limit,
    target,
    location,
    offsetLocation,
    scrollTo,
    translate,
    scrollBody,
  } = embla.internalEngine();

  let edge: number | null = null;

  if (location.get() >= limit.max) edge = limit.max;
  if (location.get() <= limit.min) edge = limit.min;

  if (edge !== null) {
    offsetLocation.set(edge);
    location.set(edge);
    target.set(edge);
    translate.to(edge);
    translate.toggleActive(false);
    scrollBody.useDuration(0).useFriction(0);
    scrollTo.distance(0, false);
  } else {
    translate.toggleActive(true);
  }
};

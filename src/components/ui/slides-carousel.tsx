import type { Swiper } from "swiper/types";
import {
  $,
  component$,
  useContext,
  useOnDocument,
  useStylesScoped$,
  useTask$,
} from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";
import { SlidesContextId } from "~/contexts/slides-context";
import { Image } from "@unpic/qwik";
import { SlideItem } from "./slide-item";
import { css } from "~/utils/css";

export const SlidesCarousel = component$(() => {
  useStylesScoped$(css`
    swiper-container {
      height: 50%;
      border-radius: 2rem;
      background-color: var(--bkg-color);
      overflow: hidden;
    }
  `);

  const slides = useContext(SlidesContextId);

  useOnDocument(
    "swiperslidechange",
    $((e) => {
      const { swiper } = e.target as EventTarget & { swiper: Swiper };
      const index = swiper.activeIndex;
      slides.active = slides.array[index];
    })
  );

  useTask$(({ track }) => {
    const newActiveSlide = track(() => slides.active);
    if (isBrowser) {
      localStorage.setItem("active", JSON.stringify(newActiveSlide));
    }
  });

  return (
    <swiper-container
      slides-per-view="3"
      direction="vertical"
      mousewheel="true"
      centered-slides="true"
      grab-cursor="true"
    >
      {slides.array.map((s) => (
        <SlideItem key={s.id}>
          {s.file_name}
          <Image src={s.preview} q:slot="preview" />
        </SlideItem>
      ))}
    </swiper-container>
  );
});

import type { DocumentHead } from "@builder.io/qwik-city";
import type { Swiper } from "swiper/types";
import {
  $,
  component$,
  useContext,
  useOnDocument,
  useSignal,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import { css } from "~/utils/css";
import { SlideItem } from "~/components/ui/slide-item";
import { Monitor } from "~/components/ui/monitor";
import { Image } from "@unpic/qwik";
import { AppContextId } from "~/contexts/app-context";
import { isBrowser } from "@builder.io/qwik/build";

export default component$(() => {
  useStyles$(css`
    main {
      width: 100svw;
      height: 100svh;
      padding: 1rem;

      display: grid;
      grid-template-columns: 100%;

      overflow: hidden;
      z-index: 1;
      position: relative;

      & swiper-container {
        height: 50%;
        border-radius: 2rem;
        background-color: var(--bkg-color);
        overflow: hidden;
      }
    }
  `);

  const app = useContext(AppContextId);

  const swiper = useSignal<HTMLElement & { swiper: Swiper }>();

  useOnDocument(
    "swiperslidechange",
    $(() => {
      const index = swiper.value!.swiper.activeIndex;
      app.slides.active = app.slides.array[index];
    })
  );
  

  useTask$(({ track }) => {
    const newActiveSlide = track(() => app.slides.active)
    if (isBrowser) {
      localStorage.setItem('activeSlide', JSON.stringify(newActiveSlide))
    }
  })

  return (
    <main>
      <Monitor />

      <swiper-container
        ref={swiper}
        slides-per-view="3"
        direction="vertical"
        mousewheel="true"
        centered-slides="true"
        grab-cursor="true"
      >
        {app.slides.array.map((s) => (
          <SlideItem key={s.id}>
            {s.file_name}
            <Image src={s.preview} q:slot="preview" />
          </SlideItem>
        ))}
      </swiper-container>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Shaliah",
  meta: [
    {
      name: "description",
      content: "Presentation controller for churches",
    },
  ],
};

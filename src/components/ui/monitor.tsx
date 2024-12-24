import {
  $,
  component$,
  useContext,
  useId,
  useOnDocument,
  useStylesScoped$,
} from "@builder.io/qwik";
import { css } from "~/utils/css";

import { BooleanButton } from "./button";
import { SlidesContextId } from "~/contexts/slides-context";
import { Image } from "@unpic/qwik";
import type { Swiper } from "swiper/types";
import { lettersAndNumbers } from "~/utils/letters-and-numbers-substring";

export const Monitor = component$(() => {
  useStylesScoped$(css`
    div {
      max-width: 80%;
      height: 70%;
      margin: 0 auto;
      box-shadow: 0px 10px 30px #00000025;

      position: relative;

      & iframe {
        /* TODO: should be according monitor screen size, and not fixed like this */
        aspect-ratio: 16 / 10;
      }

      & iframe,
      label {
        width: 100%;
        height: 100%;
      }
    }

    swiper-container {
      width: 100%;
      height: 100%;

      position: absolute;
      top: 0;
      left: 0;

      img {
        transition-property: opacity;
        transition-duration: 500ms;
        transition-timing-function: ease-in;
      }

      .swiper-slide-active img {
        opacity: 0;
      }
    }
  `);

  const slides = useContext(SlidesContextId);

  const id = lettersAndNumbers(useId());

  useOnDocument(
    `${id}slidechange`,
    $((e) => {
      const { swiper } = e.target as EventTarget & { swiper: Swiper };
      const index = swiper.activeIndex;
      slides.active = slides.array[index];
    })
  );

  return (
    <div>
      <iframe src="/present" loading="lazy"></iframe>
      <swiper-container
        centered-slides="true"
        grab-cursor="true"
        events-prefix={id}
        touch-release-on-edges="true"
      >
        {slides.array.map((s) => (
          <swiper-slide key={s.id}>
            <BooleanButton class="wrapper">
              <Image src={s.preview} />
            </BooleanButton>
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
});

import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";

export const Monitor = component$(() => {
  useStylesScoped$(css`
    div {
      max-width: 80%;
      height: 70%;
      margin: 0 auto;
      box-shadow: 0px 10px 30px #00000025;

      position: relative;

      & iframe {
        width: 100%;
        height: 100%;

        /* TODO: should be according monitor screen size, and not fixed like this */
        aspect-ratio: 16 / 10;
      }

      /* TODO: unused until bind:selectedIndex is fixed. 
               should be used to allow the user to slide
               the iframe and change the active slide
      */
      & swiper-container {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        opacity: 0;

        &.moving {
          opacity: 1;
        }

        img {
          transition-property: opacity;
          transition-duration: 500ms;
          transition-timing-function: ease-in;
        }

        .swiper-slide-active img {
          opacity: 0;
        }
      }
    }
  `);

  return (
    <div>
      <iframe src="/present" loading="lazy"></iframe>
    </div>
  );
});

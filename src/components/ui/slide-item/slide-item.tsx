import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import Image from "@/slide-placeholder.jpg?jsx";


export const SlideItem = component$(() => {
  useStylesScoped$(css`
    figure {
      height: 5rem;
      border-radius: 2rem;

      display: flex;
      justify-content: space-between;
      align-items: center;

      background-color: var(--bkg-color);
      overflow: hidden;

      > figcaption {
        width: 100%;
        height: 1.1rem;
        margin-bottom: -0.1rem; /* magic margin needed to remove vertical overflow made by overflow-x property */
        margin-inline: 1rem;

        font-weight: 500;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;

        &:empty::before {
          content: "default-file.png"
        }
      }

      & #image-wrapper {
        width: 25%;

        display: grid;
        place-content: center;
        flex-shrink: 0;
        overflow: hidden;

        > img {
          width: 100%;
          height: auto;
          display: block;
        }
      }
    }
  `);
  return (
    <figure>
      <figcaption><Slot /></figcaption>
      <div id="image-wrapper">
        <Image />
      </div>
    </figure>
  );
});

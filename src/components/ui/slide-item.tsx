import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import Image from "@/slide-placeholder.jpg?jsx";

export const SlideItem = component$(() => {
  useStylesScoped$(css`
    swiper-slide {
      min-height: 5rem;
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

      & .wrapper {
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

      /* ******************************** */
      /* Start - Colors transition styles */
      /* ******************************** */

      transition-property: background-color, color;
      transition-duration: 150ms;
      transition-timing-function: ease-in-out;

      --shade-color: rgb(0, 0, 0, 0);
      --hover-color: rgb(255, 255, 255, 0);
      --selected-color: var(--primary-color);
      --selected-percentage: 0%;
      --slide-bkg-color: color-mix(
        in srgb,
        var(--shade-color),
        var(--selected-color) var(--selected-percentage)
      );

      background-color: color-mix(
        in srgb,
        var(--hover-color),
        var(--slide-bkg-color)
      );

      &:hover {
        --hover-color: rgb(255, 255, 255, 0.1);
      }

      &:nth-child(even) {
        --shade-color: rgb(0, 0, 0, 0.1);
      }

      &.swiper-slide-active {
        --selected-percentage: 100%;
        color: color-mix(in srgb, var(--bkg-color) 100%,rgb(0, 0, 0) 50%);
      }
      
      /* ****************************** */
      /* End - Colors transition styles */
      /* ****************************** */
    }
  `);
  return (
    <swiper-slide>
        <span>
          <Slot />
        </span>
        <div class="wrapper">
          <Image />
        </div>
    </swiper-slide>
  );
});

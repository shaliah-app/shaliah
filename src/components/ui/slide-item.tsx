import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import { Button } from "./button";

export const SlideItem = component$(() => {
  useStylesScoped$(css`
    .slide-root {
      min-height: 5rem;

      > swiper-container {
        height: 100%;

        & swiper-slide {
          width: auto;
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
        color: color-mix(in srgb, var(--bkg-color) 100%, rgb(0, 0, 0) 50%);
      }

      /* ****************************** */
      /* End - Colors transition styles */
      /* ****************************** */
    }

    .slide-content {
      max-width: 100%;
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

      & .preview-wrapper {
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

    aside {
      display: flex;
      padding: 1rem;
      /* background-color: var(--primary-color); */
    }
  `);
  return (
    <swiper-slide class="slide-root">
      <swiper-container slides-per-view="auto" touch-release-on-edges="true">
        <swiper-slide class="slide-content">
          <span>
            <Slot />
          </span>
          <div class="preview-wrapper" role="none">
            <Slot name="preview" />
          </div>
        </swiper-slide>
        <swiper-slide>
          <aside role="toolbar" aria-label="Slide controls">
            <Button class="red size-lg" tabIndex={-1} icon="delete" />
          </aside>
        </swiper-slide>
      </swiper-container>
    </swiper-slide>
  );
});

import type { DocumentHead } from "@builder.io/qwik-city";
import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";

export default component$(() => {
  useStylesScoped$(css`
    main {
      width: 100svw;
      height: 100svh;
      padding: 1rem;
      display: grid;

      overflow: hidden;
      z-index: 1;
      position: relative;
    }
  `);
  return <main></main>;
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

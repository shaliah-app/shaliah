import type { DocumentHead } from "@builder.io/qwik-city";
import { component$, useStyles$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import { Monitor } from "~/components/ui/monitor";
import { Slides } from "~/components/ui/slides";

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
    }
  `);

  return (
    <main>
      <Monitor />

      <Slides.Carousel />
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

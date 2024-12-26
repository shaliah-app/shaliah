import type { DocumentHead } from "@builder.io/qwik-city";
import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import { Monitor } from "~/components/ui/monitor";
import { Slides } from "~/components/ui/slides";
import { SlidesContextId } from "~/contexts/slides-context";

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

      > ul {
        height: 50%;
        border-radius: 2rem;
        background-color: var(--bkg-color);
        overflow: scroll;
      }
    }
  `);

  const slides = useContext(SlidesContextId);

  return (
    <main>
      <Monitor />

      <ul>
        {slides.array.map((s) => (
          <Slides.Item key={s.id} slide={s}>
          </Slides.Item>
        ))}
      </ul>
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

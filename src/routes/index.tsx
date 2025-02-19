import type { DocumentHead } from "@builder.io/qwik-city";
import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import { Monitor } from "~/components/ui/monitor";
import { Slide } from "~/components/ui/slide";
import { SlidesContextId } from "~/contexts/slides-context";
import { Button } from "~/components/ui/button";
import { SlidePicker } from "~/components/file-picker";

export default component$(() => {
  useStyles$(css`
    main {
      width: 100svw;
      height: 100svh;
      padding: 1rem;

      display: grid;
      align-content: space-between;
      grid-template-columns: 100%;

      overflow: hidden;
      z-index: 1;
      position: relative;

      & ul {
        max-height: 40vh;
        height: fit-content;
        border-radius: 2rem;
        background-color: var(--bkg-color);
        overflow: auto;

        display: grid;
        color: color-mix(in srgb, var(--primary-color) 100%, black 10%);

        > :nth-child(even) .slide-content {
          --shade-color: rgb(0, 0, 0, 0.1);
        }
      }

      & menu[role="toolbar"] {
        width: fit-content;

        display: grid;
        padding: 0.625rem;
        margin-top: 2rem;
        margin-inline: 1rem;
        border-radius: 1rem;
        justify-content: end;

        background-color: color-mix(
          in srgb,
          var(--primary-color) 100%,
          black 20%
        );
        box-shadow: 0px 5px 10px #00000025;

        position: sticky;
        bottom: 1rem;
        z-index: 1;
      }

      & #upload {
        padding: 2rem;
        justify-content: space-between;

        font-weight: 500;
        font-size: 1.25rem;
        border-radius: 2rem;

        > i {
          font-size: 3rem;
        }
      }
    }
  `);

  const slides = useContext(SlidesContextId);

  return (
    <main>
      <Monitor />

      <div>
        {slides.array.length ? (
          <>
            <ul>
              {slides.array.length &&
                slides.array.map((s) => <Slide key={s.id} slide={s} />)}
              <menu role="toolbar">
                <SlidePicker>
                  <Button class="secondary" icon="add" />
                </SlidePicker>
              </menu>
            </ul>
          </>
        ) : (
          <SlidePicker>
            <Button id="upload" class="full-size" icon="add">
              Add slides
            </Button>
          </SlidePicker>
        )}
      </div>
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

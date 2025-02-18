import type { DocumentHead } from "@builder.io/qwik-city";
import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import { Monitor } from "~/components/ui/monitor";
import { Slide } from "~/components/ui/slide";
import { SlidesContextId } from "~/contexts/slides-context";
import { Button } from "~/components/ui/button";
import { FileUpload } from "~/components/file-upload";

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

      > ul {
        height: fit-content;
        border-radius: 2rem;
        background-color: var(--bkg-color);
        overflow: auto;

        display: grid;
        gap: 1rem;
        color: color-mix(in srgb, var(--primary-color) 100%, black 10%);

        & #upload {
          padding: 2rem;
          justify-content: space-between;

          font-weight: 500;
          font-size: 1.25rem;
          
          > i {
            font-size: 3rem;
          }
        }

        > :nth-child(even) .slide-content {
          --shade-color: rgb(0, 0, 0, 0.1);
        }
      }
    }
  `);

  const slides = useContext(SlidesContextId);

  return (
    <main>
      <Monitor />

      <ul>
        {slides.array.length ? (
          slides.array.map((s) => <Slide key={s.id} slide={s} />)
        ) : (
          <FileUpload onFilesSelected$={(files) => console.log(files)} multiple={true}>
            <Button id="upload" class="full-size" icon="add">
              Add slides
            </Button>
          </FileUpload>
        )}
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

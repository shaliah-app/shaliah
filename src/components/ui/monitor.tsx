import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";

import { BooleanButton, Button } from "./button";

export const Monitor = component$(() => {
  useStylesScoped$(css`
    div {
      width: 100%;
      margin: 0 auto;

      display: grid;
      grid-auto-flow: column;
      place-content: center;
      align-items: center;

      .wrapper {
        width: auto;
        margin-inline: 1.5rem;
        box-shadow: 0px 10px 30px #00000025;
        /* TODO: should be according monitor screen size, and not fixed like this */
        aspect-ratio: 16 / 10; 

        > iframe {
          width: 100%;
          height: 100%;
        }
      }

      button {
        display: none;
        grid-row: 1;
      }

      &:has(:checked) button {
        display: inline-flex;
      }
    }
  `);

  return (
    <div role="toolbar">
      <Button class="rounded size-lg" icon="arrow_back" />

      <BooleanButton class="wrapper">
        <iframe src="/present" loading="lazy"></iframe>
      </BooleanButton>

      <Button class="rounded size-lg" icon="arrow_forward" />
    </div>
  );
});

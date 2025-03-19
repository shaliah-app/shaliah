import type { PropsOf } from "@qwik.dev/core";
import { component$, useStylesScoped$, Slot } from "@qwik.dev/core";
import { css } from "~/utils/css";

export const BooleanButton = component$<PropsOf<"label">>((props) => {
  useStylesScoped$(css`
    label {
      display: inline-flex;
      & input[type="checkbox"] {
        display: none;
      }
    }
  `);

  return (
    <label {...props}>
      <input type="checkbox" />
      <Slot />
    </label>
  );
});

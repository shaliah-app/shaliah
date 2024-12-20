import { component$, type PropsOf, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";

export const Icon = component$<PropsOf<'i'>>(() => {
  useStylesScoped$(css`
    i {
      pointer-events: none;
      user-select: none;

      font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
    }
  `);
  return (
    <i class="material-symbols-outlined notranslate">
      <Slot />
    </i>
  );
});

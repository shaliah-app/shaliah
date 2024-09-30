import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./icon.style.css?inline";

export default component$(() => {
  useStylesScoped$(styles);
  return (
    <i class="material-symbols-outlined notranslate">
      <Slot />
    </i>
  );
});

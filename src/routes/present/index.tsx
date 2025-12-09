import type { DocumentHead } from "@qwik.dev/router";
import { component$ } from "@qwik.dev/core";
import { PresentationScreen } from "./partials/presentation-screen";

export default component$(() => {
  return <PresentationScreen fit="cover" />;
});

export const head: DocumentHead = {
  title: "Present",
  meta: [
    {
      name: "description",
      content: "Shaliah presentation",
    },
  ],
};

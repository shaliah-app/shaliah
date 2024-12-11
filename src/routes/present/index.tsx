import type { DocumentHead } from "@builder.io/qwik-city";
import { component$ } from "@builder.io/qwik";
import { PresentationScreen } from "~/components/ui/presentation-screen";

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

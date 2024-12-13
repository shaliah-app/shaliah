import { useStore } from "@builder.io/qwik";

interface Slide {
  id: number;
  file_name: string;
  preview: string;
}

export const usePresentationStore = () =>
  useStore<{
    slides: {
      active?: Slide;
      array: Slide[];
    };
  }>({
    slides: {
      array: [
        {
          id: 1,
          file_name: "peak.jpg",
          preview: "slide-placeholder-1.jpg",
        },
        {
          id: 2,
          file_name: "from-the-sky.png",
          preview: "slide-placeholder-2.jpg",
        },
        {
          id: 3,
          file_name: "lavender fields by chopin.jpg",
          preview: "slide-placeholder-3.jpg",
        },
        {
          id: 4,
          file_name: "SunsetBest.jpg",
          preview: "slide-placeholder-4.jpg",
        },
        {
          id: 5,
          file_name: "SpookyFrozenMountains.png",
          preview: "slide-placeholder-5.jpg",
        },
      ],
    },
  });

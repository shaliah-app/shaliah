/* eslint-disable qwik/no-use-visible-task */
import { type Signal, useVisibleTask$ } from "@builder.io/qwik";
import type { QRL } from "@qwik.dev/core";

// Define EventMap as a fallback for elements not matching HTMLElement or SVGElement
type EventMap = GlobalEventHandlersEventMap;

// Helper type to get event types from an element
type ElementEventMap<T extends Element> = T extends HTMLElement
  ? HTMLElementEventMap
  : T extends SVGElement
    ? SVGElementEventMap
    : EventMap;

/**
 * A hook for adding and removing event listeners on an element.
 *
 * @param element - A signal containing the element to attach the listener to.
 * @param eventName - The name of the event to listen for.
 * @param handler - The event handler function.
 */
export const useEventListener = <
  T extends Element,
  K extends keyof ElementEventMap<T>,
>(
  element: Signal<T | undefined>,
  eventName: K,
  handler: QRL<(this: T, ev: ElementEventMap<T>[K]) => any>
) => {
  const event = eventName as string;
  useVisibleTask$(({ cleanup }) => {
    const el = element.value;
    if (!el) return;

    // Cast the QRL handler to EventListener
    const listener = handler as unknown as EventListener;
    el.addEventListener(event, listener);

    cleanup(() => {
      el.removeEventListener(event, listener);
    });
  });
};

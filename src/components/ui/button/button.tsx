import {
  component$,
  Slot,
  useStylesScoped$,
  type PropsOf,
} from "@builder.io/qwik";
import { Icon } from "../icon/icon";
import { css } from "~/utils/css";

type ButtonProps = PropsOf<"button"> & {
  icon?: string;
  rounded?: boolean;
  wrapper?: boolean;
  size?: "lg" | "xl";
};

export const Button = component$<ButtonProps>((props) => {
  useStylesScoped$(css`
    button {
      --button-min-height: calc(2.5rem + var(--size, 0rem));

      width: fit-content;
      min-height: var(--button-min-height);
      height: fit-content;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem;

      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;

      overflow: hidden;
      cursor: pointer;

      font-weight: 700;
      color: var(--primary-color);

      --shade-color: white;
      --shade-percentage: 0%;
      background-color: color-mix(
        in srgb,
        var(--bkg-color),
        var(--shade-color) var(--shade-percentage)
      );
      transition: background-color 150ms ease-in-out;

      &:hover {
        --shade-percentage: 10%;
      }

      &:active {
        --shade-percentage: 20%;
      }

      &:disabled {
        --shade-percentage: 50%;
        cursor: default;
        pointer-events: none;
      }

      /****************/
      /*** Variants ***/
      /****************/

      &[rounded] {
        justify-content: center;
        aspect-ratio: 1;
        border-radius: 100%;
      }

      &[wrapper] {
        padding: 0;
        border-radius: 0;
        --shade-color: black;
        --bkg-color: transparent;
      }

      &[size="lg"] {
        --size: 1rem;
      }

      &[size="xl"] {
        --size: 2rem;
      }
    }
  `);

  return (
    <button {...props}>
      <Slot />
      {props.icon && <Icon>{props.icon}</Icon>}
    </button>
  );
});

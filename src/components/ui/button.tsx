import {
  component$,
  Slot,
  useStylesScoped$,
  type PropsOf,
} from "@builder.io/qwik";
import { Icon } from "./icon";
import { css } from "~/utils/css";

interface ButtonProps {
  icon?: string;
  size?: "none" | "normal" | "lg" | "xl" | "full";
  color?: "red" | "secondary" | "primary";
  shape?: "rounded" | "wrapper";
}

export const Button = component$<PropsOf<"button"> & ButtonProps>((props) => {
  useStylesScoped$(css`
    button {
      --min-size: calc(2.5rem + var(--size));

      min-width: var(--min-size);
      min-height: var(--min-size);
      width: fit-content;
      height: fit-content;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem;

      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;

      overflow: hidden;
      cursor: pointer;
      font-weight: 700;

      --hover-color-percentage: 0%;
      background-color: color-mix(
        in srgb,
        var(--background-color),
        var(--hover-color) var(--hover-color-percentage)
      );
      transition: background-color 150ms ease-in-out;

      &:hover {
        --hover-color-percentage: 10%;
      }

      &:active {
        --hover-color-percentage: 20%;
      }

      &:disabled {
        --hover-color-percentage: 50%;
        cursor: default;
        pointer-events: none;
      }

      /****************/
      /*** Variants ***/
      /****************/

      &[data-color="primary"] {
        --background-color: var(--bkg-color);
        --hover-color: white;
        color: var(--primary-color);
      }

      &[data-color="secondary"] {
        --background-color: var(--secondary-color);
        --hover-color: black;
        color: var(--black-color);
      }

      &[data-color="red"] {
        --background-color: var(--red-color);
        --hover-color: white;
        color: var(--black-color);
      }

      &[data-shape="rounded"] {
        justify-content: center;
        aspect-ratio: 1;
        border-radius: 100%;
      }

      &[data-shape="wrapper"] {
        padding: 0;
        border-radius: 0;
        --hover-color: black;
        --bkg-color: transparent;

        > * {
          pointer-events: none;
          z-index: -1;
        }
      }

      &[data-size="none"] {
        width: initial;
        height: initial;
      }

      &[data-size="normal"] {
        --size: 0rem;
      }

      &[data-size="lg"] {
        --size: 1rem;
      }

      &[data-size="xl"] {
        --size: 2rem;
      }

      &[data-size="full"] {
        width: 100%;
        height: 100%;
      }
    }
  `);

  const { icon, size, color, shape, ...rest } = props;

  return (
    <button
      data-size={size || "normal"}
      data-color={color || "primary"}
      data-shape={shape}
      {...rest}
    >
      <Slot />
      {icon && <Icon>{icon}</Icon>}
    </button>
  );
});

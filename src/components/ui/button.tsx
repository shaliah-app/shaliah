import {
  component$,
  Slot,
  useStylesScoped$,
  type PropsOf,
} from "@builder.io/qwik";
import { Icon } from "./icon";
import { css } from "~/utils/css";

interface Variants {
  icon?: string;
  rounded?: boolean;
  wrapper?: boolean;
  size?: "lg" | "xl";
}

const styles = css`
  button,
  label {
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

      > * {
        pointer-events: none;
        z-index: -1;
      }
    }

    &[size="lg"] {
      --size: 1rem;
    }

    &[size="xl"] {
      --size: 2rem;
    }
  }
`;

export const Button = component$<PropsOf<"button"> & Variants>((props) => {
  useStylesScoped$(styles);

  return (
    <button {...props}>
      <Slot />
      {props.icon && <Icon>{props.icon}</Icon>}
    </button>
  );
});

export const BooleanButton = component$<PropsOf<"label"> & Variants>(
  (props) => {
    useStylesScoped$(styles);
    useStylesScoped$(css`
      input {
        display: none;
      }
    `);

    return (
      <label {...props}>
        <Slot />
        {props.icon && <Icon>{props.icon}</Icon>}
        <input type="checkbox" />
      </label>
    );
  }
);

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
};

export const Button = component$<ButtonProps>((props) => {
  useStylesScoped$(css`
    button {
      width: fit-content;
      min-height: 2.5rem;
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

      --shade: 0%;
      background-color: color-mix(
        in srgb,
        var(--bkg-color),
        white var(--shade)
      );
      transition: background-color 150ms ease-in-out;

      &:hover {
        --shade: 10%;
      }

      &:active {
        --shade: 20%;
      }

      &:disabled {
        --shade: 50%;
        cursor: default;
        pointer-events: none;
      }

      &[rounded] {
        border-radius: 100%;
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

import { type PropsOf, component$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import { css } from "~/utils/css";
import { Image } from "@unpic/qwik";
import { AppContextId } from "~/contexts/app-context";

export const PresentationScreen = component$<
  PropsOf<"figure"> & {
    fit?: "cover" | "fill" | "scale-down";
  }
>((props) => {
  useStylesScoped$(css`
    figure {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: black;

      --fit: contain;

      > img {
        width: 100%;
        height: 100%;
        object-fit: var(--fit);
        object-position: center;
      }

      &[fit="cover"] {
        --fit: cover;
      }

      &[fit="fill"] {
        --fit: fill;
      }

      &[fit="scale-down"] {
        --fit: scale-down;
      }
    }
  `);

  const app = useContext(AppContextId)

  return (
    <figure {...props}>
      <Image src={`../${app.slides.active!.preview}`}/>
    </figure>
  );
});

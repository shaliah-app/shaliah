import type { NoSerialize, PropsOf } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  Resource,
  useResource$,
  useStylesScoped$,
} from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import { IndexedDatabaseService } from "~/services/IndexedDatabaseService";
import { css } from "~/utils/css";

interface PresentationPreviewProps {
  id: string;
}

export const PresentationPreview = component$<
  PropsOf<"div"> & PresentationPreviewProps
>((props) => {
  useStylesScoped$(css`
    div {
      width: 100%;
      height: 100%;
      background-color: var(--bkg-color);
      border-radius: 1rem;
      box-shadow: 0px 5px 10px #00000025;
      overflow: hidden;
      position: relative;

      & img {
        width: 50px;
        height: 50px;
        object-fit: contain;
      }
    }
  `);

  const slides = useResource$<NoSerialize<File[]>>(async () => {
    const db = IndexedDatabaseService<File>(props.id);
    const firstThreeSlides = await db.index(3);
    return noSerialize(firstThreeSlides);
  });

  return (
    <div>
      <Resource
        value={slides}
        onPending={() => <>loading...</>}
        onResolved={(r) => (
          <Image src={URL.createObjectURL(r![0])} />
        )}
      />
      
    </div>
  );
});

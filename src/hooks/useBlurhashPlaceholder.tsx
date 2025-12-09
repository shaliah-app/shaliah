import { decode } from "blurhash";
import { createCanvas, ImageData } from "@napi-rs/canvas";
import { isServer } from "@qwik.dev/core";

export const useBlurhashPlaceholder = (
  hash: string,
  width: number = 64,
  height: number = 64,
  punch = 1
) => {
  if (!isServer) return null;

  // 1. Decode the BlurHash into raw RGBA pixels
  const pixels = decode(hash, width, height, punch);

  // 2. Create an offscreen canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 3. Turn the raw pixel array into an ImageData object
  // (Node‑canvas v2+ and @napi‑rs/canvas both support this constructor)
  const imageData = new ImageData(
    Uint8ClampedArray.from(pixels),
    width,
    height
  );

  // 4. Paint into the canvas
  ctx.putImageData(imageData, 0, 0);

  // 5. Export as PNG data URL
  return {
    backgroundImage: `url(${canvas.toDataURL("image/png")})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
};

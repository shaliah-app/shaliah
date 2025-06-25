/**
 * Generate a BlurHash string from an image URL or data URL.
 * @param src - URL or data‑URL of the image. Must support CORS or be same‑origin.
 * @param hashWidth - width to downscale to before hashing (e.g. 32)
 * @param componentsX - horizontal component count (e.g. 4)
 * @param componentsY - vertical component count (e.g. 3)
 */
export async function generateBlurhash(
  src: string,
  hashWidth = 32,
  componentsX = 4,
  componentsY = 3
): Promise<string> {
  // 1. Dynamically import only on the client
  const { encode } = await import("blurhash");

  // 2. Load the image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();

  // 3. Compute target height to preserve aspect ratio
  const ratio = img.height / img.width;
  const hashHeight = Math.round(hashWidth * ratio);

  // 4. Draw into an offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = hashWidth;
  canvas.height = hashHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, hashWidth, hashHeight);

  // 5. Pull out pixel data
  const { data: pixels } = ctx.getImageData(0, 0, hashWidth, hashHeight);

  // 6. Run the encoder
  return encode(pixels, hashWidth, hashHeight, componentsX, componentsY);
}

export async function blurhashToDataURL(
  hash: string,
  width: number,
  height: number,
  punch = 1
): Promise<string> {
  // 1. import & decode
  const { decode } = await import("blurhash");
  const pixels = decode(hash, width, height, punch);

  // 2. paint to an offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  // 3. export as PNG data URL
  return canvas.toDataURL();
}

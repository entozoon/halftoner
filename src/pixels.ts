import { ColorModes } from "./Controls";

export interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}
// Log hex colours of flat pixel array
export const renderPixelsToConsole = (
  pixels: Uint8ClampedArray,
  rowWidth: number
) => {
  let output = "";
  for (let i = 0; i < pixels.length; i += 4) {
    if (i % (rowWidth * 4) === 0) {
      output += "\n";
    }
    output += `${pixels[i].toString(16)}${pixels[i + 1]
      .toString(16)
      .padStart(2, "0")}${pixels[i + 2].toString(16).padStart(2, "0")} `;
  }
  console.log(output);
};
// Get square area around point
export const getPixelsForArea = (
  image: HTMLImageElement,
  ctxInput: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number
) => {
  const aX = x - width / 2;
  const aY = y - width / 2;
  return ctxInput.getImageData(
    // Clamp to image bounds (otherwise they're considered #000000)
    Math.min(Math.max(aX, 0), image.width),
    Math.min(Math.max(aY, 0), image.height),
    Math.min(width * 2, image.width - aX),
    Math.min(width * 2, image.height - aY)
  ).data;
};
export const getAveragePixelFromPixelArray = (
  pixels: Uint8ClampedArray
): Pixel => {
  // Get average colour from pixel image data
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalA = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    totalR += pixels[i];
    totalG += pixels[i + 1];
    totalB += pixels[i + 2];
    totalA += pixels[i + 3];
  }
  return {
    r: Math.floor((totalR / pixels.length) * 4),
    g: Math.floor((totalG / pixels.length) * 4),
    b: Math.floor((totalB / pixels.length) * 4),
    a: Math.floor((totalA / pixels.length) * 4),
  };
};
export const getPixelBrightness = (
  r: number,
  g: number,
  b: number,
  a: number
) => (r + g + b + a) / 4 / 255;
export const modifyPixelByColorMode = (pixel: Pixel, mode: string) => {
  if (mode === ColorModes.rgb) {
    return pixel;
  }
  if (mode === ColorModes.greyScale) {
    const brightness = getPixelBrightness(pixel.r, pixel.g, pixel.b, pixel.a);
    return {
      r: brightness * 255,
      g: brightness * 255,
      b: brightness * 255,
      // a: 1,
      // a: pixel.a,
      a: brightness * 255,
    };
  }
  return pixel;
};

import { ColorThiefProvider } from "./ColorThiefProvider";
import { ColorModes } from "./Controls";
export interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}
// Log hex colors of flat pixel array
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
  // Get average color from pixel image data
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
// Extract color palette from pixels via color quantization
export const getPaletteFromPixelArray = (
  pixels: Uint8ClampedArray,
  n: number
): Pixel[] => {
  // Get color palette quantized from pixels
  const colorThief = new ColorThiefProvider();
  const palette = [];
  const colorThiefPalette = colorThief.getPalette(pixels, n);
  // Always have black and white in the palette, trust
  palette.push([0, 0, 0]);
  palette.push([255, 255, 255]);
  if (colorThiefPalette) {
    // console.log(":: ~ colorThiefPalette", colorThiefPalette.length);
    palette.push(...colorThiefPalette);
  }
  return palette.map((c) => ({
    r: c[0],
    g: c[1],
    b: c[2],
    a: 255,
  }));
};
export const modifyPixelByColorMode = (
  pixel: Pixel,
  mode: string,
  palette?: Pixel[]
) => {
  if (palette) {
    // Find nearest colour in palette based on rgb distance
    const nearest = palette?.reduce((prev, curr) => {
      const prevDist = Math.abs(prev.r - pixel.r) + Math.abs(prev.g - pixel.g);
      const currDist = Math.abs(curr.r - pixel.r) + Math.abs(curr.g - pixel.g);
      return currDist < prevDist ? curr : prev;
    });
    pixel = nearest ?? pixel;
  }
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
  if (mode === ColorModes.monochrome) {
    // This has a hack in Output.tsx too, so we can vary the size of the dots but still be all solid black
    const brightness = getPixelBrightness(pixel.r, pixel.g, pixel.b, pixel.a);
    return {
      r: 0,
      g: 0,
      b: 0,
      a: brightness * 255,
    };
  }
  if (mode === ColorModes.inverted) {
    return {
      r: 255 - pixel.r,
      g: 255 - pixel.g,
      b: 255 - pixel.b,
      a: pixel.a,
    };
  }
  if (mode === ColorModes.sepia) {
    return {
      r: Math.min(255, pixel.r * 0.393 + pixel.g * 0.769 + pixel.b * 0.189),
      g: Math.min(255, pixel.r * 0.349 + pixel.g * 0.686 + pixel.b * 0.168),
      b: Math.min(255, pixel.r * 0.272 + pixel.g * 0.534 + pixel.b * 0.131),
      a: pixel.a,
    };
  }
  return pixel;
};
export const pixelContrast = (pixel: Pixel, contrast: number) => {
  return {
    r: Math.min(255, Math.max(0, contrast * (pixel.r - 128) + 128)),
    g: Math.min(255, Math.max(0, contrast * (pixel.g - 128) + 128)),
    b: Math.min(255, Math.max(0, contrast * (pixel.b - 128) + 128)),
    a: pixel.a,
  };
};
export const pixelBrightness = (pixel: Pixel, brightness: number) => {
  return {
    r: Math.min(255, Math.max(0, pixel.r + brightness)),
    g: Math.min(255, Math.max(0, pixel.g + brightness)),
    b: Math.min(255, Math.max(0, pixel.b + brightness)),
    a: pixel.a,
  };
};

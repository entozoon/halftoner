import { useContext, useEffect } from "react";
import { ContextControls, ContextImage } from "./App";
import { setupCanvases } from "./canvas";
import "./Output.scss";
import {
  getAveragePixelFromPixelArray,
  getPixelBrightness,
  getPixelsForArea,
  modifyPixelByColorMode,
} from "./pixels";
export const Output = () => {
  const contextImage = useContext(ContextImage);
  const contextControls = useContext(ContextControls);
  // useEffect trigger whenever contextControls or contextImage changes
  useEffect(() => {
    if (!contextControls) return;
    const { example, maxRadius, spacing, vOffset, colorMode } = contextControls;
    const image = new Image();
    image.src = contextImage ? URL.createObjectURL(contextImage) : example;
    image.onload = () => {
      const { ctxInput, ctxOutput } = setupCanvases(image);
      for (
        let _x = 0, _xI = 0;
        _x < image.width;
        _x += spacing * maxRadius, _xI++
      ) {
        for (
          let _y = 0, _yI = 0;
          _y < image.height;
          _y += spacing * maxRadius, _yI++
        ) {
          let x = _x;
          let y = _y;
          // vOffset
          if (_xI % 2 === 0) y += vOffset * maxRadius;
          if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
            // const pixel = ctxInput.getImageData(x, y, 1, 1).data;
            // const [r, g, b, a] = pixel;
            //
            const pixels = getPixelsForArea(
              image,
              ctxInput,
              x,
              y,
              maxRadius * 2
            );
            // renderPixelsToConsole(pixels, maxRadius * 2);
            const pixelAverage = getAveragePixelFromPixelArray(pixels);
            // Color modes
            const { r, g, b, a } = modifyPixelByColorMode(
              pixelAverage,
              colorMode
            );
            // Get pixel brightness factor
            const brightness = getPixelBrightness(r, g, b, a);
            // Amplitude modulation of radius by brightness
            const radius = maxRadius - maxRadius * brightness;
            // Draw circle
            ctxOutput.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctxOutput.beginPath();
            ctxOutput.arc(x, y, radius, 0, 2 * Math.PI);
            ctxOutput.fill();
          }
        }
      }
    };
  }, [contextImage, contextControls]);
  return (
    <>
      <div className="canvas-wrapper input">
        <canvas>{contextImage?.name}</canvas>
      </div>
      <div className="canvas-wrapper output">
        <canvas>{contextImage?.name}</canvas>
      </div>
    </>
  );
};

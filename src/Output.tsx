import { useContext, useEffect, useState } from "react";
import { ContextControls, ContextImage } from "./App";
import { setupCanvases } from "./canvas";
import { ColorModes, Examples } from "./Controls";
import "./Output.scss";
import {
  getAveragePixelFromPixelArray,
  getPixelBrightness,
  getPixelsForArea,
  getPaletteFromPixelArray,
  modifyPixelByColorMode,
  pixelContrast,
  pixelBrightness,
} from "./pixels";
import { Helmet } from "react-helmet";
const createAsciiFromPixels = (pixels) => {
  const ascii = pixels
    .map(({ pixel, newLine }) => {
      const { r, g, b, a } = pixel;
      const brightness = getPixelBrightness(r, g, b, a);
      const ascii = brightness > 0.8 ? " " : brightness > 0.4 ? "░" : "█";
      return newLine ? `\n${ascii}` : ascii;
    })
    .join("");
  return ascii;
};
export const Output = () => {
  const contextImage = useContext(ContextImage);
  const contextControls = useContext(ContextControls);
  const [outputImage, setOutputImage] = useState("");
  const [pixelsOutput, setPixelsOutput] = useState([]);
  const [asciiOutput, setAsciiOutput] = useState("");
  // useEffect trigger whenever contextControls or contextImage changes
  useEffect(() => {
    if (!contextControls) return;
    const {
      example,
      maxRadius,
      spacing,
      vOffset,
      colorMode,
      paletteSize,
      contrast,
      brightness,
    } = contextControls;
    const image = new Image();
    image.src = contextImage
      ? URL.createObjectURL(contextImage)
      : Examples[example]?.image;
    image.onload = () => {
      const { ctxInput, ctxOutput } = setupCanvases(image);
      ctxOutput.imageSmoothingEnabled = false;
      const allPixels = ctxInput.getImageData(
        0,
        0,
        image.width,
        image.height
      ).data;
      const _pixelsOutput = [];
      const palette =
        paletteSize <= 10
          ? getPaletteFromPixelArray(allPixels, paletteSize)
          : undefined;
      for (
        let _y = 0, _yI = 0;
        _y < image.height;
        _y += spacing * maxRadius, _yI++
      ) {
        for (
          let _x = 0, _xI = 0;
          _x < image.width;
          _x += spacing * maxRadius, _xI++
        ) {
          let x = _x;
          let y = _y;
          // vOffset
          if (_xI % 2 === 0) y += vOffset * maxRadius;
          if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
            const pixels = getPixelsForArea(
              image,
              ctxInput,
              x,
              y,
              maxRadius * 2
            );
            const pixelAverage = getAveragePixelFromPixelArray(pixels);
            let pixel = pixelAverage;
            pixel = pixelContrast(pixel, contrast);
            pixel = pixelBrightness(pixel, brightness);
            pixel = modifyPixelByColorMode(pixel, colorMode, palette);
            _pixelsOutput.push({
              x,
              y,
              pixel,
              newLine: _xI === 0 && _yI !== 0,
            });
            const { r, g, b, a } = pixel;
            const _brightness = getPixelBrightness(r, g, b, a);
            let radius = maxRadius - maxRadius * _brightness;
            if (colorMode === ColorModes.monochromish) {
              radius = maxRadius - maxRadius * (a / 255);
              console.log(":: ~ a:", a);
            }
            ctxOutput.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctxOutput.beginPath();
            ctxOutput.arc(x, y, radius, 0, 2 * Math.PI);
            ctxOutput.fill();
          }
        }
      }
      setPixelsOutput(_pixelsOutput);
      setOutputImage(ctxOutput.canvas.toDataURL());
    };
  }, [contextImage, contextControls]);
  useEffect(() => {
    setAsciiOutput(createAsciiFromPixels(pixelsOutput));
  }, [pixelsOutput]);
  return (
    <>
      {/* // add data-colormode to body with Helmet */}
      <Helmet
        bodyAttributes={{ "data-colorMode": contextControls?.colorMode }}
      />
      <div>
        <div className="output-wrapper">
          <div className="canvas-wrapper input">
            <canvas>{contextImage?.name}</canvas>
          </div>
          <div className="canvas-wrapper output">
            <canvas>{contextImage?.name}</canvas>
          </div>
          <div className="output">
            <img src={outputImage} />
          </div>
        </div>
        <pre contentEditable>{asciiOutput}</pre>
      </div>
    </>
  );
};

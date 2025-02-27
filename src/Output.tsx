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
const createAsciiFromPixels = (pixels, rotate = false) => {
  const ascii = pixels
    .map(({ pixel, x, y }) => {
      const { r, g, b, a } = pixel;
      const brightness = getPixelBrightness(r, g, b, a);
      const ascii = brightness > 0.8 ? " " : brightness > 0.4 ? "░" : "█";
      const newLine = rotate ? y === 0 : x === 0;
      return newLine ? `\n${ascii}` : ascii;
    })
    .join("");
  return ascii;
};
export const Output = () => {
  const contextImage = useContext(ContextImage);
  const contextControls = useContext(ContextControls);
  const [outputImage, setOutputImage] = useState("");
  const [pixelsOutput1, setPixelsOutput1] = useState([]);
  const [pixelsOutput2, setPixelsOutput2] = useState([]);
  const [asciiOutput1, setAsciiOutput1] = useState("");
  const [asciiOutput2, setAsciiOutput2] = useState("");
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
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
      const _pixelsOutput1 = [];
      const palette =
        paletteSize <= 10
          ? getPaletteFromPixelArray(allPixels, paletteSize)
          : undefined;
      if (colorMode === ColorModes.ascii) {
        //
        //
        // Pure blaps for ASCII
        // By which I mean process every pixel
        for (let _y = 0, _yI = 0; _y < image.height; _y++) {
          for (let _x = 0, _xI = 0; _x < image.width; _x++) {
            let x = _x;
            let y = _y;
            if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
              let pixels = getPixelsForArea(image, ctxInput, x, y, 1);
              let pixel = getAveragePixelFromPixelArray(pixels);
              pixel = pixelBrightness(pixel, brightness);
              pixel = pixelContrast(pixel, contrast);
              pixel = pixelBrightness(pixel, brightness);
              pixel = modifyPixelByColorMode(pixel, colorMode, palette);
              _pixelsOutput1.push({
                x,
                y,
                pixel,
              });
            }
          }
        }
        //
        // Pure rotated blap for printing
        setPixelsOutput1(_pixelsOutput1);
        const _pixelsOutput2 = [];
        for (let _x = 0, _xI = 0; _x < image.width; _x++) {
          for (let _y = image.height - 1, _yI = 0; _y >= 0; _y--) {
            let x = _x;
            let y = _y;
            if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
              let pixels = getPixelsForArea(image, ctxInput, x, y, 1);
              let pixel = getAveragePixelFromPixelArray(pixels);
              _pixelsOutput2.push({
                x,
                y,
                pixel,
              });
            }
          }
        }
        setPixelsOutput2(_pixelsOutput2);
      }
      //
      //
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
            // _pixelsOutput1.push({
            //   x,
            //   y,
            //   pixel,
            // });
            const { r, g, b, a } = pixel;
            const _brightness = getPixelBrightness(r, g, b, a);
            let radius = maxRadius - maxRadius * _brightness;
            if (colorMode === ColorModes.monochromish) {
              radius = maxRadius - maxRadius * (a / 255);
            }
            ctxOutput.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctxOutput.beginPath();
            ctxOutput.arc(x, y, radius, 0, 2 * Math.PI);
            ctxOutput.fill();
          }
        }
      }
      setPixelsOutput1(_pixelsOutput1);
      setOutputImage(ctxOutput.canvas.toDataURL());
      setLoading(false);
    };
  }, [contextImage, contextControls]);
  useEffect(() => {
    setAsciiOutput1(createAsciiFromPixels(pixelsOutput1));
  }, [pixelsOutput1]);
  useEffect(() => {
    setAsciiOutput2(createAsciiFromPixels(pixelsOutput2, true));
  }, [pixelsOutput2]);
  const { colorMode } = contextControls;
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
          <div
            className="canvas-wrapper output"
            hidden={colorMode === ColorModes.ascii}
          >
            <canvas>{contextImage?.name}</canvas>
          </div>
          <div className="output" hidden={colorMode === ColorModes.ascii}>
            <img src={outputImage} />
          </div>
        </div>
        {loading && <div className="loading">Processing...</div>}
        <pre
          contentEditable
          dangerouslySetInnerHTML={{ __html: asciiOutput1 }}
        />
        <pre
          contentEditable
          dangerouslySetInnerHTML={{ __html: asciiOutput2 }}
        />
      </div>
    </>
  );
};

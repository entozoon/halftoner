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
      const ascii = brightness > 0.8 ? " " : brightness > 0.4 ? "." : "@"; // Probably not #, according to test print
      const newLine = rotate ? y === 0 : x === 0;
      return newLine ? `\n${ascii}` : ascii;
    })
    .join("");
  return ascii;
};
export const Output = ({ setLoading }) => {
  const contextImage = useContext(ContextImage);
  const contextControls = useContext(ContextControls);
  const [outputImage, setOutputImage] = useState("");
  const [outputPixels1, setOutputPixels1] = useState([]);
  const [outputPixels2, setOutputPixels2] = useState([]);
  const [outputPixels3, setOutputPixels3] = useState([]);
  const [outputAscii1, setOutputAscii1] = useState("");
  const [outputAscii2, setOutputAscii2] = useState("");
  const [outputAscii3, setOutputAscii3] = useState("");
  // useEffect trigger whenever contextControls or contextImage changes
  useEffect(() => {
    if (!contextControls) return;
    setLoading(true);
    const {
      example,
      maxRadius,
      spacingX,
      spacingY,
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
      const _outputPixels1 = [];
      const palette =
        paletteSize <= 10
          ? getPaletteFromPixelArray(allPixels, paletteSize)
          : undefined;
      // Crap, can't do this without abstracting ascii from the main run
      // const spacingX = colorMode === ColorModes.perfectAscii ? spacing * 0.5 : spacing;
      if (colorMode === ColorModes.perfectAscii) {
        //
        //
        // Pure blaps for ASCII
        // By which I mean process every pixel
        for (
          let _y = 0, _yI = 0;
          _y < image.height;
          _y += Math.floor(spacingY), _yI++
        ) {
          for (
            let _x = 0, _xI = 0;
            _x < image.width;
            _x += Math.floor(spacingX), _xI++
          ) {
            let x = _x;
            let y = _y;
            if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
              let pixels = getPixelsForArea(image, ctxInput, x, y, 1);
              let pixel = getAveragePixelFromPixelArray(pixels);
              pixel = pixelBrightness(pixel, brightness);
              pixel = pixelContrast(pixel, contrast);
              pixel = pixelBrightness(pixel, brightness);
              pixel = modifyPixelByColorMode(pixel, colorMode, palette);
              _outputPixels1.push({
                x,
                y,
                pixel,
              });
            }
          }
        }
        //
        // Pure rotated blap for printing
        setOutputPixels1(_outputPixels1);
        const _outputPixels2 = [];
        for (let _x = 0, _xI = 0; _x < image.width; _x += spacingX, _xI++) {
          for (
            let _y = image.height - 1, _yI = 0;
            _y >= 0;
            _y -= spacingY, _yI++
          ) {
            let x = _x;
            let y = _y;
            if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
              let pixels = getPixelsForArea(image, ctxInput, x, y, 1);
              let pixel = getAveragePixelFromPixelArray(pixels);
              _outputPixels2.push({
                x,
                y,
                pixel,
              });
            }
          }
        }
        setOutputPixels2(_outputPixels2);
      }
      //
      //
      const _outputPixels3 = [];
      for (
        let _y = 0, _yI = 0;
        _y < image.height;
        _y += spacingY * maxRadius, _yI++
      ) {
        for (
          let _x = 0, _xI = 0;
          _x < image.width;
          _x += spacingX * maxRadius, _xI++
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
            _outputPixels3.push({
              x,
              y,
              // x: Math.floor(_xI),
              // y: Math.floor(_yI),
              pixel,
            });
            // ABSTRACT THIS OUT INTO ITS OWN FOR LOOP OF  _outputPixels3
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
      setOutputPixels3(_outputPixels3);
      setOutputImage(ctxOutput.canvas.toDataURL());
      setLoading(false);
    };
  }, [contextImage, contextControls]);
  useEffect(() => {
    setOutputAscii1(createAsciiFromPixels(outputPixels1));
  }, [outputPixels1]);
  useEffect(() => {
    setOutputAscii2(createAsciiFromPixels(outputPixels2, true));
  }, [outputPixels2]);
  useEffect(() => {
    setOutputAscii3(createAsciiFromPixels(outputPixels3));
  }, [outputPixels3]);
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
            hidden={colorMode === ColorModes.perfectAscii}
          >
            <canvas>{contextImage?.name}</canvas>
          </div>
          <div
            className="canvas-wrapper output -ascii"
            hidden={colorMode === ColorModes.perfectAscii}
          >
            <pre
              contentEditable
              dangerouslySetInnerHTML={{ __html: outputAscii3 }}
            />
          </div>
          <div
            className="output"
            hidden={colorMode === ColorModes.perfectAscii}
          >
            <img src={outputImage} />
          </div>
        </div>
        <pre
          contentEditable
          dangerouslySetInnerHTML={{ __html: outputAscii1 }}
          hidden={colorMode !== ColorModes.perfectAscii}
        />
        <pre
          contentEditable
          dangerouslySetInnerHTML={{ __html: outputAscii2 }}
          hidden={colorMode !== ColorModes.perfectAscii}
        />
      </div>
    </>
  );
};

import { useContext, useEffect } from "react";
import { ContextControls, ContextImage } from "./App";
import "./Output.scss";
export const Output = () => {
  const contextImage = useContext(ContextImage);
  const contextControls = useContext(ContextControls);
  // useEffect trigger whenever contextControls or contextImage changes
  useEffect(() => {
    if (!contextControls) return;
    const { example, maxRadius, spacing, vOffset } = contextControls;
    console.log(":: ~ example", example);
    const image = new Image();
    image.src = contextImage ? URL.createObjectURL(contextImage) : example;
    image.onload = () => {
      URL.revokeObjectURL(image.src); // only if blob? :shrug:
      const canvasInput = document.querySelector(
        ".input canvas"
      ) as HTMLCanvasElement;
      const canvasOutput = document.querySelector(
        ".output canvas"
      ) as HTMLCanvasElement;
      const ctxInput = canvasInput?.getContext("2d");
      const ctxOutput = canvasOutput?.getContext("2d");
      if (!canvasInput || !ctxInput || !ctxOutput) return;
      // Render input
      canvasInput.width = image.width;
      canvasInput.height = image.height;
      ctxInput.drawImage(image, 0, 0);
      // Render output
      canvasOutput.width = image.width;
      canvasOutput.height = image.height;
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
          _xI;
          if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
            // Get pixel colour
            const pixel = ctxInput.getImageData(x, y, 1, 1).data;
            const [r, g, b, a] = pixel;
            // Get pixel brightness factor
            const brightness = (r + g + b) / 3 / 255;
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

import { useContext, useEffect } from "react";
import { ContextImage } from "./App";
import "./Output.css";
export const Output = () => {
  const contextImage = useContext(ContextImage);
  useEffect(() => {
    if (!contextImage) return;
    const image = new Image();
    image.src = URL.createObjectURL(contextImage);
    image.onload = () => {
      URL.revokeObjectURL(image.src);
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
      // Get pixel colour
      const pixel = ctxInput.getImageData(0, 0, 1, 1).data;
      const [r, g, b, a] = pixel;
      // Draw circle
      ctxOutput.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctxOutput.beginPath();
      ctxOutput.arc(200, 200, 100, 0, 2 * Math.PI);
      ctxOutput.fill();
    };
  }, [contextImage]);
  if (!contextImage) return null;
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
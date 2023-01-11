import { useContext, useEffect } from "react";
import { ContextImage } from "./App";
import "./Output.css";
const maxRadius = 12;
const spacing = 1.5; // factor of maxRadius
export const Output = () => {
  let contextImage = useContext(ContextImage);
  useEffect(() => {
    const image = new Image();
    image.src = contextImage
      ? URL.createObjectURL(contextImage)
      : "example1.jpg";
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
      for (let x = 0; x < image.width; x += spacing * maxRadius) {
        for (let y = 0; y < image.height; y += spacing * maxRadius) {
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
    };
  }, [contextImage]);
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

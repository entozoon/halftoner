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
      const canvas = document.querySelector("canvas");
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };
  }, [contextImage]);
  if (!contextImage) return null;
  return (
    <div className="output">
      <canvas>{contextImage?.name}</canvas>;
    </div>
  );
};

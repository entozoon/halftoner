export const setupCanvases = (
  image: HTMLImageElement
): {
  canvasInput: HTMLCanvasElement;
  canvasOutput: HTMLCanvasElement;
  ctxInput: CanvasRenderingContext2D;
  ctxOutput: CanvasRenderingContext2D;
} => {
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
  return { canvasInput, canvasOutput, ctxInput, ctxOutput };
};

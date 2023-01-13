export const parseToGivenType = (value: string, type: string) => {
  switch (type) {
    case "number":
      return parseFloat(value);
    default:
      return value;
  }
};
// show hex colours in console of flat pixel array
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

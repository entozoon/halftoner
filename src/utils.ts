export const parseToGivenType = (value: string, type: string) => {
  switch (type) {
    case "number":
      return parseFloat(value);
    default:
      return value;
  }
};

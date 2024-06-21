export const arrayToString = (arr) => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.map((item) => `'${item}'`).join(",");
  }
  return "";
};

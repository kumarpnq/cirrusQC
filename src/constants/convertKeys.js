export const convertKeys = (obj) => {
  const newObj = {};
  for (let key in obj) {
    const newKey = key
      .toLowerCase()
      .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase()); // Convert to camelCase
    newObj[newKey] = obj[key];
  }
  return newObj;
};

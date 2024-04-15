export const convertKeys = (obj) => {
  const newObj = {};
  for (let key in obj) {
    const newKey = key.replace(/_/g, "").toUpperCase();
    newObj[newKey] = obj[key];
  }
  return newObj;
};

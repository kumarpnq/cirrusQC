import { qc3Values } from "../constants/dataArray";

export const getValueByTitle = (title) => {
  const found = qc3Values.find((item) => item.title === title);
  return found ? found.value : null;
};

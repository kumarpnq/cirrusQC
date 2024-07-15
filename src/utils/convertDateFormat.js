import { parseISO, format } from "date-fns";

export const convertDateFormat = (dateString) => {
  if (!dateString) return null;
  const parsedDate = parseISO(dateString);
  return format(parsedDate, "yyyy-MM-dd HH:mm");
};

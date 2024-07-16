// src/utils/dateUtils.js
import { parseISO, format } from "date-fns";

/**
 * Extracts and formats the date part from an ISO date-time string.
 *
 * @param {string} dateTimeString - The ISO date-time string.
 * @returns {string} - The formatted date string in 'yyyy-MM-dd' format.
 */
export function extractDate(dateTimeString) {
  try {
    const parsedDate = parseISO(dateTimeString);
    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    return null;
  }
}

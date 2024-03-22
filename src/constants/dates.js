const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
export const formattedDate = new Date(
  currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
)
  .toISOString()
  .slice(0, 16)
  .replace("T", " ");
export const formattedNextDay = new Date(
  nextDay.getTime() - nextDay.getTimezoneOffset() * 60000
)
  .toISOString()
  .slice(0, 16)
  .replace("T", " ");

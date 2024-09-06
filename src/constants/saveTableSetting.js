export const saveTableSettings = (screen, tableId, field, width) => {
  const settings = JSON.parse(localStorage.getItem("tableSettings")) || {};

  if (!settings[screen]) {
    settings[screen] = {};
  }
  if (!settings[screen][tableId]) {
    settings[screen][tableId] = { columns: {} };
  }

  settings[screen][tableId].columns[field] = width;

  localStorage.setItem("tableSettings", JSON.stringify(settings));
};

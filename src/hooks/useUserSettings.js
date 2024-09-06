const getTableSettings = (screen, tableId) => {
  const settings = JSON.parse(localStorage.getItem("tableSettings")) || {};
  return settings?.[screen]?.[tableId]?.columns || [];
};

const useUserSettings = (screen, tableId) => {
  const columns = getTableSettings(screen, tableId);

  return columns;
};

export default useUserSettings;

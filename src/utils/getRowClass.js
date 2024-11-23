export const getRowClass = (rowData) => {
  const statusCheck =
    rowData.qc2_done === "No" &&
    (rowData.qc3_status === "Z" || rowData.qc3_status === "Y");

  const fieldsCheck =
    rowData.prominence !== null &&
    rowData.prominence !== "Unknown" &&
    rowData.reporting_subject !== "Unknown" &&
    rowData.reporting_tone !== null &&
    rowData.reporting_tone !== "Unknown";

  if (statusCheck && fieldsCheck) {
    return "accept";
  }
  return "";
};

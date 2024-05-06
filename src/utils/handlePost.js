import axios from "axios";
import { toast } from "react-toastify";

const handlePostData = async (
  updatedRows,
  name,
  currentDateWithTime,
  setSavedSuccess,
  setPostingLoading,
  setUpdatedRows,
  setSuccessMessage,
  setSelectedRowData,
  setReportingTone,
  setSearchedData,
  setSubject,
  setCategory,
  setProminence,
  setUnsavedChanges,
  setEditValue,
  setEditRow,
  userToken,
  setHighlightUpdatedRows,
  setIsRetrieveAfterSave,
  setPageNumber,
  tableData,
  setTableData
) => {
  setSavedSuccess(true);
  setPostingLoading(true);
  const dataToSending = updatedRows.map((row) => ({
    COMPANYID: row.company_id,
    DETAILSUMMARY: row.detail_summary,
    KEYWORD: row.keyword,
    MODIFIEDBY: name,
    MODIFIEDON: currentDateWithTime,
    PROMINENCE: row.prominence,
    REPORTINGSUBJECT: row.reporting_subject,
    REPORTINGTONE: row.reporting_tone,
    SOCIALFEEDID: row.social_feed_id,
    SUBCATEGORY: row.subcategory,
    HEADLINE: row.headline,
    HEADSUMMARY: row.headsummary,
    AUTHOR: row.author_name,
    REMARKS: row.remarks,
  }));
  const invalidRows = updatedRows.filter((row) =>
    ["reporting_tone", "prominence", "reporting_subject"].some(
      (field) => row[field] === "Unknown"
    )
  );

  if (invalidRows.length > 0) {
    toast.warning(
      "Some rows have null values in reporting_tone, manual_prominence, or subject."
    );
    setPostingLoading(false);
    return;
  }
  try {
    const url = `${import.meta.env.VITE_BASE_URL}update2databaseTemp/`; //update2database
    if (dataToSending.length > 0) {
      await axios.post(url, dataToSending, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });
      // Remove updated rows from table data
      const updatedSocialFeedIds = updatedRows.map((row) => row.social_feed_id);
      const updatedCompanyIds = updatedRows.map((row) => row.company_id);
      const newTableData = tableData.filter(
        (row) =>
          !updatedSocialFeedIds.includes(row.social_feed_id) ||
          !updatedCompanyIds.includes(row.company_id)
      );
      setTableData(newTableData);
      setUpdatedRows([]);
      setPostingLoading(false);
      toast.success("Data updated successfully!");
      setSelectedRowData([]);
      setHighlightUpdatedRows([]);
      setSearchedData([]);
      // Clearing the dropdown values
      setReportingTone("");
      setSubject("");
      setCategory("");
      setProminence("");
      setUnsavedChanges(false);
      setEditValue("");
      setEditRow("");
    } else {
      setSuccessMessage("No data to save.");
      setPostingLoading(false);
    }
  } catch (error) {
    if (error.message === "Network Error") {
      setSuccessMessage("Please check your internet connection.");
      setPostingLoading(false);
    }
  }
};

export default handlePostData;

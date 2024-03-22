import axios from "axios";

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
  setPageNumber
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

  try {
    const url = `${import.meta.env.VITE_BASE_URL}update2databaseTemp/`; //update2database
    if (dataToSending.length > 0) {
      await axios.post(url, dataToSending, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });
      setUpdatedRows([]);
      setPostingLoading(false);
      setSuccessMessage("Data updated successfully!");
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
      setPageNumber(1);
      setIsRetrieveAfterSave(true);
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

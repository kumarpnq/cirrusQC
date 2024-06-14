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
  setSearchedData,
  setReportingTone,
  setSubject,
  setCategory,
  setProminence,
  setUnsavedChanges,
  setEditValue,
  setEditRow,
  userToken,
  setHighlightUpdatedRows,
  tableData,
  setTableData,
  differData,
  setDifferData
) => {
  setSavedSuccess(true);
  setPostingLoading(true);

  // Separate valid and invalid rows
  const invalidRows = updatedRows.filter((row) =>
    ["reporting_tone", "prominence", "reporting_subject"].some(
      (field) => row[field] === "Unknown"
    )
  );

  const validRows = updatedRows.filter((row) =>
    ["reporting_tone", "prominence", "reporting_subject"].every(
      (field) => row[field] !== "Unknown"
    )
  );

  const hasValidRows = validRows.length > 0;
  const hasOneInvalidRowWithNoValid =
    !validRows.length && invalidRows.length === 1;
  const hasInvalidRows = invalidRows.length > 0;

  if (hasOneInvalidRowWithNoValid) {
    toast.warning("Some Mandatory Fields are Empty");
    return;
  }
  if (hasInvalidRows) {
    toast.warning(
      "Some Mandatory Fields are Empty. Only valid rows will be updated."
    );
  }

  if (!hasValidRows) {
    toast.warning("No data to save.");
    return;
  }

  const dataToSending = differData
    .map((selectedItem) => {
      const updatedData = validRows.filter(
        (row) =>
          row.social_feed_id === selectedItem.social_feed_id &&
          row.company_id === selectedItem.company_id
      );

      let modifiedFields = {};

      updatedData.forEach((updatedRow) => {
        const modifiedFieldsForRow = {};

        // Compare each field with the selected row
        if (updatedRow.prominence !== selectedItem.prominence) {
          modifiedFieldsForRow.PROMINENCE = updatedRow.prominence;
        }
        if (updatedRow.reporting_subject !== selectedItem.reporting_subject) {
          modifiedFieldsForRow.REPORTINGSUBJECT = updatedRow.reporting_subject;
        }
        if (updatedRow.reporting_tone !== selectedItem.reporting_tone) {
          modifiedFieldsForRow.REPORTINGTONE = updatedRow.reporting_tone;
        }
        if (updatedRow.sub_category !== selectedItem.sub_category) {
          modifiedFieldsForRow.SUBCATEGORY = updatedRow.sub_category;
        }
        if (updatedRow.headline !== selectedItem.headline) {
          modifiedFieldsForRow.HEADLINE = updatedRow.headline;
        }
        if (updatedRow.headsummary !== selectedItem.headsummary) {
          modifiedFieldsForRow.HEADSUMMARY = updatedRow.headsummary;
        }
        if (updatedRow.author_name !== selectedItem.author_name) {
          modifiedFieldsForRow.AUTHOR = updatedRow.author_name;
        }
        if (updatedRow.remarks !== selectedItem.remarks) {
          modifiedFieldsForRow.REMARKS = updatedRow.remarks;
        }

        // Merge modified fields for this row with overall modified fields
        modifiedFields = { ...modifiedFields, ...modifiedFieldsForRow };
      });

      if (Object.keys(modifiedFields).length > 0) {
        return {
          SOCIALFEEDID: selectedItem.social_feed_id,
          COMPANYID: selectedItem.company_id,
          MODIFIEDBY: name,
          MODIFIEDON: currentDateWithTime,
          ...modifiedFields,
        };
      }
      return null; // No modifications, return null
    })
    .filter((entry) => entry !== null);

  try {
    const url = `${import.meta.env.VITE_BASE_URL}update2databaseTemp/`;
    if (dataToSending.length > 0) {
      await axios.post(url, dataToSending, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      // Remove updated rows from table data
      const updatedSocialFeedIds = validRows.map((row) => row.social_feed_id);
      const updatedCompanyIds = validRows.map((row) => row.company_id);
      const newTableData = tableData.filter(
        (row) =>
          !updatedSocialFeedIds.includes(row.social_feed_id) ||
          !updatedCompanyIds.includes(row.company_id)
      );

      setUpdatedRows(invalidRows); // Keep only invalid rows in updatedRows
      setPostingLoading(false);
      setSelectedRowData([]);
      setHighlightUpdatedRows(invalidRows);
      setSearchedData([]);
      setDifferData([]);

      // Clearing the dropdown values
      setReportingTone("");
      setSubject("");
      setCategory("");
      setProminence("");
      setUnsavedChanges(false);
      setEditValue("");
      setEditRow("");
      setTableData(newTableData);

      toast.success("Valid data updated successfully!");
    } else {
      setSuccessMessage("No data to save.");
      setPostingLoading(false);
    }
  } catch (error) {
    console.log(error);
    setSuccessMessage(error.message);
    setPostingLoading(false);
  }
};

export default handlePostData;

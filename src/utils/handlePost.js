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
          modifiedFieldsForRow.prominence = updatedRow.prominence;
        }
        if (updatedRow.reporting_subject !== selectedItem.reporting_subject) {
          modifiedFieldsForRow.reportingSubject = updatedRow.reporting_subject;
        }
        if (updatedRow.reporting_tone !== selectedItem.reporting_tone) {
          modifiedFieldsForRow.reportingTone = updatedRow.reporting_tone;
        }
        if (updatedRow.subcategory !== selectedItem.subcategory) {
          modifiedFieldsForRow.subcategory = updatedRow.subcategory;
        }
        if (updatedRow.headline !== selectedItem.headline) {
          modifiedFieldsForRow.headline = updatedRow.headline;
        }
        if (updatedRow.remarks !== selectedItem.remarks) {
          modifiedFieldsForRow.remark = updatedRow.remarks;
        }
        if (updatedRow.keyword !== selectedItem.keyword) {
          modifiedFieldsForRow.keyword = updatedRow.keyword;
        }
        if (updatedRow.headsummary !== selectedItem.headsummary) {
          modifiedFieldsForRow.headSummary = updatedRow.headsummary;
        }
        if (updatedRow.detail_summary !== selectedItem.detail_summary) {
          modifiedFieldsForRow.summary = updatedRow.detail_summary;
        }
        if (updatedRow.author_name !== selectedItem.author_name) {
          modifiedFieldsForRow.author = updatedRow.author_name;
        }

        // Merge modified fields for this row with overall modified fields
        modifiedFields = { ...modifiedFields, ...modifiedFieldsForRow };
      });

      if (Object.keys(modifiedFields).length > 0) {
        return {
          socialFeedId: selectedItem.social_feed_id,
          companyId: selectedItem.company_id,
          modifiedBy: name,
          modifiedOn: currentDateWithTime,
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
      // setReportingTone("");
      // setSubject("");
      // setCategory("");
      // setProminence("");
      setUnsavedChanges(false);
      setEditValue("");
      setEditRow("");
      setTableData(newTableData);

      toast.success(`${dataToSending.length} rows updated successfully!`);
    } else {
      setSuccessMessage("No data to save.");
      setPostingLoading(false);
    }
  } catch (error) {
    setSuccessMessage(error.message);
  } finally {
    setPostingLoading(false);
  }
};

export default handlePostData;

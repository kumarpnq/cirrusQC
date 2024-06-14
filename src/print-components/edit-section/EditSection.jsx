import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import HeaderForEdits from "../../components/research-dropdowns/table-dropdowns/HeaderForEdits";
import Button from "../../components/custom/Button";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import { ResearchContext } from "../../context/ContextProvider";
import axios from "axios";
import TableDropdown from "../../components/dropdowns/TableDropdown";
import SubjectSearchable from "../../components/research-dropdowns/table-dropdowns/SubjectSearchable";
import SearchableCategory from "../../components/research-dropdowns/table-dropdowns/SearchableCategory";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import CustomButton from "../../@core/CustomButton";
import Delete from "../../@core/Delete";

const useStyles = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },
  textField: {
    "& .MuiInputBase-input": {
      fontSize: "0.8em",
    },
  },
  resize: {
    fontSize: "0.8em",
    height: 25,
  },
  headerCheckBox: {
    color: "white",
  },
}));
const EditSection = ({
  selectedItems,
  setSelectedItems,
  qc2PrintTableData,
  setQc2PrintTableData,
  searchedData,
  setSearchedData,
  setHighlightRows,
  updatedData,
  setUpdatedData,
  differData,
  setDifferData,
}) => {
  const { userToken, setUnsavedChanges } = useContext(ResearchContext);
  const classes = useStyles();

  const [editRow, setEditRow] = useState("");
  const [editValue, setEditValue] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // updated data to snd database
  const [reportingTones, setReportingTones] = useState([]);
  const [reportingTone, setReportingTone] = useState("");
  const { data: reportingTons } = useFetchData(`${url}reportingtonelist`);
  useEffect(() => {
    if (reportingTons.data) {
      setReportingTones(reportingTons.data.reportingtones_list);
    }
  }, [reportingTons]);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [prominences, setProminences] = useState([]);
  const [prominence, setProminence] = useState("");
  const { data: prominenceLists } = useFetchData(`${url}prominencelist`);
  useEffect(() => {
    if (prominenceLists.data) {
      setProminences(prominenceLists.data.prominence_list);
    }
  }, [prominenceLists]);
  useEffect(() => {
    const editRowValues = selectedItems
      ?.map((item) => item[editRow])
      .filter((value) => value !== undefined);
    setEditValue(editRowValues[0]);
  }, [selectedItems, editRow]);
  const handleEditRowChange = (e) => {
    setEditRow(e.target.value);
  };

  //updating tabledata
  const handleApplyChanges = () => {
    if (selectedItems.length <= 0)
      return toast.warning("Please select at least one item to update", {
        autoClose: 3000,
      });

    setApplyLoading(true);
    let text = prominence;

    let prominenceInNumber = ((text) => {
      let match;
      return (match = text.match(/\(([\d.]+)\)/)) ? match[1] : 0;
    })(text);

    const isHeaderSpace = Boolean(editRow === "header_space");

    // Prevent duplicates in differData
    const newDifferData = [...differData];
    selectedItems.forEach((item) => {
      const index = newDifferData.findIndex(
        (row) =>
          row.article_id === item.article_id &&
          row.company_id === item.company_id
      );
      if (index === -1) {
        newDifferData.push(item);
      }
    });
    setDifferData(newDifferData);

    // setTimeout(() => {
    if (selectedItems.length > 0) {
      const updatedSelectedRows = selectedItems.map((row) => ({
        ...row,
        reporting_tone: reportingTone || row.reporting_tone,
        reporting_subject: subject || row.reporting_subject,
        subcategory: category || row.subcategory,
        m_prom: prominence || row.m_prom,
        space:
          isHeaderSpace && !prominence
            ? Number(row?.m_prom?.match(/\(([\d.]+)\)/)).toFixed(2)
            : isHeaderSpace && prominence
            ? Number(editValue * prominenceInNumber).toFixed(2)
            : !isHeaderSpace && prominenceInNumber
            ? Number(prominenceInNumber * row.header_space).toFixed(2)
            : row.space,

        detail_summary:
          (editRow === "detail_summary" && editValue) || row.detail_summary,
        headline: (editRow === "headline" && editValue) || row.headline,
        head_summary:
          (editRow === "head_summary" && editValue) || row.head_summary,
        author: (editRow === "author_name" && editValue) || row.author,
        keyword: (editRow === "keyword" && editValue) || row.keyword,
        remark: (editRow === "remarks" && editValue) || row.remark,
        header_space:
          (editRow === "header_space" && Number(editValue).toFixed(2)) ||
          row.header_space,
      }));

      // Prevent duplicates in updatedData
      const newUpdatedData = [...updatedData];
      updatedSelectedRows.forEach((updatedRow) => {
        const index = newUpdatedData.findIndex(
          (row) =>
            row.article_id === updatedRow.article_id &&
            row.company_id === updatedRow.company_id
        );
        if (index > -1) {
          newUpdatedData[index] = updatedRow;
        } else {
          newUpdatedData.push(updatedRow);
        }
      });

      const updatedTableData = qc2PrintTableData.map((row) => {
        const updatedRow = updatedSelectedRows.find(
          (selectedRow) =>
            selectedRow.article_id === row.article_id &&
            selectedRow.company_id === row.company_id
        );
        return updatedRow || row;
      });

      const updatedSearchedData = searchedData.map((row) => {
        const updatedRow = updatedSelectedRows.find(
          (selectedRow) =>
            selectedRow.article_id === row.article_id &&
            selectedRow.company_id === row.company_id
        );
        return updatedRow || row;
      });

      setUpdatedData(newUpdatedData);
      setHighlightRows(newUpdatedData);
      setQc2PrintTableData(updatedTableData);
      setSearchedData(updatedSearchedData);
      setUnsavedChanges(true);
    }
    setApplyLoading(false);
    setSelectedItems([]);
    // setReportingTone("");
    // setProminence("");
    // setSubject("");
    // setCategory("");
    // }, 0);
  };

  const handleSave = async () => {
    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 19).replace("T", " ");
    const userName = sessionStorage.getItem("userName");

    // Separate valid and invalid rows
    const invalidRows = updatedData.filter((row) =>
      ["reporting_tone", "m_prom", "reporting_subject"].some(
        (field) => row[field] === "Unknown"
      )
    );

    const validRows = updatedData.filter((row) =>
      ["reporting_tone", "m_prom", "reporting_subject"].every(
        (field) => row[field] !== "Unknown"
      )
    );

    if (invalidRows.length > 0) {
      toast.warning(
        "Some rows have null values in reporting_tone, manual_prominence, or subject. Only valid rows will be updated."
      );
    }

    let dataToSending = differData.map((selectedItem) => {
      const updatedRows = validRows.filter(
        (row) =>
          row.article_id === selectedItem.article_id &&
          row.company_id === selectedItem.company_id
      );

      let modifiedFields = {};

      updatedRows.forEach((updatedRow) => {
        const modifiedFieldsForRow = {};

        // Compare each field with the selected row
        if (updatedRow.headline !== selectedItem.headline) {
          modifiedFieldsForRow.HEADLINE = updatedRow.headline;
        }
        if (updatedRow.head_summary !== selectedItem.head_summary) {
          modifiedFieldsForRow.HEADSUMMARY = updatedRow.head_summary;
        }
        if (updatedRow.author !== selectedItem.author) {
          modifiedFieldsForRow.AUTHOR = updatedRow.author;
        }
        if (updatedRow.detail_summary !== selectedItem.detail_summary) {
          modifiedFieldsForRow.DETAILSUMMARY = updatedRow.detail_summary;
        }
        if (updatedRow.keyword !== selectedItem.keyword) {
          modifiedFieldsForRow.KEYWORD = updatedRow.keyword;
        }
        if (updatedRow.m_prom !== selectedItem.m_prom) {
          modifiedFieldsForRow.PROMINENCE = updatedRow.m_prom;
        }
        if (updatedRow.reporting_subject !== selectedItem.reporting_subject) {
          modifiedFieldsForRow.REPORTINGSUBJECT = updatedRow.reporting_subject;
        }
        if (updatedRow.reporting_tone !== selectedItem.reporting_tone) {
          modifiedFieldsForRow.REPORTINGTONE = updatedRow.reporting_tone;
        }
        if (updatedRow.social_feed_id !== selectedItem.social_feed_id) {
          modifiedFieldsForRow.SOCIALFEEDID = updatedRow.social_feed_id;
        }
        if (updatedRow.sub_category !== selectedItem.sub_category) {
          modifiedFieldsForRow.SUBCATEGORY = updatedRow.sub_category;
        }
        if (updatedRow.remark !== selectedItem.remark) {
          modifiedFieldsForRow.REMARKS = updatedRow.remark;
        }
        if (updatedRow.space !== selectedItem.space) {
          modifiedFieldsForRow.TOTALSPACE = updatedRow.space;
        }

        // Merge modified fields for this row with overall modified fields
        modifiedFields = { ...modifiedFields, ...modifiedFieldsForRow };
      });

      // Return only the modified fields
      return {
        ARTICLEID: selectedItem.article_id,
        COMPANYID: selectedItem.company_id,
        MODIFIEDBY: userName,
        MODIFIEDON: formattedDate,
        ...modifiedFields,
      };
    });

    try {
      const url = `${import.meta.env.VITE_BASE_URL}updatePrint2database/`;
      if (dataToSending.length > 0) {
        setSaveLoading(true);
        const res = await axios.post(url, dataToSending, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken} `,
          },
        });

        if (res.statusText === "OK") {
          toast.success("Row Updated");

          // Remove updated rows from table data
          const updatedTableData = qc2PrintTableData.filter(
            (row) =>
              !validRows.some(
                (updatedRow) =>
                  updatedRow.article_id === row.article_id &&
                  updatedRow.company_id === row.company_id
              )
          );

          setQc2PrintTableData(updatedTableData);
          setSelectedItems(invalidRows);
          setHighlightRows(invalidRows);
          setSearchedData([]);
          setUnsavedChanges(false);
          setUpdatedData(invalidRows);
          setDifferData(invalidRows);
        } else {
          toast.warning("No Data to Save.");
        }
      } else {
        toast.warning("No data to save");
      }
      setSaveLoading(false);
    } catch (error) {
      toast.warning(error.message);
      setSaveLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* reporting tone */}
        <TableDropdown
          value={reportingTone}
          setValues={setReportingTone}
          placeholder={"Tone"}
          mappingValue={reportingTones}
        />
        {/* Prominence */}
        <TableDropdown
          value={prominence}
          setValues={setProminence}
          placeholder={"Prominence"}
          mappingValue={prominences}
        />
        <div className="flex items-center justify-center gap-2 mt-1">
          {/* Reporting subject */}
          <SubjectSearchable
            label={"Subject"}
            setSubject={setSubject}
            subject={subject}
            width={120}
          />
          <SearchableCategory
            label={"Sub Category"}
            setCategory={setCategory}
            category={category}
            width={120}
            endpoint="subcategorylist"
          />
        </div>
        <Button
          btnText={applyLoading ? "Applying" : "Apply"}
          onClick={handleApplyChanges}
          isLoading={applyLoading}
        />
        <Button
          btnText={saveLoading ? "Loading" : "Save"}
          onClick={handleSave}
        />
        {!!selectedItems.length && (
          <CustomButton
            btnText="Delete"
            onClick={handleDialogOpen}
            bg="bg-red-500"
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 ">
        <HeaderForEdits
          editRow={editRow}
          handleEditRowChange={handleEditRowChange}
          classes={classes}
          pageType={"print"}
        />
        <span className="mt-3">
          <input
            placeholder="select a summary"
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            className="bg-secondory border border-gray-300 rounded-md px-4 outline-none md:w-[800px] sm:w-full hover:border-black"
          />
        </span>
      </div>
      <Delete
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        selectedArticles={selectedItems}
        setSelectedArticles={setSelectedItems}
        qc2PrintTableData={qc2PrintTableData}
        setQc2PrintTableData={setQc2PrintTableData}
      />
    </>
  );
};
EditSection.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  qc2PrintTableData: PropTypes.array.isRequired,
  setQc2PrintTableData: PropTypes.func.isRequired,
  searchedData: PropTypes.array.isRequired,
  setSearchedData: PropTypes.func.isRequired,
  highlightRows: PropTypes.array.isRequired,
  setHighlightRows: PropTypes.func.isRequired,
  differData: PropTypes.array.isRequired,
  setDifferData: PropTypes.func.isRequired,
  updatedData: PropTypes.array.isRequired,
  setUpdatedData: PropTypes.func.isRequired,
};

export default EditSection;

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
  // setRetrieveAfterSave,
}) => {
  const { name, userToken, setUnsavedChanges } = useContext(ResearchContext);
  const classes = useStyles();

  const [editRow, setEditRow] = useState("");
  const [editValue, setEditValue] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // updated data to snd database
  const [updatedData, setUpdatedData] = useState([]);
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

    setTimeout(() => {
      if (selectedItems.length > 0) {
        const updatedSelectedRows = selectedItems.map((row) => ({
          ...row,
          reporting_tone: reportingTone || row.reporting_tone,
          reporting_subject: subject || row.reporting_subject,
          subcategory: category || row.subcategory,
          m_prom: prominence || row.m_prom,
          space:
            (
              prominenceInNumber *
              Number(editValue ? Number(editValue) : row.header_space)
            ).toFixed(2) || row.space,
          detail_summary:
            (editRow === "detail_summary" && editValue) || row.detail_summary,
          headline: (editRow === "headline" && editValue) || row.headline,
          head_summary:
            (editRow === "headsummary" && editValue) || row.head_summary,
          author: (editRow === "author_name" && editValue) || row.author,
          keyword: (editRow === "keyword" && editValue) || row.keyword,
          remark: (editRow === "remarks" && editValue) || row.remark,
          header_space:
            (editRow === "header_space" && editValue) || row.header_space,
        }));

        const updatedTableData = qc2PrintTableData.map((row) => {
          const updatedRow = updatedSelectedRows.find(
            (selectedRow) =>
              selectedRow.article_id === row.article_id &&
              selectedRow.company_id === row.company_id
          );
          return updatedRow || row;
        });

        // Update only the items that exist in selectedRowData in both searchedData and tableData
        const updatedSearchedData = searchedData.map((row) => {
          const updatedRow = updatedSelectedRows.find(
            (selectedRow) =>
              selectedRow.article_id === row.article_id &&
              selectedRow.company_id === row.company_id
          );
          return updatedRow || row;
        });

        setUpdatedData(updatedSelectedRows);
        // hightlight purpose(setHighlightUPdatedRows)
        setHighlightRows((prev) => [...prev, ...updatedSelectedRows]);

        setQc2PrintTableData(updatedTableData);
        setSearchedData(updatedSearchedData);
        setUnsavedChanges(true);
      }
      setApplyLoading(false);
      setSelectedItems([]);
      setReportingTone("");
      setProminence("");
      setSubject("");
      setCategory("");
    }, 0);
  };
  const handleSave = async () => {
    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 19).replace("T", " ");
    const userName = name;
    const dataToSending = updatedData.map((row) => ({
      ARTICLEID: row.article_id,
      COMPANYID: row.company_id,
      DETAILSUMMARY: row.detail_summary,
      KEYWORD: row.keyword,
      MODIFIEDBY: userName,
      MODIFIEDON: formattedDate,
      PROMINENCE: row.m_prom,
      REPORTINGSUBJECT: row.reporting_subject,
      REPORTINGTONE: row.reporting_tone,
      SOCIALFEEDID: row.social_feed_id,
      SUBCATEGORY: row.sub_category,
      HEADLINE: row.headline,
      HEADSUMMARY: row.head_summary,
      AUTHOR: row.author,
      REMARKS: row.remark,
      TOTALSPACE: row.space,
    }));

    const invalidRows = updatedData.filter((row) =>
      ["reporting_tone", "m_prom", "reporting_subject"].some(
        (field) => row[field] === "Unknown"
      )
    );

    if (invalidRows.length > 0) {
      toast.warning(
        "Some rows have null values in reporting_tone, manual_prominence, or subject."
      );
      return;
    }
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
        res.statusText === "OK" && toast.success("Row Updated");
        const updatedTableData = qc2PrintTableData.filter(
          (row) =>
            !updatedData.some(
              (updatedRow) =>
                updatedRow.article_id === row.article_id &&
                updatedRow.company_id === row.company_id
            )
        );
        setQc2PrintTableData(updatedTableData);
        setSelectedItems([]);
        setHighlightRows([]);
        setSaveLoading(false);
        setSearchedData([]);
        setUnsavedChanges(false);
        // setRetrieveAfterSave((prev) => !prev);
        setUpdatedData([]);
      } else {
        toast.warning("No Data to Save.");
      }
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
  setHighlightRows: PropTypes.func.isRequired,
  setRetrieveAfterSave: PropTypes.func.isRequired,
};

export default EditSection;

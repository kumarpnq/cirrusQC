import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  TableHead,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

// ** custom imports
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";
import CustomButton from "../../../@core/CustomButton";
import useProtectedRequest from "../../../hooks/useProtectedRequest";

// ** third party imports
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";
import { convertKeys } from "../../../constants/convertKeys";
import DebounceSearchCompany from "../../../@core/DebounceSearchCompany";

const SecondSection = (props) => {
  const userToken = localStorage.getItem("user");
  const { selectedClient, selectedArticle } = props;
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [tagData, setTagData] = useState([]);
  const [tagDataLoading, setTagDataLoading] = useState(false);
  const [fetchTagDataAfterChange, setFetchTagDataAfterChange] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [editableTagData, setEditableTagData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [manuallyAddedCompanies, setManuallyAddedCompanies] = useState([]);

  const [storedData, setStoredData] = useState({});

  const articleId = !!selectedArticle && selectedArticle?.article_id;

  useEffect(() => {
    const fetchTagDetails = async () => {
      try {
        setTagDataLoading(true);
        const headers = { Authorization: `Bearer ${userToken}` };
        const res = await axios.get(
          `${url}articletagdetails/?article_id=${articleId}`,
          { headers }
        );
        setTagData(res.data.article_details);
        setTagDataLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setFetchTagDataAfterChange(false);
      }
    };
    fetchTagDetails();
  }, [fetchTagDataAfterChange, userToken, articleId]);

  const { data: tones } = useFetchData(`${url}reportingtonelist`);
  const reportingTones = tones?.data?.reportingtones_list || [];

  const [subjects, setSubjects] = useState([]);

  const { data: subjectLists } = useFetchData(`${url}reportingsubjectlist`);
  useEffect(() => {
    if (subjectLists.data) {
      setSubjects(subjectLists.data.reportingsubject_list);
    }
  }, [subjectLists]);

  const { data: categoryLists } = useFetchData(`${url}subcategorylist/`);
  const categories = categoryLists?.data?.subcategory_list || [];

  const [prominences, setProminences] = useState([]);
  const { data: prominenceLists } = useFetchData(`${url}prominencelist`);
  useEffect(() => {
    if (prominenceLists.data) {
      setProminences(prominenceLists.data.prominence_list);
    }
  }, [prominenceLists]);

  useEffect(() => {
    if (tagData.length > 0) {
      setEditableTagData(tagData);
    }
  }, [tagData]);

  const handleChange = (index, key, value) => {
    const updatedRow = {
      ...editableTagData[index],
      [key]: value,
      UPDATETYPE: "U",
    };

    setEditableTagData((prevData) => {
      const newData = [...prevData];
      newData[index] = updatedRow;
      return newData;
    });

    setStoredData({
      data: updatedRow,
    });

    if (
      manuallyAddedCompanies.some(
        (row) => row.company_id === updatedRow.company_id
      )
    ) {
      setManuallyAddedCompanies((prevCompanies) => {
        const updatedCompanies = prevCompanies.map((row) =>
          row.company_id === updatedRow.company_id ? updatedRow : row
        );
        return updatedCompanies;
      });

      setModifiedRows((prevRows) => [...prevRows, updatedRow]);
    }
  };

  const handleHeaderSpaceBlur = (index) => {
    const row = editableTagData[index];
    const manualProminenceValue = parseFloat(row.manual_prominence);
    const updatedSpace = (row.header_space * manualProminenceValue).toFixed(2);
    const updatedRow = {
      ...row,
      space: parseFloat(updatedSpace),
    };
    const newData = [...editableTagData];
    newData[index] = updatedRow;
    setEditableTagData(newData);
  };

  const handleProminenceBlur = (index) => {
    const row = editableTagData[index];
    const manualProminenceValue = parseFloat(
      row.manual_prominence.match(/\d+(\.\d+)?/)[0]
    );
    const updatedSpace = (row.header_space * manualProminenceValue).toFixed(2);
    const updatedRow = {
      ...row,
      space: parseFloat(updatedSpace),
    };
    const newData = [...editableTagData];
    newData[index] = updatedRow;
    setEditableTagData(newData);
  };

  useEffect(() => {
    const changedRows =
      editableTagData.length > 0 &&
      editableTagData.filter((row, index) => {
        const originalRow = tagData[index];
        if (!originalRow) return false;
        return Object.keys(row).some((key) => row[key] !== originalRow[key]);
      });

    // Include manually added companies in modifiedRows
    const allModifiedRows = changedRows
      ? [...changedRows, ...manuallyAddedCompanies]
      : [...manuallyAddedCompanies];

    setModifiedRows(allModifiedRows);
  }, [editableTagData, tagData, manuallyAddedCompanies]);

  const handleSaveClick = async () => {
    if (!(modifiedRows.length > 0 || !!editedSingleArticle)) {
      return toast.warning("No data");
    }
    const invalidRows = modifiedRows.filter((row) =>
      [
        "reporting_tone",
        "manual_prominence",
        "reporting_subject",
        "header_space",
      ].some((field) => row[field] === null || row[field] === "Unknown")
    );

    if (invalidRows.length > 0) {
      toast.warning(
        "Some rows have null values in tone, prominence, or subject."
      );
      return;
    }

    const requestData = modifiedRows.map((obj) => convertKeys(obj));

    try {
      setSaveLoading(true);
      const headers = { Authorization: `Bearer ${userToken}` };
      if (requestData.length > 0) {
        const res = await axios.post(
          `${url}updatearticletagdetails/`,
          requestData,
          { headers }
        );

        if (res.data) {
          toast.success("Successfully saved changes!");
          setFetchTagDataAfterChange(true);
        }
      }

      setSaveLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setSaveLoading(false);
    }
  };

  const handleAddCompanies = async () => {
    const rowData = editableTagData.length > 0 && editableTagData[0];
    if (selectedCompany) {
      try {
        const header = {
          Authorization: `Bearer ${userToken}`,
        };
        const requestData = [
          {
            ARTICLEID: rowData.article_id,
            COMPANYID: selectedCompany.value,
            COMPANYNAME: selectedCompany.title,
            MANUALPROMINENCE: rowData.manual_prominence,
            HEADERSPACE: rowData.header_space,
            SPACE: rowData.space,
            REPORTINGTONE: rowData.reporting_tone,
            REPORTINGSUBJECT: rowData.reporting_subject,
            SUBCATEGORY: rowData.subcategory,
            KEYWORD: rowData.keyword,
            QC2REMARK: rowData.qc2_remark,
            DETAILSUMMARY: rowData.detail_summary,
          },
        ];
        const response = await axios.post(
          `${url}insertarticledetails/`,
          requestData,
          {
            headers: header,
          }
        );
        const successOrError =
          (response.data.result.success.length && "company added") ||
          (response.data.result.errors.length && "something went wrong");

        if (successOrError === "company added") {
          toast.success(successOrError);
          setFetchTagDataAfterChange(true);
        } else if (successOrError === "something went wrong") {
          toast.warning(successOrError);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    } else {
      toast.warning("No company Selected");
    }
  };

  const handleCheckboxChange = (row) => {
    // Check if the row is already in checkedRows
    const index = checkedRows.findIndex(
      (checkedRow) => checkedRow.company_id === row.company_id
    );
    if (index !== -1) {
      // If the row is already checked, remove it
      const updatedCheckedRows = [...checkedRows];
      updatedCheckedRows.splice(index, 1);
      setCheckedRows(updatedCheckedRows);
    } else {
      // If the row is not checked, add it
      setCheckedRows([...checkedRows, row]);
    }
  };

  // delete states
  const [password, setPassword] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { loading, error, data, makeRequest } = useProtectedRequest(
    userToken,
    "updatearticletagdetails/"
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const requestData = checkedRows.map((item) => ({
    UPDATETYPE: "D",
    ARTICLEID: item.article_id,
    COMPANYID: item.company_id,
  }));

  const userVerification = async () => {
    try {
      setVerificationLoading(true);
      const headers = { Authorization: `Bearer ${userToken}` };
      const data = { password };
      const response = await axios.post(`${url}isValidUser/`, data, {
        headers,
      });
      setVerificationLoading(false);
      return response.data.valid_user;
    } catch (error) {
      toast.error(error.message);
      setVerificationLoading(false);
    }
  };

  const handleDelete = async () => {
    const isValid = await userVerification();
    isValid && (await makeRequest(requestData));
    if (!isValid) {
      return toast.error("Password not match with records");
    }

    if (error) {
      toast.error("An error occurred while deleting the articles.");
    } else {
      toast.success("Article deleted successfully.");
      setOpen(false);
      setPassword("");
      setFetchTagDataAfterChange(true);
      setCheckedRows([]);
    }
  };
  const handleCopy = () => {
    const copiedData = editableTagData.map((row) => {
      const updatedRow = { ...row };
      for (const key in storedData.data) {
        if (key !== "space" && key !== "company_id" && key !== "company_name") {
          // Exclude company_id
          updatedRow[key] = storedData.data[key];
        }
      }
      const manualProminenceValue = parseFloat(
        updatedRow.manual_prominence?.match(/\d+(\.\d+)?/)?.[0] || "0"
      );

      updatedRow.space = Number(
        (updatedRow.header_space * manualProminenceValue).toFixed(2)
      );

      return updatedRow;
    });
    setEditableTagData(copiedData);
    setStoredData({});
  };

  return (
    <div className="px-2 mt-2 border border-black">
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {/* <DebounceSearch
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        /> */}
        <DebounceSearchCompany setSelectedCompany={setSelectedCompany} />
        <button
          onClick={handleAddCompanies}
          className="px-6 text-white uppercase rounded-md bg-primary"
          style={{ fontSize: "0.8em" }}
        >
          Add
        </button>
        {!!checkedRows.length && (
          <button
            onClick={handleClickOpen}
            className="px-6 text-white uppercase bg-red-500 rounded-md"
            style={{ fontSize: "0.8em" }}
          >
            Delete
          </button>
        )}
        {saveLoading ? (
          <CircularProgress />
        ) : (
          <button
            onClick={handleSaveClick}
            className="px-6 text-white uppercase rounded-md bg-primary"
            style={{ fontSize: "0.8em" }}
          >
            Save
          </button>
        )}
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        component={"div"}
      >
        <Typography sx={{ fontSize: "0.9em", my: 1 }}>
          ClientName: {selectedClient ? selectedClient : "No client selected"}
        </Typography>
        <button
          className="px-6 text-white uppercase rounded-md bg-primary"
          style={{ fontSize: "0.8em" }}
          onClick={handleCopy}
        >
          Copy
        </button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table sx={{ overflow: "scroll" }} aria-label="simple table">
          <TableHead
            sx={{ position: "sticky", top: 0, zIndex: 10, color: "white" }}
            className="bg-primary"
          >
            <TableRow sx={{ fontSize: "0.8em" }}>
              <TableCell sx={{ color: "white" }}>CompanyName</TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Subject
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                HeaderSpace
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Prominence
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Space
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Tone
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Delete
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                SubCategory
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Remarks
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tagDataLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              editableTagData?.map((row, index) => (
                <TableRow
                  key={row.company_id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell sx={{ fontSize: "0.8em" }} size="small">
                    {row.company_name}
                  </TableCell>
                  <TableCell size="small" sx={{ fontSize: "0.9em" }}>
                    <select
                      value={row.reporting_subject}
                      onChange={(e) =>
                        handleChange(index, "reporting_subject", e.target.value)
                      }
                      className="border border-black w-28"
                    >
                      <option value={null}>select</option>
                      {subjects.map((subject) => (
                        <option
                          value={subject}
                          key={subject + Math.random(0, 100)}
                        >
                          {subject}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell size="small">
                    <input
                      className="border border-black outline-none w-14"
                      value={row.header_space}
                      type="number"
                      onBlur={() => handleHeaderSpaceBlur(index)}
                      onChange={(e) =>
                        handleChange(index, "header_space", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell
                    size="small"
                    onClick={() => handleProminenceBlur(index)}
                  >
                    <select
                      value={row.manual_prominence}
                      onChange={(e) => {
                        handleChange(
                          index,
                          "manual_prominence",
                          e.target.value
                        );
                      }}
                      className="border border-black w-28"
                    >
                      <option value={null}>select</option>
                      {prominences.map((item, index) => (
                        <option
                          value={item.prominence}
                          key={item.prominence + String(index)}
                        >
                          {item.prominence}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell size="small">
                    <input
                      type="number"
                      value={row.space}
                      onChange={(e) =>
                        handleChange(index, "space", e.target.value)
                      }
                      disabled
                      className="border border-black outline-none w-14"
                    />
                  </TableCell>
                  <TableCell size="small">
                    <select
                      value={row.reporting_tone}
                      onChange={(e) =>
                        handleChange(index, "reporting_tone", e.target.value)
                      }
                      className="border border-black w-28"
                    >
                      <option value={null}>select</option>
                      {reportingTones.map((tone, index) => (
                        <option
                          value={tone.tonality}
                          key={tone.tonality + String(index)}
                        >
                          {tone.tonality}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell size="small">
                    <Checkbox
                      checked={checkedRows.some(
                        (checkedRow) => checkedRow.company_id === row.company_id
                      )}
                      onChange={() => handleCheckboxChange(row)}
                    />
                  </TableCell>
                  <TableCell size="small">
                    <select
                      value={row.subcategory}
                      onChange={(e) =>
                        handleChange(index, "subcategory", e.target.value)
                      }
                      className="border border-black w-28"
                    >
                      <option value={null}>select</option>
                      {categories.map((cate, index) => (
                        <option value={cate} key={cate + String(index)}>
                          {cate}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell size="small">
                    <input
                      type="text"
                      className="border border-black outline-none w-14"
                      value={row.qc2_remark}
                      onChange={(e) =>
                        handleChange(index, "qc2_remark", e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle fontSize={"1em"}>
            Enter Password For Confirmation.
          </DialogTitle>
          <DialogContent>
            <TextField
              type="password"
              sx={{ outline: "none" }}
              size="small"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <CustomButton
              btnText="Cancel"
              onClick={handleClose}
              bg={"bg-primary"}
            />
            {verificationLoading ? (
              <CircularProgress />
            ) : (
              <CustomButton
                btnText="Delete"
                onClick={handleDelete}
                bg={"bg-red-500"}
              />
            )}
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

SecondSection.propTypes = {
  selectedClient: PropTypes.string.isRequired,
  selectedArticle: PropTypes.array.isRequired,
};
export default SecondSection;

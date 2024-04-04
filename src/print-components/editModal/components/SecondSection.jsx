import { useContext, useEffect, useState } from "react";
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
import DebounceSearch from "../../dropdowns/DebounceSearch";
import { ResearchContext } from "../../../context/ContextProvider";
import CustomButton from "../../../@core/CustomButton";
import useProtectedRequest from "../../../hooks/useProtectedRequest";

// ** third party imports
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";

const SecondSection = (props) => {
  const { selectedClient, selectedArticle, editedSingleArticle } = props;
  const { userToken } = useContext(ResearchContext);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [tagData, setTagData] = useState([]);
  const [tagDataLoading, setTagDataLoading] = useState(false);
  const [fetchTagDataAfterChange, setFetchTagDataAfterChange] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [editableTagData, setEditableTagData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [manuallyAddedCompanies, setManuallyAddedCompanies] = useState([]);

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
        setFetchTagDataAfterChange(false);
      } catch (error) {
        console.log(error);
        setFetchTagDataAfterChange(false);
      }
    };
    fetchTagDetails();
  }, [fetchTagDataAfterChange, articleId, userToken]);

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

  useEffect(() => {
    if (tagData.length > 0) {
      setEditableTagData(tagData);
    }
  }, [tagData]);

  const handleChange = (index, key, value) => {
    const updatedRow = {
      ...editableTagData[index],
      [key]: value,
      UPDATETYPE: "U", // Mark as updated
    };
    const newData = [...editableTagData];
    newData[index] = updatedRow;
    setEditableTagData(newData);

    // If the edited row is a manually added company, mark it as modified
    if (
      manuallyAddedCompanies.some(
        (row) => row.company_id === updatedRow.company_id
      )
    ) {
      // Update the modified row in manuallyAddedCompanies
      const updatedManuallyAddedCompanies = manuallyAddedCompanies.map((row) =>
        row.company_id === updatedRow.company_id ? updatedRow : row
      );
      setManuallyAddedCompanies(updatedManuallyAddedCompanies);

      // Update modifiedRows to include the edited row
      setModifiedRows((prev) => [...prev, updatedRow]);
    }
  };

  const handleHeaderSpaceBlur = (index) => {
    const spaceValue = Math.round(
      editableTagData[index].header_space *
        editableTagData[index].manual_prominence
    );
    const updatedRow = { ...editableTagData[index], space: spaceValue };
    const newData = [...editableTagData];
    newData[index] = updatedRow;
    setEditableTagData(newData);
  };

  const handleProminenceBlur = (index) => {
    const spaceValue = Math.round(
      editableTagData[index].header_space *
        editableTagData[index].manual_prominence
    );
    const updatedRow = { ...editableTagData[index], space: spaceValue };
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

  // for modification keys to uppercase
  const convertKeys = (obj) => {
    const newObj = {};
    for (let key in obj) {
      const newKey = key.replace(/_/g, "").toUpperCase();
      newObj[newKey] = obj[key];
    }
    return newObj;
  };
  const handleSaveClick = async () => {
    if (modifiedRows.length < 0) {
      return toast.warning("No changes in the rows.");
    }
    try {
      setSaveLoading(true);
      const data = editedSingleArticle;
      const requestData = modifiedRows.map((obj) => convertKeys(obj));
      console.log(data);
      const headers = { Authorization: `Bearer ${userToken}` };
      const res = await axios.post(
        `${url}updatearticletagdetails/`,
        requestData,
        {
          headers,
        }
      );
      const resp = await axios.post(`${url}updatearticleheader/`, data, {
        headers,
      });
      if (res.data || resp.data) {
        toast.success("Successfully saved changes!");
      }
      setFetchTagDataAfterChange(true);
      setSaveLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddCompany = () => {
    if (selectedCompany) {
      const newRow =
        editableTagData.length > 0 ? { ...editableTagData[0] } : {};
      newRow.company_name = selectedCompany.label;
      newRow.company_id = selectedCompany.value;
      [newRow.update_type] = "I"; // Mark as inserted

      setEditableTagData((prev) => [...prev, newRow]);

      setTagData((prev) => [...prev, newRow]);

      setManuallyAddedCompanies((prev) => [...prev, newRow]);
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
  const { loading, error, data, makeRequest } = useProtectedRequest(userToken);
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
      console.log("Error:", error.message);
    }
  };

  const handleDelete = async () => {
    const isValid = await userVerification();
    isValid && (await makeRequest(requestData));
    console.log(requestData);
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

  return (
    <div className="px-2 mt-2 border border-black">
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <DebounceSearch
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />

        <button
          onClick={handleAddCompany}
          className="px-6 text-white uppercase rounded-md bg-primary"
          style={{ fontSize: "0.8em" }}
        >
          Add company
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
      <Typography sx={{ fontSize: "0.9em" }}>
        ClientName: {selectedClient ? selectedClient : "No client selected"}
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table sx={{ overflow: "scroll" }} aria-label="simple table">
          <TableHead
            sx={{ position: "sticky", top: 0, zIndex: 50, color: "white" }}
            className="bg-primary"
          >
            <TableRow sx={{ fontSize: "0.8em" }}>
              <TableCell>CompanyName</TableCell>
              <TableCell size="small">Subject</TableCell>
              <TableCell size="small">HeaderSpace</TableCell>
              <TableCell size="small">Prominence</TableCell>
              <TableCell size="small">Space</TableCell>
              <TableCell size="small">Tone</TableCell>
              <TableCell size="small">Delete</TableCell>
              <TableCell size="small">SubCategory</TableCell>
              <TableCell size="small">Remarks</TableCell>
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
                      value={row.subject}
                      onChange={(e) =>
                        handleChange(index, "subject", e.target.value)
                      }
                      className="border border-black w-28"
                    >
                      {subjects.map((subject, index) => (
                        <option value={subject} key={subject + String(index)}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell size="small">
                    <input
                      className="border border-black outline-none w-14"
                      value={row.header_space}
                      onBlur={() => handleHeaderSpaceBlur(index)}
                      onChange={(e) =>
                        handleChange(index, "header_space", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell size="small">
                    <input
                      className="border border-black outline-none w-14"
                      value={row.manual_prominence}
                      onBlur={() => handleProminenceBlur(index)}
                      onChange={(e) =>
                        handleChange(index, "manual_prominence", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell size="small">
                    <div className="border border-black w-14 h-5">
                      {row.space}
                    </div>
                  </TableCell>
                  <TableCell size="small">
                    <select
                      value={row.tone}
                      onChange={(e) =>
                        handleChange(index, "reporting_tone", e.target.value)
                      }
                      className="border border-black w-28"
                    >
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
                        handleChange(index, "remarks", e.target.value)
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
  editedSingleArticle: PropTypes.array.isRequired,
};
export default SecondSection;

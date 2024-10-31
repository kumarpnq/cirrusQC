import { useEffect, useState } from "react";
import {
  Card,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import PropTypes from "prop-types";

import useProtectedRequest from "../../hooks/useProtectedRequest";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";
import CustomButton from "../../@core/CustomButton";
import DebounceSearchCompany from "../../@core/DebounceSearchCompany";
import Button from "../../components/custom/Button";

const ClientSection = ({
  selectedArticle,
  userToken,
  tableData,
  setTableData,
  // * cleared states
  tableDataList,
  editableTagData,
  setEditableTagData,
  modifiedRows,
  setModifiedRows,
  fetchData,
  tableDataLoading,
}) => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { loading, error, data, makeRequest } = useProtectedRequest(
    userToken,
    "updatesocialfeedtagdetails/"
  );
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [subjects, setSubjects] = useState([]);

  const { data: subjectLists } = useFetchData(`${url}reportingsubjectlist`);
  useEffect(() => {
    if (subjectLists.data) {
      setSubjects(subjectLists.data.reportingsubject_list);
    }
  }, [subjectLists]);
  const [prominences, setProminences] = useState([]);
  const { data: prominenceLists } = useFetchData(`${url}prominencelist`);
  useEffect(() => {
    if (prominenceLists.data) {
      setProminences(prominenceLists.data.prominence_list);
    }
  }, [prominenceLists]);

  useEffect(() => {
    if (tableDataList.length > 0) {
      setEditableTagData(tableDataList);
    }
  }, [tableDataList]);

  const { data: tones } = useFetchData(`${url}reportingtonelist`);
  const reportingTones = tones?.data?.reportingtones_list || [];

  const handleChange = (index, key, value) => {
    const updatedRow = {
      ...editableTagData[index],
      [key]: value,
      update_type: "U",
    };

    setEditableTagData((prevData) => {
      const newData = [...prevData];
      newData[index] = updatedRow;
      return newData;
    });

    setModifiedRows((prevRows) => {
      const existingIndex = prevRows.findIndex(
        (row) => row.company_id === updatedRow.company_id
      );
      if (existingIndex >= 0) {
        const newRows = [...prevRows];
        newRows[existingIndex] = {
          ...newRows[existingIndex],
          [key]: value,
        };
        return newRows;
      } else {
        return [...prevRows, updatedRow];
      }
    });
  };

  const handleAddCompanies = async () => {
    if (selectedCompany) {
      try {
        const header = {
          Authorization: `Bearer ${userToken}`,
        };
        const requestData = {
          data: [
            {
              updateType: "I",
              socialFeedId: selectedArticle?.social_feed_id,
              companyId: selectedCompany?.value,
              companyName: selectedCompany?.label,
              keyword: null,
              // AUTHOR: rowData.author,
              reportingTone: null,
              reportingSubject: null,
              subcategory: null,
              prominence: null,
              summary: null,
              qc2Remark: null,
            },
          ],
          qcType: "QC2",
        };

        const response = await axios.post(
          `${url}updatesocialfeedtagdetails/`,
          requestData,
          {
            headers: header,
          }
        );

        const successOrError =
          (response.data.result.success.length && "company added") ||
          (response.data.result.errors.length && "something went wrong");
        const errorMessage = response.data.result.errors
          .map((i) => i.error)
          .join(", ");
        if (successOrError === "company added") {
          toast.success(successOrError);
          fetchData();
        } else if (successOrError === "something went wrong") {
          toast.warning(errorMessage);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.warning("No company Selected");
    }
  };

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
  const [selectedRowForDelete, setSelectedRowForDelete] = useState(null);
  const handleDeleteClick = (rowData) => {
    setSelectedRowForDelete(rowData);
    setOpen(true);
  };

  const handleDelete = async () => {
    const isValid = await userVerification();
    const requestData = {
      data: [
        {
          updateType: "D",
          socialFeedId: selectedRowForDelete.socialfeed_id,
          companyId: selectedRowForDelete.company_id,
          companyName: selectedRowForDelete.company_name,
        },
      ],
      qcflag: 1,
    };

    isValid && (await makeRequest(requestData));
    if (!isValid) {
      return toast.error("Password not match with records");
    }
    if (error) {
      toast.error("An error occurred while deleting the articles.");
    } else {
      toast.success("Article deleted successfully.");

      setOpen(false);
      fetchData();
      setPassword("");
      setEditableTagData([]);
      // setFetchTagDataAfterChange(true);
      setSelectedRowForDelete(null);
      // setFetchAfterSave(true);
    }
  };

  // * loading state for save
  const [saveLoading, setSaveLoading] = useState(false);
  const handleSave = async () => {
    if (modifiedRows.length < 0) {
      return toast.warning("No data");
    }

    const invalidRows = modifiedRows.filter((row) =>
      [
        "reporting_tone",
        "prominence",
        "reporting_subject",
        // "header_space",
      ].some((field) => row[field] === null || row[field] === "Unknown")
    );
    if (invalidRows.length > 0) {
      toast.warning(
        "Some rows have null values in tone, prominence, or subject."
      );
      return;
    }
    try {
      setSaveLoading(true);
      const requestData = modifiedRows.map((obj) => ({
        socialFeedId: obj.socialfeed_id,
        companyId: obj.company_id,
        companyName: obj.company_name,
        prominence: obj.prominence,
        reportingTone: obj.reporting_tone,
        reportingSubject: obj.reporting_subject,
        subcategory: obj.subcategory,
        keyword: obj.keyword,
        remarks: obj.remarks,
        detailSummary: obj.detailSummary,
        updateType: obj.update_type,
      }));

      const dataToSend = { data: requestData, qcflag: 1 };
      const headers = { Authorization: `Bearer ${userToken}` };
      const response = await axios.post(
        `${url}updatesocialfeedtagdetails/`,
        dataToSend,
        { headers }
      );
      if (response.data.result.success.length > 0) {
        const latestRows = tableData.filter(
          (item) => selectedArticle.social_feed_id !== item.socialfeedid
        );
        fetchData();
        setTableData(latestRows);
        toast.success("Updated successfully");
        setModifiedRows([]);

        // setFetchTagDataAfterChange(true);
        // setFetchAfterSave(true);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" my={1} gap={1}>
        <Box display="flex" alignItems="center">
          <Typography sx={{ fontSize: "0.9em", mt: 1 }}>Company:</Typography>
          <div className="z-50 ml-4">
            <DebounceSearchCompany setSelectedCompany={setSelectedCompany} />
          </div>
        </Box>
        <Button btnText="Add" onClick={handleAddCompanies} />
        <Button
          btnText={saveLoading ? "saving" : "save"}
          onClick={handleSave}
          isLoading={saveLoading}
        />
      </Box>
      <Card>
        <table className="w-full">
          <thead className="text-[0.9em] bg-primary text-white">
            <tr>
              <th className="text-left">Action</th>
              <th className="text-left">Company</th>
              <th className="text-left">Subject</th>
              <th className="text-left">Prominence</th>
              <th className="text-left">Tone</th>
              <th className="text-left">Summary</th>
              <th className="text-left">Remarks</th>
            </tr>
          </thead>
          <tbody className="text-[0.9em]">
            {tableDataLoading ? (
              <Box width={200}>
                <CircularProgress />
              </Box>
            ) : (
              editableTagData.map((item, index) => (
                <tr
                  key={item.socialfeed_id + item.company_id}
                  className="border border-gray-300"
                >
                  <td
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <CloseIcon />
                  </td>
                  <td className="px-2 text-[0.9em]">{item.company_name}</td>
                  <td>
                    <select
                      value={item.reporting_subject}
                      onChange={(e) =>
                        handleChange(index, "reporting_subject", e.target.value)
                      }
                      className="px-2 border border-black w-28"
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
                  </td>
                  <td className="px-2">
                    <select
                      value={item.prominence}
                      onChange={(e) => {
                        handleChange(index, "prominence", e.target.value);
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
                  </td>
                  <td className="px-2">
                    <select
                      value={item.reporting_tone}
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
                  </td>
                  <Tooltip title={item.detail_summary}>
                    <td
                      className="px-2"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {item.detail_summary}
                    </td>
                  </Tooltip>

                  <td className="px-2">
                    <input
                      type="text"
                      className="border border-black outline-none w-14"
                      value={item.remarks}
                      onChange={(e) =>
                        handleChange(index, "qc2_remark", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
      </Card>
    </>
  );
};

ClientSection.propTypes = {
  selectedArticle: PropTypes.shape({
    social_feed_id: PropTypes.number.isRequired,
  }).isRequired,
  userToken: PropTypes.string.isRequired,
  setFetchAfterSave: PropTypes.func.isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      socialfeedid: PropTypes.number.isRequired,
      // Add other relevant fields here
    })
  ).isRequired,
  setTableData: PropTypes.func.isRequired,
  tableDataList: PropTypes.arrayOf(
    PropTypes.shape({
      socialfeed_id: PropTypes.number.isRequired,
      company_id: PropTypes.number,
      company_name: PropTypes.string,
      reporting_subject: PropTypes.string,
      prominence: PropTypes.string,
      reporting_tone: PropTypes.string,
      detail_summary: PropTypes.string,
      remarks: PropTypes.string,
    })
  ).isRequired,
  setTableDataList: PropTypes.func.isRequired,
  editableTagData: PropTypes.arrayOf(
    PropTypes.shape({
      socialfeed_id: PropTypes.number.isRequired,
      company_id: PropTypes.number,
      company_name: PropTypes.string,
      reporting_subject: PropTypes.string,
      prominence: PropTypes.string,
      reporting_tone: PropTypes.string,
      detail_summary: PropTypes.string,
      remarks: PropTypes.string,
    })
  ).isRequired,
  setEditableTagData: PropTypes.func.isRequired,
  modifiedRows: PropTypes.arrayOf(
    PropTypes.shape({
      socialfeed_id: PropTypes.number.isRequired,
      company_id: PropTypes.number,
      company_name: PropTypes.string,
      reporting_subject: PropTypes.string,
      prominence: PropTypes.string,
      reporting_tone: PropTypes.string,
      detail_summary: PropTypes.string,
      remarks: PropTypes.string,
      UPDATETYPE: PropTypes.string.isRequired,
    })
  ).isRequired,
  setModifiedRows: PropTypes.func.isRequired,
  fetchData: PropTypes.func,
  tableDataLoading: PropTypes.bool,
};

export default ClientSection;

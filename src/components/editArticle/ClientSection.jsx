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
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";
import { toast } from "react-toastify";
import useProtectedRequest from "../../hooks/useProtectedRequest";
import CustomButton from "../../@core/CustomButton";
import Button from "../custom/Button";
import PropTypes from "prop-types";
import CustomMultiSelect from "../../@core/CustomMultiSelect";

const ClientSection = ({ selectedArticle, selectedClient }) => {
  const userToken = localStorage.getItem("user");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [tableDataList, setTableDataList] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [editableTagData, setEditableTagData] = useState([]);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [fetchTagDataAfterChange, setFetchTagDataAfterChange] = useState(false);
  const [modifiedRows, setModifiedRows] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const { loading, error, data, makeRequest } = useProtectedRequest(
    userToken,
    "updatesocialfeedtagdetails/"
  );
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTableDataLoading(true);
        const headers = {
          Authorization: `Bearer ${userToken}`,
        };
        const params = {
          socialfeed_id: selectedArticle.social_feed_id,
          clientId: selectedClient,
        };
        const response = await axios.get(`${url}socialfeedtagdetails/`, {
          headers: headers,
          params,
        });
        setTableDataList(response.data.socialfeed_details);
        setTableDataLoading(false);
        setFetchTagDataAfterChange(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userToken, selectedArticle, fetchTagDataAfterChange]);
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

  const { data: tones } = useFetchData(`${url}reportingtonelist`);
  const reportingTones = tones?.data?.reportingtones_list || [];

  const { data: companyData } = useFetchData(
    `${url}companylist/${selectedClient}`
  );

  const companies = companyData?.data?.companies || [];

  useEffect(() => {
    if (tableDataList.length > 0) {
      setEditableTagData(tableDataList);
    }
  }, [tableDataList]);

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
    const rowData = editableTagData.length > 0 && editableTagData[0];
    if (selectedCompany) {
      try {
        const header = {
          Authorization: `Bearer ${userToken}`,
        };
        const requestData = selectedCompanies.map((item) => ({
          updateType: "I",
          socialFeedId: rowData.socialfeed_id,
          companyId: item.value,
          companyName: item.label,
          keyword: rowData.keyword,
          // AUTHOR: rowData.author,
          reportingTone: rowData.reporting_tone,
          reportingSubject: rowData.reporting_subject,
          subCategory: rowData.subcategory,
          prominence: rowData.prominence,
          summary: rowData.detail_summary,
          qc2Remark: rowData.remarks,
        }));

        const data = { data: requestData, qcType: "QC2" };
        const response = await axios.post(
          `${url}updatesocialfeedtagdetails/`,
          data,
          {
            headers: header,
          }
        );

        const successOrError =
          (response.data.result.success.length && "company added") ||
          (response.data.result.errors.length && "something went wrong");

        if (successOrError === "company added") {
          toast.success(successOrError);
          setSelectedCompanies([]);
          setSelectedCompanies([]);
          setFetchTagDataAfterChange(true);
        } else if (successOrError === "something went wrong") {
          toast.warning(successOrError);
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
    const requestData = [
      {
        updateType: "D",
        socialFeedId: selectedRowForDelete.socialfeed_id,
        companyId: selectedRowForDelete.company_id,
      },
    ];
    const data = { data: requestData, qcType: "QC2" };
    isValid && (await makeRequest(data));
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
      setSelectedRowForDelete(null);
    }
  };

  // * loading state
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

      const headers = { Authorization: `Bearer ${userToken}` };
      const data = { data: requestData, qcType: "QC2" };
      const response = await axios.post(
        `${url}updatesocialfeedtagdetails/`,
        data,
        { headers }
      );

      if (response.data.result.success.length > 0) {
        toast.success("Updated successfully");
        setModifiedRows([]);
        setFetchTagDataAfterChange(true);
        setSaveLoading(false);
      } else {
        toast.error("Something went wrong");
        setSaveLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    const filtered = companies
      .filter((record) => selectedCompany.includes(record.companyid))
      .map((record) => ({
        value: record.companyid,
        label: record.companyname,
      }));

    setSelectedCompanies(filtered);
  }, [selectedCompany, companies]);

  return (
    <>
      <Box display="flex" alignItems="center" my={1} gap={1}>
        <Box display="flex" alignItems="center">
          <Typography sx={{ fontSize: "0.9em", mt: 1 }}>Company:</Typography>
          <div className="z-50 mt-3 ml-4">
            <CustomMultiSelect
              dropdownToggleWidth={300}
              dropdownWidth={300}
              keyId="companyid"
              keyName="companyname"
              options={companies}
              selectedItems={selectedCompany}
              setSelectedItems={setSelectedCompany}
              title="Company"
            />
          </div>
        </Box>
        <Button btnText="Add" onClick={handleAddCompanies} />
        <Button
          btnText={saveLoading ? "Loading" : "Save"}
          onClick={handleSave}
          isLoading={saveLoading}
        />
      </Box>
      <Card>
        <table>
          <thead className="text-[0.9em] bg-primary text-white h-[600] overflow-y-scroll">
            <tr>
              <th>Action</th>
              <th>Company</th>
              <th>Subject</th>
              <th>Prominence</th>
              <th>Tone</th>
              <th>Summary</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody className="text-[0.8em]">
            {tableDataLoading ? (
              <Box width={200}>
                <CircularProgress />
              </Box>
            ) : (
              editableTagData.map((item, index) => (
                <tr
                  key={item.socialfeed_id + item.company_id}
                  className={`border border-gray-300 ${
                    "qc3-" + item.qc3_status
                  }`}
                >
                  <td
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <CloseIcon />
                  </td>
                  <td className="text-[0.9em]">{item.company_name}</td>
                  <td className="px-1">
                    <select
                      value={item.reporting_subject}
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
                  </td>
                  <td className="px-1">
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
                  <td className="px-1">
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
                      className="mx-2"
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

                  <td className="px-1">
                    <input
                      type="text"
                      className="border border-black outline-none w-14"
                      value={item.remarks}
                      onChange={(e) =>
                        handleChange(index, "remarks", e.target.value)
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
              <Box width={140} textAlign={"center"}>
                {verificationLoading ? (
                  <CircularProgress size={"1.5em"} />
                ) : (
                  <CustomButton
                    btnText="Delete"
                    onClick={handleDelete}
                    bg={"bg-red-500"}
                  />
                )}
              </Box>
            </DialogActions>
          </Dialog>
        </div>
      </Card>
    </>
  );
};

ClientSection.propTypes = {
  selectedArticle: PropTypes.object.isRequired,
  userToken: PropTypes.string.isRequired,
  selectedClient: PropTypes.string,
};

export default ClientSection;

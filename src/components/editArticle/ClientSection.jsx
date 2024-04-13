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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";
import { toast } from "react-toastify";
import useProtectedRequest from "../../hooks/useProtectedRequest";
import CustomButton from "../../@core/CustomButton";

const ClientSection = ({ selectedArticle, userToken, selectedCompany }) => {
  const [tableDataList, setTableDataList] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [editableTagData, setEditableTagData] = useState([]);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [fetchTagDataAfterChange, setFetchTagDataAfterChange] = useState(false);
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

        const response = await axios.get(
          `${url}socialfeedtagdetails/?socialfeed_id=${selectedArticle.social_feed_id}`,
          {
            headers: headers,
          }
        );
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

  useEffect(() => {
    if (tableDataList.length > 0) {
      setEditableTagData(tableDataList);
    }
  }, [tableDataList]);

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
          //   setFetchTagDataAfterChange(true);
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
        UPDATETYPE: "D",
        SOCIALFEEDID: selectedRowForDelete.socialfeed_id,
        COMPANYID: selectedRowForDelete.company_id,
      },
    ];
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
      setSelectedRowForDelete(null);
    }
  };
  return (
    <Card>
      <table>
        <thead className="text-[0.9em] bg-primary text-white">
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
                <td>{item.company_name}</td>
                <td>
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
                <td>
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
                <td>
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

                <td>
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
  );
};

export default ClientSection;

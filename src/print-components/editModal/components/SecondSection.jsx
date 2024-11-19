import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";

// ** custom imports
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";
import CustomButton from "../../../@core/CustomButton";
import useProtectedRequest from "../../../hooks/useProtectedRequest";
import CheckIcon from "@mui/icons-material/Check";

// ** third party imports
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";
import { convertKeys } from "../../../constants/convertKeys";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import StoreIcon from "@mui/icons-material/Store";
import AcceptCompany from "../../../components/editArticle/AcceptCompany";
import MapExtraModal from "../../../components/editArticle/MapExtraModal";
import axiosInstance from "../../../../axiosConfigOra";

const SecondSection = (props) => {
  const userToken = localStorage.getItem("user");
  const { selectedClient, selectedArticle } = props;
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [tagData, setTagData] = useState([]);
  const [tagDataLoading, setTagDataLoading] = useState(false);
  const [fetchTagDataAfterChange, setFetchTagDataAfterChange] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [editableTagData, setEditableTagData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [manuallyAddedCompanies, setManuallyAddedCompanies] = useState([]);
  // const [selectedQc3Companies,setSelectedQc3Companies] = useState([])
  const [openMapExtra, setOpenMapExtra] = useState(false);

  const [storedData, setStoredData] = useState({});
  const [openAcceptCompany, setOpenAcceptCompany] = useState(false);
  const [selectedRowForAccept, setSelectedRowForAccept] = useState(null);

  const articleId = !!selectedArticle && selectedArticle?.article_id;

  useEffect(() => {
    const fetchTagDetails = async () => {
      try {
        setTagDataLoading(true);
        const headers = { Authorization: `Bearer ${userToken}` };
        const params = {
          article_id: articleId,
          client_id: selectedClient?.clientId,
        };
        const res = await axios.get(`${url}getArticleAutoTagDetails/`, {
          headers,
          params,
        });

        const order = ["Y", "Z", "P", "Q", "R", "N", "E"];
        let apiData = res.data.article_details || [];
        const sortedData = apiData.sort((a, b) => {
          const statusA = a.qc3_status;
          const statusB = b.qc3_status;

          const indexA = order.indexOf(statusA);
          const indexB = order.indexOf(statusB);

          if (indexA === -1) return 1;
          if (indexB === -1) return -1;

          return indexA - indexB;
        });
        setTagData(sortedData);
        setTagDataLoading(false);
      } catch (error) {
        console.log(error.message);
      } finally {
        setFetchTagDataAfterChange(false);
      }
    };
    fetchTagDetails();
  }, [fetchTagDataAfterChange, userToken, articleId, selectedClient]);

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

  const { data: companyData } = useFetchData(
    `${url}companylist/${selectedClient?.clientId}`
  );

  const companies = companyData?.data?.companies || [];

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
        (row) =>
          row.company_id === updatedRow.company_id &&
          row.article_id === updatedRow.article_id
      )
    ) {
      setManuallyAddedCompanies((prevCompanies) => {
        const updatedCompanies = prevCompanies.map((row) =>
          row.company_id === updatedRow.company_id &&
          row.article_id === updatedRow.article_id
            ? updatedRow
            : row
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
    if (!(modifiedRows.length > 0)) {
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

    const camelCaseData = requestData.map((i) => ({
      articleId: i.articleId,
      companyId: i.companyId,
      companyName: i.companyName,
      manualProminence: i.manualProminence,
      headerSpace: i.headerSpace,
      space: i.space,
      reportingTone: i.reportingTone,
      reportingSubject: i.reportingSubject,
      subcategory: i.subcategory,
      keyword: i.keyword,
      qc2Remark: i.qc2Remark,
      detailSummary: i.detailSummary,
      updateType: i.updatetype || "U",
      qc3Status: i.qc3Status,
    }));

    const data_send = {
      data: camelCaseData,
      qcType: "QC2",
    };

    try {
      setSaveLoading(true);
      const headers = { Authorization: `Bearer ${userToken}` };
      if (requestData.length > 0) {
        const res = await axios.post(
          `${url}updateqc2articletagdetails/`,
          data_send,
          { headers }
        );

        if (res.data) {
          toast.success("Successfully saved changes!");
          setFetchTagDataAfterChange(true);
        }
      }

      setSaveLoading(false);
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
  }, [selectedCompany]);

  const handleAddCompanies = async () => {
    const rowData = editableTagData.length > 0 && editableTagData[0];

    const existingCompanyIds = editableTagData.map((item) => item.company_id);

    const uniqueCompanies = selectedCompanies.filter(
      (item) => !existingCompanyIds.includes(item.value)
    );

    const duplicates = selectedCompanies.length - uniqueCompanies.length;
    if (duplicates > 0) {
      toast.warning(`${duplicates} duplicate record(s) removed`);
    }

    if (uniqueCompanies.length === 0) {
      toast.info("No new companies to add");
      return;
    }

    if (selectedCompany) {
      try {
        const header = {
          Authorization: `Bearer ${userToken}`,
        };

        const requestData = uniqueCompanies.map((item) => ({
          articleId: rowData.article_id,
          companyId: item.value,
          companyName: item.label,
          manualProminence: rowData.manual_prominence,
          headerSpace: rowData.header_space,
          space: rowData.space,
          reportingTone: rowData.reporting_tone,
          reportingSubject: rowData.reporting_subject,
          subcategory: rowData.subcategory,
          keyword: rowData.keyword,
          qc2Remark: rowData.qc2_remark,
          detailSummary: rowData.detail_summary,
        }));

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
          setSelectedCompany([]);
          setSelectedCompanies([]);
          setSelectedCompanyId("");
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
    updateType: "D",
    articleId: item.article_id,
    companyId: item.company_id,
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
    const request_data = {
      data: requestData,
      qcType: "QC2",
    };
    isValid && (await makeRequest(request_data));
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

  // * automation changes
  // const handleAccept = (row) => {
  //   setEditableTagData((prev) =>
  //     prev.map((item) =>
  //       item.article_id === row.article_id && item.company_id === row.company_id
  //         ? { ...item, qc3_status: "Z" }
  //         : item
  //     )
  //   );

  //   setModifiedRows((prevAccepted) => {
  //     const existingIndex = prevAccepted.findIndex(
  //       (item) =>
  //         item.article_id === row.article_id &&
  //         item.company_id === row.company_id
  //     );

  //     if (existingIndex !== -1) {
  //       const updatedModifiedRows = [...prevAccepted];
  //       updatedModifiedRows[existingIndex] = {
  //         ...updatedModifiedRows[existingIndex],
  //         qc3_status: "Z",
  //         update_type: "U",
  //       };
  //       return updatedModifiedRows;
  //     } else {
  //       return [...prevAccepted, { ...row, qc3_status: "Z", update_type: "U" }];
  //     }
  //   });
  // };

  const [acceptRowId, setAcceptRowId] = useState(null);
  const handleAccept = async (row) => {
    try {
      setAcceptRowId(row.company_id);
      const requestData = [
        {
          articleId: row.article_id,
          companyId: row.company_id,
          companyName: row.company_name,
          manualProminence: row.manual_prominence,
          headerSpace: row.header_space,
          space: row.space,
          reportingTone: row.reporting_tone,
          reportingSubject: row.reporting_subject,
          subcategory: row.subcategory,
          keyword: row.keyword,
          qc2Remark: row.qc2_remark,
          detailSummary: row.detail_summary,
          qc3_status: "Z",
        },
      ];
      const response = await axiosInstance.post(
        "insertarticledetails/",
        requestData
      );
      if (response.data.result.success.length) {
        toast.success(response.data.result.success[0]?.message);
        setFetchTagDataAfterChange((prev) => !prev);
      } else {
        toast.warning(response.data.result.errors[0]?.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setAcceptRowId(false);
    }
  };

  const handleOpenAccept = (row) => {
    setSelectedRowForAccept(row);
    setOpenAcceptCompany((pre) => !pre);
  };

  const handleCloseAccept = () => {
    setSelectedRowForAccept(null);
    setOpenAcceptCompany(false);
  };

  return (
    <div className="px-1 mt-2 min-h-[400px]">
      <Box display={"flex"} alignItems={"center"} gap={1} flexWrap={"wrap"}>
        <div>
          <CustomMultiSelect
            dropdownToggleWidth={300}
            dropdownWidth={300}
            keyId="companyid"
            keyName="companyname"
            options={companies || []}
            title="Company"
            selectedItems={selectedCompany}
            setSelectedItems={setSelectedCompany}
          />
        </div>
        <button
          onClick={handleAddCompanies}
          className="px-6 text-white uppercase rounded-md bg-primary text-[0.9em]"
        >
          Add
        </button>
        {!!checkedRows.length && (
          <button
            onClick={handleClickOpen}
            className="px-6 text-white uppercase bg-red-500 rounded-md text-[0.9em]"
          >
            Delete
          </button>
        )}

        {saveLoading ? (
          <CircularProgress />
        ) : (
          <button
            onClick={handleSaveClick}
            className="px-6 text-white uppercase rounded-md bg-primary text-[0.9em]"
          >
            Save
          </button>
        )}
        <button
          onClick={() => setOpenMapExtra((prev) => !prev)}
          className="px-6 text-white uppercase rounded-md bg-primary text-[0.9em]"
        >
          Map Extra
        </button>
        <button
          className="px-6 text-white uppercase rounded-md bg-primary text-[0.9em]"
          onClick={handleCopy}
        >
          Copy
        </button>
      </Box>

      <Typography sx={{ fontSize: "0.9em", my: 1 }}>
        Client: {selectedClient?.clientName || "No client selected"}
      </Typography>
      <div
        style={{
          maxHeight: 400,
          minHeight: 400,
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        <div className="overflow-auto max-h-96 min-h-40">
          <table className="w-full border border-collapse border-gray-300">
            <thead className="sticky top-0 z-10 text-white bg-primary">
              <tr className="text-sm">
                <th className="p-2">CompanyName</th>
                <th className="p-2">Action</th>
                <th className="p-2">Accept Company</th>
                <th className="p-2 min-w-28">Subject</th>
                <th className="p-2 ">HeaderSpace</th>
                <th className="p-2 min-w-28">Prominence</th>
                <th className="p-2 min-w-20">Space</th>
                <th className="p-2 min-w-28">Tone</th>
                <th className="p-2 ">Delete</th>
                <th className="p-2 min-w-28">SubCategory</th>
                <th className="p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {tagDataLoading ? (
                <tr>
                  <td colSpan={9} className="p-4 text-center">
                    <CircularProgress />
                  </td>
                </tr>
              ) : (
                editableTagData?.map((row, index) => (
                  <tr
                    key={row.company_id}
                    className={`transition-colors hover:bg-blue-100 text-[0.8em] border border-black  ${
                      "qc3-" + row.qc3_status
                    }`}
                  >
                    <td className="p-2 ">{row.company_name}</td>
                    <td>
                      {row.qc3_status !== "N" &&
                        row.qc3_status !== "Y" &&
                        row.qc3_status !== "Z" && (
                          <Tooltip title="Accept">
                            <IconButton
                              onClick={() => handleAccept(row)}
                              disabled={acceptRowId === row.company_id}
                            >
                              {acceptRowId === row.company_id ? (
                                <CircularProgress size={"1em"} />
                              ) : (
                                <CheckIcon className="text-primary" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                    </td>

                    <td>
                      {row.qc3_status === "N" || row.qc3_status === "E" ? (
                        <IconButton onClick={() => handleOpenAccept(row)}>
                          <StoreIcon className="text-primary" />
                        </IconButton>
                      ) : null}
                    </td>

                    <td className="p-2">
                      <select
                        value={row.reporting_subject}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "reporting_subject",
                            e.target.value
                          )
                        }
                        className="w-full border border-black"
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
                    <td className="p-2 ">
                      <input
                        className="w-full border border-black outline-none"
                        value={row.header_space}
                        type="number"
                        onBlur={() => handleHeaderSpaceBlur(index)}
                        onChange={(e) =>
                          handleChange(index, "header_space", e.target.value)
                        }
                      />
                    </td>
                    <td
                      className="p-2 "
                      onClick={() => handleProminenceBlur(index)}
                    >
                      <select
                        value={row.manual_prominence}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "manual_prominence",
                            e.target.value
                          )
                        }
                        className="w-full border border-black"
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
                    <td className="p-2 ">
                      <input
                        type="number"
                        value={row.space}
                        onChange={(e) =>
                          handleChange(index, "space", e.target.value)
                        }
                        disabled
                        className="w-full border border-black outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={row.reporting_tone}
                        onChange={(e) =>
                          handleChange(index, "reporting_tone", e.target.value)
                        }
                        className="w-full border border-black"
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
                    <td className="p-2 ">
                      <Checkbox
                        type="checkbox"
                        checked={checkedRows.some(
                          (checkedRow) =>
                            checkedRow.company_id === row.company_id
                        )}
                        onChange={() => handleCheckboxChange(row)}
                      />
                    </td>
                    <td className="p-2 ">
                      <select
                        value={row.subcategory}
                        onChange={(e) =>
                          handleChange(index, "subcategory", e.target.value)
                        }
                        className="w-full border border-black"
                      >
                        <option value={null}>select</option>
                        {categories.map((cate, index) => (
                          <option value={cate} key={cate + String(index)}>
                            {cate}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="w-full border border-black outline-none"
                        value={row.qc2_remark}
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
        </div>
      </div>

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
      <AcceptCompany
        open={openAcceptCompany}
        handleClose={handleCloseAccept}
        articleType="print"
        selectedRow={selectedRowForAccept}
        // setModifiedRows={setModifiedRows}
        // setMainTableData={setEditableTagData}
        setFetchTagDataAfterChange={setFetchTagDataAfterChange}
      />
      <MapExtraModal
        open={openMapExtra}
        handleClose={() => setOpenMapExtra(false)}
        clientId={selectedClient?.clientId || ""}
        articleId={articleId}
        articleType={"print"}
        setMainTableData={setEditableTagData}
        setFetchTableDataAfterInsert={setFetchTagDataAfterChange}
        tableData={editableTagData}
      />
    </div>
  );
};

SecondSection.propTypes = {
  selectedClient: PropTypes.object.isRequired,
  selectedArticle: PropTypes.array.isRequired,
};
export default SecondSection;

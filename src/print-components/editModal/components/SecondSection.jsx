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
import CustomMultiSelect from "../../../@core/CustomMultiSelect";

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

  const [storedData, setStoredData] = useState({});

  const articleId = !!selectedArticle && selectedArticle?.article_id;

  useEffect(() => {
    const fetchTagDetails = async () => {
      try {
        setTagDataLoading(true);
        const headers = { Authorization: `Bearer ${userToken}` };
        const params = {
          article_id: articleId,
          clientId: selectedClient?.clientId,
        };
        const res = await axios.get(`${url}articletagdetails/`, {
          headers,
          params,
        });
        setTagData(res.data.article_details);
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
    if (companies.length > 0) {
      const localCompany = companies.find(
        (i) => i.companyid === selectedCompanyId
      );

      setSelectedCompany([
        {
          value: localCompany?.companyid,
          label: localCompany?.companyName,
        },
      ]);
    }
  }, [selectedCompanyId]);

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
      articleId: i.ARTICLEID,
      companyId: i.COMPANYID,
      companyName: i.COMPANYNAME,
      manualProminence: i.MANUALPROMINENCE,
      headerSpace: i.HEADERSPACE,
      space: i.SPACE,
      reportingTone: i.REPORTINGTONE,
      reportingSubject: i.REPORTINGSUBJECT,
      subcategory: i.subcategory,
      keyword: i.KEYWORD,
      qc2Remark: i.QC2REMARK,
      detailSummary: i.DETAILSUMMARY,
      updateType: i.UPDATETYPE,
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
          `${url}updatearticletagdetails/`,
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

  return (
    <div className="px-2 mt-2 border border-black min-h-[400px]">
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <div className="z-50 mt-3">
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
          Client: {selectedClient?.clientName || "No client selected"}
        </Typography>
        <button
          className="px-6 text-white uppercase rounded-md bg-primary"
          style={{ fontSize: "0.8em" }}
          onClick={handleCopy}
        >
          Copy
        </button>
      </Box>
      <div
        style={{
          maxHeight: 400,
          minHeight: 400,
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        <div className="overflow-auto max-h-96">
          <table className="w-full border border-collapse border-gray-300">
            <thead className="sticky top-0 z-10 text-white bg-primary">
              <tr className="text-sm">
                <th className="p-2">CompanyName</th>
                <th className="p-2 min-w-20">Subject</th>
                <th className="p-2 ">HeaderSpace</th>
                <th className="p-2">Prominence</th>
                <th className="p-2 ">Space</th>
                <th className="p-2 min-w-20">Tone</th>
                <th className="p-2 ">Delete</th>
                <th className="p-2 ">SubCategory</th>
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
                    className={`transition-colors hover:bg-blue-100 ${
                      "qc3-" + row.qc3_status
                    }`}
                  >
                    <td className="p-2 border border-gray-300">
                      {row.company_name}
                    </td>
                    <td className="p-2 border border-gray-300">
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
                    <td className="p-2 border border-gray-300">
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
                      className="p-2 border border-gray-300"
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
                    <td className="p-2 border border-gray-300">
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
                    <td className="p-2 border border-gray-300">
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
                    <td className="p-2 border border-gray-300">
                      <Checkbox
                        type="checkbox"
                        checked={checkedRows.some(
                          (checkedRow) =>
                            checkedRow.company_id === row.company_id
                        )}
                        onChange={() => handleCheckboxChange(row)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
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
                    <td className="p-2 border border-gray-300">
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
    </div>
  );
};

SecondSection.propTypes = {
  selectedClient: PropTypes.object.isRequired,
  selectedArticle: PropTypes.array.isRequired,
};
export default SecondSection;

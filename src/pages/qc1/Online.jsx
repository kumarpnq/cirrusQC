// * online component is inside the qc1-components/components/online

import { useCallback, useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";

// *component imports
import Button from "../../components/custom/Button";
import EditDialog from "../../qc1-components/print/edit-dialog/EditDialog";

// * data hooks
import useFetchData from "../../hooks/useFetchData";

// *constants
import { url } from "../../constants/baseUrl";
import {
  continents,
  countriesByContinent,
  dateTypes,
  qc1Array,
} from "../../constants/dataArray";
import { formattedDate, formattedNextDay } from "../../constants/dates";

// * third party imports
import axios from "axios";
import { toast } from "react-toastify";
import { arrayToString } from "../../utils/arrayToString";
import {
  AttachFileOutlined,
  CloseOutlined,
  ControlCameraOutlined,
} from "@mui/icons-material";
import CustomAccordionDetails from "../../qc1-components/print/edit-dialog/SearchFilters";
import DeleteConfirmationDialog from "../../@core/DeleteDialog";
import GroupUnGroupModal from "../../qc1-components/print/Group&Ungroup";
import MainTable from "../../qc1-components/print/MainTable";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
}));

const Online = () => {
  // * state variables for search data
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedDateType, setSelectedDateType] = useState("article");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [isQc1Done, setIsQc1Done] = useState(1);
  const [qc1By, setQc1By] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedContinents, setSelectedContinents] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isImage, setIsImage] = useState(0);
  const [isVideo, setIsVideo] = useState(0);
  const [headOrSummary, setHeadOrSummary] = useState("");
  const [link, setLink] = useState("");
  const [socialFeedId, setSocialFeedId] = useState("");

  // * data hooks
  const { data: clientData } = useFetchData(`${url}clientlist/`);
  const { data: companyData } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : ""
  );
  // * token and headers
  const userToken = localStorage.getItem("user");
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  // * fetching user list
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const params = {
          from_date: fromDate.split(" ")[0],
          to_date: dateNow.split(" ")[0],
        };
        const response = await axios.get(`${url}qc1userlistonline/`, {
          headers,
          params,
        });
        setUserList(response.data.qc_users);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserList();
  }, [fromDate, dateNow]);

  // * table data
  const [tableData, setTableData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const fetchTableData = useCallback(async () => {
    if (!selectedClient || !selectedDateType) {
      toast.warning("Please select a client or date type.");
      return;
    }
    try {
      setTableDataLoading(true);

      const params = {
        client_id: selectedClient,
        from_date: fromDate,
        to_date: dateNow,
        date_type: selectedDateType,

        //* optional params
        // company_ids: "",
        // search_text: "",
        // link: "",
        // is_qc1: "",
        // qc_1by: "",
        // language: "",
        // continent: "",
        // country: "",
        // has_image: "",
        // has_video: "",
        // socialfeed_id: "",
        // count: "",
      };

      // eslint-disable-next-line no-inner-declarations
      function addPropertyIfConditionIsTrue(condition, property, value) {
        if (condition) {
          params[property] = value;
        }
      }
      addPropertyIfConditionIsTrue(
        selectedCompanies.length > 0,
        "company_ids",
        arrayToString(selectedCompanies)
      );
      addPropertyIfConditionIsTrue(
        headOrSummary !== "",
        "search_text",
        headOrSummary
      );
      addPropertyIfConditionIsTrue(qc1By !== "", "qc_1by", qc1By);
      addPropertyIfConditionIsTrue(link !== "", "link", link);
      addPropertyIfConditionIsTrue(isQc1Done !== "", "is_qc1", isQc1Done);
      addPropertyIfConditionIsTrue(
        selectedLanguages.length > 0,
        "language",
        arrayToString(selectedLanguages)
      );
      addPropertyIfConditionIsTrue(
        selectedContinents.length > 0,
        "continent",
        arrayToString(selectedContinents)
      );
      addPropertyIfConditionIsTrue(
        selectedCountries.length > 0,
        "country",
        arrayToString(selectedCountries)
      );
      addPropertyIfConditionIsTrue(isImage !== 0, "has_image", Number(isImage));
      addPropertyIfConditionIsTrue(isVideo !== 0, "has_video", Number(isVideo));
      addPropertyIfConditionIsTrue(
        socialFeedId !== "",
        "socialfeed_id",
        Number(socialFeedId)
      );
      const response = await axios.get(`${url}listArticlebyQC1/`, {
        headers,
        params,
      });
      if (response.data.feed_data.length) {
        setTableData(response.data.feed_data || []);
      } else {
        setTableData([]);
        toast.warning("No data found.");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setTableDataLoading(false);
    }
  }, [
    dateNow,
    fromDate,
    headOrSummary,
    isImage,
    isQc1Done,
    isVideo,
    link,
    qc1By,
    selectedClient,
    selectedCompanies,
    selectedContinents,
    selectedCountries,
    selectedDateType,
    selectedLanguages,
    socialFeedId,
    headers,
  ]);
  // *  mui style
  const classes = useStyle();

  //  * edit dialog
  const [open, setOpen] = useState(false);
  const [articleNumber, setArticleNumber] = useState(0);

  const handleRowClick = (row, rowNumber) => {
    setOpen((prev) => !prev);
    setArticleNumber(rowNumber);
  };

  // * row selection modal
  const [selectionModal, setSelectionModal] = useState([]);
  const handleSelectionChange = (ids) => {
    const selectedItem = ids.map((index) => tableData[index]);
    setSelectedItems(selectedItem);
    setSelectionModal(ids);
  };

  //* Group modal
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const handleGroupModalOpen = () => {
    setOpenGroupModal(true);
  };

  // * un-group selected items
  const [unGroupLoading, setUnGroupLoading] = useState(false);
  const handleUnGroup = async () => {
    if (selectedItems.length !== 1) {
      return toast.warning("Please select exactly one item");
    }
    const parent_id = selectedItems[0]?.social_feed_id;
    try {
      setUnGroupLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = { Authorization: `Bearer ${userToken}` };

      const request_data = {
        parent_id: parent_id,
      };
      const response = await axios.post(
        `${url}ungroupsimilarsocialfeeds/`,
        request_data,
        {
          headers,
          // params: request_data,
        }
      );
      if (response.data.status?.success?.length) {
        toast.success("Articles ungrouped successfully.");
        setSelectedItems([]);
        setSelectionModal([]);
        fetchTableData();
      } else {
        toast.warning("Error while un-grouping.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUnGroupLoading(false);
    }
  };

  // * remove companies from selected items
  const [removeLoading, setRemoveLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
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
  const handleClickOpen = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleClickRemoveCompanies = async () => {
    const isValid = await userVerification();
    if (!isValid) {
      return toast.warning("User not valid.");
    }
    const socialFeedIds = selectedItems.map((i) => i.social_feed_id);

    try {
      setRemoveLoading(true);
      const request_data = {
        client_id: selectedClient,
        socialfeed_ids: arrayToString(socialFeedIds),
        company_ids: arrayToString(selectedCompanies),
      };
      if (selectedCompanies.length) {
        request_data.company_ids = arrayToString(selectedCompanies);
      }
      const response = await axios.delete(`${url}removecompanyonline/`, {
        headers,
        params: request_data,
      });
      if (response) {
        toast.success("Companies removed.");
        setSelectionModal([]);
        setSelectedItems([]);
        setOpenDelete(false);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setRemoveLoading(false);
    }
  };

  // * saving the edited cells
  const [oldRows, setOldRows] = useState(null);
  const [newRows, setNewRows] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSaveManualEditedCells = async () => {
    if (!newRows) {
      toast.warning("No changes found.");
      return;
    }
    try {
      setSaveLoading(true);
      const request_data = {
        SOCIALFEEDID: newRows?.socialFeedId,
      };
      if (oldRows.headline !== newRows.headline) {
        request_data.HEADLINE = newRows.headline;
      }
      if (oldRows.summary !== newRows.summary) {
        request_data.SUMMARY = newRows.summary;
      }
      if (oldRows.journalist !== newRows.journalist) {
        request_data.AUTHOR = newRows.journalist;
      }
      const data = {
        data: [request_data],
        qcflag: 1,
      };
      const response = await axios.post(`${url}updatesocialfeedheader/`, data, {
        headers,
      });
      if (response.data.result?.success?.length) {
        toast.success("Data updated.");
        setNewRows(null);
        setOldRows(null);
        fetchTableData();
      } else {
        toast.warning("Something wrong try again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setSaveLoading(false);
    }
  };

  // * highlight edit rows
  const getRowClassName = (params) => {
    return newRows?.socialFeedId === params.row.socialFeedId
      ? "highlight-row"
      : "";
  };

  const isShowSecondAccordion = selectedItems.length || Boolean(newRows);

  // * buttons permission
  const [buttonsPermission, setButtonsPermission] = useState(null);
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(
          `${url}buttonspermissions/?screen=online`,
          { headers }
        );
        setButtonsPermission(response.data.permission_data[0]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPermission();
  }, []);

  return (
    <Box mx={2}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Search Filters
        </AccordionSummary>
        <CustomAccordionDetails
          clientData={clientData}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          selectedCompanies={selectedCompanies}
          setSelectedCompanies={setSelectedCompanies}
          companyData={companyData}
          classes={classes}
          dateTypes={dateTypes}
          selectedDateType={selectedDateType}
          setSelectedDateType={setSelectedDateType}
          fromDate={fromDate}
          setFromDate={setFromDate}
          dateNow={dateNow}
          setDateNow={setDateNow}
          isQc1Done={isQc1Done}
          setIsQc1Done={setIsQc1Done}
          qc1Array={qc1Array}
          userList={userList}
          qc1By={qc1By}
          setQc1By={setQc1By}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          selectedContinents={selectedContinents}
          setSelectedContinents={setSelectedContinents}
          countriesByContinent={countriesByContinent}
          filteredCountries={filteredCountries}
          setFilteredCountries={setFilteredCountries}
          continents={continents}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          isImage={isImage}
          setIsImage={setIsImage}
          isVideo={isVideo}
          setIsVideo={setIsVideo}
          headOrSummary={headOrSummary}
          setHeadOrSummary={setHeadOrSummary}
          link={link}
          setLink={setLink}
          socialFeedId={socialFeedId}
          setSocialFeedId={setSocialFeedId}
          tableDataLoading={tableDataLoading}
          fetchTableData={fetchTableData}
        />
      </Accordion>
      {isShowSecondAccordion && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Group & remove
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {buttonsPermission?.group === "Yes" && (
                <Button
                  btnText={"group"}
                  icon={<AttachFileOutlined />}
                  onClick={handleGroupModalOpen}
                />
              )}
              {buttonsPermission?.un_group === "Yes" && (
                <Button
                  btnText={unGroupLoading ? "loading" : "unGroup"}
                  icon={<ControlCameraOutlined />}
                  onClick={handleUnGroup}
                  isLoading={unGroupLoading}
                />
              )}
              {buttonsPermission?.add_and_remove_company === "Yes" && (
                <Button
                  btnText={"Add & Remove Companies"}
                  icon={<CloseOutlined />}
                  onClick={handleClickOpen}
                  isLoading={removeLoading}
                />
              )}
              {buttonsPermission?.save === "Yes" && (
                <Button
                  btnText={saveLoading ? "saving" : "save"}
                  onClick={handleSaveManualEditedCells}
                  isLoading={saveLoading}
                />
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Divider sx={{ mt: 1 }} />
      <MainTable
        tableData={tableData}
        tableDataLoading={tableDataLoading}
        selectionModal={selectionModal}
        setSelectionModal={setSelectionModal}
        handleSelectionChange={handleSelectionChange}
        handleRowClick={handleRowClick}
        newRows={newRows}
        setNewRows={setNewRows}
        setOldRows={setOldRows}
        getRowClassName={getRowClassName}
      />
      <EditDialog
        open={open}
        setOpen={setOpen}
        rowData={tableData}
        rowNumber={articleNumber}
        setRowNumber={setArticleNumber}
      />
      <DeleteConfirmationDialog
        open={openDelete}
        handleClose={handleCloseDelete}
        password={password}
        setPassword={setPassword}
        handleClickRemove={handleClickRemoveCompanies}
        verificationLoading={verificationLoading}
      />

      <GroupUnGroupModal
        openGroupModal={openGroupModal}
        setOpenGroupModal={setOpenGroupModal}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSelectionModal={setSelectionModal}
        groupOrUnGroup="group"
        fetchMainData={fetchTableData}
      />
    </Box>
  );
};

export default Online;

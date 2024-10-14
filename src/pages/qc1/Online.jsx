// * online component is inside the qc1-components/components/online

import { useCallback, useEffect, useRef, useState } from "react";
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
import GroupUnGroupModal from "../../qc1-components/print/Group&Ungroup";
import MainTable from "../../qc1-components/print/MainTable";
import AddCompaniesModal from "../../qc1-components/components/AddCompanyModal";

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
  const [isQc1Done, setIsQc1Done] = useState("0");
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
          client_id: selectedClient,
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
  }, [fromDate, dateNow, selectedClient]);

  function mapBinaryToYesNoAll(value) {
    switch (value) {
      case 1:
        return "Y";
      case "0":
        return "N";
      case 2:
        return "ALL";
      case 3:
        return "PY";
      case 4:
        return "PN";
      default:
        return value;
    }
  }
  // * table data
  const [tableData, setTableData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedFilteredRows, setSortedFilteredRows] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const fetchTableData = useCallback(async () => {
    if (!selectedDateType || !selectedClient) {
      toast.warning("Please select a client or date type.");
      return;
    }
    // const dateDifferenceInHours = differenceInHours(
    //   new Date(dateNow),
    //   new Date(fromDate)
    // );
    // if (!selectedClient && dateDifferenceInHours > 24) {
    //   toast.warning(
    //     "Date range should not exceed 24 hours if no client is selected."
    //   );
    //   return;
    // }

    try {
      setTableDataLoading(true);
      setSortedFilteredRows([]);

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
      addPropertyIfConditionIsTrue(
        isQc1Done !== "",
        "is_qc1",
        mapBinaryToYesNoAll(isQc1Done)
      );
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
      toast.error("Error while fetching.");
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
    setArticleNumber(rowNumber || 0);
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
      const response = await axios.delete(`${url}ungroupsimilarsocialfeeds/`, {
        headers,
        params: request_data,
      });
      if (response.data) {
        toast.success("Articles ungrouped successfully.");
        setSelectedItems([]);
        setSelectionModal([]);
        fetchTableData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUnGroupLoading(false);
    }
  };

  // * saving the edited cells

  const [saveLoading, setSaveLoading] = useState(false);
  const [hasUnsavedRows, setHasUnsavedRows] = useState(false);
  const unsavedChangesRef = useRef({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const processRowUpdate = useCallback((newRow, oldRow) => {
    const rowId = newRow.socialFeedId;

    // Update unsaved rows
    unsavedChangesRef.current.unsavedRows[rowId] = newRow;

    // Store initial state before any changes are made
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }

    setHasUnsavedRows(true);

    return newRow;
  }, []);

  const handleSaveManualEditedCells = async () => {
    const changedRows = unsavedChangesRef.current.unsavedRows;
    const rowsBeforeChange = unsavedChangesRef.current.rowsBeforeChange;

    if (Object.keys(changedRows).length === 0) {
      toast.warning("No changes found.");
      return;
    }
    // const changedRowIds = Object.keys(changedRows);
    try {
      setSaveLoading(true);

      const requestData = Object.keys(changedRows).map((rowId) => {
        const newRow = changedRows[rowId];
        const oldRow = rowsBeforeChange[rowId];
        const request_data = {
          socialFeedId: newRow.socialFeedId,
        };

        if (oldRow.headline !== newRow.headline) {
          request_data.headline = newRow.headline;
        }
        if (oldRow.summary !== newRow.summary) {
          request_data.summary = newRow.summary;
        }
        if (oldRow.journalist !== newRow.journalist) {
          request_data.author = newRow.journalist;
        }
        return request_data;
      });
      const data = {
        data: requestData,
        qcflag: "QCP",
      };
      const response = await axios.post(`${url}updatesocialfeedheader/`, data, {
        headers,
      });
      if (response.data.result?.success?.length) {
        toast.success("Data updated.");
        unsavedChangesRef.current.unsavedRows = {};
        unsavedChangesRef.current.rowsBeforeChange = {};
        // const filteredArray = tableData.filter(
        //   (item) => !changedRowIds.includes(item.social_feed_id)
        // );
        fetchTableData();
        // setTableData(filteredArray);
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
    return unsavedChangesRef.current.unsavedRows[params.row.socialFeedId]
      ? "highlight-row"
      : "";
  };

  const isShowSecondAccordion =
    selectedItems.length ||
    Object.keys(unsavedChangesRef.current.unsavedRows).length > 0;

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

  // * add companies
  const [openAddCompanies, setOpenAddCompanies] = useState(false);

  // * data for edit dialog
  const [multipleEditOpen, setMultipleEditOpen] = useState(false);
  const dataForEditDialog = sortedFilteredRows.length
    ? sortedFilteredRows
    : tableData;

  const isFiltered = sortedFilteredRows.length && true;

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
          setTableData={setTableData}
          setSelectionModal={setSelectionModal}
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
              <Button
                btnText="Edit"
                onClick={() => setMultipleEditOpen(true)}
              />
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
                  onClick={() => setOpenAddCompanies(true)}
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
        getRowClassName={getRowClassName}
        processRowUpdate={processRowUpdate}
        sortedFilteredRows={sortedFilteredRows}
        setSortedFilteredRows={setSortedFilteredRows}
        // childArticles={child}
      />
      <EditDialog
        open={open}
        setOpen={setOpen}
        rowData={open ? dataForEditDialog : []}
        rowNumber={articleNumber}
        setRowNumber={setArticleNumber}
        isFiltered={isFiltered}
      />

      {/* edit multiple  temporary solot*/}
      <EditDialog
        open={multipleEditOpen}
        setOpen={setMultipleEditOpen}
        rowData={multipleEditOpen ? selectedItems : []}
        setSelectedItems={multipleEditOpen ? setSelectedItems : () => {}}
        setSelectionModal={multipleEditOpen ? setSelectionModal : () => {}}
        rowNumber={articleNumber || 0}
        setRowNumber={setArticleNumber}
        isFiltered={false}
        isMultipleArticles={true}
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
      {/* Combine for print & online */}
      <AddCompaniesModal
        open={openAddCompanies}
        setOpen={setOpenAddCompanies}
        selectedRows={selectedItems}
        screen={"online"}
        setSelectionModal={setSelectionModal}
      />
    </Box>
  );
};

export default Online;

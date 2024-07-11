import { useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

// *component imports
import SearchableDropdown from "../../components/dropdowns/SearchableDropdown";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import Qc1All from "../../components/research-dropdowns/Qc1All";
import Qc1By from "../../components/research-dropdowns/Qc1By";
import Languages from "../../components/research-dropdowns/Languages";
import Continents from "../../components/research-dropdowns/Continents";
import Countries from "../../components/research-dropdowns/Countries";
import CheckboxComp from "../../components/checkbox/Checkbox";
import Button from "../../components/custom/Button";
import EditDialog from "../../qc1-components/print/edit-dialog/EditDialog";
import CustomAutocomplete from "../../components/custom/Autocomplet";
import Datetype from "../../components/research-dropdowns/Datetype";

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
import CustomTextField from "../../@core/CutsomTextField";
import { arrayToString } from "../../utils/arrayToString";
import {
  AttachFileOutlined,
  CloseOutlined,
  ControlCameraOutlined,
  EditAttributesOutlined,
} from "@mui/icons-material";
import CustomButton from "../../@core/CustomButton";

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

const iconCellStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

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
      addPropertyIfConditionIsTrue(isQc1Done !== 0, "is_qc1", isQc1Done);
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

  // * group selected articles
  const [groupLoading, setGroupLoading] = useState(false);
  const handleClickGroupItems = async () => {
    if (selectedItems.length === 1) {
      toast.warning("Select more than one article.");
      return;
    }
    const parentId = selectedItems[0].id;
    const childrenIds = selectedItems.slice(1).map((item) => item.id);

    try {
      setGroupLoading(true);
      const request_data = {
        parent_id: parentId,
        child_id: arrayToString(childrenIds),
      };
      const response = await axios.post(
        `${url}groupsimilarsocialfeeds/`,
        request_data,
        { headers }
      );
      if (response.data.status?.success?.length) {
        toast.success("Articles grouped successfully.");
        setSelectionModal([]);
        setSelectedItems([]);
      } else {
        toast.warning("Something went wrong.");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setGroupLoading(false);
    }
  };

  // * un-group selected items
  const [unGroupLoading, setUnGroupLoading] = useState(false);
  const handleClickUnGroupItems = async () => {
    if (selectedItems.length === 1) {
      toast.warning("Select more than one article.");
      return;
    }
    const parentId = selectedItems[0].id;
    const childrenIds = selectedItems.slice(1).map((item) => item.id);

    try {
      setUnGroupLoading(true);
      const request_data = {
        parent_id: parentId,
        child_id: arrayToString(childrenIds),
      };
      const response = await axios.post(
        `${url}ungroupsimilarsocialfeeds/`,
        request_data,
        { headers }
      );
      if (response.data.status?.success?.length) {
        setSelectionModal([]);
        setSelectedItems([]);
        toast.success("Articles ungrouped successfully.");
      } else {
        toast.warning("Ids not found.");
      }
    } catch (error) {
      console.log(error.message);
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

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <IconButton onClick={() => handleRowClick(params.row, params.id)}>
            <EditAttributesOutlined className="text-primary" />
          </IconButton>
        </div>
      ),
    },
    { field: "headline", headerName: "Headline", width: 250, editable: true },
    { field: "summary", headerName: "Summary", width: 500, editable: true },
    {
      field: "journalist",
      headerName: "Journalist",
      width: 150,
      editable: true,
    },
    { field: "publication", headerName: "Publication", width: 150 },
    {
      field: "url",
      headerName: "URL",
      width: 100,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      ),
    },
    { field: "qcDone", headerName: "QC Done", width: 100 },
    { field: "articleDate", headerName: "Article Date", width: 150 },
    { field: "socialFeedId", headerName: "socialFeedId", width: 150 },
  ];
  const rows = tableData?.map((item, index) => ({
    id: index,
    action: "#",
    headline: item.headline,
    summary: item.detail_summary,
    journalist: item.journalist,
    publication: item.publication,
    url: item.link,
    qcDone: item.qc1_done,
    articleDate: item.feed_date_time,
    socialFeedId: item.social_feed_id,
  }));

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

  // * custom toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarQuickFilter />
        {/* Export button is not included */}
      </GridToolbarContainer>
    );
  }

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
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexFlow: "wrap",
              gap: 1,
            }}
          >
            <div className="flex items-center mt-1" style={{ height: 25 }}>
              <SearchableDropdown
                options={clientData?.data?.clients || []}
                testclient={selectedClient}
                setTestClient={setSelectedClient}
                label="Clients"
                width={300}
              />
            </div>
            <CustomAutocomplete
              companies={selectedCompanies}
              setCompanies={setSelectedCompanies}
              company={companyData?.data?.companies || []}
            />
            <Datetype
              classes={classes}
              dateTypes={dateTypes}
              dateType={selectedDateType}
              setDateType={setSelectedDateType}
            />
            <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            <ToDate dateNow={dateNow} setDateNow={setDateNow} isMargin={true} />
            <Qc1All
              qc1done={isQc1Done}
              setQc1done={setIsQc1Done}
              classes={classes}
              qc1Array={qc1Array}
            />
            <Qc1By
              qcUsersData={userList || []}
              qc1by={qc1By}
              setQc1by={setQc1By}
              classes={classes}
              pageType={"print"}
            />
            <Languages
              language={selectedLanguages}
              setLanguage={setSelectedLanguages}
              classes={classes}
            />
            <Continents
              continent={selectedContinents}
              setContinent={setSelectedContinents}
              countriesByContinent={countriesByContinent}
              setFilteredCountries={setFilteredCountries}
              continents={continents}
              classes={classes}
            />
            {/* countries */}
            <Countries
              country={selectedCountries}
              setCountry={setSelectedCountries}
              classes={classes}
              filteredCountries={filteredCountries}
            />
            <div className="flex flex-wrap items-center" style={{ height: 25 }}>
              <CheckboxComp
                value={isImage}
                setValue={setIsImage}
                label={"Image"}
              />
              <CheckboxComp
                value={isVideo}
                setValue={setIsVideo}
                label={"Video"}
              />
            </div>
            <div
              className="flex flex-wrap items-center gap-2 pt-2"
              style={{ height: 25 }}
            >
              <CustomTextField
                width={200}
                placeholder="Summary/Headline"
                type="text"
                value={headOrSummary}
                setValue={setHeadOrSummary}
              />
              <CustomTextField
                width={200}
                placeholder="Link"
                type="text"
                value={link}
                setValue={setLink}
              />
              <CustomTextField
                width={200}
                placeholder={"socialFeedId"}
                type={"number"}
                value={socialFeedId}
                setValue={setSocialFeedId}
              />
            </div>
            <Button
              btnText={tableDataLoading ? "searching" : "search"}
              isLoading={tableDataLoading}
              onClick={fetchTableData}
            />
          </Box>
        </AccordionDetails>
        {/* <AccordionActions></AccordionActions> */}
      </Accordion>
      {!!isShowSecondAccordion && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Group & remove
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              btnText={groupLoading ? "Loading" : "group"}
              icon={<AttachFileOutlined />}
              onClick={handleClickGroupItems}
              isLoading={groupLoading}
            />
            <Button
              btnText={unGroupLoading ? "ungrouping" : "ungroup"}
              icon={<ControlCameraOutlined />}
              onClick={handleClickUnGroupItems}
              isLoading={unGroupLoading}
            />
            <Button
              btnText={removeLoading ? "Removing" : "Remove Companies"}
              icon={<CloseOutlined />}
              onClick={handleClickOpen}
              isLoading={removeLoading}
              isDanger
            />
            <Button
              btnText={saveLoading ? "saving" : "save"}
              onClick={handleSaveManualEditedCells}
              isLoading={saveLoading}
            />
          </AccordionDetails>
        </Accordion>
      )}

      <Divider sx={{ mt: 1 }} />
      <Box sx={{ height: 600, width: "100%", mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSize={5}
          pageSizeOptions={[
            10,
            100,
            200,
            1000,
            { value: 1000, label: "1,000" },
          ]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.9em",
            },
          }}
          checkboxSelection
          rowSelectionModel={selectionModal}
          onRowSelectionModelChange={(ids) => {
            setSelectionModal(ids);
            handleSelectionChange(ids);
          }}
          processRowUpdate={(newRow, oldRow) => {
            if (newRows) {
              toast.warning("Please save the changes first.");
              return;
            }
            if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
              setNewRows(newRow);
              setOldRows(oldRow);
            }
          }}
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          columnBufferPx={1000}
          loading={tableDataLoading && <CircularProgress />}
          components={{ Toolbar: CustomToolbar }}
          hideFooterSelectedRowCount
          getRowHeight={() => "auto"}
          getRowClassName={getRowClassName}
        />
      </Box>
      <EditDialog
        open={open}
        setOpen={setOpen}
        rowData={tableData}
        rowNumber={articleNumber}
        setRowNumber={setArticleNumber}
      />
      <div>
        <Dialog open={openDelete} onClose={handleCloseDelete}>
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
              onClick={handleCloseDelete}
              bg={"bg-primary"}
            />
            {verificationLoading ? (
              <Box width={130} display={"flex"} justifyContent={"center"}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <CustomButton
                btnText="Delete"
                onClick={handleClickRemoveCompanies}
                bg={"bg-red-500"}
              />
            )}
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
};

export default Online;

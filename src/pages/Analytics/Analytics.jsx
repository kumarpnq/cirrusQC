import { useState, useMemo, Fragment } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Typography,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AiOutlineDownload } from "react-icons/ai";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// * third party imports
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

//* components
import Button from "../../components/custom/Button";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import Qc1By from "../../components/research-dropdowns/Qc1By";
import useFetchData from "../../hooks/useFetchData";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import { formattedDate, formattedNextDay } from "../../constants/dates";
import { url } from "../../constants/baseUrl";
import { arrayToString } from "../../utils/arrayToString";

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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Analytics = () => {
  // * table data variables
  const [gridData, setGridData] = useState([]);
  const [articleData, setArticleData] = useState([]);
  const [competitionData, setCompetitionData] = useState([]);

  // * retrieve
  const [gridDataLoading, setGridDataLoading] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedPrintAndOnline, setSelectedPrintAndOnline] = useState([]);
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [withCompetition, setWithCompetition] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // * clear the dropdown values after tab change
    setGridData([]);
    setArticleData([]);
    setCompetitionData([]);
    setSelectedClients([]);
    setSelectedPrintAndOnline([]);
    setSelectedHeaders([]);
    setSelectedUsers([]);
    setSelectedUserId("");
  };

  // * data hooks
  const { data } = useFetchData(`${url}clientlist/`);
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`);

  const columns = useMemo(
    () => [
      { field: "USERNAME", headerName: "Username", width: 150 },
      { field: "TIMESTAMP", headerName: "Timestamp", width: 200 },
      { field: "ACTIVITY", headerName: "Activity", width: 200 },
    ],
    []
  );

  const columns1 = useMemo(
    () => [
      { field: "USERNAME", headerName: "Username", width: 150 },
      { field: "MEDIA", headerName: "Media", width: 150 },
      { field: "CLIENTNAME", headerName: "Client Name", width: 200 },
      { field: "COMPANYNAME", headerName: "Company Name", width: 200 },
      { field: "QC_DATE", headerName: "QC Date", width: 150 },
      { field: "QC1BY_HEADER", headerName: "QC1 By Header", width: 150 },
      { field: "QC1BY_DETAIL", headerName: "QC1 By Detail", width: 150 },
      { field: "QC2BY_HEADER", headerName: "QC2 By Header", width: 150 },
      { field: "QC2BY_DETAIL", headerName: "QC2 By Detail", width: 150 },
    ],
    []
  );

  const articleDataColumn = useMemo(
    () => [
      { field: "USERNAME", headerName: "Username", width: 150 },
      { field: "MEDIA", headerName: "Media", width: 150 },
      { field: "QC_DATE", headerName: "QC Date", width: 150 },
      { field: "QC1_HEADER", headerName: "QC1 Header", width: 150 },
      { field: "QC2_HEADER", headerName: "QC2 Header", width: 150 },
    ],
    []
  );
  const competitionYes = useMemo(
    () => [
      { field: "USERNAME", headerName: "Username", width: 150 },
      { field: "MEDIA", headerName: "Media", width: 150 },
      { field: "CLIENTNAME", headerName: "Client Name", width: 200 },
      { field: "COMPANYNAME", headerName: "Company Name", width: 200 },
      { field: "QC_DATE", headerName: "QC Date", width: 150 },
      { field: "QC1_DETAIL", headerName: "QC1 Detail", width: 150 },
      { field: "QC2_DETAIL", headerName: "QC2 Detail", width: 150 },
    ],
    []
  );

  const competitionNo = useMemo(
    () => [
      { field: "USERNAME", headerName: "Username", width: 150 },
      { field: "MEDIA", headerName: "Media", width: 150 },
      { field: "CLIENTNAME", headerName: "Client Name", width: 200 },
      { field: "QC_DATE", headerName: "QC Date", width: 150 },
      { field: "QC1_DETAIL", headerName: "QC1 Detail", width: 150 },
      { field: "QC2_DETAIL", headerName: "QC2 Detail", width: 150 },
    ],
    []
  );

  const competitionDataColumn = withCompetition
    ? competitionYes
    : competitionNo;

  const handleFetchRecords = async () => {
    if (value && !selectedUserId) {
      toast.warning("Please select user.");
      return;
    } else if (!value && !selectedPrintAndOnline.length) {
      toast.warning("Please select Media.");
      return;
    }
    const data = qcUserData?.data?.qc_users || [];
    const usernames = selectedUsers.map((id) => {
      const user = data.find((entry) => entry.usersid === id);
      return user ? user.username : null;
    });
    try {
      setGridDataLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      const params1 = {
        userName: selectedUserId,
        fromDate: fromDate.split(" ")[0],
        toDate: toDate.split(" ")[0],
      };
      const params0 = {
        media: arrayToString(selectedPrintAndOnline),
        fromdate: fromDate.split(" ")[0],
        todate: toDate.split(" ")[0],
        clientids: arrayToString(selectedClients),
        usernames: arrayToString(usernames),
        qc1: selectedHeaders.includes("qc1"),
        qc2: selectedHeaders.includes("qc2"),
        competetion: withCompetition ? "YES" : "NO",
      };

      const endpoint = !value ? "useractivityreport/" : "userActivityLog/";
      const response = await axios.get(url + endpoint, {
        headers,
        params: value ? params1 : params0,
      });
      const accesskey = !value ? "feed_data" : "result";
      const data = response.data[accesskey] || [];
      if (data.length && value) {
        setGridData(response.data[accesskey]);
      } else if (!!data && !value) {
        const article = data.article;
        const competition = data.competetion;
        setArticleData(article || []);
        setCompetitionData(competition || []);
      } else {
        toast.warning("No data found.");
      }
    } catch (error) {
      toast.error("Error while fetching records.");
    } finally {
      setGridDataLoading(false);
    }
  };

  // * mui classes
  const classes = useStyle();

  const rows = gridData.map((item, index) => ({ id: index + 1, ...item }));
  const articleRows = articleData.map((item, index) => ({
    id: index + 1,
    ...item,
  }));
  const competitionRows = competitionData.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  // Function to handle Excel export
  const handleExportToExcel = () => {
    const articleSheet = XLSX.utils.json_to_sheet(articleRows);
    const competitionSheet = XLSX.utils.json_to_sheet(competitionRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, articleSheet, "Article Data");
    XLSX.utils.book_append_sheet(wb, competitionSheet, "Competition Data");
    const excelFileName = "analytics_data.xlsx";
    XLSX.writeFile(wb, excelFileName);
  };

  return (
    <div className="px-3">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="activity logs"
          >
            <Tab label="QC Activity" {...a11yProps(0)} />
            <Tab label="Logs" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        {!value ? (
          <>
            <div className="pt-3 w-[200px]">
              <CustomMultiSelect
                title="Clients"
                options={data?.data?.clients || []}
                selectedItems={selectedClients}
                setSelectedItems={setSelectedClients}
                keyId="clientid"
                keyName="clientname"
                dropdownWidth={250}
                dropdownToggleWidth={200}
              />
            </div>
            <div className="pt-3 w-[200px]">
              <CustomMultiSelect
                title="Users"
                options={qcUserData?.data?.qc_users || []}
                selectedItems={selectedUsers}
                setSelectedItems={setSelectedUsers}
                keyId="usersid"
                keyName="username"
                dropdownWidth={200}
                dropdownToggleWidth={200}
              />
            </div>
            <div className="pt-3 w-[180px]">
              <CustomMultiSelect
                title="QC"
                dropdownWidth={180}
                dropdownToggleWidth={180}
                options={[
                  { id: "qc1", name: "QC1" },
                  { id: "qc2", name: "QC2" },
                ]}
                keyId="id"
                keyName="name"
                selectedItems={selectedHeaders}
                setSelectedItems={setSelectedHeaders}
              />
            </div>
            <div className="pt-3 w-[150px]">
              <CustomMultiSelect
                title="Media"
                options={[
                  { id: "PRINT", name: "Print" },
                  { id: "ONLINE", name: "Online" },
                ]}
                selectedItems={selectedPrintAndOnline}
                setSelectedItems={setSelectedPrintAndOnline}
                keyId="id"
                keyName="name"
                dropdownWidth={180}
                dropdownToggleWidth={150}
              />
            </div>
            <div>
              <FormControl>
                <FormControlLabel
                  sx={{ mt: 2 }}
                  label={
                    <Typography variant="h6" fontSize={"0.9em"}>
                      Competition
                    </Typography>
                  }
                  control={
                    <Checkbox
                      checked={withCompetition}
                      onChange={() => setWithCompetition((prev) => !prev)}
                    />
                  }
                />
              </FormControl>
            </div>
            <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
          </>
        ) : (
          <>
            <Qc1By
              qcUsersData={qcUserData?.data?.qc_users || []}
              qc1by={selectedUserId}
              setQc1by={setSelectedUserId}
              classes={classes}
              title={"Users"}
            />
            <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
          </>
        )}
        <Button
          btnText={gridDataLoading ? "Searching" : "Search"}
          onClick={handleFetchRecords}
          isLoading={gridDataLoading}
        />
      </Box>
      <Divider sx={{ my: 1 }} />

      <Box sx={{ height: 500, width: "100%" }}>
        {value ? (
          <DataGrid
            rows={rows}
            columns={!value ? columns1 : columns}
            pageSize={5}
            density="compact"
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            loading={gridDataLoading && <CircularProgress />}
          />
        ) : (
          <Fragment>
            <Box
              component={"button"}
              display={"flex"}
              alignItems={"center"}
              className="gap-1 text-primary"
              onClick={handleExportToExcel}
              disabled={!articleData.length && !competitionData.length}
            >
              <AiOutlineDownload />
              EXPORT
            </Box>
            <Box display={"flex"} gap={1} sx={{ height: 450, width: "100%" }}>
              <Box>
                <DataGrid
                  rows={articleRows}
                  columns={articleDataColumn}
                  loading={gridDataLoading && <CircularProgress />}
                  density="compact"
                />
              </Box>
              <DataGrid
                density="compact"
                rows={competitionRows}
                columns={competitionDataColumn}
                loading={gridDataLoading && <CircularProgress />}
              />
            </Box>
          </Fragment>
        )}
      </Box>
    </div>
  );
};

export default Analytics;

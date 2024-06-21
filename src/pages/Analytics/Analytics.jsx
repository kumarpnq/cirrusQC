import { useState, useMemo } from "react";
import { Box, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// * third party imports
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

//* components
import Button from "../../components/custom/Button";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import { formattedDate, formattedNextDay } from "../../constants/dates";
import Qc1By from "../../components/research-dropdowns/Qc1By";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";
import LongMenu from "../../analytics-components/MultiCheckbox";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
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
  const [gridData, setGridData] = useState([]);
  const [gridDataLoading, setGridDataLoading] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedPrintAndOnline, setSelectedPrintAndOnline] = useState([]);
  const [headerDetails, setHeaderDetails] = useState({
    qc1by_header: false,
    qc2by_header: false,
    qc1by_detail: false,
    qc2by_detail: false,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // * clear the dropdown values after tab change
    setGridData([]);
    setSelectedClients([]);
    setSelectedPrintAndOnline([]);
    setHeaderDetails({
      qc1by_header: false,
      qc2by_header: false,
      qc1by_detail: false,
      qc2by_detail: false,
    });
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
      { field: "QC1BY_DETAIL", headerName: "QC1 By Detail", width: 150 },
      { field: "QC2BY_DETAIL", headerName: "QC2 By Detail", width: 150 },
    ],
    []
  );

  const handleFetchRecords = async () => {
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
      // Format dates to "YYYY-MM-DD"
      const formattedFromDate = new Date(fromDate).toISOString().split("T")[0];
      const formattedToDate = new Date(toDate).toISOString().split("T")[0];

      const params1 = {
        userName: selectedUserId,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
      };
      const params0 = {
        media: arrayToString(selectedPrintAndOnline),
        fromdate: formattedFromDate,
        todate: formattedToDate,
        clientids: arrayToString(selectedClients),
        userids: arrayToString(usernames),
        qc1by_header: headerDetails.qc1by_header,
        qc2by_header: headerDetails.qc2by_header,
        qc1by_detail: headerDetails.qc1by_detail,
        qc2by_detail: headerDetails.qc2by_detail,
      };
      const endpoint = !value ? "useractivityreport/" : "userActivityLog/";
      const response = await axios.get(url + endpoint, {
        headers,
        params: value ? params1 : params0,
      });
      const accesskey = !value ? "feed_data" : "result";
      setGridData(response.data[accesskey]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGridDataLoading(false);
    }
  };

  // * mui classes
  const classes = useStyle();

  const rows = gridData.map((item, index) => ({ id: index + 1, ...item }));

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
            <div className="pt-2">
              <LongMenu
                headerDetails={headerDetails}
                setHeaderDetails={setHeaderDetails}
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
        <DataGrid
          rows={rows}
          columns={!value ? columns1 : columns}
          pageSize={5}
          density="compact"
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </div>
  );
};

export default Analytics;

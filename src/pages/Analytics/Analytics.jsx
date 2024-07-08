import { useState, useMemo, Fragment } from "react";
import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AiOutlineDownload } from "react-icons/ai";

// * third party imports
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

//* components

import useFetchData from "../../hooks/useFetchData";
import { formattedDate, formattedNextDay } from "../../constants/dates";
import { url } from "../../constants/baseUrl";
import { arrayToString } from "../../utils/arrayToString";
import NavigateTabs from "../../analytics-components/NavigateTabs";
import SearchFilters from "../../analytics-components/SearchFilters";

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
  const [threshHold, setThreshHold] = useState();
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
    setThreshHold();
  };

  // * data hooks
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`);

  // * column data for grid
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

  const column2 = useMemo(() => {
    const columns = [{ field: "USERNAME", headerName: "Username", width: 150 }];
    if (selectedHeaders.includes("qc1")) {
      columns.push({ field: "QC1", headerName: "QC1", width: 150 });
    }
    if (selectedHeaders.includes("qc2")) {
      columns.push({ field: "QC2", headerName: "QC2", width: 150 });
    }
    columns.push({
      field: "TOTAL_HOURS",
      headerName: "Total Hours",
      width: 150,
    });
    return columns;
  }, [selectedHeaders]);

  const articleDataColumn = useMemo(
    () => [
      { field: "USERNAME", headerName: "Username", width: 150 },
      { field: "MEDIA", headerName: "Media", width: 150 },
      { field: "QC_DATE", headerName: "QC Date", width: 150 },
      { field: "QC1_HEADER", headerName: "QC1", width: 150 },
      { field: "QC2_HEADER", headerName: "QC2", width: 150 },
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
      { field: "QC1_DETAIL", headerName: "QC1", width: 150 },
      { field: "QC2_DETAIL", headerName: "QC2", width: 150 },
    ],
    []
  );

  const competitionNo = useMemo(
    () => [
      { field: "USERNAME", headerName: "Username", width: 150 },
      { field: "MEDIA", headerName: "Media", width: 150 },
      { field: "CLIENTNAME", headerName: "Client Name", width: 200 },
      { field: "QC_DATE", headerName: "QC Date", width: 150 },
      { field: "QC1_DETAIL", headerName: "QC1", width: 150 },
      { field: "QC2_DETAIL", headerName: "QC2", width: 150 },
    ],
    []
  );

  const competitionDataColumn = withCompetition
    ? competitionYes
    : competitionNo;

  // * decide the endpoint basis on selected tab
  const getEndpoint = (value) => {
    switch (value) {
      case 0:
        return "useractivityreport/";
      case 1:
        return "userActivityLog/";
      case 2:
        return "usersefforts/";
      case 3:
        return "totalefforts/";
      default:
        throw new Error("Invalid value");
    }
  };

  // * decide params basis on selected tab
  const getParams = (
    value,
    selectedUserId,
    fromDate,
    toDate,
    selectedPrintAndOnline,
    selectedClients,
    usernames,
    selectedHeaders,
    withCompetition,
    threshHold
  ) => {
    switch (value) {
      case 0:
        return {
          media: arrayToString(selectedPrintAndOnline),
          fromdate: fromDate.split(" ")[0],
          todate: toDate.split(" ")[0],
          clientids: arrayToString(selectedClients),
          usernames: arrayToString(usernames),
          qc1: selectedHeaders.includes("qc1"),
          qc2: selectedHeaders.includes("qc2"),
          competetion: withCompetition ? "YES" : "NO",
        };
      case 1:
        return {
          userName: selectedUserId,
          fromDate: fromDate.split(" ")[0],
          toDate: toDate.split(" ")[0],
        };
      case 2:
        return {
          usernames: arrayToString(usernames),
          fromdate: fromDate.split(" ")[0],
          todate: toDate.split(" ")[0],
          qc1: selectedHeaders.includes("qc1"),
          qc2: selectedHeaders.includes("qc2"),
          threshold: threshHold,
        };
      case 3:
        return {
          fromdate: fromDate.split(" ")[0],
          todate: toDate.split(" ")[0],
        };
      default:
        throw new Error("Invalid value");
    }
  };

  const handleFetchRecords = async () => {
    if (value === 1 && !selectedUserId) {
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
      const endpoint = getEndpoint(value);
      const params = getParams(
        value,
        selectedUserId,
        fromDate,
        toDate,
        selectedPrintAndOnline,
        selectedClients,
        usernames,
        selectedHeaders,
        withCompetition,
        threshHold
      );
      const response = await axios.get(url + endpoint, {
        headers,
        params,
      });
      const accesskey =
        (!value && "feed_data") ||
        (value === 1 && "result") ||
        (value === 2 && "users_data") ||
        (value === 3 && "qc_data");
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

  // * grid rows
  const rows = gridData.map((item, index) => ({ id: index + 1, ...item }));
  const articleRows = articleData.map((item, index) => ({
    id: index + 1,
    ...item,
  }));
  const competitionRows = competitionData.map((item, index) => ({
    id: index + 1,
    ...item,
  }));
  const valueTwoRows = gridData.map((item, index) => ({
    id: index + 1,
    ...item,
    TOTAL_HOURS:
      typeof item.TOTAL_HOURS === "number"
        ? parseFloat(item.TOTAL_HOURS.toFixed(2))
        : item.TOTAL_HOURS,
  }));

  // * value three grid data and column
  const dataForFilter = value === 3 ? gridData : [];
  const filteredData = dataForFilter.map((day) => ({
    ...day,
    data: day.data.filter((slot) => slot.data.qc1 !== 0 || slot.data.qc2 !== 0),
  }));
  const columnGroupingModel = useMemo(() => {
    // Extract unique slots from data
    const uniqueSlots = filteredData.reduce((slots, item) => {
      item.data.forEach((slotItem) => {
        if (!slots.includes(slotItem.slot)) {
          slots.push(slotItem.slot);
        }
      });
      return slots;
    }, []);

    // Generate column grouping model based on unique slots
    const groupingModel = uniqueSlots.map((slot) => ({
      groupId: `slot_${slot.replace(":", "-")}`,
      headerName: slot,
      description: "",
      children: [
        { field: `qc1_${slot}`, headerName: "QC1", width: 100 },
        { field: `qc2_${slot}`, headerName: "QC2", width: 100 },
      ],
    }));

    return groupingModel;
  }, [filteredData]);

  const columns3 = useMemo(() => {
    // Create columns array including date and all slot-related fields
    const dateColumn = { field: "date", headerName: "Date", width: 150 };
    const grandTotalColumn = {
      field: "total",
      headerName: " Grand Total",
      width: 150,
    };
    const slotColumns = columnGroupingModel.reduce((cols, group) => {
      cols.push(...group.children);
      return cols;
    }, []);

    return [dateColumn, ...slotColumns, grandTotalColumn];
  }, [columnGroupingModel]);

  const rows3 = useMemo(() => {
    let flattenedRows = [];
    filteredData.forEach((item, index) => {
      const rowData = { id: index + 1, date: item.date };
      let grandTotal = 0;
      item.data.forEach((slotItem) => {
        const qc1Value = slotItem.data.qc1;
        const qc2Value = slotItem.data.qc2;
        rowData[`qc1_${slotItem.slot}`] = qc1Value;
        rowData[`qc2_${slotItem.slot}`] = qc2Value;
        grandTotal += qc1Value + qc2Value;
      });
      rowData.total = grandTotal;
      flattenedRows.push(rowData);
    });
    return flattenedRows;
  }, [filteredData]);

  const getRowClassName = (params) => {
    const { data } = params.row;

    // Ensure qc1 and qc2 values are defined
    if (
      data &&
      typeof data.qc1 !== "undefined" &&
      typeof data.qc2 !== "undefined"
    ) {
      const thresholdHigh = 50; // Example threshold for high value
      const thresholdLow = 10; // Example threshold for low value

      // Check qc1 and qc2 values and return corresponding class name
      if (data.qc1 > thresholdHigh || data.qc2 > thresholdHigh) {
        return "row-high-value"; // Apply green background for high values
      } else if (data.qc1 < thresholdLow || data.qc2 < thresholdLow) {
        return "row-low-value"; // Apply light background for low values
      }
    }

    return ""; // Default class (no additional styling)
  };

  // Function to handle Excel export
  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();

    if (value === 2) {
      // Create the date range data
      const dateRangeData = [
        { fromDate: fromDate.split(" ")[0], toDate: toDate.split(" ")[0] },
      ];
      const dateRangeSheet = XLSX.utils.json_to_sheet(dateRangeData, {
        skipHeader: true,
      });
      XLSX.utils.book_append_sheet(wb, dateRangeSheet, "Date Range");

      // Add the date range header to the data
      const dataWithDateRange = [
        { date: `From: ${fromDate.split(" ")[0]} To: ${toDate.split(" ")[0]}` },
        ...valueTwoRows,
      ];

      // Create the data sheet with the date range header
      const dataSheet = XLSX.utils.json_to_sheet(dataWithDateRange);
      XLSX.utils.book_append_sheet(wb, dataSheet, "Data");
    } else {
      // Add sheets for other values
      const articleSheet = XLSX.utils.json_to_sheet(articleRows);
      const competitionSheet = XLSX.utils.json_to_sheet(competitionRows);
      XLSX.utils.book_append_sheet(wb, articleSheet, "Article Data");
      XLSX.utils.book_append_sheet(wb, competitionSheet, "Competition Data");
    }

    const excelFileName = "analytics_data.xlsx";
    XLSX.writeFile(wb, excelFileName);
  };

  return (
    <div className="px-3">
      <Box sx={{ width: "100%" }}>
        <NavigateTabs value={value} handleChange={handleChange} />
      </Box>
      <SearchFilters
        value={value}
        selectedClients={selectedClients}
        setSelectedClients={setSelectedClients}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        selectedHeaders={selectedHeaders}
        setSelectedHeaders={setSelectedHeaders}
        selectedPrintAndOnline={selectedPrintAndOnline}
        setSelectedPrintAndOnline={setSelectedPrintAndOnline}
        withCompetition={withCompetition}
        setWithCompetition={setWithCompetition}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        gridDataLoading={gridDataLoading}
        handleFetchRecords={handleFetchRecords}
        classes={classes}
        threshHold={threshHold}
        setThreshHold={setThreshHold}
      />
      <Divider sx={{ my: 1 }} />
      <Box sx={{ height: 500, width: "100%" }}>
        {(value == 1 && (
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
        )) ||
          (value === 0 && (
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
              <Box sx={{ height: 450, width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 450 }}>
                      <Typography component={"span"}>Articles</Typography>
                      <DataGrid
                        rows={articleRows}
                        columns={articleDataColumn}
                        loading={gridDataLoading && <CircularProgress />}
                        density="compact"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 450 }}>
                      <Typography component={"span"}>Competition</Typography>
                      <DataGrid
                        rows={competitionRows}
                        columns={competitionDataColumn}
                        loading={gridDataLoading && <CircularProgress />}
                        density="compact"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Fragment>
          )) ||
          (value === 2 && (
            <Fragment>
              <Box
                component={"button"}
                display={"flex"}
                alignItems={"center"}
                className="gap-1 text-primary"
                onClick={handleExportToExcel}
                // disabled={!articleData.length}
              >
                <AiOutlineDownload />
                EXPORT
              </Box>
              <DataGrid
                rows={valueTwoRows}
                columns={column2}
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
                    showQuickFilter: false,
                  },
                }}
                loading={gridDataLoading && <CircularProgress />}
              />
            </Fragment>
          )) ||
          (value === 3 && (
            <Box sx={{ height: 500 }}>
              <DataGrid
                rows={rows3}
                columns={columns3}
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
                columnGroupingModel={columnGroupingModel}
                getRowClassName={getRowClassName}
              />
            </Box>
          ))}
      </Box>
    </div>
  );
};

export default Analytics;

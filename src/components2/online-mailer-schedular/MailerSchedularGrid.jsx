import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import EditDialog from "./EditDialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { url_mongo } from "../../constants/baseUrl";

const MailerSchedularGrid = () => {
  const [open, setOpen] = useState(false);
  const [scheduleData, setScheduleDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  function yesNo(val) {
    if (val === true) return "Yes";
    else return "No";
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("user");
        const response = await axios.get(`${url_mongo}mailerSchedulerData/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setScheduleDate(response.data.scheduleData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setOpen((prev) => !prev);
              setSelectedRow(params.row);
            }}
          >
            <EditNoteIcon
              style={{ cursor: "pointer", marginRight: 10 }}
              className="text-primary"
            />
          </IconButton>

          <IconButton
            onClick={() => {
              alert(params.value);
            }}
          >
            <DeleteIcon
              style={{ cursor: "pointer" }}
              className="text-primary"
            />
          </IconButton>
        </>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value === "Yes" ? "green" : "orange" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "clientName",
      headerName: "Client Name",
      width: 200,
    },
    {
      field: "scheduledCompanies",
      headerName: "Company",
      width: 150,
      renderCell: (params) => (
        <Tooltip
          title={
            <>
              {params.value.map((i, index) => (
                <div key={index} style={{ whiteSpace: "pre-line" }}>
                  {i.companyName}
                </div>
              ))}
            </>
          }
        >
          <InfoIcon className="text-primary" />
        </Tooltip>
      ),
    },
    {
      field: "sendReport",
      headerName: "Send Report Even if no New result Were Found",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: params.value === "Yes" ? "green" : "orange" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "lastReport",
      headerName: "Only include new results since last report",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: params.value === "Yes" ? "green" : "orange" }}>
          {params.value}
        </span>
      ),
    },
    { field: "scheduleDetails", headerName: "Schedule Details", width: 300 },
  ];
  const rows = scheduleData.map((item) => ({
    id: item.clientId,
    active: yesNo(item.active),
    clientName: item.clientName,
    sendReport: yesNo(item.isSendReport),
    lastReport: yesNo(item.isIncludeReport),
    scheduledCompanies: item.scheduledCompanies,
    schedule: item.schedule,
  }));

  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="standard"
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      </Box>
      <EditDialog
        open={open}
        handleClose={handleClose}
        row={selectedRow}
        openedFromWhere="edit"
      />
    </>
  );
};

export default MailerSchedularGrid;

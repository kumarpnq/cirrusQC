import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import EditDialog from "./EditDialog";
import { useState } from "react";

const MailerSchedularGrid = () => {
  const [open, setOpen] = useState(false);
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => setOpen((prev) => !prev)}>
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
      field: "company",
      headerName: "Company",
      width: 150,
      renderCell: (params) => (
        <InfoIcon
          style={{ cursor: "pointer" }}
          titleAccess={params.value}
          className="text-primary"
        />
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

  const rows = [
    {
      id: 1,
      action: "",
      active: "Yes",
      company: "Example Company 1",
      sendReport: "Yes",
      lastReport: "No",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 2,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 3,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 4,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 5,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 6,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 7,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 8,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 9,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
    {
      id: 10,
      action: "",
      active: "No",
      company: "Example Company 2",
      sendReport: "No",
      lastReport: "Yes",
      scheduleDetails: "Send Report : Every day(s) - 08:30, 10:30, 23:00",
    },
  ];

  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="standard"
          rowsPerPageOptions={[5, 10, 20]}
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
      <EditDialog open={open} setOpen={setOpen} openedFromWhere="edit" />
    </>
  );
};

export default MailerSchedularGrid;

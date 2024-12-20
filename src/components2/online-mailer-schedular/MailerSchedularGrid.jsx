import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import EditDialog from "./EditDialog";
import { useState } from "react";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axiosInstance from "../../../axiosConfig";

const MailerSchedularGrid = ({
  loading,
  scheduleData,
  setScheduleData,
  handleFetch,
}) => {
  const [open, setOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  function yesNo(val) {
    if (val === true) return "Yes";
    else return "No";
  }

  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDelete = async () => {
    try {
      const params = {
        clientId: selectedRow?.id,
      };

      const response = await axiosInstance.delete(`removeMailerSchedule/`, {
        params,
      });

      if (response.data?.scheduleData?.status === "success") {
        const filteredData = scheduleData.filter(
          (item) => item.clientId !== selectedRow?.id
        );
        setScheduleData(filteredData);
        handleFetch();
        setSelectedRow(null);
        setDeleteOpen(false);
        toast.success(response.data?.scheduleData?.message);
      } else {
        toast.success(response.data?.scheduleData?.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

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
              setDeleteOpen((prev) => !prev);
              setSelectedRow(params.row);
            }}
            size="small"
          >
            <DeleteIcon
              style={{ cursor: "pointer" }}
              // className="text-primary"
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
    {
      field: "scheduleDetails",
      headerName: "Schedule Details",
      width: 350,
      renderCell: (params) => (
        <div>
          Send Report : Every Day(s) -{" "}
          {params.row.schedule.map((i) => i.time).join(",")}
        </div>
      ),
    },
  ];
  const rows = scheduleData.map((item) => ({
    id: item.clientId,
    active: yesNo(item.active),
    clientName: item.clientName,
    sendReport: item.isSendReport,
    lastReport: item.isIncludeReport,
    scheduledCompanies: item.scheduledCompanies,
    schedule: item.schedule,
    excludeDays: item.excludeDays,
  }));

  return (
    <>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
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
        handleFetch={handleFetch}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
        }}
        onDelete={handleDelete}
      />
    </>
  );
};

MailerSchedularGrid.propTypes = {
  loading: PropTypes.bool.isRequired,
  scheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      clientId: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      clientName: PropTypes.string.isRequired,
      isSendReport: PropTypes.bool.isRequired,
      isIncludeReport: PropTypes.bool.isRequired,
      scheduledCompanies: PropTypes.arrayOf(
        PropTypes.shape({
          companyName: PropTypes.string.isRequired,
        })
      ).isRequired,
      schedule: PropTypes.arrayOf(
        PropTypes.shape({
          time: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  setScheduleData: PropTypes.func.isRequired,
  handleFetch: PropTypes.func,
};
export default MailerSchedularGrid;

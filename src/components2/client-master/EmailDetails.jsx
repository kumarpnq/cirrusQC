import { useCallback, useEffect, useState, useRef, Fragment } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
// import axiosInstance from "../../../axiosConfigOra";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import axiosInstance from "../../../axiosConfigOra";
import EmailDetailsAddModal from "./EmailDetailsAddModal";

const EmailDetails = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const apiRef = useGridApiRef();
  const [addOpen, setAddOpen] = useState(false);

  // * GET DATA
  useEffect(() => {
    const fetchEmailDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("user");
        const response = await axios.get(
          "http://127.0.0.1:8000/getemaildetails/?client_id=DEMC",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setData(response.data.email_details || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmailDetails();
  }, []);

  const rows = data.map((item, index) => ({
    id: index,
    serialNumber: item.serial_number,
    email: item.email_id,
    name: item.name,
    phone: item.phone,
    designation: item.designation,
    startDate: item.email_start_date,
    endDate: item.email_end_date,
    sortOrder: item.sort_order,
    active: item.is_active,
  }));

  const columns = [
    {
      field: "email",
      headerName: "Email",
      editable: true,
      width: 250,
    },
    {
      field: "name",
      headerName: "Name",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      editable: true,
      width: 150,
    },
    {
      field: "designation",
      headerName: "Designation",
      editable: true,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      editable: true,
      renderCell: (params) => <span>{format(params.value, "yyyy-MM-dd")}</span>,
    },
    {
      field: "endDate",
      headerName: "End Date",
      editable: true,
      renderCell: (params) => <span>{format(params.value, "yyyy-MM-dd")}</span>,
    },
    {
      field: "sortOrder",
      headerName: "Sort Order",
      editable: true,
    },
    {
      field: "active",
      headerName: "Active",
      width: 200,
      editable: true,
    },
  ];

  const [hasUnsavedRows, setHasUnsavedRows] = useState(false);
  const unsavedChangesRef = useRef({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const processRowUpdate = useCallback((newRow, oldRow) => {
    const rowId = newRow.id;

    unsavedChangesRef.current.unsavedRows[rowId] = newRow;

    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }

    setHasUnsavedRows(true);

    return newRow;
  }, []);

  const changedRows = unsavedChangesRef.current.unsavedRows;
  const rowsBeforeChange = unsavedChangesRef.current.rowsBeforeChange;

  console.log(changedRows);

  const handleSave = async () => {
    try {
      console.log(changedRows);
      console.log(rowsBeforeChange);
      const requestData = Object.keys(changedRows).map((rowId) => {
        const newRow = changedRows[rowId];
        const oldRow = rowsBeforeChange[rowId];
        const request_data = {
          clientId: "DEMC",
          serialNumber: newRow.serialNumber,
        };

        if (oldRow.email !== newRow.email) {
          request_data.emailId = newRow.email;
        }
        if (oldRow.name !== newRow.name) {
          request_data.name = newRow.name;
        }
        if (oldRow.phone !== newRow.phone) {
          request_data.phone = newRow.phone;
        }
        if (oldRow.designation !== newRow.designation) {
          request_data.designation = newRow.designation;
        }
        if (oldRow.startDate !== newRow.startDate) {
          request_data.emailStartDate = newRow.startDate;
        }
        if (oldRow.endDate !== newRow.endDate) {
          request_data.emailEndDate = newRow.endDate;
        }
        if (oldRow.endDate !== newRow.endDate) {
          request_data.emailEndDate = newRow.endDate;
        }
        if (oldRow.sortOrder !== newRow.sortOrder) {
          request_data.sortOrder = newRow.sortOrder;
        }
        if (oldRow.active !== newRow.active) {
          request_data.isActive = newRow.active;
        }

        return request_data;
      });
      const response = await axiosInstance.post(
        "updateclientmasteremaildetails/",
        requestData
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("test");
    }
  };

  return (
    <Fragment>
      <Divider sx={{ mb: 1 }} />
      <Typography
        component={"div"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="text-primary">Edit Email Details.</span>
        <Box sx={{ display: "flex", alignItems: "center" }} className="gap-1">
          <Button size="small" variant="outlined" onClick={handleSave}>
            Save
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setAddOpen((prev) => !prev)}
          >
            Add
          </Button>
        </Box>
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          pageSize={5}
          loading={loading}
          density="compact"
          processRowUpdate={processRowUpdate}
          hideFooterSelectedRowCount
          disableRowSelectionOnClick
        />
      </Box>
      <EmailDetailsAddModal
        open={addOpen}
        handleClose={() => setAddOpen(false)}
      />
    </Fragment>
  );
};

export default EmailDetails;

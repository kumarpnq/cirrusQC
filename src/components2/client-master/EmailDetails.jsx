import { useCallback, useEffect, useState, useRef, Fragment } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { green, orange } from "@mui/material/colors";
import toast from "react-hot-toast";
import { format } from "date-fns";

import EmailDetailsAddModal from "./EmailDetailsAddModal";
import axiosInstance from "../../../axiosConfig";

const EmailDetails = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const apiRef = useGridApiRef();
  const [addOpen, setAddOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // * GET DATA
  const fetchEmailDetails = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        "clientmailerdetails/?clientId=DEMC"
      );

      setData(response.data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmailDetails();
  }, []);

  const rows = data.map((item, index) => ({
    id: index,
    serialNumber: item.serialNumber,
    email: item.emailId,
    name: item.name || "",
    phone: item.phone || "",
    designation: item.designation || "",
    startDate: item.emailStartDate,
    endDate: item.emailEndDate,
    sortOrder: item.sortOrder,
    active: item.isActive === "Y" ? "Yes" : "No",
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
      renderCell: (params) => (
        <span
          style={{ color: params.value === "Yes" ? green[500] : orange[500] }}
        >
          {" "}
          {params.value}{" "}
        </span>
      ),
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

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      const requestData = Object.keys(changedRows).map((rowId) => {
        const newRow = changedRows[rowId];
        const oldRow = rowsBeforeChange[rowId];
        const request_data = {
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
          request_data.isActive =
            (newRow.active.toLowerCase() === "yes" && "Y") ||
            (newRow.active.toLowerCase() === "no" && "N");
        }

        return request_data;
      });
      const data = {
        clientId: "DEMC",
        data: requestData,
      };
      const response = await axiosInstance.post(
        "/updateclientmailerdetails",
        data
      );
      if (response.data.data.success.length) {
        unsavedChangesRef.current.unsavedRows = {};
        unsavedChangesRef.current.rowsBeforeChange = {};
        const success = response.data.data.success[0]?.updateStatus;
        toast.success(success);
        fetchEmailDetails();
      } else {
        toast.error(response.data?.error[0]?.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // * highlight edit rows
  const getRowClassName = (params) => {
    return unsavedChangesRef.current.unsavedRows[params.row.id]
      ? "highlight-row"
      : "";
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
            {updateLoading && <CircularProgress size={"1em"} />}
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
          getRowClassName={getRowClassName}
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

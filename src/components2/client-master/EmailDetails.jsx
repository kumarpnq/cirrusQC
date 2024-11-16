import { useCallback, useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
// import axiosInstance from "../../../axiosConfigOra";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

const EmailDetails = () => {
  const [data, setData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [loading, setLoading] = useState(false);
  const apiRef = useGridApiRef();

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
      width: 500,
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

  const changedRows = unsavedChangesRef.current.unsavedRows;
  const rowsBeforeChange = unsavedChangesRef.current.rowsBeforeChange;

  console.log(changedRows);

  return (
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
  );
};

export default EmailDetails;

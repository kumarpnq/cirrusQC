import { useEffect, useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import axiosInstance from "../../../axiosConfigOra";
import axios from "axios";
import toast from "react-hot-toast";

const EmailDetails = () => {
  const [data, setData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleEditCellChange = (params) => {
    console.log(params);

    const { id, field, value } = params;
    setData((prevRows) =>
      prevRows.map((row) =>
        row.serial_number === id ? { ...row, [field]: value } : row
      )
    );
    setModifiedRows((prevModifiedRows) => ({
      ...prevModifiedRows,
      [id]: {
        ...prevModifiedRows[id],
        [field]: value,
      },
    }));
  };

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
      type: "date",
      valueGetter: (params) => new Date(params?.row?.startDate),
    },
    {
      field: "endDate",
      headerName: "End Date",
      editable: true,
      type: "date",
      valueFormatter: (params) => {
        return params?.value ? new Date(params?.value) : "";
      },
    },
    {
      field: "sortOrder",
      headerName: "Sort Order",
      editable: true,
    },
    {
      field: "active",
      headerName: "Active",
      editable: true,
      width: 200,
      renderCell: (params) => (
        <RadioGroup
          value={params.value}
          onChange={(e) => handleRadioChange(e, params)}
          row
        >
          <FormControlLabel
            value="Yes"
            control={<Radio checked={params.row.active} size="small" />}
            label="Yes"
          />
          <FormControlLabel
            value="No"
            control={<Radio checked={!params.row.active} size="small" />}
            label="No"
          />
        </RadioGroup>
      ),
    },
  ];

  const handleRadioChange = (e, params) => {
    const updatedRow = { ...params.row, active: e.target.value };
    console.log(updatedRow);
  };

  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        loading={loading}
        density="compact"
        onCellEditCommit={handleEditCellChange}
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default EmailDetails;

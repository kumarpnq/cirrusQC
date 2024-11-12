import { useState } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Work, Send } from "@mui/icons-material";

const CompanyBasket = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      companyName: "Company A",
      fromDate: "2023-01-01",
      toDate: "2023-12-31",
      sortOrder: 1,
      mailSection: "Section 1",
      active: "yes",
    },
    {
      id: 2,
      companyName: "Company B",
      fromDate: "2023-02-01",
      toDate: "2023-11-30",
      sortOrder: 2,
      mailSection: "Section 2",
      active: "no",
    },
    {
      id: 3,
      companyName: "Company C",
      fromDate: "2023-03-01",
      toDate: "2023-12-31",
      sortOrder: 3,
      mailSection: "Section 3",
      active: "yes",
    },
    {
      id: 4,
      companyName: "Company D",
      fromDate: "2023-04-01",
      toDate: "2023-10-31",
      sortOrder: 4,
      mailSection: "Section 1",
      active: "no",
    },
    {
      id: 5,
      companyName: "Company E",
      fromDate: "2023-05-01",
      toDate: "2023-11-30",
      sortOrder: 5,
      mailSection: "Section 2",
      active: "yes",
    },
    {
      id: 6,
      companyName: "Company F",
      fromDate: "2023-06-01",
      toDate: "2023-12-31",
      sortOrder: 6,
      mailSection: "Section 3",
      active: "no",
    },
    {
      id: 7,
      companyName: "Company G",
      fromDate: "2023-07-01",
      toDate: "2023-10-31",
      sortOrder: 7,
      mailSection: "Section 1",
      active: "yes",
    },
    {
      id: 8,
      companyName: "Company H",
      fromDate: "2023-08-01",
      toDate: "2023-12-31",
      sortOrder: 8,
      mailSection: "Section 2",
      active: "no",
    },
    {
      id: 9,
      companyName: "Company I",
      fromDate: "2023-09-01",
      toDate: "2023-11-30",
      sortOrder: 9,
      mailSection: "Section 3",
      active: "yes",
    },
    {
      id: 10,
      companyName: "Company J",
      fromDate: "2023-10-01",
      toDate: "2023-12-31",
      sortOrder: 10,
      mailSection: "Section 1",
      active: "no",
    },
    {
      id: 11,
      companyName: "Company K",
      fromDate: "2023-11-01",
      toDate: "2023-12-31",
      sortOrder: 11,
      mailSection: "Section 2",
      active: "yes",
    },
    {
      id: 12,
      companyName: "Company L",
      fromDate: "2023-12-01",
      toDate: "2023-12-31",
      sortOrder: 12,
      mailSection: "Section 3",
      active: "no",
    },
    {
      id: 13,
      companyName: "Company M",
      fromDate: "2024-01-01",
      toDate: "2024-12-31",
      sortOrder: 13,
      mailSection: "Section 1",
      active: "yes",
    },
    {
      id: 14,
      companyName: "Company N",
      fromDate: "2024-02-01",
      toDate: "2024-11-30",
      sortOrder: 14,
      mailSection: "Section 2",
      active: "no",
    },
    {
      id: 15,
      companyName: "Company O",
      fromDate: "2024-03-01",
      toDate: "2024-12-31",
      sortOrder: 15,
      mailSection: "Section 3",
      active: "yes",
    },
    {
      id: 16,
      companyName: "Company P",
      fromDate: "2024-04-01",
      toDate: "2024-10-31",
      sortOrder: 16,
      mailSection: "Section 1",
      active: "no",
    },
    {
      id: 17,
      companyName: "Company Q",
      fromDate: "2024-05-01",
      toDate: "2024-11-30",
      sortOrder: 17,
      mailSection: "Section 2",
      active: "yes",
    },
    {
      id: 18,
      companyName: "Company R",
      fromDate: "2024-06-01",
      toDate: "2024-12-31",
      sortOrder: 18,
      mailSection: "Section 3",
      active: "no",
    },
    {
      id: 19,
      companyName: "Company S",
      fromDate: "2024-07-01",
      toDate: "2024-10-31",
      sortOrder: 19,
      mailSection: "Section 1",
      active: "yes",
    },
    {
      id: 20,
      companyName: "Company T",
      fromDate: "2024-08-01",
      toDate: "2024-12-31",
      sortOrder: 20,
      mailSection: "Section 2",
      active: "no",
    },
  ]);

  const handleRowEdit = (updatedRow) => {
    const updatedRows = rows.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    );
    setRows(updatedRows);
  };

  const columns = [
    {
      field: "keyword",
      headerName: "Keyword",
      width: 150,
      renderCell: () => (
        <IconButton>
          <Work />
        </IconButton>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      width: 150,
      renderCell: () => (
        <IconButton>
          <Send />
        </IconButton>
      ),
    },
    {
      field: "companyName",
      headerName: "Company Name",
      editable: true,
      width: 200,
    },
    {
      field: "fromDate",
      headerName: "From Date",
      editable: true,
      width: 180,
      type: "date",
      valueGetter: () => new Date(),
    },
    {
      field: "toDate",
      headerName: "To Date",
      editable: true,
      width: 180,
      type: "date",
      valueGetter: () => new Date(),
    },
    {
      field: "sortOrder",
      headerName: "Sort Order",
      editable: true,
      width: 150,
    },
    {
      field: "mailSection",
      headerName: "Mail Section",
      editable: true,
      width: 180,
      renderCell: (params) => (
        <FormControl fullWidth>
          <Select
            value={params.value}
            onChange={(e) =>
              handleRowEdit({ ...params.row, mailSection: e.target.value })
            }
            size="small"
          >
            <MenuItem value="Section 1">Section 1</MenuItem>
            <MenuItem value="Section 2">Section 2</MenuItem>
            <MenuItem value="Section 3">Section 3</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      editable: true,
      width: 180,
      renderCell: (params) => (
        <RadioGroup
          row
          value={params.value}
          onChange={(e) =>
            handleRowEdit({ ...params.row, active: e.target.value })
          }
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      ),
    },
  ];

  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        density="compact"
        rowsPerPageOptions={[5]}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default CompanyBasket;

import { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <GridToolbarExport />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};
const KeywordDetails = () => {
  const [selectedValue, setSelectedValue] = useState("yes");

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const [rows, setRows] = useState([
    {
      id: 1,
      companyName: "Company A",
      keyword: "Keyword1",
      ignoredKeyword: "Ignored1",
      exactMatch: "yes",
      active: "yes",
      processStatus: "yes",
    },
    {
      id: 2,
      companyName: "Company B",
      keyword: "Keyword2",
      ignoredKeyword: "Ignored2",
      exactMatch: "no",
      active: "no",
      processStatus: "no",
    },
    {
      id: 3,
      companyName: "Company C",
      keyword: "Keyword3",
      ignoredKeyword: "Ignored3",
      exactMatch: "yes",
      active: "yes",
      processStatus: "no",
    },
    {
      id: 4,
      companyName: "Company D",
      keyword: "Keyword4",
      ignoredKeyword: "Ignored4",
      exactMatch: "no",
      active: "yes",
      processStatus: "yes",
    },
  ]);

  const columns = [
    { field: "companyName", headerName: "Company Name", width: 180 },
    { field: "keyword", headerName: "Keyword", width: 180 },
    { field: "ignoredKeyword", headerName: "Ignored Keyword", width: 200 },
    {
      field: "exactMatch",
      headerName: "Exact Match",
      width: 130,
      renderCell: (params) => (
        <span style={{ color: params.value === "yes" ? "green" : "red" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      width: 130,
      renderCell: (params) => (
        <span style={{ color: params.value === "yes" ? "green" : "red" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "processStatus",
      headerName: "Process Status",
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "yes" ? "green" : "orange",
          }}
        >
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ padding: 1, display: "flex", alignItems: "center", gap: 3 }}>
        <Typography variant="h6" gutterBottom fontSize={"1em"}>
          Client Keyword
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="client keyword"
            name="clientKeyword"
            value={selectedValue}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          slots={{
            toolbar: CustomToolbar,
          }}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
    </>
  );
};

export default KeywordDetails;

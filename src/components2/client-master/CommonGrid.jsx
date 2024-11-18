import { Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Divider } from "@mui/material";
import CustomMultiSelect from "../../@core/CustomMultiSelect";

const CommonGrid = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([
    {
      id: "NYK",
      name: "Newyork Times",
    },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Example rows data with publicationName field
  const rows = [
    { id: 1, publicationName: "Publication A" },
    { id: 2, publicationName: "Publication B" },
    { id: 3, publicationName: "Publication C" },
  ];

  // Columns definition for DataGrid
  const columns = [
    { field: "publicationName", headerName: "Publication Name", width: 200 },
  ];

  // Handler for selection change
  const handleSelectionChange = (selectionModel) => {
    setSelectedRows(selectionModel);
  };

  return (
    <Fragment>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CustomMultiSelect
          options={data}
          dropdownToggleWidth={300}
          dropdownWidth={300}
          keyId="id"
          keyName="name"
          title="Select"
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        <Button variant="outlined" size="small">
          Save
        </Button>
        <Button variant="outlined" size="small" color="error">
          Delete
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          density="compact"
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedRows}
          disableRowSelectionOnClick
        />
      </Box>
    </Fragment>
  );
};

export default CommonGrid;

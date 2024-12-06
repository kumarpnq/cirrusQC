import { Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Divider } from "@mui/material";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import useFetchMongoData from "../../hooks/useFetchMongoData";

const CommonGrid = ({ clientId }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([
    {
      id: "NYK",
      name: "Newyork Times",
    },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { data: onlinePublications } = useFetchMongoData(`onlinePublications/`);
  console.log(onlinePublications);

  const rows = [
    { id: 1, publicationName: "Publication A" },
    { id: 2, publicationName: "Publication B" },
    { id: 3, publicationName: "Publication C" },
  ];

  const columns = [
    { field: "publicationName", headerName: "Publication Name", width: 200 },
  ];

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
      <Box sx={{ height: "80vh", width: "100%" }}>
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

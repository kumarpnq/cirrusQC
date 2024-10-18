import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import AddModal from "./AddModal";

const PublicationGrid = () => {
  const [open, setOpen] = useState(false);
  const [rowId, setRowId] = useState(null);

  const handleOpen = (rowId) => {
    setRowId(rowId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const columns = [
    {
      field: "_",
      headerName: "Edit",
      width: 60,
      renderCell: (params) => (
        <IconButton onClick={() => handleOpen(params.row?.id)}>
          <EditNoteIcon className="text-primary" />
        </IconButton>
      ),
    },
    { field: "pubid", headerName: "Publication ID", width: 150 },
    { field: "publicationname", headerName: "Publication Name", width: 200 },
    { field: "pubgroupid", headerName: "Publication Group ID", width: 180 },
    { field: "pubscore", headerName: "Publication Score", width: 180 },
    { field: "isactive", headerName: "Active", width: 100 },
  ];

  const rows = [
    {
      id: 1,
      pubid: "001",
      publicationname: "Daily News",
      pubgroupid: "G1",
      pubscore: 85,
      isactive: "Yes",
    },
    {
      id: 2,
      pubid: "002",
      publicationname: "Global Times",
      pubgroupid: "G2",
      pubscore: 90,
      isactive: "No",
    },
    {
      id: 3,
      pubid: "003",
      publicationname: "Tech Weekly",
      pubgroupid: "G1",
      pubscore: 78,
      isactive: "Yes",
    },
    {
      id: 4,
      pubid: "004",
      publicationname: "Health Journal",
      pubgroupid: "G3",
      pubscore: 88,
      isactive: "Yes",
    },
    {
      id: 5,
      pubid: "005",
      publicationname: "Finance Daily",
      pubgroupid: "G2",
      pubscore: 92,
      isactive: "No",
    },
    {
      id: 6,
      pubid: "006",
      publicationname: "Fashion Trends",
      pubgroupid: "G4",
      pubscore: 80,
      isactive: "Yes",
    },
    {
      id: 7,
      pubid: "007",
      publicationname: "Sports World",
      pubgroupid: "G1",
      pubscore: 75,
      isactive: "No",
    },
    {
      id: 8,
      pubid: "008",
      publicationname: "Education Digest",
      pubgroupid: "G3",
      pubscore: 84,
      isactive: "Yes",
    },
    {
      id: 9,
      pubid: "009",
      publicationname: "Travel Magazine",
      pubgroupid: "G4",
      pubscore: 79,
      isactive: "Yes",
    },
    {
      id: 10,
      pubid: "010",
      publicationname: "Cooking Delight",
      pubgroupid: "G1",
      pubscore: 77,
      isactive: "No",
    },
  ];

  return (
    <Fragment>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <AddModal open={open} handleClose={handleClose} />
    </Fragment>
  );
};

export default PublicationGrid;

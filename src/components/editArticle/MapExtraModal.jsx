import PropTypes from "prop-types";
import { Modal, Box, Typography, Button, Paper, Divider } from "@mui/material";
import { useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "46%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1,
};

const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
    >
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};
const MapExtraModal = ({ open, handleClose }) => {
  const [aiSelectionModalChange, setAiSelectionModalChange] = useState([]);
  const [dbSelectionModal, setDbSelectionModal] = useState([]);

  const aiRows = [
    {
      id: 1,
      companyName: "EDELWEISS TOKIO LIFE",
      qc3_status: "E",
    },
    {
      id: 2,
      companyName: "TATA CONSULTANCY SERVICES",
      qc3_status: "P",
    },
    {
      id: 3,
      companyName: "RELIANCE INDUSTRIES",
      qc3_status: "Q",
    },
    {
      id: 4,
      companyName: "INFOSYS",
      qc3_status: "R",
    },
    {
      id: 5,
      companyName: "MAHINDRA & MAHINDRA",
      qc3_status: "Z",
    },
  ];
  const aiColumns = [
    {
      field: "companyName",
      title: "Company Name",
      width: 200,
    },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          fontSize={"1em"}
        >
          Map Extra
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Paper
            elevation={4}
            sx={{ borderRadius: "10px", padding: "20px", overflow: "hidden" }}
          >
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={aiRows}
                columns={aiColumns}
                pageSize={5}
                checkboxSelection
                slots={{ toolbar: CustomToolbar }}
                rowSelectionModel={aiSelectionModalChange}
                onRowSelectionModelChange={(selection) => {
                  if (selection.length > 1) {
                    const selectionSet = new Set(aiSelectionModalChange);
                    const result = selection.filter(
                      (s) => !selectionSet.has(s)
                    );

                    setAiSelectionModalChange(result);
                  } else {
                    setAiSelectionModalChange(selection);
                  }
                }}
                density="compact"
                hideFooterSelectedRowCount
              />
            </div>
          </Paper>

          <Paper
            elevation={4}
            sx={{ borderRadius: "10px", padding: "20px", overflow: "hidden" }}
          >
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={aiRows}
                columns={aiColumns}
                pageSize={5}
                checkboxSelection
                slots={{ toolbar: CustomToolbar }}
                rowSelectionModel={aiSelectionModalChange}
                onRowSelectionModelChange={(selection) => {
                  if (selection.length > 1) {
                    const selectionSet = new Set(aiSelectionModalChange);
                    const result = selection.filter(
                      (s) => !selectionSet.has(s)
                    );

                    setAiSelectionModalChange(result);
                  } else {
                    setAiSelectionModalChange(selection);
                  }
                }}
                density="compact"
                hideFooterSelectedRowCount
              />
            </div>
          </Paper>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box textAlign={"end"}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          >
            Close
          </Button>
          <Button variant="outlined" color="primary" size="small">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

MapExtraModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default MapExtraModal;

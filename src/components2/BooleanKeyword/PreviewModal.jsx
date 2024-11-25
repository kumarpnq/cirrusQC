import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { DataGrid, GridCloseIcon } from "@mui/x-data-grid";

const PreviewModal = ({ open, handleClose }) => {
  // Sample data for DataGrid
  const [data, setData] = useState([
    { id: 1, headline: "Breaking News 1", summary: "Summary 1" },
    { id: 2, headline: "Breaking News 2", summary: "Summary 2" },
    { id: 3, headline: "Breaking News 3", summary: "Summary 3" },
    // Add more data as needed
  ]);

  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "headline", headerName: "Headline", width: 300 },
    { field: "summary", headerName: "Summary", width: 400 },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "90%",
          height: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 1,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top section for date range and search */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            my: 1,
            p: 0.5,
            justifyContent: "space-between",
          }}
          component={Paper}
        >
          <div className="flex items-center gap-1">
            <TextField
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              size="small"
            />

            <TextField
              label="To Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <Button size="small" variant="outlined" color="primary">
              Search
            </Button>
          </div>
          <IconButton onClick={handleClose} color="primary">
            <GridCloseIcon />
          </IconButton>
        </Box>

        {/* DataGrid to display results */}
        <Box sx={{ flexGrow: 1 }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            density="compact"
            sx={{ height: "100%" }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

PreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default PreviewModal;

import PropTypes from "prop-types";
import { Modal, Box, Typography, Button, Paper, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import axios from "axios";
import { url } from "../../constants/baseUrl";

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

const MapExtraModal = ({ open, handleClose, selectedRow, articleType }) => {
  const accessKey = articleType === "print" ? "article_id" : "socialfeed_id";
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [aiSelectionModal, setAiSelectionModal] = useState([]);
  const [aiSelectedRows, setAiSelectedRows] = useState([]);
  const [dbSelectionModal, setDbSelectionModal] = useState([]);
  const [dbSelectedRows, setDbSelectedRows] = useState([]);

  useEffect(() => {
    const getDataForArticleOrSocialFeed = async () => {
      try {
        setLoading(true);
        const params = {
          articleId: selectedRow[accessKey],
          articleType,
        };
        const token = localStorage.getItem("user");
        const response = await axios.get(`${url}getcompaniesforarticle/`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        const respData = response.data.socialfeed_details;

        setData(respData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      getDataForArticleOrSocialFeed();
    }
  }, [selectedRow, articleType, open]);

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
    {
      field: "qc3_status",
      title: "QC3 Status",
      width: 150,
    },
  ];

  const getSelectedRows = (selection, rows) => {
    return rows.filter((row) => selection.includes(row.id));
  };

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
                rowSelectionModel={aiSelectionModal}
                onRowSelectionModelChange={(selection) => {
                  setAiSelectionModal(selection);
                  const selectedRows = getSelectedRows(selection, aiRows);
                  setAiSelectedRows(selectedRows);
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
                rowSelectionModel={dbSelectionModal}
                onRowSelectionModelChange={(selection) => {
                  setDbSelectionModal(selection);
                  const selectedRows = getSelectedRows(selection, aiRows);
                  setDbSelectedRows(selectedRows);
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

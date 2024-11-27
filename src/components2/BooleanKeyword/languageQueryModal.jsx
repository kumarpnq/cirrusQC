import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  Box,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../../axiosConfig";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PreviewModal from "./PreviewModal";

const style = {
  width: "100%",
  maxWidth: 600,
  height: "auto",
  bgcolor: "background.paper",
  p: 3,
  borderRadius: "8px",
};

const LanguageQueryModal = ({
  open,
  handleClose,
  loading,
  data = [],
  type,
  row,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);
  const [acceptLoading, setAcceptLoading] = useState(false);

  // * preview
  const [selectedLocalQuery, setSelectedLocalQuery] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setSelectedLocalQuery("");
  };

  const handlePreviewOpen = (paramRow) => {
    setSelectedLocalQuery(paramRow.query);
    setPreviewOpen(true);
  };

  const columns = [
    { field: "language", headerName: "Language", width: 120 },
    {
      field: "view",
      headerName: "View",
      width: 50,
      renderCell: (params) => (
        <IconButton
          onClick={() => handlePreviewOpen(params.row)}
          color="primary"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
    { field: "query", headerName: "Query", width: 300 },
  ];

  const rows = data.map((item, index) => ({
    id: index + 1,
    query: item.query,
    language: item.langName,
    ...item,
  }));

  const handleSelectChange = (newSelectionModel) => {
    setSelectionModal(newSelectionModel);
    const selectedData = rows.filter((item) =>
      newSelectionModel.includes(item.id)
    );
    setSelectedRows(selectedData);
  };

  const handleValidateAndAdd = async () => {
    if (!selectedRows.length) {
      toast.error("Please select at least one row.");
    }

    try {
      setAcceptLoading(true);

      const requests = selectedRows.map(async (item) => {
        const { id, query } = item;

        const requestData = {
          companyId: row?.companyId,
          companyName: row?.companyName,
          //   langId: id,
        };

        const includeQuery = {};
        const excludeQuery = {};

        if (type === "Include Query") {
          includeQuery.query = query;
          includeQuery.langId = id;
        }

        if (Object.keys(includeQuery).length) {
          requestData.includeQuery = includeQuery;
        }

        if (type === "Exclude Query") {
          excludeQuery.query = query;
          excludeQuery.langId = id;
        }

        if (Object.keys(excludeQuery).length) {
          requestData.excludeQuery = excludeQuery;
        }

        try {
          const response = await axiosInstance.post("newBoolean", requestData);
          if (response.status === 200) {
            toast.success(response.data.data.message);
          }
        } catch (error) {
          toast.error("Something went wrong with the request for row " + id);
        }
      });

      const responses = await Promise.all(requests);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAcceptLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="language-query-modal"
      aria-describedby="language-query-modal-description"
      maxWidth="sm"
      fullWidth
      sx={{ width: "100%" }}
    >
      <Box sx={style}>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            density="compact"
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectionModal}
            onRowSelectionModelChange={handleSelectChange}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleValidateAndAdd}
            disabled={acceptLoading}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {acceptLoading && <CircularProgress size={"1em"} />}
            Accept
          </Button>
        </Box>
        <PreviewModal
          handleClose={handlePreviewClose}
          open={previewOpen}
          row={row}
          query={{
            query: selectedLocalQuery,
            whichQuery: type,
          }}
        />
      </Box>
    </Dialog>
  );
};

LanguageQueryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.array,
  type: PropTypes.string,
  row: PropTypes.object,
};

export default LanguageQueryModal;

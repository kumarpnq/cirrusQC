import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Paper, IconButton } from "@mui/material";
import { DataGrid, GridCloseIcon } from "@mui/x-data-grid";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";

const PreviewModal = ({ open, handleClose, row, query }) => {
  // Sample data for DataGrid
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Columns for DataGrid
  const columns = [
    { field: "articleId", headerName: "ID", width: 150 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "headline", headerName: "Headline", width: 300 },
    { field: "summary", headerName: "Summary", width: 450 },
  ];

  useEffect(() => {
    const fetchBooleanRecords = async () => {
      try {
        setLoading(true);
        const requestData = {
          companyId: row?.companyId,
          companyName: row?.companyName,
        };
        if (query?.whichQuery === "Include Query")
          requestData.includeQuery = query?.query;
        if (query?.whichQuery === "Exclude Query")
          requestData.excludeQuery = query?.query;
        const response = await axiosInstance.post(
          "validateBooleanQuery",
          requestData
        );
        if (response.status === 200) {
          toast.success(response.data.data.message);
          setData(response.data.data.data || []);
        }
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchBooleanRecords();
  }, [open, query?.query, query?.whichQuery, row?.companyId, row?.companyName]);

  const rows = data.map((item) => ({
    id: item._id,
    type: item._index,
    articleId: item._source.articleId || item._source.socialFeedId,
    headline:
      item._source?.feedData?.headlines || item._source?.articleData?.headlines,
    summary:
      item._source?.feedData?.summary || item._source?.articleData?.summary,
  }));

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
          <IconButton onClick={handleClose} color="primary">
            <GridCloseIcon />
          </IconButton>
        </Box>

        {/* DataGrid to display results */}
        <Box sx={{ width: "100%", height: 550 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            loading={loading}
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
  row: PropTypes.object,
  query: PropTypes.object,
};
export default PreviewModal;

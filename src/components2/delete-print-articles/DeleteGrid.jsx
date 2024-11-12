import PropTypes from "prop-types";
import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import axios from "axios";
import toast from "react-hot-toast";
import { url } from "../../constants/baseUrl";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";

const CustomToolbar = ({ onDelete, loading }) => {
  return (
    <GridToolbarContainer
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={onDelete}
        sx={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        {loading && <CircularProgress size={"1em"} color="error" />} Delete
      </Button>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

CustomToolbar.propTypes = {
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const columns = [
  { field: "scanId", headerName: "Scan ID", width: 150 },
  { field: "uploadId", headerName: "Upload ID", width: 250 },
  { field: "articleDate", headerName: "Article Date", width: 150 },
  { field: "uploadDate", headerName: "Upload Date", width: 150 },
  { field: "publication", headerName: "Publication", width: 200 },
  { field: "pageNumber", headerName: "Page Number", width: 150 },
];

const DeleteGrid = ({ data = [], setData, loading }) => {
  const [selectionModal, setSelectionModal] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const rows = data.map((article, index) => ({
    id: index,
    scanId: article.article_id,
    uploadId: article.upload_id,
    articleDate: article.article_date,
    uploadDate: article.upload_date,
    publication: article.publication_name,
    pageNumber: article.page_number,
  }));

  const handleSelectionChange = (newSelectionModel) => {
    setSelectionModal(newSelectionModel);
    const selectedData = rows.filter((row) =>
      newSelectionModel.includes(row.id)
    );
    setSelectedRows(selectedData);
  };

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      const articleIds = selectedRows.map((i) => i.scanId);
      //   const testURL = "http://127.0.0.1:8000/";
      const token = localStorage.getItem("user");

      const requestData = {
        article_ids: articleIds,
      };
      const response = await axios.delete(`${url}deleteprintarticles/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: requestData,
      });
      toast.success(response.data.message);
      const filteredData = data.filter(
        (article) => !articleIds.includes(article.article_id)
      );
      setData(filteredData);
      setSelectedRows([]);
      setSelectionModal([]);
      setDeleteOpen(false);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteOpen = () => {
    if (!selectedRows.length) {
      toast.error("No rows to delete.");
      return;
    }
    setDeleteOpen((prev) => !prev);
  };

  return (
    <Box>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          density="compact"
          checkboxSelection
          loading={loading}
          slots={{
            toolbar: () => (
              <CustomToolbar
                onDelete={handleDeleteOpen}
                loading={deleteLoading}
              />
            ),
          }}
          rowSelectionModel={selectionModal}
          onRowSelectionModelChange={handleSelectionChange}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={onDelete}
      />
    </Box>
  );
};

DeleteGrid.propTypes = {
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default DeleteGrid;

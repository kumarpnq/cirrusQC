import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import KeywordView from "./KeywordView";
import AddEditDialog from "./AddEditDialog";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";
import toast from "react-hot-toast";
import axiosInstance from "../../../axiosConfig";

const BooleanGrid = ({ data = [], loading, setData }) => {
  const [openEditOrView, setOpenEditOrView] = useState({
    edit: false,
    view: false,
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpen = (row, mode) => {
    setSelectedRow(row);
    setOpenEditOrView((prev) => ({ ...prev, [mode]: true }));
  };

  const handleDeleteOpen = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `removeCompanyKeywords/?companyId=${selectedRow?.companyId}`
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setDeleteModalOpen(false);
        setSelectedRow(null);
        const filteredData = data.filter(
          (item) => item.companyId !== selectedRow.companyId
        );
        setData(filteredData);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  // Columns for the DataGrid
  const columns = [
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            onClick={() => handleOpen(params.row, "edit")}
          >
            <EditNoteIcon className="text-primary" />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleDeleteOpen(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "keyword",
      headerName: "Keyword",
      renderCell: (params) => (
        <IconButton
          aria-label="view"
          onClick={() => handleOpen(params.row, "view")}
        >
          <VisibilityIcon className="text-primary" />
        </IconButton>
      ),
    },
    {
      field: "companyName",
      headerName: "Company",
      width: 300,
    },
  ];

  const rows = data.map((item, index) => ({
    id: index,
    ...item,
  }));

  return (
    <>
      <div style={{ height: "80vh", width: "100%", marginTop: 4 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          density="compact"
          loading={loading}
          slots={{
            toolbar: () => (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <GridToolbarExport />
                <GridToolbarQuickFilter />
              </div>
            ),
          }}
          hideFooterSelectedRowCount
        />
      </div>
      <KeywordView
        open={openEditOrView.view}
        handleClose={() =>
          setOpenEditOrView({
            edit: false,
            view: false,
          })
        }
        row={selectedRow}
      />
      <AddEditDialog
        open={openEditOrView.edit}
        handleClose={() =>
          setOpenEditOrView({
            edit: false,
            view: false,
          })
        }
        fromWhere="Edit"
        row={selectedRow}
      />

      <DeleteConfirmationDialog
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDelete}
      />
    </>
  );
};

BooleanGrid.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  setData: PropTypes.func,
};
export default BooleanGrid;

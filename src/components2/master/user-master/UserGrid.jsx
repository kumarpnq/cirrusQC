import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolbar } from "../../../@core/CustomGridToolExportAndFilter";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import UserAddEditModal from "./UserAddEditModal";

const UserGrid = ({ loading, data = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const rows = data.map((item) => ({
    id: item._id,
    ...item,
  }));

  const handleOpen = (row) => {
    setOpen((prev) => !prev);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleOpen(params.row)}>
          <EditNoteIcon />
        </IconButton>
      ),
      width: 70,
      sortable: false,
      disableColumnMenu: true,
    },

    {
      field: "isActive",
      headerName: "Active",
      renderCell: (params) => (
        <Box
          sx={{
            color: params.row.isActive === "Y" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {params.row.isActive === "Y" ? "Yes" : "No"}
        </Box>
      ),
      width: 100,
    },
    { field: "userType", headerName: "User Type", width: 150 },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "loginName", headerName: "Login Name", width: 150 },
  ];

  return (
    <Fragment>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          density="compact"
          slots={{
            toolbar: CustomToolbar,
          }}
          loading={loading}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <UserAddEditModal
        open={open}
        handleClose={handleClose}
        row={selectedRow}
        fromWhere={"Edit"}
      />
    </Fragment>
  );
};

UserGrid.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      userType: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      loginName: PropTypes.string.isRequired,
      isActive: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

UserGrid.defaultProps = {
  loading: false,
  data: [],
};
export default UserGrid;

import { Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { EditNoteOutlined } from "@mui/icons-material";
import UserDetailsAddEdit from "./UserDetailsAddEdit";

// Sample data for the table
const userData = [
  {
    id: 1,
    userName: "John Doe",
    loginName: "jdoe",
    password: "password123",
    active: true,
  },
  {
    id: 2,
    userName: "Jane Smith",
    loginName: "jsmith",
    password: "abcde123",
    active: false,
  },
  {
    id: 3,
    userName: "Emily Johnson",
    loginName: "ejohnson",
    password: "mypassword",
    active: true,
  },
];

const renderActiveStatus = (params) => {
  return (
    <Typography
      style={{
        color: params.value ? "green" : "orange",
        fontWeight: "bold",
      }}
    >
      {params.value ? "Yes" : "No"}
    </Typography>
  );
};

const UserDetails = () => {
  const [addEditOpen, setAddEditOpen] = useState({
    add: false,
    edit: false,
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const handleOpenEdit = (row) => {
    setSelectedRow(row);
    setAddEditOpen({ add: false, edit: true });
  };
  const handleOpenAdd = () => {
    setAddEditOpen({ add: true, edit: false });
  };

  const handleEditClose = () => {
    setSelectedRow(null);
    setAddEditOpen((prev) => ({
      ...prev,
      edit: false,
    }));
  };
  const handleAddClose = () => {
    setAddEditOpen((prev) => ({
      ...prev,
      add: false,
    }));
  };

  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: "primary.main" }}
          onClick={() => handleOpenEdit(params.row)}
        >
          <EditNoteOutlined />
        </IconButton>
      ),
    },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "loginName", headerName: "Login Name", width: 150 },
    { field: "password", headerName: "Password", width: 150, type: "password" },
    {
      field: "active",
      headerName: "Active",
      width: 120,
      renderCell: renderActiveStatus,
    },
  ];

  return (
    <Fragment>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Typography sx={{ fontSize: "1em", color: "primary.main" }}>
          User Details
        </Typography>
        <Button size="small" variant="outlined" onClick={handleOpenAdd}>
          Add
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box style={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={userData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          density="compact"
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <UserDetailsAddEdit
        openedFromWhere="edit"
        open={addEditOpen.edit}
        handleClose={handleEditClose}
        selectedRow={selectedRow}
      />
      <UserDetailsAddEdit
        openedFromWhere="add"
        open={addEditOpen.add}
        handleClose={handleAddClose}
      />
    </Fragment>
  );
};

export default UserDetails;

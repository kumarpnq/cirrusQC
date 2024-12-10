import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import AddEditModal from "./AddEditModal";

export default function WhatsappGrid({
  whatsAppData = [],
  loading,
  fetchMainData,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<EditNoteIcon color="primary" />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
        />,
      ],
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 120,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Y" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {params.value === "Y" ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "client",
      headerName: "Client",
      width: 150,
    },
    {
      field: "contacts",
      headerName: "Contact",
      width: 250,
      renderCell: (params) => {
        const whatsappConfig = params.row?.whatsappConfig || [];

        const activeContacts = whatsappConfig
          .flatMap((config) =>
            config.contacts.filter((contact) => contact.isActive === "Y")
          )
          .map((contact) => contact.contactNumber)
          .join(", ");

        return (
          <div>
            {activeContacts.length > 0 ? activeContacts : "No active contacts"}
          </div>
        );
      },
    },
  ];

  const rows = whatsAppData.map((item, index) => ({
    id: index,
    ...item,
  }));

  const handleEdit = (id) => {
    setSelectedRow(id);
    setOpenEdit((prev) => !prev);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedRow(null);
  };
  const handleDelete = (id) => {
    // Handle delete action
    console.log("Delete row", id);
  };

  return (
    <Fragment>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          loading={loading}
        />
      </div>
      <AddEditModal
        open={openEdit}
        handleClose={handleEditClose}
        row={selectedRow}
        fromWhere={"Edit"}
        fetchMainData={fetchMainData}
      />
    </Fragment>
  );
}

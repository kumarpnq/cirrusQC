import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import AddEditModal from "./AddEditModal";
import axiosInstance from "../../../../axiosConfig";
import DeleteConfirmationDialog from "../../../@core/DeleteConfirmationDialog";
import toast from "react-hot-toast";

export default function WhatsappGrid({
  whatsAppData = [],
  loading,
  fetchMainData,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = (row) => {
    setDeleteOpen((prev) => !prev);
    setSelectedRow(row);
  };
  const handleDeleteClose = () => {
    setSelectedRow(null);
    setDeleteOpen(false);
  };
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
          onClick={() => handleDeleteOpen(params.row)}
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
      field: "clientName",
      headerName: "Client",
      width: 200,
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
  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `removeWhatsappConfig/?clientId=${selectedRow?.clientId}`
      );
      if (response.status === 200) {
        setDeleteOpen(false);
        toast.success("Contact deleted.");
      }
    } catch (error) {
      console.log(error);
    }
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
      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        onDelete={handleDelete}
      />
    </Fragment>
  );
}

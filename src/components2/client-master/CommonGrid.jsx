import { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, CircularProgress, Divider } from "@mui/material";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import useFetchMongoData from "../../hooks/useFetchMongoData";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";

const CommonGrid = ({ clientId, setSelectedMainTab }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: onlinePublications } = useFetchMongoData(
    `onlinePublicationList/`
  );
  const onlinePublicationListArray = onlinePublications?.data?.data || [];

  const [tableData, setTableData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `clientPublicationOnline/?clientId=${clientId}`
      );
      setTableData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const rows = tableData.map((item, index) => ({
    id: index,
    ...item,
  }));

  const columns = [
    { field: "publicationName", headerName: "Publication Name", width: 200 },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectionModal(newSelection);
    const selectedRowsData = rows.filter((row) =>
      newSelection.includes(row.id)
    );

    setSelectedRows(selectedRowsData);
  };

  const addNewPublication = async () => {
    try {
      setAddLoading(true);
      const publicationNames = onlinePublicationListArray
        .filter((i) => selectedItems.includes(i.publicationId))
        .map((i) => i.publicationName);

      const requestData = {
        clientId,
        publications: publicationNames,
      };
      const response = await axiosInstance.post(
        `addOnlineClientPublication/`,
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setSelectedItems([]);
        fetchData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteOpen = () => setDeleteOpen((prev) => !prev);
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleDelete = async () => {
    try {
      const params = {
        clientId,
        publications: selectedRows.map((i) => i.publicationName).join(","),
      };
      const response = await axiosInstance.delete(
        `removeOnlineClientPublication`,
        { params }
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setSelectedRows([]);
        setSelectionModal([]);
        fetchData();
        handleDeleteClose();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Fragment>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CustomMultiSelect
          options={onlinePublicationListArray}
          dropdownToggleWidth={300}
          dropdownWidth={300}
          keyId="publicationId"
          keyName="publicationName"
          title="Publication"
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={addNewPublication}
          sx={{ display: "flex", gap: 1 }}
        >
          {addLoading && <CircularProgress size={"1em"} />}
          Add
        </Button>

        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleDeleteOpen}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSelectedMainTab("Print Publications")}
        >
          Next
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          density="compact"
          loading={loading}
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectionModal}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <DeleteConfirmationDialog
        onClose={handleDeleteClose}
        open={deleteOpen}
        onDelete={handleDelete}
      />
    </Fragment>
  );
};

CommonGrid.propTypes = {
  clientId: PropTypes.string.isRequired,
  setSelectedMainTab: PropTypes.func,
};

export default CommonGrid;

import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import PrintGrid from "./PrintGrid";
import { useState } from "react";
import PrintAddModal from "./PrintAddModal";
// import PropTypes from "prop-types";
import toast from "react-hot-toast";
import axiosInstance from "../../../../axiosConfig";

const PrintCluster = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clusterData, setClusterData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleEditOpen = () => setAddModalOpen(true);
  const handleEditClose = () => setAddModalOpen(false);

  const fetchClusterMaster = async (event) => {
    event?.preventDefault();
    try {
      setLoading(true);
      const clusterType = "print";
      const response = await axiosInstance.get(
        `cluster/clusterMaster/?clusterType=${clusterType}`
      );

      setClusterData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const deletePrintCluster = async () => {
    try {
      const params = {
        clusterIds: selectedItems.join(","),
      };
      const response = await axiosInstance.delete(`cluster/deleteCluster/`, {
        params,
      });
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setSelectedItems([]);
        setDeleteOpen(false);
        fetchClusterMaster();
      }
    } catch (error) {
      toast.error("something went wrong.");
    }
  };
  return (
    <Box sx={{ mt: 0.5 }}>
      <SearchFilters
        handleOpen={handleEditOpen}
        handleSubmit={fetchClusterMaster}
        loading={loading}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        onDelete={deletePrintCluster}
      />
      <Divider sx={{ my: 1 }} />
      <PrintGrid
        loading={loading}
        clusterData={clusterData}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
      />
      <PrintAddModal
        open={addModalOpen}
        handleClose={handleEditClose}
        fromWhere="Add"
        row={null}
      />
    </Box>
  );
};

PrintCluster.propTypes = {};
export default PrintCluster;

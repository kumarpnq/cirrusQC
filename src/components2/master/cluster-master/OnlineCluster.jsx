import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import OnlineGrid from "./OnlineGrid";
import { useState } from "react";
import OnlineAddModal from "./OnlineAddModal";
import toast from "react-hot-toast";
import axiosInstance from "../../../../axiosConfig";
// import PropTypes from "prop-types";

const OnlineCluster = () => {
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
      const clusterType = "online";
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

  const deleteOnlineCluster = async () => {
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
        loading={loading}
        handleSubmit={fetchClusterMaster}
        onDelete={deleteOnlineCluster}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
      />
      <Divider sx={{ my: 1 }} />
      <OnlineGrid
        clusterData={clusterData}
        loading={loading}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
      />
      <OnlineAddModal
        open={addModalOpen}
        handleClose={handleEditClose}
        fromWhere={"Add"}
        row={null}
      />
    </Box>
  );
};

OnlineCluster.propTypes = {};
export default OnlineCluster;

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
  const handleEditOpen = () => setAddModalOpen(true);
  const handleEditClose = () => setAddModalOpen(false);

  const fetchClusterMaster = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const clusterType = "print";
      const response = await axiosInstance.get(
        `clusterMaster/?clusterType=${clusterType}`
      );

      setClusterData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ mt: 0.5 }}>
      <SearchFilters
        handleOpen={handleEditOpen}
        handleSubmit={fetchClusterMaster}
        loading={loading}
      />
      <Divider sx={{ my: 1 }} />
      <PrintGrid loading={loading} clusterData={clusterData} />
      <PrintAddModal open={addModalOpen} handleClose={handleEditClose} />
    </Box>
  );
};

PrintCluster.propTypes = {};
export default PrintCluster;

import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  ListItemText,
  TextField,
  ListItem,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import useFetchMongoData from "../../../hooks/useFetchMongoData";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

const OnlineAddModal = ({ open, handleClose, row, fromWhere }) => {
  const { data: onlinePublications } = useFetchMongoData(
    `onlinePublicationList/`
  );
  const onlinePublicationListArray = onlinePublications?.data?.data || [];

  const [clusterName, setClusterName] = useState("");
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [searchText, setSearchText] = useState("");

  // * add update states
  const [initialState, setInitialState] = useState(null);

  const fetchClusterData = async () => {
    try {
      const params = {
        clusterType: "online",
        clusterId: row?.clusterId,
      };
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/cluster/clusterDetails/`,
        { params }
      );
      let localState = response.data.data.clusterData;
      setInitialState(localState);
      setClusterName(localState.clusterName);
      let localPublicationIds =
        localState.publicationList.map((i) => ({
          publicationId: i.id,
          publicationName: i.publicationName,
        })) || [];
      setSelectedPublications(localPublicationIds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fromWhere === "Edit" && row?.clusterId) {
      fetchClusterData();
    }
  }, [fromWhere, row?.clusterId]);

  // * add update states
  const [loading, setLoading] = useState(false);

  // Toggle selected items
  const handleToggle = (publication) => {
    const currentIndex = selectedPublications.findIndex(
      (selected) => selected.publicationId === publication.publicationId
    );
    const newSelected = [...selectedPublications];

    if (currentIndex === -1) {
      newSelected.push({
        publicationId: publication.publicationId,
        publicationName: publication.publicationName,
      });
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedPublications(newSelected);
  };

  // * add new cluster
  const handleAddCluster = async () => {
    try {
      setLoading(true);
      const requestData = {
        clusterType: "online",
        clusterName,
        publicationList: selectedPublications,
      };
      const response = await axiosInstance.post(
        `http://127.0.0.1:8000/cluster/createCluster/`,
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setClusterName("");
        setSearchText("");
        setSelectedPublications([]);
        handleClose();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // * update cluster
  const handleUpdateCluster = async () => {
    try {
      setLoading(true);

      // Step 1: Create a request object with only changed fields
      const requestData = {
        clusterType: "online",
        clusterId: row?.clusterId,
      };

      // Step 2: Check if the cluster name has changed and include it if necessary
      if (initialState.clusterName !== clusterName) {
        requestData.clusterName = clusterName;
      }

      // Step 3: Calculate added and removed publications
      const initialPublicationIds = initialState.publicationList.map(
        (pub) => pub.id
      );
      const selectedPublicationIds = selectedPublications.map(
        (pub) => pub.publicationId
      );

      const removedPublications = initialPublicationIds.filter(
        (id) => !selectedPublicationIds.includes(id)
      );
      const addedPublications = selectedPublicationIds.filter(
        (id) => !initialPublicationIds.includes(id)
      );

      // Step 4: Add removed and added publications if any changes
      if (removedPublications.length > 0) {
        requestData.removedPublications = removedPublications.join(",");
      }

      if (addedPublications.length > 0) {
        requestData.addedPublications = addedPublications.map((id) => ({
          publicationId: id,
          publicationName: selectedPublications.find(
            (pub) => pub.publicationId === id
          ).publicationName,
        }));
      }

      // Step 5: Send the update request
      const response = await axiosInstance.post(
        `http://127.0.0.1:8000/cluster/updateClusterDetails/`,
        requestData
      );

      if (response.status === 200) {
        toast.success(response.data.data.message);
        fetchClusterData(); // Fetch updated cluster data after successful update
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = onlinePublicationListArray
    .filter((item) =>
      item.publicationName.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const isASelected = selectedPublications.some(
        (selected) => selected.publicationId === a.publicationId
      );
      const isBSelected = selectedPublications.some(
        (selected) => selected.publicationId === b.publicationId
      );

      // Ensure selected items appear at the top
      if (isASelected && !isBSelected) return -1;
      if (!isASelected && isBSelected) return 1;
      return 0; // If both are selected or both are not, maintain order
    });

  const renderRow = ({ index, style }) => {
    const item = filteredData[index];
    const labelId = `checkbox-list-label-${item.publicationId}`;

    return (
      <ListItem
        key={item.publicationId}
        role={undefined}
        dense
        button
        onClick={() => handleToggle(item)}
        style={style}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selectedPublications.some(
              (selected) => selected.publicationId === item.publicationId
            )}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={item.publicationName} />
      </ListItem>
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          mb={2}
          fontSize={"1em"}
        >
          Add Online Cluster
        </Typography>

        <TextField
          size="small"
          fullWidth
          placeholder="Cluster Name"
          value={clusterName}
          onChange={(e) => setClusterName(e.target.value)}
          sx={{ my: 0.5 }}
        />

        {/* Multi-select List */}
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 1,
            height: 275,
            // overflow: "auto",
          }}
        >
          <TextField
            size="small"
            placeholder="Search Publications"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
            sx={{ mb: 2, p: 1 }}
          />
          <FixedSizeList
            height={200}
            width={360}
            itemSize={46}
            itemCount={filteredData.length}
          >
            {renderRow}
          </FixedSizeList>
        </Box>

        {/* Action Buttons */}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleClose}
            color="primary"
            size="small"
            variant="outlined"
            sx={{ mr: 0.5 }}
          >
            Close
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={
              fromWhere === "Add" ? handleAddCluster : handleUpdateCluster
            }
            sx={{ display: "flex", gap: 1 }}
          >
            {loading && <CircularProgress size={"1em"} />}
            {fromWhere === "Add" ? "Save" : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

OnlineAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default OnlineAddModal;

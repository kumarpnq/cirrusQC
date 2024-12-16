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
import { useState } from "react";
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

const OnlineAddModal = ({ open, handleClose }) => {
  const { data: onlinePublications } = useFetchMongoData(
    `onlinePublicationList/`
  );
  const onlinePublicationListArray = onlinePublications?.data?.data || [];

  const [clusterName, setClusterName] = useState("");
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const filteredData = onlinePublicationListArray.filter((item) =>
    item.publicationName.toLowerCase().includes(searchText.toLowerCase())
  );

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
            onClick={handleAddCluster}
            sx={{ display: "flex", gap: 1 }}
          >
            {loading && <CircularProgress size={"1em"} />}
            Save
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

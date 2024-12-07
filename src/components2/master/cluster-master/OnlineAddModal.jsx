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
} from "@mui/material";
import { useState } from "react";
import { FixedSizeList } from "react-window";
import useFetchMongoData from "../../../hooks/useFetchMongoData";

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

  const [ClusterName, setClusterName] = useState("");
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Toggle selected items
  const handleToggle = (publicationId) => {
    const currentIndex = selectedPublications.indexOf(publicationId);
    const newSelected = [...selectedPublications];

    if (currentIndex === -1) {
      newSelected.push(publicationId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedPublications(newSelected);
  };

  // Filter list based on search input
  const filteredData = onlinePublicationListArray.filter((item) =>
    item.publicationName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderRow = ({ index, style }) => {
    const item = filteredData[index];
    const labelId = `checkbox-list-label-${item.publicationId}`;

    return (
      <ListItem
        key={item.publicationId}
        role={undefined}
        dense
        button
        onClick={() => handleToggle(item.publicationId)}
        style={style}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selectedPublications.indexOf(item.publicationId) !== -1}
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
          value={ClusterName}
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
          <Button size="small" variant="outlined">
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

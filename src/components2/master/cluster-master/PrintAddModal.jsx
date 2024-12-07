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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

const PrintAddModal = ({ open, handleClose }) => {
  const demoPublications = [
    { id: "msn", name: "msn.com" },
    { id: "nyt", name: "nytimes.com" },
    { id: "bbc", name: "bbc.com" },
    { id: "cnn", name: "cnn.com" },
    { id: "forbes", name: "forbes.com" },
  ];

  const demoCities = [
    { id: "ny", name: "New York" },
    { id: "la", name: "Los Angeles" },
    { id: "sf", name: "San Francisco" },
    { id: "chi", name: "Chicago" },
    { id: "bos", name: "Boston" },
  ];

  const [clusterName, setClusterName] = useState("");
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [searchPublications, setSearchPublications] = useState("");
  const [searchCities, setSearchCities] = useState("");

  // Toggle selected items for Publications
  const handleTogglePublication = (id) => {
    const currentIndex = selectedPublications.indexOf(id);
    const newSelected = [...selectedPublications];

    if (currentIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedPublications(newSelected);
  };

  // Toggle selected items for Cities
  const handleToggleCity = (id) => {
    const currentIndex = selectedCities.indexOf(id);
    const newSelected = [...selectedCities];

    if (currentIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedCities(newSelected);
  };

  // Filter lists based on search input
  const filteredPublications = demoPublications.filter((item) =>
    item.name.toLowerCase().includes(searchPublications.toLowerCase())
  );

  const filteredCities = demoCities.filter((item) =>
    item.name.toLowerCase().includes(searchCities.toLowerCase())
  );

  const renderRow = (data, handleToggle, selectedItems) => {
    const rowRenderer = ({ index, style }) => {
      const item = data[index];
      const labelId = `checkbox-list-label-${item.id}`;

      return (
        <ListItem
          key={item.id}
          role={undefined}
          dense
          button
          onClick={() => handleToggle(item.id)}
          style={style}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={selectedItems.indexOf(item.id) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": labelId }}
            />
          </ListItemIcon>
          <ListItemText id={labelId} primary={item.name} />
        </ListItem>
      );
    };

    rowRenderer.displayName = "RowRenderer";
    return rowRenderer;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" mb={2}>
          Add Print Cluster
        </Typography>
        <TextField
          size="small"
          fullWidth
          placeholder="Cluster Name"
          value={clusterName}
          onChange={(e) => setClusterName(e.target.value)}
          sx={{ mb: 0.5 }}
        />
        <Box display="flex" gap={2}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                height: 270,
              }}
            >
              <TextField
                size="small"
                placeholder="Search Publications"
                value={searchPublications}
                onChange={(e) => setSearchPublications(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FixedSizeList
                height={200}
                // width={280}
                itemSize={46}
                itemCount={filteredPublications.length}
              >
                {renderRow(
                  filteredPublications,
                  handleTogglePublication,
                  selectedPublications
                )}
              </FixedSizeList>
            </Box>
          </Box>

          {/* Cities Section */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                height: 270,
              }}
            >
              <TextField
                size="small"
                placeholder="Search Cities"
                value={searchCities}
                onChange={(e) => setSearchCities(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FixedSizeList
                height={200}
                // width={280}
                itemSize={46}
                itemCount={filteredCities.length}
              >
                {renderRow(filteredCities, handleToggleCity, selectedCities)}
              </FixedSizeList>
            </Box>
          </Box>
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

PrintAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PrintAddModal;

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  List,
  ListItem,
  Input,
  Paper,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

const SelectableList = ({
  data = [],
  idKey,
  nameKey,
  selectedItems,
  setSelectedItems,
  placeholder,
}) => {
  const [selectedItemsLocal, setSelectedItemsLocal] = useState([]);

  useEffect(() => {
    setSelectedItemsLocal(selectedItems);
  }, [selectedItems]);

  const handleToggleItem = (item) => () => {
    const currentIndex = selectedItemsLocal.findIndex((i) => i === item[idKey]);
    const newSelectedItems = [...selectedItemsLocal];

    if (currentIndex === -1) {
      newSelectedItems.push(item[idKey]);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }

    setSelectedItemsLocal(newSelectedItems);
    setSelectedItems(newSelectedItems);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = () => {
    const localIds = data.map((i) => i[idKey]);
    setSelectedItemsLocal([...localIds]);
    setSelectedItems([...localIds]);
  };

  const handleSelectNone = () => {
    setSelectedItemsLocal([]);
    setSelectedItems([]);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems =
    data.filter((item) =>
      item[nameKey].toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <Box sx={{ maxWidth: 300, mt: 1 }} component={Paper}>
      <Input
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        startAdornment={<SearchOutlined />}
        endAdornment={
          selectedItemsLocal.length > 0 ? (
            <Box display="flex" alignItems="center">
              <span>{selectedItemsLocal.length}</span>
            </Box>
          ) : null
        }
        placeholder={placeholder || "Search items..."}
      />
      <List sx={{ overflow: "auto", height: 350 }} dense>
        <ListItem dense>
          <Button size="small" onClick={handleSelectAll}>
            All
          </Button>
          <Button size="small" onClick={handleSelectNone}>
            None
          </Button>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        {filteredItems?.map(
          (item) =>
            item &&
            item[idKey] && (
              <Box
                key={item[idKey]}
                onClick={handleToggleItem(item)}
                sx={{
                  padding: "8px",
                  marginBottom: "4px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  backgroundColor: selectedItemsLocal?.some(
                    (i) => i === item[idKey]
                  )
                    ? "primary.main"
                    : "inherit",
                  color: selectedItemsLocal?.some((i) => i === item[idKey])
                    ? "white"
                    : "inherit",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
                fontSize={"0.9em"}
              >
                <Typography variant="body1" fontSize={"0.9em"}>
                  {item[nameKey] || "Unnamed"}
                </Typography>
              </Box>
            )
        )}
      </List>
    </Box>
  );
};

// Updated PropTypes to reflect the correct data keys
SelectableList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      companyid: PropTypes.string.isRequired, // changed from cityid to companyid
      companyname: PropTypes.string.isRequired, // changed from cityname to companyname
    })
  ).isRequired,
  idKey: PropTypes.string.isRequired, // idKey now refers to 'companyid'
  nameKey: PropTypes.string.isRequired, // nameKey now refers to 'companyname'
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string,
};

export default SelectableList;

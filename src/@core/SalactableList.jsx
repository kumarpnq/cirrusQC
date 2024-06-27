import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Input,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

const SelectableList = ({
  data,
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
    const currentIndex = selectedItemsLocal.findIndex(
      (i) => i[idKey] === item[idKey]
    );
    const newSelectedItems = [...selectedItemsLocal];

    if (currentIndex === -1) {
      newSelectedItems.push(item);
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
    setSelectedItemsLocal([...data]);
    setSelectedItems([...data]);
  };

  const handleSelectNone = () => {
    setSelectedItemsLocal([]);
    setSelectedItems([]);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = data.filter((item) =>
    item[nameKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredItems.map((item) => (
          <ListItem
            key={item[idKey]}
            button
            onClick={handleToggleItem(item)}
            dense
            selected={selectedItemsLocal.some((i) => i[idKey] === item[idKey])}
          >
            <ListItemText primary={item[nameKey]} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

SelectableList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      cityid: PropTypes.number.isRequired,
      cityname: PropTypes.string.isRequired,
    })
  ).isRequired,
  idKey: PropTypes.string.isRequired,
  nameKey: PropTypes.string.isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string,
};

export default SelectableList;

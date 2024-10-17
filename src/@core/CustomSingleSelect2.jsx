import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  MenuItem,
  ListItemText,
  Input,
  Paper,
  Divider,
  Box,
  Typography,
  IconButton,
  List,
  Popper,
  ClickAwayListener,
  ListItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FixedSizeList as ListWindow } from "react-window";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 240,
    maxWidth: 360,
  },
  paperBox: {
    height: 250,
    background: "#fff",
    overflow: "hidden",
  },
  select: {
    minHeight: 40,
    maxHeight: 160,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: theme.spacing(1),
  },
  searchInput: {
    padding: "8px 12px",
  },
  optionItem: {
    minHeight: 40,
  },
  dropdownToggle: {
    border: "1px solid lightgray",
    height: 25,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "3px",
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      border: "1px solid black",
    },
  },
}));

const CustomSingleSelect = ({
  title,
  options,
  selectedItem,
  setSelectedItem,
  keyId,
  keyName,
  dropdownWidth,
  dropdownToggleWidth,
}) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleSelectChange = (option) => {
    // Deselect if the selected item is clicked again
    if (selectedItem === option[keyId]) {
      setSelectedItem(null);
    } else {
      setSelectedItem(option[keyId]);
    }
    setListOpen(false); // Close dropdown after selection
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggle = () => {
    setListOpen((prev) => !prev);
  };

  const handleClickAway = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setListOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option[keyName]?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const Row = ({ index, style }) => {
    const option = filteredOptions[index];
    return (
      <MenuItem
        key={option[keyId]}
        value={option[keyId]}
        onClick={() => handleSelectChange(option)}
        selected={selectedItem === option[keyId]}
        dense
        style={style}
      >
        <ListItemText primary={option[keyName]} />
      </MenuItem>
    );
  };

  return (
    <Box>
      <FormControl className={classes.formControl}>
        <Box
          ref={anchorRef}
          className={classes.dropdownToggle}
          onClick={handleToggle}
          sx={{ width: dropdownToggleWidth }}
        >
          <Typography
            component={"p"}
            sx={{
              textWrap: "nowrap",
              textOverflow: "ellipsis",
              fontSize: "0.8em",
            }}
          >
            {selectedItem ? (
              options
                .find((option) => option[keyId] === selectedItem)
                [keyName].substring(0, 30) + "..."
            ) : (
              <span className="italic text-gray-500 text-[0.9em]">{title}</span>
            )}
          </Typography>
          <IconButton aria-label="toggle list">
            {listOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </Box>
        <Popper
          open={listOpen}
          anchorEl={anchorRef.current}
          placement="bottom-end"
          disablePortal
          sx={{ zIndex: 50 }}
        >
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper sx={{ width: dropdownWidth }} className={classes.paperBox}>
              <List>
                <ListItem dense>
                  <Input
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    value={searchTerm}
                    className={classes.searchInput}
                    startAdornment={<SearchIcon />}
                    size="small"
                    autoFocus
                  />
                </ListItem>
                <Divider />
                <ListWindow
                  height={150}
                  itemCount={filteredOptions.length}
                  itemSize={40}
                  width={dropdownWidth}
                >
                  {Row}
                </ListWindow>
              </List>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </FormControl>
    </Box>
  );
};

CustomSingleSelect.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      keyId: PropTypes.number.isRequired,
      keyName: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedItem: PropTypes.number,
  setSelectedItem: PropTypes.func.isRequired,
  keyId: PropTypes.string.isRequired,
  keyName: PropTypes.string.isRequired,
  dropdownWidth: PropTypes.number.isRequired,
  dropdownToggleWidth: PropTypes.number.isRequired,
};

export default CustomSingleSelect;

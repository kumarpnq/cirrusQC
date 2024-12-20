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
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FixedSizeList as ListWindow } from "react-window";

const useStyles = makeStyles((theme) => ({
  formControl: {
    // minWidth: 240,
    // maxWidth: 360,
  },
  paperBox: {
    // height: 250,
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

const CustomMultiSelect = ({
  title,
  options,
  selectedItems,
  setSelectedItems,
  keyId,
  keyName,
  dropdownWidth,
  dropdownToggleWidth,
  isIncreased,
  isDisabled,
}) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleSelectChange = (option) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(option[keyId])) {
        return prevSelected.filter((item) => item !== option[keyId]);
      } else {
        return [...prevSelected, option[keyId]];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedItems(options.map((option) => option[keyId]));
  };

  const handleSelectNone = () => {
    setSelectedItems([]);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggle = (event) => {
    event?.preventDefault();
    setListOpen((prev) => !prev);
  };

  const handleClickAway = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setListOpen(false);
  };

  const filteredOptions = options?.filter((option) =>
    option[keyName].toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const Row = ({ index, style }) => {
    const option = filteredOptions[index];
    return (
      <MenuItem
        key={option[keyId]}
        value={option[keyId]}
        onClick={() => handleSelectChange(option)}
        selected={selectedItems.includes(option[keyId])}
        dense
        style={style}
      >
        <ListItemText primary={option[keyName]} />
      </MenuItem>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl className={classes.formControl}>
        <Box
          ref={anchorRef}
          className={classes.dropdownToggle}
          onClick={handleToggle}
          sx={{
            width: dropdownToggleWidth || "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: isDisabled ? "cell" : "",
          }}
          component={"button"}
          disabled={isDisabled}
        >
          <Typography component={"span"}>
            {selectedItems.length > 0 ? (
              `${selectedItems.length} selected`
            ) : (
              <span
                className={`italic text-[0.9em] ${
                  isDisabled ? "text-gray-300" : "text-gray-800"
                }`}
              >
                {title}
              </span>
            )}
          </Typography>
          <IconButton aria-label="toggle list" sx={{ padding: 0 }}>
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
            <Paper
              sx={{
                width: dropdownWidth || "100%",
                height: isIncreased ? 400 : 250,
              }}
              className={classes.paperBox}
            >
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
                <ListItem>
                  <Button onClick={handleSelectAll} size="small">
                    All
                  </Button>
                  <Button onClick={handleSelectNone} size="small">
                    None
                  </Button>
                </ListItem>
                <Divider />
                <ListWindow
                  height={isIncreased ? 300 : 150}
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

CustomMultiSelect.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      keyId: PropTypes.number.isRequired,
      keyName: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  keyId: PropTypes.string.isRequired,
  keyName: PropTypes.string.isRequired,
  dropdownWidth: PropTypes.number.isRequired,
  dropdownToggleWidth: PropTypes.number.isRequired,
  isIncreased: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default CustomMultiSelect;

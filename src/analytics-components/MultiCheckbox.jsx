import { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { Button, Divider, Tooltip } from "@mui/material";

const options = ["QC1 Header", "QC2 Header", "Qc1 Detail", "Qc2 Detail"];

const ITEM_HEIGHT = 48;

function LongMenu({ headerDetails, setHeaderDetails }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    setHeaderDetails((prevDetails) => ({
      ...prevDetails,
      [getOptionKey(option)]: !prevDetails[getOptionKey(option)],
    }));
  };

  const isSelected = (option) => headerDetails[getOptionKey(option)];

  const getOptionKey = (option) => {
    switch (option) {
      case "QC1 Header":
        return "qc1by_header";
      case "QC2 Header":
        return "qc2by_header";
      case "Qc1 Detail":
        return "qc1by_detail";
      case "Qc2 Detail":
        return "qc2by_detail";
      default:
        return "";
    }
  };

  const handleSelectAll = () => {
    const allSelectedDetails = options.reduce((acc, option) => {
      acc[getOptionKey(option)] = true;
      return acc;
    }, {});
    setHeaderDetails(allSelectedDetails);
  };

  const handleSelectNone = () => {
    const allDeselectedDetails = options.reduce((acc, option) => {
      acc[getOptionKey(option)] = false;
      return acc;
    }, {});
    setHeaderDetails(allDeselectedDetails);
  };

  return (
    <div>
      <Tooltip title="Header&detail">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{ fontSize: "0.9em", background: "#0a4f7d", color: "#fff" }}
        >
          QC
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem>
          <Button onClick={handleSelectAll} size="small">
            All
          </Button>
          <Button onClick={handleSelectNone} size="small">
            None
          </Button>
        </MenuItem>
        <Divider />
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleMenuItemClick(option)}
            selected={isSelected(option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

LongMenu.propTypes = {
  headerDetails: PropTypes.shape({
    qc1by_header: PropTypes.bool.isRequired,
    qc2by_header: PropTypes.bool.isRequired,
    qc1by_detail: PropTypes.bool.isRequired,
    qc2by_detail: PropTypes.bool.isRequired,
  }).isRequired,
  setHeaderDetails: PropTypes.func.isRequired,
};

export default LongMenu;

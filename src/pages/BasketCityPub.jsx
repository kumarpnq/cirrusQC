import PropTypes from "prop-types";
import { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import CompanyMaster from "../components2/company-master/CompanyMaster";
import PublicationMaster from "../components2/publication-master/PublicationMaster";
import PublicationMasterOnline from "../components2/publication-master-online/PublicationMasterOnline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PrintIcon from "@mui/icons-material/Print";
import PublicIcon from "@mui/icons-material/Public";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { styled } from "@mui/system";
import CityMaster from "../components2/master/city-master/CityMaster";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  position: "relative",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    boxShadow: `0 4px 12px ${theme.palette.primary.main}`,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      transform: "scale(1.05)",
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.05)",
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
  },
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: "40px",
  color: theme.palette.primary.main,
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "1em",
  textDecoration: "underline",
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "1px 1px gray",
  fontStyle: "italic",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const RenderComponent = ({ value }) => {
  switch (value) {
    case "City Master":
      return <CityMaster />;
    case "Company Master":
      return <CompanyMaster />;
    case "Publication Master":
      return <PublicationMaster />;
    case "Publication Master Online":
      return <PublicationMasterOnline />;
    default:
      return <>No page.</>;
  }
};

RenderComponent.propTypes = {
  value: PropTypes.number,
};
const BasketCityPub = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState("City Master");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (option) => {
    setSelectedItem(option?.label);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuOptions = [
    { label: "City Master", icon: <AccountCircleIcon /> },
    { label: "Company Master", icon: <EmailIcon /> },
    { label: "State Master", icon: <BusinessIcon /> },
    { label: "Country Master", icon: <LocationCityIcon /> },
    { label: "User Master", icon: <PrintIcon /> },
    { label: "Publication Master", icon: <PublicIcon /> },
    { label: "Publication Master Online", icon: <PriorityHighIcon /> },
  ];

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <StyledTypography>{selectedItem}</StyledTypography>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {menuOptions.map((option, index) => (
          <StyledMenuItem
            key={index}
            onClick={() => handleSelect(option)}
            selected={selectedItem === option.label}
          >
            <StyledListItemIcon>{option.icon}</StyledListItemIcon>
            <StyledListItemText primary={option.label} />
          </StyledMenuItem>
        ))}
      </Menu>
      <Divider />
      <RenderComponent value={selectedItem} />
    </Box>
  );
};

export default BasketCityPub;

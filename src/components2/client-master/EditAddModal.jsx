import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClientDetail from "./ClientDetail";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PrintIcon from "@mui/icons-material/Print";
import PublicIcon from "@mui/icons-material/Public";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { styled } from "@mui/system";
import EmailDetails from "./EmailDetails";
import CompanyBasket from "./CompanyBasket";
import KeywordDetails from "./KeywordDetails";
import BasketCityPubPage from "../../basketCityPub-components/BasketCityPubPage";

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

const EditAddModal = ({ open, onClose, openFromWhere }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Client Detail");

  const TabToRender = (val) => {
    switch (val) {
      case "Client Detail":
        return <ClientDetail />;
      case "Email Details":
        return <EmailDetails />;
      case "Company Basket":
        return <CompanyBasket />;
      case "Keyword Details":
        return <KeywordDetails />;
      case "Basket City Pub":
        return <BasketCityPubPage />;
      default:
        return <p>No record found.</p>;
    }
  };

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
    { label: "Client Detail", icon: <AccountCircleIcon /> },
    { label: "Email Details", icon: <EmailIcon /> },
    { label: "Company Basket", icon: <BusinessIcon /> },
    { label: "City Basket", icon: <LocationCityIcon /> },
    { label: "Print Publication", icon: <PrintIcon /> },
    { label: "Online Publication New", icon: <PublicIcon /> },
    { label: "Publication Priority", icon: <PriorityHighIcon /> },
    { label: "Keyword Details", icon: <DescriptionIcon /> },
    { label: "User Detail", icon: <PeopleIcon /> },
    { label: "Basket City Pub", icon: <LocationOnIcon /> },
  ];
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "99vw",
          height: "99vh",
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 1,
          outline: "none",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography component={"h2"} fontSize={"1em"}>
            {openFromWhere === "edit" ? "Edit" : "Add"} Modal
          </Typography>
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
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
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

        {TabToRender(selectedItem)}
      </Box>
    </Modal>
  );
};

EditAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  openFromWhere: PropTypes.string,
};

export default EditAddModal;

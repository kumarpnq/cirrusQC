import { useContext, useState } from "react";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PrintIcon from "@mui/icons-material/Print";
import PublicIcon from "@mui/icons-material/Public";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { styled } from "@mui/system";
import RenderComponent from "../components2/master/RenderComponent";
import { ResearchContext } from "../context/ContextProvider";

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
  // textDecoration: "underline",
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "1px 1px gray",
  // fontStyle: "italic",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const Master = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Company Master");
  const { screenPermissions } = useContext(ResearchContext);

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
    {
      label: "City Master",
      icon: <AccountCircleIcon />,
      permission: screenPermissions?.CityMaster,
    },
    {
      label: "Company Master",
      icon: <EmailIcon />,
      permission: screenPermissions?.CompanyMaster,
    },
    {
      label: "State Master",
      icon: <BusinessIcon />,
      permission: screenPermissions?.StateMaster,
    },
    {
      label: "Country Master",
      icon: <LocationCityIcon />,
      permission: screenPermissions?.CountryMaster,
    },
    {
      label: "User Master",
      icon: <PrintIcon />,
      permission: screenPermissions?.UserMaster,
    },
    {
      label: "Publication Group Master",
      icon: <PublicIcon />,
      permission: screenPermissions?.PublicationGroupMaster,
    },
    {
      label: "Publication Master",
      icon: <PublicIcon />,
      permission: screenPermissions?.PublicationMaster,
    },
    {
      label: "Publication Master Online",
      icon: <PriorityHighIcon />,
      permission: screenPermissions?.PublicationMasterOnline,
    },
    {
      label: "Industry Master",
      icon: <PriorityHighIcon />,
      permission: screenPermissions?.IndustryMaster,
    },
    {
      label: "Cluster Master",
      icon: <DashboardIcon />,
      permission: true,
    },
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
            disabled={!option.permission}
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

export default Master;

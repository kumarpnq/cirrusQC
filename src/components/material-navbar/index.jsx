import * as React from "react";
import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// import { toast } from "react-toastify";
// import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
// import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import MoreIcon from "@mui/icons-material/MoreVert";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";

//** react icons
import { HiStatusOnline } from "react-icons/hi";
import { FaPrint } from "react-icons/fa";
import { FaDumpster } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { LuBookCopy } from "react-icons/lu";

//**  context
import { ResearchContext } from "../../context/ContextProvider";
import { getInitials } from "../../utils/getInitialName";

export default function MainNav() {
  const navigate = useNavigate();
  const { handleLogout, screenPermissions, unsavedChanges } =
    useContext(ResearchContext);
  const userName = sessionStorage.getItem("userName");

  // ** state variables
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  // * vars
  const userToken = localStorage.getItem("user");
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const navList = [
    ...(screenPermissions["QC1-Online"]
      ? [
          {
            id: 1,
            title: "QC1 Online",
            path: "/qc1/online",
            icon: <HiStatusOnline />,
          },
        ]
      : []),
    ...(screenPermissions["QC1-Print"]
      ? [
          {
            id: 2,
            title: "QC1 Print",
            path: "/qc1/print",
            icon: <FaPrint />,
          },
        ]
      : []),
    ...(screenPermissions["PrintSimilarArticles"]
      ? [
          {
            id: 2,
            title: "PrintSimilarArticles",
            path: "/qc1/print-similar-articles",
            icon: <FaPrint />,
          },
        ]
      : []),
    ...(screenPermissions["Online-QC2"]
      ? [
          {
            id: 3,
            title: "QC2 Online",
            path: "/online",
            icon: <HiStatusOnline />,
          },
        ]
      : []),
    ...(screenPermissions["Print-QC2"]
      ? [{ id: 4, title: "QC2 Print", path: "/print", icon: <FaPrint /> }]
      : []),
    ...(screenPermissions.Dump
      ? [{ id: 5, title: "Dump", path: "/dump", icon: <FaDumpster /> }]
      : []),
    ...(screenPermissions["Manual-upload"]
      ? [
          {
            id: 6,
            title: "Manual Upload",
            path: "/manual-upload",
            icon: <UploadFileIcon />,
          },
        ]
      : []),
    ...(screenPermissions["Non-Tagged"]
      ? [
          {
            id: 7,
            title: "Non Tagged",
            path: "/non-tagged",
            icon: <BookmarkBorderIcon />,
          },
        ]
      : []),

    ...(screenPermissions.Analytics
      ? [
          {
            id: 8,
            title: "Analytics",
            path: "/analytics",
            icon: <BarChartIcon />,
          },
        ]
      : []),
    ...(screenPermissions.clientBasketCityPublication
      ? [
          {
            id: 9,
            title: "ClientBasketCity",
            path: "/client-basket-city-publication",
            icon: <ShoppingBasketIcon />,
          },
        ]
      : []),
    ...(screenPermissions.CopyArticles
      ? [
          {
            id: 10,
            title: "Copy Articles",
            path: "/copy-articles",
            icon: <FolderCopyIcon />,
          },
        ]
      : []),
    ...(screenPermissions.CompanySlicing
      ? [
          {
            id: 11,
            title: "Company Slicing",
            path: "/company-slicing",
            icon: <LuBookCopy />,
          },
        ]
      : []),
    ...(screenPermissions.MailerScheduler
      ? [
          {
            id: 12,
            title: "Online Mailer Schedular",
            path: "/online-mailer-schedular",
            icon: <IoMail />,
          },
        ]
      : []),
    ...(screenPermissions.WhatsappContact
      ? [
          {
            id: 13,
            title: "Whatsapp Contact",
            path: "/whatsapp-contact",
            icon: <WhatsAppIcon />,
          },
        ]
      : []),
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleManualLogout = () => {
    toggleDrawer(false);
    handleMobileMenuClose();
    handleMenuClose();
    handleLogout();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleManualLogout}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="small"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          onClick={userToken && handleManualLogout}
        >
          Log Out
        </IconButton>
      </MenuItem>
    </Menu>
  );

  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navList.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ width: 160 }}>
            <NavLink
              to={item.path}
              className={
                location.pathname === item.path && "bg-primary text-gray-300"
              }
            >
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault();
                  if (unsavedChanges) {
                    if (
                      window.confirm(
                        "Are you sure you want to leave this page?"
                      )
                    ) {
                      navigate(item.path);
                    }
                  } else {
                    navigate(item.path);
                  }
                }}
              >
                <ListItemIcon>
                  {" "}
                  <span
                    className={
                      location.pathname === item.path &&
                      "bg-primary text-gray-300"
                    }
                  >
                    {item.icon}
                  </span>
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    textWrap: "nowrap",
                    letterSpacing: "1px",
                    width: 230,
                    textOverflow: "ellipsis",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const activeTabTitle = navList.find(
    (item) => item.path === location.pathname
  )?.title;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ background: "#0a4f7d" }}>
        {userToken && (
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                  textTransform: "uppercase",
                },
              }}
            >
              {isSmallScreen ? (
                <p className="font-medium tracking-wide">
                  <span className="text-white">P</span>
                  <span className="mx-1 text-lg text-red-500">&</span>
                  <span className="text-gray-500">Q</span>
                </p>
              ) : (
                <p className="font-medium tracking-wide">
                  {" "}
                  <span className="text-white">PERCEPTION</span>
                  <span className="mx-1 text-lg text-red-500">&</span>
                  <span className="text-gray-500">QUANT</span>
                </p>
              )}
            </Typography>

            <Typography
              component={"span"}
              ml={5}
              className="italic border-b border-gray-400 hover:border-gray-600"
            >
              {activeTabTitle}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{
                  background: "#fff",
                  color: "#0a4f7d",
                  fontSize: "0.9em",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disableRipple
              >
                {userName ? getInitials(userName) : <AccountCircle />}
              </IconButton>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        )}
      </AppBar>
      {userToken && renderMobileMenu}
      {userToken && renderMenu}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
}

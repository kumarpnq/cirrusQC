import * as React from "react";
import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

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

//**  context
import { ResearchContext } from "../../context/ContextProvider";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function MainNav() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState();
  const [filteredNavItems, setFilteredNavItems] = React.useState([]);
  const { handleLogout, screenPermissions } = useContext(ResearchContext);
  const userToken = localStorage.getItem("user");
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navList = [
    ...(screenPermissions["Online-QC2"]
      ? [
          {
            id: 1,
            title: "Online-QC2",
            path: "/online",
            icon: <HiStatusOnline />,
          },
        ]
      : []),
    ...(screenPermissions["Print-QC2"]
      ? [{ id: 2, title: "Print-QC2", path: "/print", icon: <FaPrint /> }]
      : []),
    ...(screenPermissions.Dump
      ? [{ id: 3, title: "Dump", path: "/dump", icon: <FaDumpster /> }]
      : []),
    ...(screenPermissions["Manual-upload"]
      ? [
          {
            id: 4,
            title: "Manual-upload",
            path: "/manual-upload",
            icon: <UploadFileIcon />,
          },
        ]
      : []),
    ...(screenPermissions["Non-Tagged"]
      ? [
          {
            id: 5,
            title: "Non-Tagged",
            path: "/non-tagged",
            icon: <BookmarkBorderIcon />,
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

  const handleSearchValue = React.useCallback((event) => {
    const { value } = event.target;
    setSearchValue(value);
    const list = navList.map((i) => i.title);
    const filteredItems = list.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNavItems(filteredItems || []);
  }, []);

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      const foundItem = navList.find(
        (item) => item.title.toLowerCase() === searchValue.toLowerCase()
      );
      if (foundItem) {
        navigate(foundItem.path);
      } else {
        toast.error("No such page found.");
      }
    }
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
    <Box sx={{ width: 200 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navList.map((item) => (
          <ListItem key={item.id} disablePadding>
            <NavLink
              to={item.path}
              className={location.pathname === item.path && "bg-primary"}
            >
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    window.confirm("Are you sure you want to leave this page?")
                  ) {
                    navigate(item.path);
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
                <>
                  <span className="text-black">P</span>
                  <span className="text-red-500">&</span>
                  <span className="text-gray-500">Q</span>
                </>
              ) : (
                <>
                  {" "}
                  <span className="text-black">PERCEPTION</span>
                  <span className="text-red-500">&</span>
                  <span className="text-gray-500">QUANT</span>
                </>
              )}
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchValue}
                onChange={handleSearchValue}
                onKeyDown={handleEnterKeyPress}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
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

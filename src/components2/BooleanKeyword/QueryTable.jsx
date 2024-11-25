import React from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Box,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TranslateIcon from "@mui/icons-material/Translate";
import axiosInstance from "../../../axiosConfig";

// Styled Components
const StyledList = styled(List)({
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  width: "100%",
});

const StyledListItem = styled(ListItem)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 1,
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  marginBottom: "8px",
  backgroundColor: "#fff",
  transition: "transform 0.6s, box-shadow 0.2s, background-color 0.2s",

  "&:hover": {
    backgroundColor: "#f5f5f5",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transform: "scale(1.01)",
  },

  "&:active": {
    backgroundColor: "#e0e0e0",
    transform: "scale(1)",
  },

  "&:last-child": {
    borderBottom: "none",
  },
});

const QueryBox = styled(Box)({
  flexGrow: 1,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  fontWeight: 500,
  color: "#333",
  marginLeft: 2,
});

const languages = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Bengali (Bangla)", value: "bn" },
  { label: "Marathi", value: "mr" },
];

const QueryList = ({ setQuery, data = [] }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState("");

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTranslate = async (event) => {
    setAnchorEl(event.currentTarget);
    try {
      const params = {
        query: "",
        languages: "hn,mr",
      };
      const response = await axiosInstance.get("translateBoolean", { params });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledList>
      {data.map((row) => (
        <StyledListItem key={row.queryId}>
          {/* Action Buttons */}
          <Tooltip title="Delete">
            <IconButton size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              size="small"
              onClick={() => setQuery(row.query)}
            >
              <EditNoteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Translate">
            <IconButton color="primary" size="small" onClick={handleTranslate}>
              <TranslateIcon />
            </IconButton>
          </Tooltip>

          {/* Language Selector */}
          <FormControl sx={{ minWidth: 120, mx: 1, height: 25 }}>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              displayEmpty
              sx={{
                height: 25,
                lineHeight: "25px",
                "& .MuiSelect-select": {
                  padding: "0px 8px",
                  height: "25px",
                },
              }}
            >
              <MenuItem value="">
                <em>Language</em>
              </MenuItem>
              {languages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Query Text */}
          <QueryBox>{row.query}</QueryBox>
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default QueryList;

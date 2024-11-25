import { Box, Button, Popover, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import QueryTable from "./QueryTable";
import { generateSuggestions, validateQuery } from "./utils";
import SuggestionsDropdown from "./SuggestionsDropdown";
import InputAdornment from "@mui/material/InputAdornment";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import QueryComponent from "./QueryRules";
import PreviewModal from "./PreviewModal";

const QueryBox = ({ type, row }) => {
  const [query, setQuery] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  console.log(row);

  const handleQueryChange = (event) => {
    let localQuery = event.target.value;
    setQuery(localQuery);
    validateQuery(localQuery, setIsValid, setError);
    generateSuggestions(
      localQuery,
      event.target.selectionStart,
      setSuggestions
    );
  };

  const applySuggestion = (suggestion) => {
    const words = query.split(/\s+/);
    words.pop();
    const newQuery = [...words, suggestion].join(" ");
    setQuery(newQuery);
    setShowSuggestions(false);
    validateQuery(newQuery, setIsValid, setError);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClosePreviewModal = () => setOpenPreviewModal((prev) => !prev);

  const open = Boolean(anchorEl);
  const id = open ? "query-popover" : undefined;

  return (
    <Box sx={{ border: "1px solid #ddd", mt: 1, p: 0.5, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "start",
          my: 0.5,
        }}
      >
        {<Typography variant="body2">{type}</Typography>}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="outlined">
            Validate & Add
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setOpenPreviewModal((prev) => !prev)}
          >
            Preview
          </Button>
        </Box>
      </Box>

      <TextField
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setShowSuggestions(true)}
        fullWidth
        multiline
        rows={4}
        placeholder="Enter company boolean string (e.g., publication.name:'TheHindu' AND 'TimesNow' AND ('Breaking News' OR 'Prime Debate' OR 'Entertainment Show'))"
        error={!isValid}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={"Click for query info"} arrow>
                <IconButton size="small" onClick={handleClick}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <QueryComponent />
      </Popover>
      <Box sx={{ position: "absolute", zIndex: 999, width: "100%" }}>
        {showSuggestions && !!suggestions.length && (
          <SuggestionsDropdown
            applySuggestion={applySuggestion}
            showSuggestions={showSuggestions}
            suggestions={suggestions}
          />
        )}
      </Box>
      <QueryTable
        setQuery={setQuery}
        data={
          type === "Include Query" ? row?.includeQuery : row?.excludeQuery || []
        }
      />
      <PreviewModal
        open={openPreviewModal}
        handleClose={handleClosePreviewModal}
      />
    </Box>
  );
};

QueryBox.propTypes = {
  type: PropTypes.string,
  row: PropTypes.object,
};

export default QueryBox;

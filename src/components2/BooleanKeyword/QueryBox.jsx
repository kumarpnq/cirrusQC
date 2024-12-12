import {
  Box,
  Button,
  CircularProgress,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
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
import toast from "react-hot-toast";
import axiosInstance from "../../../axiosConfig";

const QueryBox = ({
  type,
  row,
  language,
  filteredIncludeData,
  filteredExcludeData,
  fetchData,
  selectedFullClient,
  fromWhere,
}) => {
  const [query, setQuery] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [queryId, setQueryId] = useState("");

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

  // * validate and add
  const handleValidateAndAdd = async () => {
    if (!isValid || !query) {
      toast.error("Please put valid query.");
      return;
    }

    try {
      setAcceptLoading(true);
      const requestData = {
        // query: query.trim(),
        companyId:
          fromWhere === "Add" ? selectedFullClient?.companyid : row?.companyId,
        companyName:
          fromWhere === "Add"
            ? selectedFullClient?.companyname
            : row?.companyName,
      };
      const includeQuery = {};
      const excludeQuery = {};
      if (type === "Include Query") {
        includeQuery.query = query;
        includeQuery.langId = language;
      }
      if (Object.keys(includeQuery).length)
        requestData.includeQuery = [includeQuery];
      if (type === "Exclude Query") {
        requestData.includeQuery = filteredIncludeData.map((item) => ({
          query: item.query,
          langId: item.langId,
        }));
        excludeQuery.query = query;
        excludeQuery.langId = language;
      }
      if (Object.keys(excludeQuery).length)
        requestData.excludeQuery = [excludeQuery];
      const response = await axiosInstance.post("newBoolean", requestData);

      if (response.status === 200) {
        toast.success(response.data.data.message);
        setQuery("");
        fetchData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAcceptLoading(false);
    }
  };

  // * validate and update
  const handleValidateAndUpdate = async () => {
    if (!isValid || !query) {
      toast.error("Please put valid query.");
      return;
    }
    try {
      setAcceptLoading(true);
      const requestData = {
        // query: query.trim(),
        companyId:
          fromWhere === "Add" ? selectedFullClient?.companyid : row?.companyId,
        companyName:
          fromWhere === "Add"
            ? selectedFullClient?.companyname
            : row?.companyName,
        booleanQuery: query,
        booleanId: queryId,
      };
      // if (type === "Include Query") requestData.includeQuery = query;
      // if (type === "Exclude Query") requestData.includeQuery = query;
      const response = await axiosInstance.post("changeBoolean", requestData);
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setQueryId("");
        setIsEdit(false);
        setQuery("");
        fetchData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsEdit(false);
    setQueryId("");
  };

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
          <Button
            size="small"
            variant="outlined"
            onClick={isEdit ? handleValidateAndUpdate : handleValidateAndAdd}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {acceptLoading && <CircularProgress size={"1em"} />}
            Validate & {isEdit ? "update" : "Add"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setOpenPreviewModal((prev) => !prev);
            }}
            disabled={!query}
          >
            Preview
          </Button>
          <Button size="small" variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Box>

      <TextField
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
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
        <QueryComponent handleClose={handleClose} />
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
          type === "Include Query"
            ? filteredIncludeData
            : filteredExcludeData || []
        }
        setIsEdit={setIsEdit}
        setQueryId={setQueryId}
        companyId={row?.companyId}
        queryId={queryId}
        type={type}
        row={row}
        query={query}
      />
      <PreviewModal
        open={openPreviewModal}
        handleClose={handleClosePreviewModal}
        query={{
          query,
          whichQuery: type,
        }}
        row={row}
      />
    </Box>
  );
};

QueryBox.propTypes = {
  type: PropTypes.string,
  row: PropTypes.object,
  language: PropTypes.string,
  filteredIncludeData: PropTypes.array,
  filteredExcludeData: PropTypes.array,
  fetchData: PropTypes.func,
  selectedFullClient: PropTypes.object,
  fromWhere: PropTypes.string,
};

export default QueryBox;

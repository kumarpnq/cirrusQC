import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Fragment, useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { url } from "../../../constants/baseUrl";
import { arrayToString } from "../../../utils/arrayToString";
import { GridClearIcon } from "@mui/x-data-grid";

const DebounceSearchHeadline = ({
  fromDate,
  toDate,
  selectedClient,
  selectedCompanies,
  selectedFetchedHeadline,
  setSelectedFetchedHeadline,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [textFieldRect, setTextFieldRect] = useState({});
  const [isListClicked, setIsListClicked] = useState(false);

  // Function to fetch data from API
  const fetchData = async (term) => {
    if (!term) {
      setResultData([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("user");
      const params = {
        headline: term,
        from_date: fromDate,
        to_date: toDate,
        // client_id: selectedClient,
        // company_id: arrayToString(selectedCompanies),
      };
      if (selectedClient) {
        params.client_id = selectedClient;
      }
      if (selectedCompanies.length) {
        params.company_id = arrayToString(selectedCompanies);
      }
      const response = await axios.get(`${url}fetchheadlines/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setResultData(response.data.headlines);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useCallback(debounce(fetchData, 500), []);

  useEffect(() => {
    if (searchTerm) {
      debouncedFetchData(searchTerm);
    } else {
      setResultData([]);
    }
  }, [searchTerm, debouncedFetchData]);

  const handleFocus = (event) => {
    setIsFocused(true);
    setTextFieldRect(event.target.getBoundingClientRect());
  };

  const handleBlur = () => {
    if (!isListClicked) {
      // Check if list item was clicked
      setIsFocused(false);
    }
    setIsListClicked(false); // Reset list click state
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedFetchedHeadline("");
    setResultData([]);
  };

  return (
    <Fragment>
      <TextField
        InputProps={{
          style: {
            fontSize: "0.8rem",
            height: 25,
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <GridClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        value={searchTerm || selectedFetchedHeadline}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search headlines..."
        variant="outlined"
        sx={{ position: "relative" }}
      />
      {isFocused && (resultData.length > 0 || loading) && (
        <Paper
          sx={{
            position: "absolute",
            top: textFieldRect.top - 5,
            left: textFieldRect.left,
            width: textFieldRect.width + 200,
            bgcolor: "background.paper",
            boxShadow: 3,
            zIndex: 10,
          }}
        >
          <List
            sx={{
              maxHeight: 200,
              background: "#ffff",
              bgcolor: "background.paper",
              overflow: "auto",
              "& ul": { padding: 0, margin: 0 },
            }}
            subheader={<li />}
          >
            {loading && (
              <p className="text-center">
                <CircularProgress size={"20px"} />
              </p>
            )}
            {resultData.length > 0 ? (
              resultData.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  onMouseDown={() => setIsListClicked(true)}
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedFetchedHeadline(item);
                    setIsFocused(false);
                  }}
                >
                  <ListItemText
                    primary={<span className="text-[0.8em]">{item}</span>}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Fragment>
  );
};

DebounceSearchHeadline.propTypes = {
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  selectedClient: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  selectedCompanies: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
  selectedFetchedHeadline: PropTypes.string,
  setSelectedFetchedHeadline: PropTypes.func,
};
export default DebounceSearchHeadline;

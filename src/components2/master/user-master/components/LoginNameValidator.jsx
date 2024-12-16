import { useState } from "react";
import { TextField, CircularProgress, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import axiosInstance from "../../../../../axiosConfig";

const LoginNameValidator = ({ loginName, setLoginName }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLoginChange = async (e) => {
    const value = e.target.value;
    setLoginName(value);
    setAnchorEl(e.target);

    if (value.trim() === "") {
      setSuggestions([]);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await axiosInstance.get(
        `user/getValidLoginName/?loginName=${value}`
      );

      setLoading(false);
      if (response.data.valid) {
        setSuggestions([]);
      } else {
        setSuggestions(response.data.suggestions);
        setError(true);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLoginName(suggestion);
    setSuggestions([]);
    setAnchorEl(null);
    setError(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        InputProps={{
          style: { height: 25, fontSize: "0.9em", width: 330 },
          endAdornment: loading ? <CircularProgress size={24} /> : null,
        }}
        placeholder="Login Name"
        value={loginName}
        onChange={handleLoginChange}
        fullWidth
        error={error}
        helperText={error ? "Login Name already taken." : ""}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && suggestions.length > 0}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 300,
            maxHeight: 200,
          },
        }}
      >
        {suggestions.map((suggestion, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            style={{ padding: "8px 16px" }}
          >
            {suggestion}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

LoginNameValidator.propTypes = {
  loginName: PropTypes.string.isRequired,
  setLoginName: PropTypes.func.isRequired,
};

export default LoginNameValidator;

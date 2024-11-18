import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CustomTextField = ({
  placeholder,
  value,
  setValue,
  type,
  width,
  isDisabled,
  isRequired,
  isMultiline,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      size="small"
      type={type === "password" && !showPassword ? "password" : "text"}
      fullWidth
      required={isRequired}
      multiline={isMultiline}
      sx={{ width: width }}
      autoComplete={autoComplete}
      InputProps={{
        style: {
          fontSize: "0.8rem",
          height: 25,
        },
        endAdornment: type === "password" && (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} edge="end">
              {showPassword ? (
                <VisibilityOff className="text-primary" />
              ) : (
                <Visibility className="text-primary" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      value={value}
      onChange={handleChange}
      disabled={isDisabled}
    />
  );
};

CustomTextField.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
  type: PropTypes.string,
  width: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isMultiline: PropTypes.bool,
  autoComplete: PropTypes.string,
};

export default CustomTextField;

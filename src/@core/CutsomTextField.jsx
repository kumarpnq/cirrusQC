import PropTypes from "prop-types";
import { TextField } from "@mui/material";

const CustomTextField = ({
  placeholder,
  value,
  setValue,
  type,
  width,
  isDisabled,
  isRequired,
}) => {
  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      size="small"
      type={type}
      fullWidth
      required={isRequired}
      multiline
      sx={{ width: width }}
      InputProps={{
        style: {
          fontSize: "0.8rem",
          height: 25,
        },
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
};

export default CustomTextField;

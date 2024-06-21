import PropTypes from "prop-types";
import { TextField } from "@mui/material";

const CustomTextField = ({
  placeholder,
  value,
  setValue,
  type,
  width,
  isDisabled,
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
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  type: PropTypes.string,
  width: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool,
};

export default CustomTextField;

import PropTypes from "prop-types";
import { TextField } from "@mui/material";

const TextFields = ({ placeholder, value, setValue, type }) => {
  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      size="small"
      type={type}
      InputProps={{
        style: {
          fontSize: "0.8rem",
          height: 25,
          top: 6,
          width: "auto",
        },
      }}
      value={value}
      onChange={handleChange}
    />
  );
};

TextFields.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default TextFields;

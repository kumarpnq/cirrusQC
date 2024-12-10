import PropTypes from "prop-types";
import { FormControl, TextField } from "@mui/material";

const CustomTextField = ({
  id,
  name,
  label,
  value,
  onChange,
  isMultiline,
  isAutoHeight,
  onFocus,
  onBlur,
}) => {
  return (
    <FormControl fullWidth>
      <TextField
        id={id}
        name={name}
        variant="outlined"
        label={label}
        size="small"
        InputProps={{
          style: {
            fontSize: "0.8rem",
            height: !isAutoHeight ? 25 : "auto",
          },
        }}
        InputLabelProps={{
          shrink: value ? true : undefined, // Ensures label stays in place when there's a value
          style: {
            fontSize: "0.9rem", // Adjust label font size
            lineHeight: "1.2", // Ensure consistent spacing for label text
          },
        }}
        multiline={isMultiline}
        maxRows={5}
        value={value}
        margin="dense"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </FormControl>
  );
};

CustomTextField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isMultiline: PropTypes.bool,
  isAutoHeight: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default CustomTextField;

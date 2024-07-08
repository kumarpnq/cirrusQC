// CustomTextField.js
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
      <label htmlFor={id} className="text-[0.9em]">
        {label}
      </label>
      <TextField
        id={id}
        name={name}
        variant="outlined"
        size="small"
        InputProps={{
          style: {
            fontSize: "0.8rem",
            height: !isAutoHeight && 25,
          },
        }}
        multiline={isMultiline}
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

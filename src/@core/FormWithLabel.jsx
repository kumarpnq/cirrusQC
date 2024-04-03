import PropTypes from "prop-types";
import { FormControl, FormLabel } from "@mui/material";
import CustomTextField from "./CutsomTextField";

const FormWithLabelTextField = ({
  label,
  type,
  value,
  setValue,
  placeholder,
  width,
}) => {
  return (
    <FormControl
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 1,
      }}
    >
      <FormLabel sx={{ fontSize: "0.8em" }}>{label}:</FormLabel>
      <CustomTextField
        placeholder={placeholder}
        width={width}
        type={type}
        value={value}
        setValue={setValue}
      />
    </FormControl>
  );
};

FormWithLabelTextField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  width: PropTypes.number,
};
export default FormWithLabelTextField;

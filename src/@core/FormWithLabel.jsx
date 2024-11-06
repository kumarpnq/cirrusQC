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
  isDisabled,
  tClasses,
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
      <FormLabel sx={{ fontSize: "0.8em", width: 50 }}>{label}:</FormLabel>
      <div className={tClasses}>
        <CustomTextField
          placeholder={placeholder}
          width={width}
          type={type}
          value={value}
          setValue={setValue}
          isDisabled={isDisabled}
        />
      </div>
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
  isIncrease: PropTypes.bool,
  customHeight: PropTypes.number,
  isDisabled: PropTypes.bool,
  tClasses: PropTypes.string,
};
export default FormWithLabelTextField;

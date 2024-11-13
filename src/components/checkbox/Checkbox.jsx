import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
  FormGroup,
} from "@mui/material";
import PropTypes from "prop-types";

export default function CheckboxComp({ value, setValue, label, isDisabled }) {
  return (
    <FormControl>
      <FormGroup>
        <FormControlLabel
          disabled={isDisabled}
          control={
            <Checkbox
              size="small"
              checked={value === 1}
              onChange={() => {
                setValue(value === 1 ? 0 : 1);
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              fontSize={"0.8em"}
              sx={{ opacity: 0.7 }}
            >
              {label}
            </Typography>
          }
        />
      </FormGroup>
    </FormControl>
  );
}

CheckboxComp.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
};

import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import PropTypes from "prop-types";

const TableRadio = ({ selectedRadioValue, handleChange }) => {
  return (
    <FormControl component="fieldset" sx={{ height: 25, display: "flex" }}>
      <RadioGroup
        aria-label="and-or-label"
        name="and-or-label"
        value={selectedRadioValue}
        onChange={handleChange}
        row
      >
        <FormControlLabel
          value="and"
          control={<Radio size="small" />}
          label="AND"
          sx={{
            fontSize: "0.8em",
            "& .MuiTypography-root": { fontSize: "0.8em" },
          }}
        />
        <FormControlLabel
          value="or"
          control={<Radio size="small" />}
          label="OR"
          sx={{
            fontSize: "0.8em",
            "& .MuiTypography-root": { fontSize: "0.8em" },
          }}
        />
      </RadioGroup>
    </FormControl>
  );
};
TableRadio.propTypes = {
  selectedRadioValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};
export default TableRadio;

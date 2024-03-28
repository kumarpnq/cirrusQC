import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const Permissions = ({
  value,
  setValue,
  classes,
  width,
  mapValue,
  placeholder,
}) => {
  const handleValueChane = (event) => {
    setValue(event.target.value);
  };
  const formControlStyle = {
    width: `${width}px`,
  };
  return (
    <FormControl style={formControlStyle}>
      <Select
        value={value}
        onChange={handleValueChane}
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>{placeholder}</em>
        </MenuItem>
        {mapValue.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
          >
            {item.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
Permissions.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  mapValue: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  width: PropTypes.number,
  placeholder: PropTypes.string.isRequired,
};
export default Permissions;

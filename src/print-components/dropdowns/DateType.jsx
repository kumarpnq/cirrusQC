import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { dateTypes } from "../../constants/dataArray";

const Datetype = ({ dateType, setDateType, classes, width }) => {
  const handleDateTypeChange = (event) => {
    setDateType(event.target.value);
  };
  const formControlStyle = {
    width: `${width}px`,
  };
  return (
    <FormControl style={formControlStyle}>
      <Select
        value={dateType}
        onChange={handleDateTypeChange}
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>Datetype</em>
        </MenuItem>
        {dateTypes.map((dateType) => (
          <MenuItem
            key={dateType.id}
            value={dateType.value}
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
          >
            {dateType.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
Datetype.propTypes = {
  dateType: PropTypes.string.isRequired,
  setDateType: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  dateTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  width: PropTypes.number,
};
export default Datetype;

import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const Datetype = ({ dateType, setDateType, classes, dateTypes }) => {
  const handleDateTypeChange = (event) => {
    setDateType(event.target.value);
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-24">
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
    </div>
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
};
export default Datetype;

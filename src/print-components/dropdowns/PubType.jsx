import PropTypes from "prop-types";
import { FormControl, Select, MenuItem } from "@mui/material";
import { pubTypes } from "../../constants/dataArray";

const PubType = ({ pubType, setPubType, classes, width }) => {
  const handleChange = (e) => {
    setPubType(e.target.value);
  };

  const formControlStyle = {
    width: `${width}px`,
  };
  return (
    <FormControl style={formControlStyle}>
      <Select
        value={pubType}
        onChange={handleChange}
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>Pub Type</em>
        </MenuItem>
        {pubTypes.map((group) => (
          <MenuItem
            key={group.id}
            value={group.value}
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
          >
            {group.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
PubType.propTypes = {
  pubType: PropTypes.number.isRequired,
  setPubType: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};
export default PubType;

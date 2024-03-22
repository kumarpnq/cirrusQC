import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const Qc2All = ({ qc2done, setQc2done, classes, qc2Array }) => {
  const handleQc2done = (event) => {
    setQc2done(event.target.value);
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-28">
        <Select
          displayEmpty
          value={qc2done}
          onChange={handleQc2done}
          className={classes.dropDowns}
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
        >
          <MenuItem value="" disabled>
            <em>qc2 done</em>
          </MenuItem>
          {qc2Array.map((item) => (
            <MenuItem
              key={item.id}
              value={item.value}
              sx={{ fontSize: "0.8em" }}
            >
              {item.option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
Qc2All.propTypes = {
  qc2done: PropTypes.number.isRequired,
  setQc2done: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  qc2Array: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      option: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default Qc2All;

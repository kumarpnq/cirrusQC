import { FormControl, Select, OutlinedInput, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const Qc1All = ({ qc1done, setQc1done, classes, qc1Array }) => {
  const handleQc1done = (event) => {
    setQc1done(event.target.value);
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-28">
        <Select
          id="qc1-checks"
          value={qc1done}
          onChange={handleQc1done}
          input={<OutlinedInput label="tag" />}
          className={classes.dropDowns}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
        >
          <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
            <em>qc1 done</em>
          </MenuItem>
          {qc1Array.map((item) => (
            <MenuItem
              key={item.id}
              value={item.value}
              sx={{ fontSize: "0.8em", opacity: 0.7 }}
            >
              {item.option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
Qc1All.propTypes = {
  qc1done: PropTypes.number.isRequired,
  setQc1done: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  qc1Array: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      option: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default Qc1All;

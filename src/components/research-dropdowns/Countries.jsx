import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";

const Countries = ({ country, setCountry, classes, filteredCountries }) => {
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-28">
        <Select
          multiple
          displayEmpty
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          input={<OutlinedInput label="Name" />}
          className={classes.dropDowns}
          MenuProps={{ PaperProps: { style: { height: 200 } } }}
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Countries</em>;
            }
            return selected.join(", ");
          }}
        >
          <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
            <em>Countries</em>
          </MenuItem>
          {filteredCountries.map((country) => (
            <MenuItem
              key={country}
              value={country}
              sx={{ fontSize: "0.8em", opacity: 0.7 }}
            >
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

Countries.propTypes = {
  country: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCountry: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  filteredCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default Countries;

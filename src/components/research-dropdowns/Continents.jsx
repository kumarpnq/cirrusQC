import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";

const Continents = ({
  continent,
  countriesByContinent,
  setContinent,
  setFilteredCountries,
  continents,
  classes,
}) => {
  const handleContinentChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedContinent =
      typeof value === "string" ? value.split(", ") : value;

    // Filter countries by the selected continent
    const selectedCountries = countriesByContinent
      .filter((item) => selectedContinent.includes(item.continent))
      .map((item) => item.countries)
      .flat();

    setContinent(selectedContinent);
    setFilteredCountries(selectedCountries);
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-28">
        <Select
          multiple
          displayEmpty
          value={continent}
          onChange={handleContinentChange}
          input={<OutlinedInput label="Name" />}
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Continents</em>;
            }
            return selected.join(", ");
          }}
          className={classes.dropDowns}
        >
          <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
            {" "}
            <em>Continents</em>
          </MenuItem>
          {continents.map((continent) => (
            <MenuItem
              key={continent}
              value={continent}
              sx={{ fontSize: "0.8em", opacity: 0.7 }}
            >
              {continent}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
Continents.propTypes = {
  continent: PropTypes.arrayOf(PropTypes.string).isRequired,
  countriesByContinent: PropTypes.arrayOf(
    PropTypes.shape({
      continent: PropTypes.string.isRequired,
      countries: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  setContinent: PropTypes.func.isRequired,
  setFilteredCountries: PropTypes.func.isRequired,
  continents: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.object.isRequired,
};
export default Continents;

import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";

const Cities = ({ classes, city, setCity }) => {
  const { data } = useFetchData(`${url}citieslist`, city);
  const citiesArray = data?.data?.cities || [];
  const selectedCity = citiesArray
    ?.filter((item) => city.includes(item.cityid))
    .map((selectedItem) => selectedItem.cityname);
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-32">
        <Select
          className={classes.dropDowns}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          multiple
          MenuProps={{ PaperProps: { style: { height: 200 } } }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
          renderValue={() => {
            if (selectedCity?.length === 0) {
              return <em>Cities</em>;
            }
            return selectedCity?.join(", ");
          }}
        >
          <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
            <em>City</em>
          </MenuItem>
          {citiesArray &&
            citiesArray?.map((items) => (
              <MenuItem
                key={items.cityid}
                value={items.cityid}
                sx={{ fontSize: "0.8em", opacity: 0.7 }}
              >
                {items.cityname}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};
Cities.propTypes = {
  classes: PropTypes.object.isRequired,
  city: PropTypes.array.isRequired,
  setCity: PropTypes.func.isRequired,
};
export default Cities;

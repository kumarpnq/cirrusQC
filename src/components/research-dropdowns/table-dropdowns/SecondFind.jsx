import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import {
  DDSearchValues,
  DDSearchValuesForPrint,
} from "../../../constants/dataArray";

const SecondFind = ({
  classes,
  secondHeaderForSearch,
  handleSecondSearchUsingHeader,
  headerForSearch,
  screen,
}) => {
  const dataForMapping = screen ? DDSearchValuesForPrint : DDSearchValues;
  return (
    <FormControl className="w-28">
      <Select
        className={classes.dropDowns}
        value={secondHeaderForSearch}
        onChange={handleSecondSearchUsingHeader}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={{ PaperProps: { style: { height: 200 } } }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>select</em>
        </MenuItem>

        {headerForSearch === "all"
          ? dataForMapping.slice(1).map((item) => (
              <MenuItem
                value={item.value}
                key={item.title}
                sx={{ fontSize: "0.8em", opacity: 0.7 }}
              >
                {item.title}
              </MenuItem>
            ))
          : dataForMapping.map((item) => (
              <MenuItem
                value={item.value}
                key={item.title}
                sx={{ fontSize: "0.8em", opacity: 0.7 }}
              >
                {item.title}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
};
SecondFind.propTypes = {
  classes: PropTypes.object.isRequired,
  secondHeaderForSearch: PropTypes.string.isRequired,
  handleSecondSearchUsingHeader: PropTypes.func.isRequired,
  headerForSearch: PropTypes.string.isRequired,
  screen: PropTypes.string,
};
export default SecondFind;

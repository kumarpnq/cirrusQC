import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import {
  DDSearchValues,
  DDSearchValuesForPrint,
} from "../../../constants/dataArray";

const FirstFind = ({
  classes,
  headerForSearch,
  handleTableSearchUsingHeader,
  screen,
}) => {
  const dataForMapping = screen ? DDSearchValuesForPrint : DDSearchValues;
  return (
    <FormControl className="w-28">
      <Select
        className={classes.dropDowns}
        value={headerForSearch}
        onChange={handleTableSearchUsingHeader}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={{ PaperProps: { style: { height: 200 } } }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>Select</em>
        </MenuItem>

        {dataForMapping.map((item) => (
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

FirstFind.propTypes = {
  classes: PropTypes.object.isRequired,
  headerForSearch: PropTypes.string.isRequired,
  handleTableSearchUsingHeader: PropTypes.func.isRequired,
  screen: PropTypes.string,
};
export default FirstFind;

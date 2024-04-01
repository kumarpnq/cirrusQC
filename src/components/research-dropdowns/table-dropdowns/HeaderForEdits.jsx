import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { DDEditValues } from "../../../constants/dataArray";
import { DDEditValuesForPrint } from "../../../constants/dataArray";

const HeaderForEdits = ({
  editRow,
  handleEditRowChange,
  classes,
  pageType,
}) => {
  const mapValue = pageType === "print" ? DDEditValuesForPrint : DDEditValues;
  return (
    <FormControl className="w-28">
      <Select
        value={editRow}
        onChange={handleEditRowChange}
        variant="outlined"
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={{ PaperProps: { style: { height: 200 } } }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>Select</em>
        </MenuItem>
        {mapValue.map((item) => (
          <MenuItem
            key={item.id}
            value={item.value}
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
          >
            {item.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
HeaderForEdits.propTypes = {
  editRow: PropTypes.string.isRequired,
  handleEditRowChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  pageType: PropTypes.string,
};
export default HeaderForEdits;

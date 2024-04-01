import PropTypes from "prop-types";
import { FormControl, Select, MenuItem } from "@mui/material";
import { categories } from "../../constants/dataArray";

const Category = ({ category, setCategory, classes, width }) => {
  const handleDateTypeChange = (event) => {
    setCategory(event.target.value);
  };

  const formControlStyle = {
    width: `${width}px`,
  };

  return (
    <FormControl style={formControlStyle}>
      <Select
        value={category}
        onChange={handleDateTypeChange}
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>Include Category</em>
        </MenuItem>
        {categories.map((cate) => (
          <MenuItem
            key={cate.id}
            value={cate.value}
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
          >
            {cate.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

Category.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};

export default Category;

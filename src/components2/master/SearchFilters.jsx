import { Box, Button, Paper } from "@mui/material";
import YesOrNo from "../../@core/YesOrNo";
import CustomTextField from "../../@core/CutsomTextField";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { useState } from "react";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));
const SearchFilters = (props) => {
  const { handleOpen } = props;
  const classes = useStyle();
  const [isActive, setIsActive] = useState("All");
  const [searchText, setSearchText] = useState("");
  const handleSearch = () => {};
  const handleDelete = () => {};
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Box
        component={Paper}
        sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        className="gap-1 px-1 py-1"
      >
        <YesOrNo
          classes={classes}
          mapValue={["All", "Active", "In Active"]}
          width={100}
          placeholder="IsActive"
          value={isActive}
          setValue={setIsActive}
        />
        <CustomTextField
          placeholder={"Search Text"}
          width={200}
          type={"text"}
          value={searchText}
          setValue={setSearchText}
        />
        <Button
          variant="outlined"
          size="small"
          type="submit"
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button variant="outlined" size="small" onClick={handleOpen}>
          Add
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </form>
  );
};

SearchFilters.propTypes = {
  handleOpen: PropTypes.func.isRequired,
};

export default SearchFilters;

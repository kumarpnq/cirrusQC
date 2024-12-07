import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
import CustomTextField from "../../../@core/CutsomTextField";
import YesOrNo from "../../../@core/YesOrNo";

const SearchFilters = ({ handleOpen }) => {
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState("");

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <CustomTextField
        type={"text"}
        placeholder={"Search Text"}
        width={300}
        value={searchText}
        setValue={setSearchText}
      />
      <YesOrNo
        mapValue={["Yes", "No"]}
        placeholder="Select"
        value={isActive}
        setValue={setIsActive}
        width={200}
      />
      <Button variant="outlined" size="small" onClick={handleOpen}>
        Add
      </Button>
      <Button variant="outlined" size="small" color="error">
        Delete
      </Button>
    </Box>
  );
};

SearchFilters.propTypes = {
  handleOpen: PropTypes.func.isRequired,
};

export default SearchFilters;

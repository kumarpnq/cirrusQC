import { Box, Button, Paper } from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { useState } from "react";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import CompanyFormModal from "./EditModal";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const SearchFilters = () => {
  const classes = useStyle();

  const [display, setDisplay] = useState();
  const [searchText, setSearchText] = useState("");
  const [activeValue, setActiveValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${url}endpoint`);
      console.log(response.data);
    } catch (error) {
      console.log("error");
    }
  };
  return (
    <Box component={Paper} mt={1}>
      <form
        className="flex flex-wrap items-center gap-1 p-1"
        onSubmit={handleFormSubmit}
      >
        <CustomTextField
          value={display}
          setValue={setDisplay}
          placeholder={"Display"}
          type={"number"}
          width={200}
        />
        <CustomTextField
          value={searchText}
          setValue={setSearchText}
          placeholder={"Search Text"}
          type={"text"}
          width={200}
        />
        <YesOrNo
          classes={classes}
          value={activeValue}
          setValue={setActiveValue}
          width={200}
          placeholder="IsActive"
          mapValue={["All", "Active", "In Active"]}
        />
        <Button variant="outlined" size="small" type="submit">
          Search
        </Button>
        <Button variant="outlined" size="small" onClick={handleOpen}>
          Add
        </Button>
        <Button variant="outlined" color="error" size="small">
          Delete
        </Button>
      </form>
      <CompanyFormModal open={open} handleClose={handleClose} rowId={null} />
    </Box>
  );
};

export default SearchFilters;

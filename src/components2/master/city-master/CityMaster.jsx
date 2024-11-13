import { Box, Button, Divider, Paper } from "@mui/material";
import { useState } from "react";
import YesOrNo from "../../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../../@core/CutsomTextField";
import CityGrid from "./CityGrid";
import AddEditModal from "./AddEditModal";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const CityMaster = () => {
  const classes = useStyle();
  const [isActive, setIsActive] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box>
      {/* search filters */}
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
          <Button variant="outlined" size="small" type="submit">
            Search
          </Button>
          <Button variant="outlined" size="small" onClick={handleOpen}>
            Add
          </Button>
          <Button variant="outlined" size="small" color="error">
            Delete
          </Button>
        </Box>
      </form>
      <Divider sx={{ my: 1 }} />
      <CityGrid />
      <AddEditModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default CityMaster;

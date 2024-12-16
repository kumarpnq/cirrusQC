import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../@core/CutsomTextField";
import YesOrNo from "../../../@core/YesOrNo";
import DeleteConfirmationDialog from "../../../@core/DeleteConfirmationDialog";

const SearchFilters = ({
  handleOpen,
  handleSubmit,
  loading,
  onDelete = () => {},
  deleteOpen,
  setDeleteOpen,
}) => {
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState("");

  const handleDeleteOpen = () => setDeleteOpen((prev) => !prev);
  const handleDeleteClose = () => setDeleteOpen(false);

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CustomTextField
            type={"text"}
            placeholder={"Search Text"}
            width={250}
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
          <Button
            size="small"
            variant="outlined"
            type="submit"
            sx={{ display: "flex", gap: 1 }}
          >
            {loading && <CircularProgress size={"1em"} />}
            Search
          </Button>
          <Button variant="outlined" size="small" onClick={handleOpen}>
            Add
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDeleteOpen}
          >
            Delete
          </Button>
        </Box>
      </form>
      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        onDelete={onDelete}
      />
    </Fragment>
  );
};

SearchFilters.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleteOpen: PropTypes.bool.isRequired,
  setDeleteOpen: PropTypes.func.isRequired,
};

export default SearchFilters;

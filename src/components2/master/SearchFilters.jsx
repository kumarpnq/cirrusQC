import { Box, Button, CircularProgress, Paper } from "@mui/material";
import YesOrNo from "../../@core/YesOrNo";
import CustomTextField from "../../@core/CutsomTextField";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));
const SearchFilters = ({
  handleOpen,
  setData = () => {},
  loading,
  setLoading = () => {},
  endpoint,
  deleteEndPoint,
  selectedItems = [],
  fetchAfterSave,
  setFetchAfterSave,
}) => {
  const classes = useStyle();
  const [isActive, setIsActive] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpenOrClose = () => setDeleteOpen((prev) => !prev);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const params = {
        // isActive,
      };
      if (searchText) {
        params.searchText = searchText;
      }
      if (isActive === "Active" || isActive === "In Active") {
        params.isActive = isActive === "Active" ? "Y" : "N";
      }

      const response = await axiosInstance.get(endpoint, { params });
      if (response.status === 200) {
        setData(response.data.data?.data || response.data || []);
        setFetchAfterSave(false);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (fetchAfterSave) {
  //     handleFormSubmit();
  //   }
  // }, [fetchAfterSave]);

  const handleDelete = async () => {
    try {
      const key = "pubGroupId";
      const keyToSend = "pubGroupIds";
      const Ids = selectedItems.map((item) => item[key]);

      const response = await axiosInstance.delete(
        `${deleteEndPoint}?${keyToSend}=${Ids.join(",")}`
      );

      if (response.status === 200) {
        toast.success(response.data.data.message);

        setData((prev) => prev.filter((item) => !Ids.includes(item[key])));

        handleDeleteOpenOrClose();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleFormSubmit}>
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
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
            onClick={handleDeleteOpenOrClose}
          >
            Delete
          </Button>
        </Box>
      </form>
      <DeleteConfirmationDialog
        onClose={handleDeleteOpenOrClose}
        open={deleteOpen}
        onDelete={handleDelete}
      />
    </Fragment>
  );
};

SearchFilters.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  setData: PropTypes.func,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
  endpoint: PropTypes.string,
  deleteEndPoint: PropTypes.string,
  selectedItems: PropTypes.array,
  fetchAfterSave: PropTypes.bool,
  setFetchAfterSave: PropTypes.func,
};

export default SearchFilters;

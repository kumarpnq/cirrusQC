import { Box, Button, CircularProgress, Paper } from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { useState } from "react";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import CompanyFormModal from "./EditModal";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { arrayToString } from "../../utils/arrayToString";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const SearchFilters = ({ setCompanies, selectedRows, setSelectedRows }) => {
  const classes = useStyle();

  const [display, setDisplay] = useState();
  const [searchText, setSearchText] = useState("");
  const [activeValue, setActiveValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const getActiveValue = (value) => {
    switch (value) {
      case "Active":
        return "Y";
      case "In Active":
        return "N";
    }
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("user");
      const params = {};
      if (activeValue === "Active" || activeValue === "In Active") {
        params.isActive = getActiveValue(activeValue);
      }

      if (display) {
        params.display = display;
      }
      if (searchText) {
        params.searchText = searchText;
      }

      const response = await axios.get(`${url}companymaster/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setCompanies(response.data.companies || []);
    } catch (error) {
      toast.error("Error while fetching");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("user");
      const companyIds = selectedRows.map((i) => i.companyId);
      if (!companyIds.length) {
        toast.warning("Please select at least one company");
        return;
      }
      const requestData = {
        companyId: companyIds.join(","),
        updateType: "D",
      };
      const response = await axios.post(
        `${url}updatecompanymaster`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.updateStatus.status === "Deleted Successfully") {
        setCompanies((prevCompanies) =>
          prevCompanies.filter(
            (company) => !companyIds.includes(company.companyId)
          )
        );
        setSelectedRows([]);
        toast.success("Companies deleted successfully");
      } else {
        toast.warning(response.data.updateStatus.status);
      }
    } catch (error) {
      console.error(error);
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
        <Button
          variant="outlined"
          size="small"
          type="submit"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {loading && <CircularProgress size={"1em"} />}Search
        </Button>
        <Button variant="outlined" size="small" onClick={handleOpen}>
          Add
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </form>
      <CompanyFormModal
        open={open}
        handleClose={handleClose}
        rowId={null}
        isEdit={false}
      />
    </Box>
  );
};

SearchFilters.propTypes = {
  setCompanies: PropTypes.func.isRequired,
  selectedRows: PropTypes.array.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
};

export default SearchFilters;

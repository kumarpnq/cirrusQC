import PropTypes from "prop-types";
import { Box, Button, CircularProgress, Paper } from "@mui/material";
import Client from "../../print-components/dropdowns/Client";
import { Fragment, useState } from "react";
import YesOrNo from "../../@core/YesOrNo";
import AddEditDialog from "./AddEditDialog";
import toast from "react-hot-toast";
import axiosInstance from "../../../axiosConfig";

const SearchFilters = ({ loading, setLoading, setData }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [testCompanies, setTestCompanies] = useState([]);
  const [selectedValidity, setSelectedValidity] = useState("");
  const [open, setOpen] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const params = {
        // companyId,
        // isActive
      };
      if (selectedClient) params.companyId = selectedClient;
      if (selectedValidity)
        params.isActive = selectedValidity === "Valid" ? "Y" : "N";
      const response = await axiosInstance.get("keywordBoolean", { params });

      setData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleFormSubmit}>
        <Box
          component={Paper}
          sx={{ display: "flex", alignItems: "center", px: 0.5 }}
          className="gap-1"
        >
          <div className="pb-1.5">
            <Client
              label="Client"
              client={selectedClient}
              setClient={setSelectedClient}
              width={200}
              setCompanies={setTestCompanies}
            />
          </div>

          <YesOrNo
            mapValue={["Valid", "Invalid"]}
            placeholder="Validity"
            value={selectedValidity}
            setValue={setSelectedValidity}
            width={200}
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
          <Button variant="outlined" size="small" color="error">
            Reset
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpen((prev) => !prev)}
          >
            Add
          </Button>
        </Box>
      </form>
      <AddEditDialog
        open={open}
        handleClose={() => setOpen((prev) => !prev)}
        fromWhere="Add"
      />
    </Fragment>
  );
};

SearchFilters.propTypes = {
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};
export default SearchFilters;

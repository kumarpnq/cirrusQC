import { Box, Button, Paper } from "@mui/material";
import Client from "../../print-components/dropdowns/Client";
import { Fragment, useState } from "react";
// import CompanyList from "../../qc1-components/components/CompanyList";
import YesOrNo from "../../@core/YesOrNo";
import AddEditDialog from "./AddEditDialog";
import Languages from "../../components/research-dropdowns/Languages";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";

const SearchFilters = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [testCompanies, setTestCompanies] = useState([]);
  const [selectedValidity, setSelectedValidity] = useState("");
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const { data: languageData } = useFetchData(`${url}languagelist/`);
  // console.log(languageData);

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
          <Button variant="outlined" size="small">
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

export default SearchFilters;

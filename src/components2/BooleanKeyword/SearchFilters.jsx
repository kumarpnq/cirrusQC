import { Box, Button } from "@mui/material";
import Client from "../../print-components/dropdowns/Client";
import { Fragment, useState } from "react";
import CompanyList from "../../qc1-components/components/CompanyList";
import YesOrNo from "../../@core/YesOrNo";
import AddEditDialog from "./AddEditDialog";

const SearchFilters = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [testCompanies, setTestCompanies] = useState([]);
  const [selectedValidity, setSelectedValidity] = useState("");
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <form onSubmit={handleFormSubmit}>
        <Box sx={{ display: "flex", alignItems: "center" }} className="gap-1">
          <div className="mb-2">
            <Client
              label="Client"
              client={selectedClient}
              setClient={setSelectedClient}
              width={200}
              setCompanies={setTestCompanies}
            />
          </div>

          <div className="w-[200px]">
            <CompanyList
              selectedCompanies={selectedCompanies}
              setSelectedCompanies={setSelectedCompanies}
              selectedClient={""}
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
          <Button variant="outlined" size="small">
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

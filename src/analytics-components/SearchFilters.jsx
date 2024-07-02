import PropTypes from "prop-types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
} from "@mui/material";
import CustomMultiSelect from "../@core/CustomMultiSelect";
import useFetchData from "../hooks/useFetchData";
import { url } from "../constants/baseUrl";
import FromDate from "../components/research-dropdowns/FromDate";
import ToDate from "../components/research-dropdowns/ToDate";
import Qc1By from "../components/research-dropdowns/Qc1By";
import Button from "../components/custom/Button";

const SearchFilters = (props) => {
  const {
    value,
    selectedClients,
    setSelectedClients,
    selectedUsers,
    setSelectedUsers,
    selectedHeaders,
    setSelectedHeaders,
    selectedPrintAndOnline,
    setSelectedPrintAndOnline,
    withCompetition,
    setWithCompetition,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedUserId,
    setSelectedUserId,
    gridDataLoading,
    handleFetchRecords,
    classes,
  } = props;
  // * data hooks
  const { data } = useFetchData(`${url}clientlist/`);
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`);
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        SearchFilters
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {!value ? (
            <>
              <div className="pt-3 w-[200px]">
                <CustomMultiSelect
                  title="Clients"
                  options={data?.data?.clients || []}
                  selectedItems={selectedClients}
                  setSelectedItems={setSelectedClients}
                  keyId="clientid"
                  keyName="clientname"
                  dropdownWidth={250}
                  dropdownToggleWidth={200}
                />
              </div>
              <div className="pt-3 w-[200px]">
                <CustomMultiSelect
                  title="Users"
                  options={qcUserData?.data?.qc_users || []}
                  selectedItems={selectedUsers}
                  setSelectedItems={setSelectedUsers}
                  keyId="usersid"
                  keyName="username"
                  dropdownWidth={200}
                  dropdownToggleWidth={200}
                />
              </div>
              <div className="pt-3 w-[180px]">
                <CustomMultiSelect
                  title="QC"
                  dropdownWidth={180}
                  dropdownToggleWidth={180}
                  options={[
                    { id: "qc1", name: "QC1" },
                    { id: "qc2", name: "QC2" },
                  ]}
                  keyId="id"
                  keyName="name"
                  selectedItems={selectedHeaders}
                  setSelectedItems={setSelectedHeaders}
                />
              </div>
              <div className="pt-3 w-[150px]">
                <CustomMultiSelect
                  title="Media"
                  options={[
                    { id: "PRINT", name: "Print" },
                    { id: "ONLINE", name: "Online" },
                  ]}
                  selectedItems={selectedPrintAndOnline}
                  setSelectedItems={setSelectedPrintAndOnline}
                  keyId="id"
                  keyName="name"
                  dropdownWidth={180}
                  dropdownToggleWidth={150}
                />
              </div>
              <div>
                <FormControl>
                  <FormControlLabel
                    sx={{ mt: 2 }}
                    label={
                      <Typography variant="h6" fontSize={"0.9em"}>
                        Competition
                      </Typography>
                    }
                    control={
                      <Checkbox
                        checked={withCompetition}
                        onChange={() => setWithCompetition((prev) => !prev)}
                      />
                    }
                  />
                </FormControl>
              </div>
              <FromDate fromDate={fromDate} setFromDate={setFromDate} />
              <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
            </>
          ) : (
            <>
              <Qc1By
                qcUsersData={qcUserData?.data?.qc_users || []}
                qc1by={selectedUserId}
                setQc1by={setSelectedUserId}
                classes={classes}
                title={"Users"}
              />
              <FromDate fromDate={fromDate} setFromDate={setFromDate} />
              <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
            </>
          )}
          <Button
            btnText={gridDataLoading ? "Searching" : "Search"}
            onClick={handleFetchRecords}
            isLoading={gridDataLoading}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

SearchFilters.propTypes = {
  value: PropTypes.bool,
  selectedClients: PropTypes.array.isRequired,
  setSelectedClients: PropTypes.func.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  setSelectedUsers: PropTypes.func.isRequired,
  selectedHeaders: PropTypes.array.isRequired,
  setSelectedHeaders: PropTypes.func.isRequired,
  selectedPrintAndOnline: PropTypes.array.isRequired,
  setSelectedPrintAndOnline: PropTypes.func.isRequired,
  withCompetition: PropTypes.bool.isRequired,
  setWithCompetition: PropTypes.func.isRequired,
  fromDate: PropTypes.string.isRequired,
  setFromDate: PropTypes.func.isRequired,
  toDate: PropTypes.string.isRequired,
  setToDate: PropTypes.func.isRequired,
  selectedUserId: PropTypes.string.isRequired,
  setSelectedUserId: PropTypes.func.isRequired,
  gridDataLoading: PropTypes.bool.isRequired,
  handleFetchRecords: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default SearchFilters;

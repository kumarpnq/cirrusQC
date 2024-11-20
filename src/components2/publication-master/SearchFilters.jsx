import PropTypes from "prop-types";
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomTextField from "../../@core/CutsomTextField";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import useFetchData from "../../hooks/useFetchData";
import { styled } from "@mui/system";
import { url } from "../../constants/baseUrl";
import PublicationAddModal from "./PublicationAddModal";
import axiosInstance from "../../../axiosConfig";
import { pubTypesAll } from "../../constants/dataArray";
import { toast } from "react-toastify";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import { format } from "date-fns";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const FilterWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 1.7,
  flexWrap: "wrap",
});

const SearchFilters = ({
  setPublicationData,
  fetchLoading,
  setFetchLoading,
}) => {
  const classes = useStyle();
  const [fromDate, setFromDate] = useState("");
  const [dateNow, setDateNow] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pubType, setPubType] = useState("");
  const [temporary, setTemporary] = useState("");
  const [type, setType] = useState("");
  const [populate, setPopulate] = useState("");
  const [edition, setEdition] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [subscription, setSubscription] = useState("");

  const [openAddPublication, setOpenAddPublication] = useState(false);
  const handleOpen = () => setOpenAddPublication(true);
  const handleClose = () => setOpenAddPublication(false);

  // * city data fetch
  const { data } = useFetchData(`${url}citieslist`);
  const cityData = data?.data?.cities || [];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setFetchLoading(true);
      const params = {
        // searchText: (Optional[str] = None),
        // fromDate: (Optional[str] = None),
        // toDate: (Optional[str] = None),
        // publicationType: (Optional[str] = None),
        // editionType: (Optional[str] = None),
        // newsType: (Optional[str] = None),
        // subscriptionType: (Optional[str] = None),
      };
      if (searchText) {
        params.searchText = searchText;
      }
      if (fromDate) {
        params.fromDate = format(fromDate, "yyyy-MM-dd");
      }
      if (dateNow) {
        params.toDate = format(dateNow, "yyyy-MM-dd");
      }
      if (pubType) {
        params.publicationType = pubType;
      }
      if (edition) {
        params.editionType = edition;
      }
      if (type) {
        params.newsType = type;
      }
      if (subscription) {
        params.subscriptionType = subscription;
      }
      if (selectedCity) {
        params.cityEdition = selectedCity;
      }
      if (populate) {
        params.populate = populate;
      }
      if (temporary) {
        params.temporary = temporary;
      }
      const response = await axiosInstance.get("publicationMaster", { params });
      setPublicationData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setFetchLoading(false);
    }
  };
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        Search
      </AccordionSummary>
      <AccordionDetails>
        <form action="" onSubmit={handleSubmit}>
          <FilterWrapper>
            <Tooltip title="Start Date" arrow>
              <div className="mb-3">
                <FromDate fromDate={fromDate} setFromDate={setFromDate} />
              </div>
            </Tooltip>
            <Tooltip title="End Date" arrow>
              <div>
                <ToDate dateNow={dateNow} setDateNow={setDateNow} />
              </div>
            </Tooltip>
            <CustomTextField
              value={searchText}
              setValue={setSearchText}
              width={200}
              placeholder={"Search text"}
              type={"text"}
            />
            <Typography component={"div"} width={200}>
              <CustomSingleSelect
                dropdownToggleWidth={200}
                dropdownWidth={250}
                keyId="cityid"
                keyName="cityname"
                options={cityData}
                selectedItem={selectedCity}
                setSelectedItem={setSelectedCity}
                title="City"
              />
            </Typography>

            <YesOrNo
              classes={classes}
              placeholder="Pub Type"
              mapValue={pubTypesAll}
              value={pubType}
              setValue={setPubType}
              width={120}
            />
            <YesOrNo
              classes={classes}
              placeholder="Temporary"
              mapValue={["Yes", "No", "All"]}
              value={temporary}
              setValue={setTemporary}
              width={120}
            />
            <YesOrNo
              classes={classes}
              placeholder="Type"
              mapValue={["YPT", "TPT", "POST"]}
              value={type}
              setValue={setType}
              width={120}
            />
            <YesOrNo
              classes={classes}
              placeholder="Subscription"
              mapValue={["Vendor", "Courier", "Post"]}
              value={subscription}
              setValue={setSubscription}
              width={120}
            />
            <YesOrNo
              classes={classes}
              placeholder="Populate"
              mapValue={["Yes", "No"]}
              value={populate}
              setValue={setPopulate}
              width={120}
            />
            <YesOrNo
              classes={classes}
              placeholder="Edition"
              mapValue={["BD", "ND", "RD", "TAB", "PIM", "BIM", "TM", "WP"]}
              value={edition}
              setValue={setEdition}
              width={120}
            />
            <Button
              variant="outlined"
              size="small"
              type="submit"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {fetchLoading && <CircularProgress size={"1em"} />}
              Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setFromDate("");
                setDateNow("");
                setSearchText("");
                setPubType("");
                setTemporary("");
                setType("");
                setPopulate("");
                setEdition("");
                setSelectedCity("");
                setSubscription("");
              }}
            >
              Clear
            </Button>
            <Button variant="outlined" size="small" onClick={handleOpen}>
              Add
            </Button>
            <Button variant="outlined" color="error" size="small">
              Delete
            </Button>
          </FilterWrapper>
        </form>
      </AccordionDetails>
      <PublicationAddModal
        open={openAddPublication}
        handleClose={handleClose}
      />
    </Accordion>
  );
};

SearchFilters.propTypes = {
  setPublicationData: PropTypes.func.isRequired,
  fetchLoading: PropTypes.bool.isRequired,
  setFetchLoading: PropTypes.func.isRequired,
};

export default SearchFilters;

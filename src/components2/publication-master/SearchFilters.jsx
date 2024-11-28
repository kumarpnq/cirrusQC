import PropTypes from "prop-types";
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { url } from "../../constants/baseUrl";
import { editionTypes, pubTypesAll } from "../../constants/dataArray";
import axiosInstance from "../../../axiosConfig";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomTextField from "../../@core/CutsomTextField";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import YesOrNo from "../../@core/YesOrNo";
import useFetchData from "../../hooks/useFetchData";
import PublicationAddModal from "./PublicationAddModal";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";

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
  selectedItems,
  setSelectedItems,
  setSelectionModal,
  mainFetchAPi,
  mainDeleteApi,
  screen,
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

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

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
        params.publicationType = pubType?.toLowerCase();
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
        params.cityId = Number(selectedCity);
      }
      if (populate) {
        params.populate = populate === "Yes" ? "Y" : "N";
      }
      if (temporary && temporary !== "All") {
        params.isTemporary = temporary === "Yes" ? "Y" : "N";
      }
      const response = await axiosInstance.get(mainFetchAPi, { params });
      setPublicationData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const publicationIds = selectedItems.map((item) => item.publicationId);

      const response = await axiosInstance.delete(
        `${mainDeleteApi}/?publicationIds=${publicationIds.join(",")}`
      );

      if (response.status === 200) {
        toast.success(response.data.data.message);
        setPublicationData((prevData) =>
          prevData.filter(
            (publication) => !publicationIds.includes(publication.publicationId)
          )
        );
        setSelectedItems([]);
        setSelectionModal([]);
        setOpenDeleteConfirmation(false);
      }
    } catch (error) {
      toast.error("Something went wrong.");
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
            <div className="flex items-center gap-1">
              <div className="flex items-center border border-gray-400 rounded-md p-[0.1em] gap-1">
                <Typography fontSize={"0.8em"}>
                  Subscription Start Date :{" "}
                </Typography>
                <FromDate
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  isNoMargin
                />
              </div>

              <div className="flex items-center border border-gray-400 rounded-md p-[0.1em] gap-1">
                <Typography fontSize={"0.8em"}>
                  Subscription End Date :{" "}
                </Typography>
                <ToDate dateNow={dateNow} setDateNow={setDateNow} />
              </div>
            </div>
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
            {mainFetchAPi !== "publicationMasterOnline" && (
              <YesOrNo
                classes={classes}
                placeholder="Temporary"
                mapValue={["Yes", "No", "All"]}
                value={temporary}
                setValue={setTemporary}
                width={120}
              />
            )}

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
            <Typography component={"div"} width={150}>
              <CustomSingleSelect
                dropdownToggleWidth={150}
                dropdownWidth={250}
                keyId="id"
                keyName="name"
                options={editionTypes}
                selectedItem={edition}
                setSelectedItem={setEdition}
                title="Edition"
              />
            </Typography>

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
                setSelectedItems([]);
                setPublicationData([]);
              }}
            >
              Clear
            </Button>
            <Button variant="outlined" size="small" onClick={handleOpen}>
              Add
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setOpenDeleteConfirmation(true)}
              disabled={!selectedItems.length}
            >
              Delete
            </Button>
          </FilterWrapper>
        </form>
      </AccordionDetails>
      <PublicationAddModal
        open={openAddPublication}
        handleClose={handleClose}
        screen={screen}
      />
      <DeleteConfirmationDialog
        open={openDeleteConfirmation}
        onDelete={handleDelete}
        onClose={() => setOpenDeleteConfirmation(false)}
      />
    </Accordion>
  );
};

SearchFilters.propTypes = {
  setPublicationData: PropTypes.func.isRequired,
  fetchLoading: PropTypes.bool.isRequired,
  setFetchLoading: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  setSelectionModal: PropTypes.func.isRequired,
  mainFetchAPi: PropTypes.string,
  mainDeleteApi: PropTypes.string,
  screen: PropTypes.string,
};

export default SearchFilters;

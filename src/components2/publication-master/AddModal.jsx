import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import CustomTextField from "../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";
import OtherInfo from "./OtherInfo";
import FormAction from "./FormAction";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const FieldWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 2,
  margin: 1,
  padding: 5,
});
const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: "1em", // Default size
  color: "gray",
  textWrap: "nowrap",
  width: 250,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.500em",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "0.500em",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1em",
  },
}));
const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));
const AddModal = ({ open, handleClose, row }) => {
  const classes = useStyle();
  const [publicationID, setPublicationID] = useState("");
  const [publicationName, setPublicationName] = useState("");
  const [fullCoverage, setFullCoverage] = useState("");
  const [publicationCategory, setPublicationCategory] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [type, setType] = useState("");
  const [actualPublication, setActualPublication] = useState("");
  const [publicationInDropDown, setPublicationInDropDown] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [tier, setTier] = useState("");
  const [subscriptionFromDate, setSubscriptionFromDate] = useState(null);
  const [subscriptionToDate, setSubscriptionToDate] = useState(null);
  const [editionType, setEditionType] = useState("");
  const [publicationPriority, setPublicationPriority] = useState("");
  const [publicationScore, setPublicationScore] = useState("");
  const [adRates, setAdRates] = useState("");
  const [shortPublicationId, setShortPublicationId] = useState("");
  const [groupPublication, setGroupPublication] = useState("");
  const [publicationGroupName, setPublicationGroupName] = useState("");
  const [temporary, setTemporary] = useState("");
  const [circulation, setCirculation] = useState("");
  const [active, setActive] = useState("");

  const { data } = useFetchData(`${url}citieslist`, city);
  const citiesArray = data?.data?.cities || [];

  const { data: languageData } = useFetchData(`${url}languagelist/`);
  const languageArray = Object.entries(languageData?.data?.languages || {}).map(
    ([languageName, languageId]) => ({
      languageName,
      languageId,
    })
  );

  const [selectedTab, setSelectedTab] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchPublicationData = async () => {
      try {
        setFetchLoading(true);
        const response = await axiosInstance.get(
          `getPublicationInfo/?publicationId="49"`
        );
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setFetchLoading(false);
      }
    };
    if (open && row) {
      fetchPublicationData();
    }
  }, [open, row]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!publicationID) {
      toast.warning("Publication ID is required.");
    }
    try {
      setUpdateLoading(true);
      const requestData = {
        publicationId: "",
        publicationName: "",
        shortPublication: "",
        actualPublication: "",
        publicationType: "",
        publicationCategory: "",
        publicationLogo: "",
        publicationGroupID: "",
        publicationGroupName: "",
        editionType: "",
        cityId: "",
        cityName: "",
        zone: "",
        language: "",
        newsType: "",
        isPopulate: "",
        isActive: "",
        isTemporary: "",
      };
      const response = await axiosInstance.post(
        "updatePublicationInfo/",
        requestData
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateLoading(false);
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "35vw",
            bgcolor: "background.paper",
            border: "1px solid #000",
            boxShadow: 24,
            height: 600,
            overflow: "scroll",
            p: 1,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            fontSize={"1em"}
          >
            Add - Publication Master
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="publication tabs"
          >
            <Tab label="Publication Info" />
            <Tab label="Other Info" />
          </Tabs>
          {!selectedTab ? (
            fetchLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-1 mt-1 border rounded-md"
              >
                <FieldWrapper>
                  <FieldLabel>Publication ID :</FieldLabel>
                  <CustomTextField
                    value={publicationID}
                    setValue={setPublicationID}
                    placeholder={"Publication ID"}
                    type={"text"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication Name :</FieldLabel>
                  <CustomTextField
                    value={publicationName}
                    setValue={setPublicationName}
                    placeholder={"Publication Name"}
                    type={"text"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Short Publication ID :</FieldLabel>
                  <CustomTextField
                    value={shortPublicationId}
                    setValue={setShortPublicationId}
                    placeholder={"Short Pub ID"}
                    type={"text"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Actual Publication :</FieldLabel>
                  <CustomTextField
                    value={actualPublication}
                    setValue={setActualPublication}
                    placeholder={"Publication"}
                    type={"text"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Full Coverage :</FieldLabel>
                  <YesOrNo
                    mapValue={["1", "0"]}
                    placeholder="Coverage"
                    classes={classes}
                    value={fullCoverage}
                    setValue={setFullCoverage}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication Category :</FieldLabel>
                  <YesOrNo
                    mapValue={[
                      "News",
                      "Magazine",
                      "Supplement",
                      "Blog",
                      "Special News",
                    ]}
                    placeholder="Pub Category"
                    classes={classes}
                    value={publicationCategory}
                    setValue={setPublicationCategory}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication Type :</FieldLabel>
                  <YesOrNo
                    mapValue={[
                      "Daily",
                      "Weekly",
                      "Monthly",
                      "FortNightly",
                      "Others",
                    ]}
                    placeholder="Pub Type"
                    classes={classes}
                    value={publicationType}
                    setValue={setPublicationType}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Type :</FieldLabel>
                  <YesOrNo
                    mapValue={["YPT", "TPT", "POST"]}
                    placeholder="Type"
                    classes={classes}
                    value={type}
                    setValue={setType}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <FieldLabel>Publish in Dropdown :</FieldLabel>
                  <YesOrNo
                    mapValue={["No", "Yes"]}
                    placeholder="Publish Dropdown"
                    classes={classes}
                    value={publicationInDropDown}
                    setValue={setPublicationInDropDown}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>City Edition :</FieldLabel>
                  {/* <div className="ml-20"> */}
                  <CustomSingleSelect
                    dropdownToggleWidth={`100%`}
                    dropdownWidth={"100%"}
                    keyId="cityid"
                    keyName="cityname"
                    options={citiesArray}
                    selectedItem={city}
                    setSelectedItem={setCity}
                    title="City"
                  />
                  {/* </div> */}
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Language :</FieldLabel>
                  {/* <div className="ml-24"> */}
                  <CustomSingleSelect
                    dropdownToggleWidth={`100%`}
                    dropdownWidth={"100%"}
                    keyId="languageId"
                    keyName="languageName"
                    options={languageArray}
                    selectedItem={language}
                    setSelectedItem={setLanguage}
                    title="Language"
                  />
                  {/* </div> */}
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Subscription Type :</FieldLabel>
                  <YesOrNo
                    mapValue={["Vendor", "Courier", "Post"]}
                    placeholder="Subscription Type"
                    classes={classes}
                    value={subscriptionType}
                    setValue={setSubscriptionType}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Tier :</FieldLabel>
                  <YesOrNo
                    mapValue={["Other", "1", "2"]}
                    placeholder="Tier"
                    classes={classes}
                    value={tier}
                    setValue={setTier}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Subscription Date :</FieldLabel>

                  <TextField
                    InputProps={{ style: { height: 25 } }}
                    type="date"
                    value={subscriptionFromDate}
                    onChange={(e) => setSubscriptionFromDate(e.target.value)}
                    fullWidth
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Subscription Date :</FieldLabel>
                  <TextField
                    type="date"
                    fullWidth
                    InputProps={{ style: { height: 25 } }}
                    value={subscriptionToDate}
                    onChange={(e) => setSubscriptionToDate(e.target.value)}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Type Of Edition :</FieldLabel>
                  <YesOrNo
                    mapValue={[
                      "BD",
                      "ND",
                      "RD",
                      "TAB",
                      "PIM",
                      "BIM",
                      "TM",
                      "WP",
                    ]}
                    placeholder="Edition"
                    classes={classes}
                    value={editionType}
                    setValue={setEditionType}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication Priority :</FieldLabel>
                  <CustomTextField
                    value={publicationPriority}
                    setValue={setPublicationPriority}
                    placeholder={"Publication Priority"}
                    type={"text"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication Score :</FieldLabel>
                  <CustomTextField
                    value={publicationScore}
                    setValue={setPublicationScore}
                    placeholder={"Publication Score"}
                    type={"number"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Ad Rates :</FieldLabel>
                  <CustomTextField
                    value={adRates}
                    setValue={setAdRates}
                    placeholder={"Ad Rates"}
                    type={"text"}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <FieldLabel>Group Publication :</FieldLabel>
                  {/* <div className="ml-8"> */}
                  <CustomSingleSelect
                    dropdownToggleWidth={`100%`}
                    dropdownWidth={"100%"}
                    keyId="cityid"
                    keyName="cityname"
                    options={citiesArray}
                    selectedItem={groupPublication}
                    setSelectedItem={setGroupPublication}
                    title="Publication Group"
                  />
                  {/* </div> */}
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication Group:</FieldLabel>
                  <CustomTextField
                    value={publicationGroupName}
                    setValue={setPublicationGroupName}
                    placeholder={"Publication Group Name"}
                    type={"text"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Temporary :</FieldLabel>
                  <YesOrNo
                    mapValue={["Yes", "No"]}
                    placeholder="Temporary"
                    classes={classes}
                    value={temporary}
                    setValue={setTemporary}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Circulation :</FieldLabel>
                  <CustomTextField
                    value={circulation}
                    setValue={setCirculation}
                    placeholder={"Circulation"}
                    type={"text"}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Active :</FieldLabel>
                  <YesOrNo
                    mapValue={["Yes", "No"]}
                    placeholder="Active"
                    classes={classes}
                    value={active}
                    setValue={setActive}
                  />
                </FieldWrapper>
                <Divider sx={{ my: 1 }} />
                <FormAction
                  handleClose={handleClose}
                  updateLoading={updateLoading}
                />
              </form>
            )
          ) : (
            <OtherInfo
              FieldWrapper={FieldWrapper}
              FieldLabel={FieldLabel}
              handleClose={handleClose}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

AddModal.propTypes = {
  open: PropTypes.bool.isRequired, // Boolean to control the modal visibility
  handleClose: PropTypes.func.isRequired, // Function to handle closing the modal
  row: PropTypes.shape({
    // Object representing the row
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Example key, replace as per your data
    name: PropTypes.string, // Example key, replace as per your data
    // Add other row-specific keys here based on your structure
  }).isRequired,
};
export default AddModal;

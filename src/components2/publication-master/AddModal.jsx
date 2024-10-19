import { Modal, Box, Button, Typography, Divider } from "@mui/material";
import { styled } from "@mui/system";
import CustomTextField from "../../@core/CutsomTextField";
import { useState } from "react";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";

const FieldWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: 1,
});
const FieldLabel = styled(Typography)({
  fontSize: "1em",
  color: "gray",
  textWrap: "nowrap",
  width: 300,
});
const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));
const AddModal = ({ open, handleClose }) => {
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
  const [temporary, setTemporary] = useState("");
  const [circulation, setCirculation] = useState("");
  const [active, setActive] = useState("");

  const { data } = useFetchData(`${url}citieslist`, city);
  const citiesArray = data?.data?.cities || [];

  const { data: languageData } = useFetchData(`${url}languagelist/`);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
            width: 500,
            bgcolor: "background.paper",
            border: "1px solid #000",
            boxShadow: 24,
            height: 600,
            overflow: "scroll",
            p: 1,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Add - Publication Master
          </Typography>
          <form onSubmit={handleSubmit}>
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
              <FieldLabel>Actual Publication :</FieldLabel>
              <CustomTextField
                value={actualPublication}
                setValue={setActualPublication}
                placeholder={"Publication"}
                type={"text"}
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
              />
              {/* </div> */}
            </FieldWrapper>
            <FieldWrapper>
              <FieldLabel>Language :</FieldLabel>
              <div className="ml-24">
                <CustomSingleSelect
                  dropdownToggleWidth={`100%`}
                  dropdownWidth={"100%"}
                  keyId="cityid"
                  keyName="cityname"
                  options={citiesArray}
                  selectedItem={language}
                  setSelectedItem={setLanguage}
                />
              </div>
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
              <input
                type="date"
                className="w-full border border-gray-400 rounded-sm hover:border-black"
                value={subscriptionFromDate}
                onChange={(e) => setSubscriptionFromDate(e.target.value)}
              />
            </FieldWrapper>
            <FieldWrapper>
              <FieldLabel>Subscription Date :</FieldLabel>
              <input
                type="date"
                className="w-full border border-gray-400 rounded-sm hover:border-black"
                value={subscriptionToDate}
                onChange={(e) => setSubscriptionToDate(e.target.value)}
              />
            </FieldWrapper>
            <FieldWrapper>
              <FieldLabel>Type Of Edition :</FieldLabel>
              <YesOrNo
                mapValue={["BD", "ND", "RD", "TAB", "PIM", "BIM", "TM", "WP"]}
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
              <FieldLabel>Short Publication ID :</FieldLabel>
              <CustomTextField
                value={shortPublicationId}
                setValue={setShortPublicationId}
                placeholder={"Short Pub ID"}
                type={"text"}
              />
            </FieldWrapper>
            <FieldWrapper>
              <FieldLabel>Group Publication :</FieldLabel>
              <div className="ml-8">
                <CustomSingleSelect
                  dropdownToggleWidth={`100%`}
                  dropdownWidth={"100%"}
                  keyId="cityid"
                  keyName="cityname"
                  options={citiesArray}
                  selectedItem={groupPublication}
                  setSelectedItem={setGroupPublication}
                />
              </div>
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleClose} variant="outlined" size="small">
                Close
              </Button>
              <Button type="submit" variant="contained" size="small">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddModal;

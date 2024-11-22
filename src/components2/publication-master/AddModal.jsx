import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Tabs,
  Tab,
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
import {
  publicationCategories,
  pubTypesAll,
  zones,
} from "../../constants/dataArray";

const FieldWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  margin: theme.spacing(0.2),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
  transition: "all 0.5s ease-in-out",
  "&:hover": {
    boxShadow: `0 6px 12px rgba(0, 0, 0, 0.2)`,
    // transform: "scale(1.001)",
  },
  backgroundColor: theme.palette.background.default,
}));
const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: "1em",
  color: theme.palette.text.secondary,
  fontWeight: "500",
  whiteSpace: "nowrap",
  width: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75em",
    width: "auto",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "0.875em",
    width: "auto",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1em",
    width: 250,
  },
  textAlign: "left",
  padding: theme.spacing(0.5),
}));
const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));
const AddModal = ({ open, handleClose, row, screen }) => {
  const classes = useStyle();
  const [publicationID, setPublicationID] = useState("");
  const [publicationName, setPublicationName] = useState("");
  const [publicationCategory, setPublicationCategory] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [type, setType] = useState("");
  const [actualPublication, setActualPublication] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [editionType, setEditionType] = useState("");
  const [shortPublication, setShortPublication] = useState("");
  const [groupPublication, setGroupPublication] = useState("");
  const [temporary, setTemporary] = useState("");
  const [active, setActive] = useState("");
  const [zone, setZone] = useState("");
  const [populate, setPopulate] = useState("");

  // * special for online
  const [fullCoverage, setFullCoverage] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [publicationData, setPublicationData] = useState(null);

  const { data } = useFetchData(`${url}citieslist`, city);
  const citiesArray = data?.data?.cities || [];

  const { data: languageData } = useFetchData(`${url}languagelist/`);
  const languageArray = Object.entries(languageData?.data?.languages || {}).map(
    ([languageName, languageId]) => ({
      languageName,
      languageId,
    })
  );

  const { data: publicationGroupsData } = useFetchData(
    `${url}publicationgroupsall`
  );

  const publicationGroups =
    publicationGroupsData?.data?.publication_groups || [];

  const [selectedTab, setSelectedTab] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchPublicationData = async () => {
    try {
      setFetchLoading(true);
      const endpoint =
        screen === "print" ? "publicationInfo" : "publicationInfoOnline";
      const response = await axiosInstance.get(
        `${endpoint}/?publicationId=${row?.publicationId}`
      );
      const publicationDataLocal = response.data?.data?.data;

      setPublicationData(publicationDataLocal);
      setPublicationID(publicationDataLocal?.publicationId);
      setPublicationName(publicationDataLocal?.publicationName);
      setShortPublication(publicationDataLocal?.shortPublication);
      setActualPublication(publicationDataLocal?.actualPublication);
      setPublicationType(publicationDataLocal?.publicationType);
      setPublicationCategory(publicationDataLocal?.publicationCategory);
      setGroupPublication(publicationDataLocal?.publicationGroupID);
      setEditionType(publicationDataLocal?.editionType);
      setCity(publicationDataLocal?.cityId);
      setZone(publicationDataLocal?.zone);
      setLanguage(publicationDataLocal?.languageCode);
      setType(publicationDataLocal?.newsType || publicationDataLocal?.newType);
      setPopulate(publicationDataLocal?.isPopulate === "Y" ? "Yes" : "No");
      setActive(publicationDataLocal?.isActive === "Y" ? "Yes" : "No");
      setTemporary(publicationDataLocal?.isTemporary === "Y" ? "Yes" : "No");

      // * for online only
      if (screen === "online") {
        setFullCoverage(publicationDataLocal?.fullCoverage ? "Yes" : "No");
        setSortOrder(publicationDataLocal?.sortOrder);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  };
  useEffect(() => {
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
      // * function which returns a yes no to y n
      const getYN = (value) => {
        if (value === "Yes") return "Y";
        else if (value === "No") return "N";
      };
      setUpdateLoading(true);
      const requestData = {
        publicationId: row?.publicationId,
        // publicationName: "",
        // shortPublication: "",
        // actualPublication: "",
        // publicationType: "",
        // publicationCategory: "",
        // * publicationLogo: "",
        // publicationGroupID: "",
        // * publicationGroupName: "",
        // editionType: "",
        // cityId: "",
        // cityName: "",
        // zone: "",
        // language: "",
        // newsType: "",
        // isPopulate: "",
        // isActive: "",
        // isTemporary: "",
      };
      if (publicationName !== publicationData?.publicationName) {
        requestData.publicationName = publicationName;
      }
      if (shortPublication !== publicationData?.shortPublication) {
        requestData.shortPublication = shortPublication;
      }
      if (actualPublication !== publicationData?.actualPublication) {
        requestData.actualPublication = actualPublication;
      }
      if (publicationType !== publicationData?.publicationType) {
        requestData.publicationType = publicationType.toLowerCase();
      }
      if (publicationCategory !== publicationData?.publicationCategory) {
        requestData.publicationCategory = publicationCategory;
      }
      if (groupPublication !== publicationData?.publicationGroupID) {
        requestData.publicationGroupID = groupPublication;
      }
      if (editionType !== publicationData?.editionType) {
        requestData.editionType = editionType;
      }
      if (city !== publicationData?.cityId) {
        requestData.cityId = city;
      }
      if (zone !== publicationData?.zone) {
        requestData.zone = zone;
      }
      const newsTypeKey = screen === "online" ? "newType" : "newsType";
      if (type !== publicationData?.[newsTypeKey]) {
        requestData[newsTypeKey] = newsTypeKey;
      }

      if (language !== publicationData?.languageCode) {
        requestData.languageCode = language;
      }

      if (getYN(populate) !== publicationData?.isPopulate) {
        requestData.isPopulate = populate;
      }
      if (getYN(active) !== publicationData?.isActive) {
        requestData.isActive = getYN(active);
      }
      if (getYN(populate) !== publicationData?.isPopulate) {
        requestData.isPopulate = getYN(populate);
      }

      // * only print related
      if (screen === "print") {
        if (getYN(temporary) !== publicationData?.isTemporary) {
          requestData.isTemporary = getYN(temporary);
        }
      }

      // * only online related
      if (screen === "online") {
        if ((fullCoverage === "Yes") !== publicationData?.fullCoverage) {
          requestData.fullCoverage = Boolean(fullCoverage === "Yes");
        }
        if (sortOrder !== publicationData?.sortOrder) {
          requestData.sortOrder = Number(sortOrder);
        }
      }
      const endpoint =
        screen === "print"
          ? "updatePublicationInfo"
          : "updateOnlinePublicationInfo";
      const response = await axiosInstance.post(`${endpoint}/`, requestData);
      if (response.status === 200) {
        toast.success(response.data.message);
        setFullCoverage("");
        setSortOrder("");
        setPublicationData(null);
        fetchPublicationData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
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
            minWidth: 600,
            bgcolor: "background.paper",
            border: "1px solid #000",
            boxShadow: 24,
            height: "99vh",
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
                  <FieldLabel>Publication Group :</FieldLabel>
                  {/* <div className="ml-8"> */}
                  <CustomSingleSelect
                    dropdownToggleWidth={`100%`}
                    dropdownWidth={"100%"}
                    keyId="publicationgroupid"
                    keyName="publicationgroupname"
                    options={publicationGroups}
                    selectedItem={groupPublication}
                    setSelectedItem={setGroupPublication}
                    title="Publication Group ID"
                  />
                  {/* </div> */}
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication ID :</FieldLabel>
                  <CustomTextField
                    value={publicationID}
                    setValue={setPublicationID}
                    placeholder={"Publication ID"}
                    type={"text"}
                    isDisabled
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
                    value={shortPublication}
                    setValue={setShortPublication}
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
                  <FieldLabel>Publication Category :</FieldLabel>

                  <CustomSingleSelect
                    dropdownToggleWidth={`100%`}
                    dropdownWidth={"100%"}
                    keyId="id"
                    keyName="title"
                    options={publicationCategories}
                    selectedItem={publicationCategory}
                    setSelectedItem={setPublicationCategory}
                    title="Pub Category"
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <FieldLabel>Publication Type :</FieldLabel>
                  <YesOrNo
                    mapValue={pubTypesAll}
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
                {screen === "print" && (
                  <FieldWrapper>
                    <FieldLabel>Zone :</FieldLabel>
                    <YesOrNo
                      mapValue={zones}
                      placeholder="Zone"
                      classes={classes}
                      value={zone}
                      setValue={setZone}
                    />
                  </FieldWrapper>
                )}

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
                {screen === "print" && (
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
                )}

                <FieldWrapper>
                  <FieldLabel>Populate :</FieldLabel>
                  <YesOrNo
                    mapValue={["Yes", "No"]}
                    placeholder="Populate"
                    classes={classes}
                    value={populate}
                    setValue={setPopulate}
                  />
                </FieldWrapper>
                {screen === "online" && (
                  <>
                    <FieldWrapper>
                      <FieldLabel>Full Coverage :</FieldLabel>
                      <YesOrNo
                        mapValue={["Yes", "No"]}
                        placeholder="Active"
                        classes={classes}
                        value={fullCoverage}
                        setValue={setFullCoverage}
                      />
                    </FieldWrapper>
                    <FieldWrapper>
                      <FieldLabel>Sort Order :</FieldLabel>
                      <CustomTextField
                        value={sortOrder}
                        setValue={setSortOrder}
                        placeholder={"Sort Order"}
                        type={"number"}
                      />
                    </FieldWrapper>
                  </>
                )}

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
              publicationId={row?.publicationId}
              tabValue={selectedTab}
              screen={screen}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

AddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  row: PropTypes.shape({
    publicationId: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }).isRequired,
  screen: PropTypes.string,
};
export default AddModal;

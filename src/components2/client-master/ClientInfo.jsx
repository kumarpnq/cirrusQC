import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import { format, addYears } from "date-fns";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import ComponentsHeader from "./ComponentsHeader";
import axiosInstance from "../../../axiosConfig";
import PropTypes from "prop-types";
import useMailerLogic from "./clientInfo/useMailerLogic";
import useFetchMongoData from "../../hooks/useFetchMongoData";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";

const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,

  "&:hover": {
    backgroundColor: "#ddd",
    boxShadow: `0px 4px 10px ${theme.palette.primary.main}`, // adding shadow on hover
    transform: "scale(1.001)", // slight scaling on hover
    transition: "all 0.6s ease", // smooth transition for hover effects
  },
}));
const StyledText = styled(Typography)({
  fontSize: "1em",
  color: "GrayText",
  textWrap: "nowrap",
  width: 170,
});
const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const ClientInfo = ({ clientId: idForFetch }) => {
  const classes = useStyle();
  const [clientId, setClientId] = useState("");
  const [encryptedClientId, setEncryptedClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("");
  const [emailID, setEmailID] = useState("");
  const [phoneNo, setPhoneNo] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [subFromDate, setSubFromDate] = useState(null);
  const [subToDate, setSubToDate] = useState(null);
  const [clientGroupID, setClientGroupID] = useState("");
  const [mailerID, setMailerID] = useState("");
  const [mailerSubject, setMailerSubject] = useState("");
  const [individualMail, setIndividualMail] = useState("");
  const [mailTimeSlot, setMailTimeSlot] = useState("");
  const [mailerLogic, setMailerLogic] = useState("");
  const [mailerFormat, setMailerFormat] = useState("");
  const [onlineMailerFormat, setOnlineMailerFormat] = useState("");
  const [mailedArticles, setMailedArticles] = useState("");
  const [bulkMailer, setBulkMailer] = useState("");
  const [summary, setSummary] = useState("");
  const [allowTagging, setAllowTagging] = useState("");
  const [allowTonality, setAllowTonality] = useState("");
  const [onlineRefresh, setOnlineRefresh] = useState("");
  const [allPermissionOnline, setAllPermissionOnline] = useState("");
  const [mailerMissingAlert, setMailerMissingAlert] = useState("");
  const [AllowSearchablePDF, setAllowSearchablePDF] = useState("");
  const [excelExport, setExcelExport] = useState("");
  const [active, setActive] = useState("");
  const [advArticle, setAdvArticle] = useState({
    advertise: false,
    articles: true,
  });

  useEffect(() => {
    const today = new Date();
    const nextYear = addYears(today, 1);

    setSubFromDate(format(today, "yyyy-MM-dd"));
    setSubToDate(format(nextYear, "yyyy-MM-dd"));
  }, []);

  // * fetch main data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `clientSettings/?clientId=${idForFetch}`
        );
        const data = response.data.data.data;

        let clientInfo = data?.clientInfo;
        setClientId(clientInfo?.clientId);
        setEncryptedClientId(encryptedClientId || "");
        setClientName(clientInfo?.clientName);
        setAddress(clientInfo?.clientAddress);
        setContactPerson(clientInfo?.contactPerson);
        setDesignation(clientInfo?.designation);
        setEmailID(clientInfo?.email);
        setPhoneNo(clientInfo?.phone);
        setMobileNumber(clientInfo?.mobile);
        setSubFromDate(clientInfo?.fromDate);
        setSubToDate(clientInfo?.toDate);
        setActive(clientInfo?.isActive == "Y" ? "Yes" : "No");
        setClientGroupID(clientInfo?.clientGroupID);

        let mailerInfo = data?.mailerInfo;
        setMailerID(mailerInfo?.mailerId);
        setMailerSubject(mailerInfo?.mailerSubject);
        setMailerFormat(mailerInfo?.mailerFormat);
        setBulkMailer(mailerInfo?.bulkMailer);
        setSummary(mailerInfo?.hasSummary);
        setMailerLogic(mailerInfo?.mailerLogic);
      } catch (error) {
        console.log(error);
      }
    };

    if (idForFetch) {
      fetchData();
    }
  }, [idForFetch]);

  // * get mailer logics
  const { mailerLogic: mailerLogicArray } = useMailerLogic();
  const { data } = useFetchMongoData(
    `clientMailerFormat/?mailerLogic=${mailerLogic}`
  );

  return (
    <Box
      sx={{ border: "1px solid #DDD" }}
      className="p-1 mt-1 rounded-md shadow-md"
    >
      <ComponentsHeader
        title="Mailer Settings"
        loading={false}
        onSave={() => {}}
      />
      <StyledWrapper>
        <StyledText>Client Id : </StyledText>
        <CustomTextField
          width={150}
          placeholder={"Client id"}
          value={clientId || idForFetch}
          setValue={setClientId}
          type={"text"}
          isRequired
          isDisabled
        />
        {/*  hidden */}
        <StyledWrapper>
          <StyledText>Encrypted ClientId : </StyledText>
          <CustomTextField
            width={150}
            placeholder={"Encrypted id"}
            value={encryptedClientId}
            setValue={setEncryptedClientId}
            type={"text"}
          />
        </StyledWrapper>
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Client Name : </StyledText>
        <CustomTextField
          width={300}
          placeholder={"Client name"}
          value={clientName}
          setValue={setClientName}
          type={"text"}
          isRequired
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Address : </StyledText>
        <textarea
          rows={2}
          cols={70}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border border-gray-300 rounded-sm hover:border-black text-[0.8em] px-3"
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Contact Person : </StyledText>
        <CustomTextField
          width={300}
          placeholder={"Contact person"}
          value={contactPerson}
          setValue={setContactPerson}
          type={"text"}
          isRequired
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Designation : </StyledText>
        <CustomTextField
          width={300}
          placeholder={"Designation"}
          value={designation}
          setValue={setDesignation}
          type={"text"}
          isRequired
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Email ID : </StyledText>
        <CustomTextField
          width={300}
          placeholder={"Email"}
          value={emailID}
          setValue={setEmailID}
          type={"email"}
          isRequired
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Phone : </StyledText>
        <CustomTextField
          width={200}
          placeholder={"12345"}
          value={phoneNo}
          setValue={setPhoneNo}
          type={"number"}
        />
        <StyledWrapper>
          <StyledText>Mobile : </StyledText>
          <CustomTextField
            width={200}
            placeholder={"1234567890"}
            value={mobileNumber}
            setValue={setMobileNumber}
            type={"number"}
          />
        </StyledWrapper>
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Subscription : </StyledText>
        <StyledWrapper>
          <span className="mr-2 text-gray-500">From : </span>
          <TextField
            type="datetime-local"
            width={250}
            value={subFromDate}
            onChange={(e) => setSubFromDate(e.target.value)}
            InputProps={{
              style: {
                fontSize: "0.8rem",
                height: 25,
              },
            }}
          />
        </StyledWrapper>
        <StyledWrapper>
          <span className="mx-2 text-gray-500">End : </span>
          <TextField
            type="datetime-local"
            width={200}
            value={subToDate}
            onChange={(e) => setSubToDate(e.target.value)}
            InputProps={{
              style: {
                fontSize: "0.8rem",
                height: 25,
              },
            }}
          />
        </StyledWrapper>
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>ClientGroup ID : </StyledText>
        <YesOrNo
          classes={classes}
          mapValue={["One", "Two", "Three", "Four", "Five"]}
          placeholder="Client group id"
          value={clientGroupID}
          setValue={setClientGroupID}
          width={300}
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Mail ID : </StyledText>
        <CustomTextField
          value={mailerID}
          setValue={setMailerID}
          width={300}
          placeholder={"Email"}
          type={"email"}
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Mail Subject : </StyledText>
        <CustomTextField
          value={mailerSubject}
          setValue={setMailerSubject}
          width={300}
          placeholder={"Subject"}
          type={"text"}
        />
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Individual Mail : </StyledText>

        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No"]}
          placeholder="IND Mail"
          value={individualMail}
          setValue={setIndividualMail}
          width={150}
        />
        <StyledWrapper>
          <StyledText>Mail Time Slot : </StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              "ALL",
              "8:00",
              "8:30",
              "9:00",
              "9:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
              "12:30",
              "13:00",
              "13:30",
              "14:00",
              "14:30",
              "15:00",
              "15:30",
              "16:00",
              "16:30",
              "17:00",
            ]}
            placeholder="Slots"
            value={mailTimeSlot}
            setValue={setMailTimeSlot}
            width={150}
          />
        </StyledWrapper>
      </StyledWrapper>
      <Divider />
      <StyledWrapper>
        <StyledText>Mailer Logic : </StyledText>
        <div style={{ width: 300 }}>
          <CustomSingleSelect
            dropdownToggleWidth={300}
            dropdownWidth={300}
            keyId="logicId"
            keyName="logicName"
            options={mailerLogicArray}
            title="Mailer Logic"
            selectedItem={mailerLogic}
            setMailerLogic={setMailerLogic}
          />
        </div>

        <StyledText>Mailer Format : </StyledText>
        <YesOrNo
          classes={classes}
          mapValue={[
            "Samsung",
            "Simple Blue",
            "Custom Tabular 2022",
            "Cirrus Gold",
            "BB Big Font",
          ]}
          placeholder="Mailer logic"
          value={mailerFormat}
          setValue={setMailerFormat}
          width={300}
        />
      </StyledWrapper>
      <StyledWrapper>
        <StyledText>Online Mailer Format : </StyledText>
        <YesOrNo
          classes={classes}
          mapValue={["Online", "Online Summary", "GIONEE Format"]}
          placeholder="Mailer format"
          value={onlineMailerFormat}
          setValue={setOnlineMailerFormat}
          width={150}
        />
        <StyledText>Mailed Articles : </StyledText>
        <YesOrNo
          classes={classes}
          mapValue={["All", "Mailed"]}
          placeholder="Mailed Article"
          value={mailedArticles}
          setValue={setMailedArticles}
          width={150}
        />
      </StyledWrapper>
      {/* second portion of section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ border: "1px solid #DDD" }}>
          <StyledWrapper>
            <StyledText>Bulk Mailer : </StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Bulk Mailer"
              value={bulkMailer}
              setValue={setBulkMailer}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Summary : </StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Normal", "CompanyWise", "No"]}
              placeholder="Summary"
              value={summary}
              setValue={setSummary}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Allow Tagging : </StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Tagging"
              value={allowTagging}
              setValue={setAllowTagging}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Allow Tonality : </StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Tonality"
              value={allowTonality}
              setValue={setAllowTonality}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Online Refresh : </StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Refresh"
              value={onlineRefresh}
              setValue={setOnlineRefresh}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>All Permission Online :</StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Permission"
              value={allPermissionOnline}
              setValue={setAllPermissionOnline}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Mailer Missing Alert :</StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Alert"
              value={mailerMissingAlert}
              setValue={setMailerMissingAlert}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Allow Searchable PDF :</StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="PDF"
              value={AllowSearchablePDF}
              setValue={setAllowSearchablePDF}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Excel Export :</StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Export"
              value={excelExport}
              setValue={setExcelExport}
              width={150}
            />
          </StyledWrapper>
          <Divider />
          <StyledWrapper>
            <StyledText>Active :</StyledText>
            <YesOrNo
              classes={classes}
              mapValue={["Yes", "No"]}
              placeholder="Active"
              value={active}
              setValue={setActive}
              width={150}
            />
          </StyledWrapper>
        </Box>
      </Box>
      <Divider />
      <StyledWrapper>
        <StyledText>Client Type : </StyledText>
        <FormControlLabel
          control={
            <Checkbox
              checked={advArticle.advertise}
              onChange={(e) => {
                setAdvArticle((prev) => ({
                  ...prev,
                  advertise: e.target.checked,
                }));
              }}
            />
          }
          label="Advertise"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={advArticle.articles}
              onChange={(e) => {
                setAdvArticle((prev) => ({
                  ...prev,
                  articles: e.target.checked,
                }));
              }}
            />
          }
          label="Articles"
        />
      </StyledWrapper>
    </Box>
  );
};

ClientInfo.propTypes = {
  clientId: PropTypes.string.isRequired, // Define clientId as a required string
  clientName: PropTypes.string.isRequired, // Define clientName as a required string
  isActive: PropTypes.bool, // Define isActive as an optional boolean
  onStatusChange: PropTypes.func, // Define a function for handling status changes
  startDate: PropTypes.instanceOf(Date), // Define startDate as a Date object
  endDate: PropTypes.instanceOf(Date), // Define endDate as a Date object
  isEditable: PropTypes.bool, // Define isEditable as an optional boolean
  // You can define more props as needed
};
export default ClientInfo;

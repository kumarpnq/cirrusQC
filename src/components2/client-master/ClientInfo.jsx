import { Box, Divider, styled, Typography } from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import { format, addYears } from "date-fns";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";

const StyledWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 1,
});
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
const sectionArray = [
  { name: "Ikea", value: 0 },
  { name: "Industry", value: 0 },
  { name: "Industry2", value: 0 },
  { name: "Competition", value: 0 },
  { name: "Category", value: 0 },
  { name: "Industry3", value: 0 },
  { name: "Others", value: 0 },
];

const ClientInfo = () => {
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

  // * section
  const [section, setSection] = useState({
    Ikea: 0,
    Industry: 0,
    Industry2: 0,
    Competition: 0,
    Category: 0,
    Industry3: 0,
    Others: 0,
  });

  useEffect(() => {
    const today = new Date();
    const nextYear = addYears(today, 1);

    setSubFromDate(format(today, "yyyy-MM-dd"));
    setSubToDate(format(nextYear, "yyyy-MM-dd"));
  }, []);

  return (
    <Box sx={{ border: "1px solid #DDD" }}>
      <StyledWrapper>
        <StyledText>Client Id : </StyledText>
        <CustomTextField
          width={150}
          placeholder={"Client id"}
          value={clientId}
          setValue={setClientId}
          type={"text"}
          isRequired
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
          className="border border-gray-300 rounded-sm hover:border-black"
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
          <input
            type="date"
            width={200}
            value={subFromDate}
            onChange={(e) => setSubFromDate(e.target.value)}
            className="border border-gray-300 rounded-sm hover:border-black"
          />
        </StyledWrapper>
        <StyledWrapper>
          <span className="mx-2 text-gray-500">End : </span>
          <input
            type="date"
            width={200}
            value={subToDate}
            onChange={(e) => setSubToDate(e.target.value)}
            className="border border-gray-300 rounded-sm hover:border-black"
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
        <YesOrNo
          classes={classes}
          mapValue={[
            "CompanyWise",
            "HeadlineWise",
            "SectionCompanyWise",
            "SectionWise",
            "StateWise",
          ]}
          placeholder="Mailer logic"
          value={mailerLogic}
          setValue={setMailerLogic}
          width={300}
        />

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
        <StyledWrapper>
          <StyledText>Allow Searchable PDF :</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={["Yes", "No"]}
            placeholder="Alert"
            value={AllowSearchablePDF}
            setValue={setAllowSearchablePDF}
            width={150}
          />
        </StyledWrapper>
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
      <Box>
        {sectionArray.map((item) => (
          <StyledWrapper key={item.name}>
            <StyledText>{item.name}</StyledText>
          </StyledWrapper>
        ))}
      </Box>
    </Box>
  );
};

export default ClientInfo;

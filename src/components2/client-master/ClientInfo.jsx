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
  width: 150,
});
const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));
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
          placeholder={"client id"}
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
            placeholder={"encrypted id"}
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
          placeholder={"client name"}
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
          placeholder={"contact person"}
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
          placeholder={"designation"}
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
          placeholder={"email"}
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
          placeholder="client group id"
          value={clientGroupID}
          setValue={setClientGroupID}
          width={300}
        />
      </StyledWrapper>
    </Box>
  );
};

export default ClientInfo;

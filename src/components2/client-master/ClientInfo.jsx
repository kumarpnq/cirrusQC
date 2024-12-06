import { Box, Divider, styled, TextField, Typography } from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { Fragment, useEffect, useState } from "react";
import { format, addYears } from "date-fns";
import { makeStyles } from "@mui/styles";
import ComponentsHeader from "./ComponentsHeader";
import axiosInstance from "../../../axiosConfig";
import PropTypes from "prop-types";
import useFetchMongoData from "../../hooks/useFetchMongoData";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import ClientDetailTabs from "./client-info/Tabs";
import Info from "./client-info/Info";
import toast from "react-hot-toast";
import { emailRegex } from "../../constants/emailRegex";
import CompactStepper from "./client-info/ContactStepper";

const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,

  // Use box-shadow for a thinner border effect
  boxShadow: `0 0 0 0.2px ${theme.palette.primary.main}`,

  "&:hover": {
    backgroundColor: "#ddd",
    boxShadow: `0px 4px 10px ${theme.palette.primary.main}`,
    transition: "all 0.6s ease",
  },
}));

const StyledText = styled(Typography)({
  fontSize: "1em",
  color: "GrayText",
  textWrap: "nowrap",
  width: 170,
  minWidth: 170,
});
const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const ClientInfo = ({ clientId: idForFetch, setGlobalTabValue }) => {
  const classes = useStyle();
  const [tabValue, setTabValue] = useState(0);
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
  const [mailerLogic, setMailerLogic] = useState("");
  const [mailerFormat, setMailerFormat] = useState("");
  // const [advArticle, setAdvArticle] = useState({
  //   advertise: false,
  //   articles: true,
  // });

  // * deliver info
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliverContactPerson, setDeliveryContactPerson] = useState("");
  const [deliverDesignation, setDeliveryDesignation] = useState("");
  const [deliverEmailID, setDeliveryEmailID] = useState("");
  const [deliverPhoneNo, setDeliveryPhoneNo] = useState("");
  const [deliverMobileNumber, setDeliveryMobileNumber] = useState("");

  // * states for comparison
  const [clientInfo, setClientInfo] = useState(null);
  const [mailerInfo, setMailerInfo] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [emailError, setEmailError] = useState(false);

  // * contact stepper
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const today = new Date();
    const nextYear = addYears(today, 1);

    setSubFromDate(format(today, "yyyy-MM-dd"));
    setSubToDate(format(nextYear, "yyyy-MM-dd"));
  }, []);

  // * fetch main data
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `clientSettings/?clientId=${idForFetch}`
      );
      const data = response.data.data.data;

      let clientInfo = data?.clientInfo;
      setClientInfo(clientInfo);
      setClientId(clientInfo?.clientId);
      setEncryptedClientId(encryptedClientId || "");
      setClientName(clientInfo?.clientName);
      setAddress(clientInfo?.clientAddress);
      setContactPerson(clientInfo?.contactPerson);
      setDesignation(clientInfo?.designation);
      setEmailID(clientInfo?.email);
      const email = clientInfo?.email || "";
      setEmailError(!emailRegex.test(email));
      setPhoneNo(clientInfo?.phone);
      setMobileNumber(clientInfo?.mobile);
      setSubFromDate(clientInfo?.fromDate);
      setSubToDate(clientInfo?.toDate);
      setClientGroupID(clientInfo?.clientGroupId);

      let mailerInfo = data?.mailerInfo;
      setMailerID(mailerInfo?.mailerId);
      setMailerSubject(mailerInfo?.mailerSubject);
      setMailerFormat(mailerInfo?.mailerFormat);
      setMailerLogic(mailerInfo?.mailerLogic);
      setMailerInfo(mailerInfo);

      let deliveryInfo = data?.deliveryInfo;
      setDeliveryAddress(deliveryInfo?.clientAddress);
      setDeliveryContactPerson(deliveryInfo?.contactPerson);
      setDeliveryDesignation(deliveryInfo?.designation);
      setDeliveryEmailID(deliveryInfo?.email);
      setDeliveryMobileNumber(deliveryInfo?.mobile);
      setDeliveryPhoneNo(deliveryInfo?.phone);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  useEffect(() => {
    if (idForFetch) {
      fetchData();
    }
  }, [idForFetch]);

  // * get mailer logics
  const { data: mailerLogicData } = useFetchMongoData(`mailerLogicDDL/`);
  const { data: clientGroupData } = useFetchMongoData(`clientGroupsDDL/`);
  const { data: mailerFormatData } = useFetchMongoData(
    `mailerFormatDDL/?logicId=${mailerLogic}`
  );

  let mailerLogicOptions = mailerLogicData?.data?.data?.fieldList || [];
  let mailerFormatOptions = mailerFormatData?.data?.data || [];
  let clientGroupOptions = clientGroupData?.data?.data || [];
  const availableFormats = ["PO21", "TAB20", "POH22", "CIR1", "SECO1", "S1"];
  const filteredFormats = mailerFormatOptions.filter((format) =>
    availableFormats.includes(format.formatId)
  );

  const [updateLoading, setUpdateLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      const isEmailInvalid = !emailID || emailID === "na";
      const isPhoneOrMobileInvalid = !phoneNo && !mobileNumber;
      if (isEmailInvalid || isPhoneOrMobileInvalid) {
        toast.error("EmailID, PhoneNo or MobileNumber are required.");
        return;
      }
      setUpdateLoading(true);
      const requestData = {
        clientId,
      };
      const clientInfoLocal = {};
      const mailerInfoLocal = {};
      const deliveryInfoLocal = {};
      if (clientInfo?.clientName !== clientName)
        clientInfoLocal.clientName = clientName;
      if (clientInfo?.clientAddress !== address)
        clientInfoLocal.clientAddress = address;
      if (clientInfo?.contactPerson !== contactPerson)
        clientInfoLocal.contactPerson = contactPerson;
      if (clientInfo?.designation !== designation)
        clientInfoLocal.designation = designation;
      if (clientInfo?.email !== emailID) clientInfoLocal.email = emailID;
      if (clientInfo?.phone !== phoneNo) clientInfoLocal.phone = phoneNo;
      if (clientInfo?.mobile !== mobileNumber)
        clientInfoLocal.mobile = mobileNumber;
      if (clientInfo?.fromDate !== subFromDate)
        clientInfoLocal.fromDate = format(subFromDate, "yyyy-MM-dd HH:MM:ss");
      if (clientInfo?.toDate !== subToDate)
        clientInfoLocal.toDate = format(subToDate, "yyyy-MM-dd HH:MM:ss");
      if (clientInfo?.clientGroupId !== clientGroupID)
        clientInfoLocal.clientGroupId = clientGroupID;
      if (Object.keys(clientInfoLocal).length) {
        requestData.clientInfo = clientInfoLocal;
      }
      if (mailerInfo?.mailerId !== mailerID)
        mailerInfoLocal.mailerId = mailerID;
      if (mailerInfo?.mailerSubject !== mailerSubject)
        mailerInfoLocal.mailerSubject = mailerSubject;
      if (mailerInfo?.mailerFormat !== mailerFormat)
        mailerInfoLocal.mailerFormat = mailerFormat;
      if (mailerInfo?.mailerLogic !== mailerLogic)
        mailerInfoLocal.mailerLogic = mailerLogic;
      if (Object.keys(mailerInfoLocal).length) {
        requestData.mailerInfo = mailerInfoLocal;
      }

      if (deliveryInfo?.clientAddress !== deliveryAddress)
        deliveryInfoLocal.clientAddress = deliveryAddress;
      if (deliveryInfo?.contactPerson !== deliverContactPerson)
        deliveryInfoLocal.contactPerson = deliverContactPerson;
      if (deliveryInfo?.designation !== deliverDesignation)
        deliveryInfoLocal.designation = deliverDesignation;
      if (deliveryInfo?.email !== deliverEmailID)
        deliveryInfoLocal.email = deliverEmailID;
      if (deliveryInfo?.phone !== deliverPhoneNo)
        deliveryInfoLocal.phone = deliverPhoneNo;
      if (deliveryInfo?.mobile !== deliverMobileNumber)
        deliveryInfoLocal.mobile = deliverMobileNumber;
      if (Object.keys(deliveryInfoLocal).length) {
        requestData.deliveryInfo = deliveryInfoLocal;
      }
      const response = await axiosInstance.post(
        "updateClientSettings/",
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.data.status);
        fetchData();
        setTabValue(1);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Fragment>
      <ClientDetailTabs value={tabValue} setValue={setTabValue} />
      {!tabValue ? (
        <Box
          sx={{ border: "1px solid #DDD" }}
          className="p-1 mt-1 rounded-md shadow-md"
        >
          <ComponentsHeader
            title="Mailer Settings"
            loading={updateLoading}
            onSave={handleUpdate}
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
            {/* <StyledWrapper>
              <StyledText>Encrypted ClientId : </StyledText>
              <CustomTextField
                width={150}
                placeholder={"Encrypted id"}
                value={encryptedClientId}
                setValue={setEncryptedClientId}
                type={"text"}
              />
            </StyledWrapper> */}
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
          {/* contact area */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ maxWidth: 200 }}>
              <CompactStepper
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            </Box>
            <Box>
              <StyledWrapper>
                <StyledText>Address : </StyledText>
                <textarea
                  rows={2}
                  cols={70}
                  value={!activeStep ? address : deliveryAddress}
                  onChange={(e) =>
                    !activeStep
                      ? setAddress(e.target.value)
                      : setDeliveryAddress(e.target.value)
                  }
                  className="border border-gray-300 rounded-sm hover:border-black text-[0.8em] px-3"
                />
              </StyledWrapper>
              <Divider />
              <StyledWrapper>
                <StyledText>Contact Person : </StyledText>
                <CustomTextField
                  width={300}
                  placeholder={"Contact person"}
                  value={!activeStep ? contactPerson : deliverContactPerson}
                  setValue={
                    !activeStep ? setContactPerson : setDeliveryContactPerson
                  }
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
                  value={!activeStep ? designation : deliverDesignation}
                  setValue={
                    !activeStep ? setDesignation : setDeliveryDesignation
                  }
                  type={"text"}
                  isRequired
                />
              </StyledWrapper>
              <Divider />
              <StyledWrapper>
                <StyledText>Email ID : </StyledText>
                <TextField
                  sx={{ width: 300 }}
                  value={!activeStep ? emailID : deliverEmailID}
                  onChange={(e) => {
                    if (!activeStep) {
                      setEmailID(e.target.value);
                    } else {
                      setDeliveryEmailID(e.target.value);
                    }
                    setEmailError(!emailRegex.test(e.target.value));
                  }}
                  type="email"
                  required
                  placeholder="Email"
                  InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                  error={emailError}
                />
              </StyledWrapper>
              <Divider />
              <StyledWrapper>
                <StyledText>Phone : </StyledText>
                <CustomTextField
                  width={200}
                  placeholder={"12345"}
                  value={!activeStep ? phoneNo : deliverPhoneNo}
                  setValue={!activeStep ? setPhoneNo : setDeliveryPhoneNo}
                  type={"number"}
                />
                <StyledWrapper>
                  <StyledText>Mobile : </StyledText>
                  <CustomTextField
                    width={200}
                    placeholder={"1234567890"}
                    value={!activeStep ? mobileNumber : deliverMobileNumber}
                    setValue={
                      !activeStep ? setMobileNumber : setDeliveryMobileNumber
                    }
                    type={"number"}
                  />
                </StyledWrapper>
              </StyledWrapper>
            </Box>
          </Box>

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
            <CustomSingleSelect
              dropdownToggleWidth={300}
              dropdownWidth={300}
              keyId="clientGroupId"
              keyName="clientGroupName"
              options={clientGroupOptions}
              title="Client Group ID"
              selectedItem={clientGroupID}
              setSelectedItem={setClientGroupID}
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
            <StyledText>Mailer Logic : </StyledText>
            <div style={{ width: 300 }}>
              <CustomSingleSelect
                dropdownToggleWidth={300}
                dropdownWidth={300}
                keyId="logicId"
                keyName="name"
                options={mailerLogicOptions}
                title="Mailer Logic"
                selectedItem={mailerLogic}
                setSelectedItem={setMailerLogic}
              />
            </div>

            <StyledText>Mailer Format : </StyledText>
            <div style={{ width: 300 }}>
              <CustomSingleSelect
                dropdownToggleWidth={300}
                dropdownWidth={300}
                keyId="formatId"
                keyName="name"
                options={filteredFormats}
                title="Mailer Format"
                selectedItem={mailerFormat}
                setSelectedItem={setMailerFormat}
              />
            </div>
          </StyledWrapper>
        </Box>
      ) : (
        <Info
          StyledText={StyledText}
          StyledWrapper={StyledWrapper}
          classes={classes}
          clientId={clientId}
          setGlobalTabValue={setGlobalTabValue}
        />
      )}
    </Fragment>
  );
};

ClientInfo.propTypes = {
  clientId: PropTypes.string.isRequired,
};
export default ClientInfo;

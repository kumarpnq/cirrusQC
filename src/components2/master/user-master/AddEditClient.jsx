import { Box, Button, CircularProgress, Divider } from "@mui/material";
import CustomTextField from "../../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import { StyledText, StyledWrapper } from "../common";
import toast from "react-hot-toast";
import axiosInstance from "../../../../axiosConfig";
import { generatePassword } from "./common";
import DotsMobileStepper from "./components/stepper";
import AddClients from "./components/addClients";
import YesOrNo from "../../../@core/YesOrNo";
import ClientScreenTable from "./components/ClientScreenTableNew";

const AddEditClient = ({ handleClose, fromWhere, row }) => {
  const [active, setActive] = useState("");
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  // * stepper
  const [activeStep, setActiveStep] = useState(0);
  let totalSteps = 3;

  // * add update States
  const [initialState, setInitialState] = useState(null);
  const [addUpdateLoading, setAddUpdateLoading] = useState(false);
  const [modifiedClients, setModifiedClients] = useState([]);

  // * password auto generation
  useEffect(() => {
    if (userName && loginName && fromWhere === "Add") {
      const generatedPassword = generatePassword(userName, loginName);
      setPassword(generatedPassword);
    }
  }, [userName, loginName, fromWhere]);

  // * show the data of the user
  const fetchAdminDetails = async () => {
    try {
      const params = {
        loginName: row?.loginName,
        userType: "CL",
      };
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/getUserData/`,
        { params }
      );

      const localClientResponse = response.data;
      setInitialState(localClientResponse);
      setUserName(localClientResponse.userName);
      setLoginName(localClientResponse.loginName);
      setPassword(localClientResponse.password);
      setEmail(localClientResponse.email);
      setFullName(localClientResponse.fullName);
      setActive(localClientResponse.isActive);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (fromWhere === "Edit") {
      fetchAdminDetails();
    }
  }, [fromWhere, row?.loginName]);

  const updateClient = async () => {
    try {
      setAddUpdateLoading(true);
      const requestData = {
        userType: "CL",
        loginName: row?.loginName,
      };

      if (initialState.userName !== userName) requestData.userName = userName;
      if (initialState.loginName !== loginName)
        requestData.loginName = loginName;
      if (initialState.password !== password) requestData.password = password;
      if (initialState.email !== email) requestData.email = email;
      if (initialState.fullName !== fullName) requestData.fullName = fullName;
      if (initialState.isActive !== active) requestData.isActive = active;

      if (!Object.keys(requestData).length) {
        toast.error("No modified data.");
        return;
      }
      const response = await axiosInstance.put(`updateUser/`, requestData);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchAdminDetails();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAddUpdateLoading(false);
    }
  };

  const sendModifiedClients = async () => {
    try {
      setAddUpdateLoading(true);
      const modifiedData = modifiedClients.map((client) => ({
        clientId: client.id,
        clientName: client.clientName,
        sortOrder: client.sortOrder,
        isActive: client.active ? "Y" : "N",
      }));
      const requestData = {
        loginName: row?.loginName,
        userType: "CL",
        clientPermission: modifiedData,
      };
      const response = await axiosInstance.put(`updateUser/`, requestData);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setAddUpdateLoading(false);
    }
  };

  return (
    <div>
      <Box>
        {activeStep === 0 ? (
          <>
            <StyledWrapper>
              <StyledText>Active : </StyledText>
              <YesOrNo
                mapValue={[
                  { name: "Yes", id: "Y" },
                  { name: "No", id: "N" },
                ]}
                placeholder="Active"
                value={active}
                setValue={setActive}
                isYN
                keyId={"id"}
                keyName={"name"}
              />
            </StyledWrapper>
            <StyledWrapper>
              <StyledText>User Name : </StyledText>
              <CustomTextField
                width={"100%"}
                type={"text"}
                value={userName}
                setValue={setUserName}
                placeholder={"User Name"}
              />
            </StyledWrapper>
            <StyledWrapper>
              <StyledText>Full Name : </StyledText>
              <CustomTextField
                width={"100%"}
                type={"text"}
                value={fullName}
                setValue={setFullName}
                placeholder={"Full Name"}
              />
            </StyledWrapper>
            <StyledWrapper>
              <StyledText>Email : </StyledText>
              <CustomTextField
                width={"100%"}
                type={"email"}
                value={email}
                setValue={setEmail}
                placeholder={"Email"}
              />
            </StyledWrapper>
            <StyledWrapper>
              <StyledText>Login Name : </StyledText>
              <CustomTextField
                width={"100%"}
                type={"text"}
                value={loginName}
                setValue={setLoginName}
                placeholder={"Login Name"}
                isDisabled={fromWhere === "Edit"}
              />
            </StyledWrapper>
            <StyledWrapper>
              <StyledText>Password : </StyledText>
              <CustomTextField
                width={"100%"}
                type={"password"}
                value={password}
                setValue={setPassword}
                placeholder={"Password"}
                autoComplete={"new-password"}
              />
            </StyledWrapper>
          </>
        ) : activeStep === 1 ? (
          <AddClients
            row={row}
            modifiedClients={modifiedClients}
            setModifiedClients={setModifiedClients}
            initialState={initialState}
          />
        ) : (
          <ClientScreenTable
            initialState={initialState}
            fetchData={fetchAdminDetails}
            row={row}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <DotsMobileStepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          steps={totalSteps}
        />
      </Box>

      <Divider />
      <Box
        mt={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 1,
        }}
      >
        {activeStep !== 2 && (
          <>
            {" "}
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ ml: 2 }}
              size="small"
            >
              Cancel
            </Button>
            <Button
              onClick={
                (activeStep === 0 && updateClient) ||
                (activeStep === 1 && sendModifiedClients)
              }
              variant="outlined"
              color="primary"
              size="small"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {addUpdateLoading && <CircularProgress size={"1em"} />}
              Save
            </Button>
          </>
        )}
      </Box>
    </div>
  );
};

export default AddEditClient;

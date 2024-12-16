import { Box, Button, CircularProgress } from "@mui/material";
import { StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";
import { generatePassword } from "./common";
import AdminScreenTable from "./components/AdminScreensTable";
import DotsMobileStepper from "./components/stepper";
import YesOrNo from "../../../@core/YesOrNo";

const AddEditAdmin = ({ handleClose, activeTab, fromWhere, row }) => {
  const [active, setActive] = useState("");
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  // * update add states
  const [addUpdateLoading, setAddUpdateLoading] = useState(false);
  const [initialState, setInitialState] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  let totalSteps = 2;

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
        userType: "US",
      };
      const response = await axiosInstance.get(`getUserData/`, { params });

      const localAdminResponse = response.data;
      setInitialState(localAdminResponse);
      setUserName(localAdminResponse.userName);
      setLoginName(localAdminResponse.loginName);
      setPassword(localAdminResponse.password);
      setEmail(localAdminResponse.email);
      setFullName(localAdminResponse.fullName);
      setActive(localAdminResponse.isActive);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (fromWhere === "Edit") {
      fetchAdminDetails();
    }
  }, [fromWhere, row?.loginName]);

  const updateAdmin = async () => {
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

  return (
    <Box>
      {activeStep === 0 ? (
        <>
          {" "}
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
              placeholder={"Login Name"}
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
      ) : (
        <AdminScreenTable
          initialState={initialState}
          row={row}
          fetchData={fetchAdminDetails}
        />
      )}

      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <DotsMobileStepper
          steps={totalSteps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </Box>
      {activeStep !== 1 && (
        <Box sx={{ mt: 0.5, display: "flex", justifyContent: "end", gap: 1 }}>
          <Button size="small" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={updateAdmin}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {addUpdateLoading && <CircularProgress size={"1em"} />}
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AddEditAdmin;

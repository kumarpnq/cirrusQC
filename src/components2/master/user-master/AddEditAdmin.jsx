import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import { buttonPermission, screensArray } from "../../../constants/dataArray";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";
import { generatePassword } from "./common";

const AddEditAdmin = ({ handleClose, activeTab, fromWhere, row }) => {
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectedOnlineButtons, setSelectedOnlineButtons] = useState([]);
  const [selectedPrintButtons, setSelectedPrintButtons] = useState([]);

  // * update add states
  const [addUpdateLoading, setAddUpdateLoading] = useState(false);
  const [initialState, setInitialState] = useState(null);

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
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/getUserData/`,
        { params }
      );

      const localAdminResponse = response.data;
      setInitialState(localAdminResponse);
      setUserName(localAdminResponse.userName);
      setLoginName(localAdminResponse.loginName);
      setPassword(localAdminResponse.password);
      const activeScreenPermissions = localAdminResponse?.screenPermissions
        .filter((i) => i.permission)
        .map((i) => i.name);
      const activeOnlineButtonPermissions =
        localAdminResponse?.buttonPermissions
          .filter(
            (i) => i.permission && i.description === "Permission for online"
          )
          .map((i) => i.name);
      const activePrintButtonPermissions = localAdminResponse?.buttonPermissions
        .filter((i) => i.permission && i.description === "Permission for print")
        .map((i) => i.name);
      setSelectedScreens(activeScreenPermissions);
      setSelectedOnlineButtons(activeOnlineButtonPermissions);
      setSelectedPrintButtons(activePrintButtonPermissions);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (fromWhere === "Edit") {
      fetchAdminDetails();
    }
  }, [fromWhere, row?.loginName]);

  const addAdminUser = async () => {
    try {
      if (!userName || !loginName || !password) {
        toast.error("UserName, LoginName, Password are required fields.");
        return;
      }
      setAddUpdateLoading(true);
      const finalData = [];
      selectedOnlineButtons.forEach((button) => {
        finalData.push({
          button: button,
          permission: true,
          description: "online",
        });
      });
      selectedPrintButtons.forEach((button) => {
        finalData.push({
          button: button,
          permission: true,
          description: "print",
        });
      });
      const requestData = {
        userType: activeTab === 1 ? "US" : "CL",
        loginName,
        password,
        email: userName,
        screenPermissions: [
          { screen: "Online-QC2", permission: true },
          { screen: "Print-QC2", permission: false },
        ],
        buttonPermissions: finalData,
      };

      const response = await axiosInstance.post(
        `http://127.0.0.1:8000/addUser/`,
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setUserName("");
        setLoginName("");
        setPassword("");
        setSelectedScreens([]);
        selectedOnlineButtons([]);
        selectedPrintButtons([]);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAddUpdateLoading(false);
    }
  };

  const updateAdmin = async () => {
    try {
      setAddUpdateLoading(true);
      const requestData = {};

      if (initialState.userName !== userName) requestData.userName = userName;
      if (initialState.loginName !== loginName)
        requestData.loginName = loginName;
      if (initialState.password !== password) requestData.password = password;

      const updatedScreenPermissions = screensArray
        .filter((screen) => {
          const screenKey = screen.screenId;
          const currentPermission = selectedScreens.includes(screenKey)
            ? "Yes"
            : "No";
          const initialPermission =
            initialState.screenPermissions[screenKey] || "No";
          return currentPermission !== initialPermission;
        })
        .map((screen) => ({
          screen: screen.screenId,
          permission: selectedScreens.includes(screen.screenId) ? "Yes" : "No",
        }));

      if (updatedScreenPermissions.length > 0) {
        requestData.screenPermissions = updatedScreenPermissions;
      }

      const updatedButtonPermissions = buttonPermission
        .filter((button) => {
          const buttonKey = button.buttonId;
          const currentPermission = selectedOnlineButtons.includes(buttonKey)
            ? "Yes"
            : "No";
          const initialPermission =
            initialState.buttonPermissions[buttonKey] || "No";
          return currentPermission !== initialPermission;
        })
        .map((button) => ({
          button: button.buttonId,
          permission: selectedOnlineButtons.includes(button.buttonId)
            ? "Yes"
            : "No",
        }));

      if (updatedButtonPermissions.length > 0) {
        requestData.buttonPermissions = updatedButtonPermissions;
      }

      if (!Object.keys(requestData).length) {
        toast.error("No modified data.");
        return;
      }

      const response = await axiosInstance.put(
        `http://127.0.0.1:8000/updateUser/${row?.loginName}`,
        requestData
      );

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
      <StyledWrapper>
        <StyledText>Screen Permissions : </StyledText>
        <CustomMultiSelect
          keyId="screenId"
          keyName="screenName"
          dropdownToggleWidth={272}
          dropdownWidth={250}
          options={screensArray}
          selectedItems={selectedScreens}
          setSelectedItems={setSelectedScreens}
          title="Screen"
        />
      </StyledWrapper>
      <Box
        border={"1px solid #ccc"}
        borderRadius={"3px"}
        padding={"0.5"}
        margin={0.5}
      >
        <Typography variant="body-2" color={"GrayText"}>
          Buttons Permission
        </Typography>
        <StyledWrapper>
          <StyledText>Online : </StyledText>
          <CustomMultiSelect
            keyId="buttonId"
            keyName="buttonName"
            dropdownToggleWidth={272}
            dropdownWidth={250}
            options={buttonPermission}
            selectedItems={selectedOnlineButtons}
            setSelectedItems={setSelectedOnlineButtons}
            title="Button"
          />
        </StyledWrapper>
        <StyledWrapper>
          <StyledText>Print : </StyledText>
          <CustomMultiSelect
            keyId="buttonId"
            keyName="buttonName"
            dropdownToggleWidth={272}
            dropdownWidth={250}
            options={buttonPermission}
            selectedItems={selectedPrintButtons}
            setSelectedItems={setSelectedPrintButtons}
            title="Button"
          />
        </StyledWrapper>
      </Box>

      <Box sx={{ mt: 0.5, display: "flex", justifyContent: "end", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={fromWhere === "Add" ? addAdminUser : updateAdmin}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {addUpdateLoading && <CircularProgress size={"1em"} />}
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditAdmin;

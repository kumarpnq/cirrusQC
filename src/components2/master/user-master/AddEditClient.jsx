import { Box, Button, CircularProgress, Divider } from "@mui/material";
import CustomTextField from "../../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import { StyledText, StyledWrapper } from "../common";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import {
  clientReports,
  clientScreenArray,
  clientSelection,
  clientToolIcons,
} from "../../../constants/dataArray";
import toast from "react-hot-toast";
import axiosInstance from "../../../../axiosConfig";
import { generatePassword } from "./common";

const AddEditClient = ({ handleClose, fromWhere, row }) => {
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectedToolIcons, setSelectedToolIcons] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedSelection, setSelectedSelection] = useState([]);

  // * add update States
  const [initialState, setInitialState] = useState(null);
  const [addUpdateLoading, setAddUpdateLoading] = useState(false);

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
      const activeScreenPermissions = localClientResponse?.screenPermissions
        ?.filter((i) => i.permission)
        .map((i) => i.name);
      const activeToolPermissions = localClientResponse?.toolIconPermissions
        ?.filter((i) => i.permission)
        .map((i) => i.name);
      const activeReportPermissions = localClientResponse?.reportPermissions
        ?.filter((i) => i.permission)
        .map((i) => i.name);
      const activeSelectionPermissions =
        localClientResponse?.selectionPermissions
          ?.filter((i) => i.permission)
          .map((i) => i.name);
      setSelectedScreens(activeScreenPermissions || []);
      setSelectedToolIcons(activeToolPermissions || []);
      setSelectedReports(activeReportPermissions || []);
      setSelectedSelection(activeSelectionPermissions || []);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (fromWhere === "Edit") {
      fetchAdminDetails();
    }
  }, [fromWhere, row?.loginName]);

  const addClientUser = async () => {
    try {
      if (!userName || !loginName || !password) {
        toast.error("UserName, LoginName, Password are required fields.");
        return;
      }
      setAddUpdateLoading(true);

      const requestData = {
        userType: "CL",
        loginName,
        password,
        email: userName,
        screenPermissions: selectedScreens.map((i) => ({
          screen: i,
          permission: true,
        })),
        toolPermissions: selectedToolIcons.map((i) => ({
          tool: i,
          permission: true,
        })),
        reportPermissions: selectedReports.map((i) => ({
          report: i,
          permission: true,
        })),
        selectionPermissions: selectedSelection.map((i) => ({
          selection: i,
          permission: true,
        })),
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
        setSelectedToolIcons([]);
        setSelectedReports([]);
        setSelectedSelection([]);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAddUpdateLoading(false);
    }
  };
  return (
    <div>
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
          <StyledText>screen Permissions : </StyledText>
          <CustomMultiSelect
            keyId="screenId"
            keyName="screenName"
            dropdownToggleWidth={272}
            dropdownWidth={250}
            options={clientScreenArray}
            selectedItems={selectedScreens}
            setSelectedItems={setSelectedScreens}
            title="Screen"
          />
        </StyledWrapper>
        <StyledWrapper>
          <StyledText>Tool Permissions : </StyledText>
          <CustomMultiSelect
            keyId="toolId"
            keyName="toolName"
            dropdownToggleWidth={272}
            dropdownWidth={250}
            options={clientToolIcons}
            selectedItems={selectedToolIcons}
            setSelectedItems={setSelectedToolIcons}
            title="Tools"
          />
        </StyledWrapper>
        <StyledWrapper>
          <StyledText>Report Permissions : </StyledText>
          <CustomMultiSelect
            keyId="reportId"
            keyName="reportName"
            dropdownToggleWidth={272}
            dropdownWidth={250}
            options={clientReports}
            selectedItems={selectedReports}
            setSelectedItems={setSelectedReports}
            title="Reports"
          />
        </StyledWrapper>
        <StyledWrapper>
          <StyledText>Report Permissions : </StyledText>
          <CustomMultiSelect
            keyId="selectionId"
            keyName="selectionName"
            dropdownToggleWidth={272}
            dropdownWidth={250}
            options={clientSelection}
            selectedItems={selectedSelection}
            setSelectedItems={setSelectedSelection}
            title="Selection"
          />
        </StyledWrapper>
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
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ ml: 2 }}
          size="small"
        >
          Cancel
        </Button>
        <Button
          onClick={addClientUser}
          variant="outlined"
          color="primary"
          size="small"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {addUpdateLoading && <CircularProgress size={"1em"} />}
          Save
        </Button>
      </Box>
    </div>
  );
};

export default AddEditClient;

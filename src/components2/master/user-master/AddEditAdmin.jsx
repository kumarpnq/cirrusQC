import { Box } from "@mui/material";
import { StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";
import { useEffect, useState } from "react";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import { screensArray } from "../../../constants/dataArray";

const AddEditAdmin = () => {
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedScreens, setSelectedScreens] = useState([]);

  // * password auto creation basis on the userName and loginName
  const generatePassword = (userName, loginName) => {
    const specialChars = "!@#$%^&*";
    const randomSpecialChar =
      specialChars[Math.floor(Math.random() * specialChars.length)];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    return `${userName}_${loginName}${randomSpecialChar}${randomSuffix}`;
  };

  useEffect(() => {
    if (userName && loginName) {
      const generatedPassword = generatePassword(userName, loginName);
      setPassword(generatedPassword);
    }
  }, [userName, loginName]);
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
        />
      </StyledWrapper>
      <StyledWrapper>
        <StyledText>Password : </StyledText>
        <CustomTextField
          width={"100%"}
          type={"text"}
          value={password}
          setValue={setPassword}
          placeholder={"Password"}
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
    </Box>
  );
};

export default AddEditAdmin;

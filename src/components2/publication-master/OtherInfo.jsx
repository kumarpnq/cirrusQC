import { Box, Divider, TextField, Typography } from "@mui/material";
import YesOrNo from "../../@core/YesOrNo";
import { useState } from "react";
import CustomTextField from "../../@core/CutsomTextField";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import FormAction from "./FormAction";

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "1em",
}));

const OtherInfo = ({ FieldWrapper, FieldLabel, handleClose }) => {
  const [coverage, setCoverage] = useState("");
  const [publicationScore, setPublicationScore] = useState("");
  const [adRates, setAdRates] = useState("");
  const [tier, setTier] = useState("");
  const [circulation, setCirculation] = useState("");

  //   * subscription
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  //   * priority
  const [publication, setPublication] = useState("");
  const [language, setLanguage] = useState("");
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  return (
    <form className="p-1 border rounded-md">
      <Box>
        <StyledTypography>Metrics</StyledTypography>
        <FieldWrapper>
          <FieldLabel>Full Coverage : </FieldLabel>
          <YesOrNo
            //   width={"100%"}
            mapValue={["Yes", "No"]}
            placeholder="Coverage"
            value={coverage}
            setValue={setCoverage}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Publication Score : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Publication Score"}
            value={publicationScore}
            setValue={setPublicationScore}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Ad Rates : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Ad Rates"}
            value={adRates}
            setValue={setAdRates}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Tier : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Tier"}
            value={tier}
            setValue={setTier}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Circulation : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Circulation"}
            value={circulation}
            setValue={setCirculation}
          />
        </FieldWrapper>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box>
        <StyledTypography>Subscription</StyledTypography>
        <FieldWrapper>
          <FieldLabel>Type : </FieldLabel>
          <YesOrNo
            mapValue={["Vendor"]}
            placeholder="Type"
            value={type}
            setValue={setType}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Start Date : </FieldLabel>
          <TextField
            type="date"
            InputProps={{ style: { height: 25 } }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>End Date : </FieldLabel>
          <TextField
            type="date"
            InputProps={{ style: { height: 25 } }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
        </FieldWrapper>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box>
        <StyledTypography>Priority</StyledTypography>
        <FieldWrapper>
          <FieldLabel>Publication : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Publication"}
            value={publication}
            setValue={setPublication}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Language : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Language"}
            value={language}
            setValue={setLanguage}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Level 1 : </FieldLabel>
          <CustomTextField
            width={"100&"}
            type={"number"}
            placeholder={"Level 1"}
            value={level1}
            setValue={setLevel1}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Level 2 : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Level 2"}
            value={level2}
            setValue={setLevel2}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel>Level 3 : </FieldLabel>
          <CustomTextField
            width={"100%"}
            type={"number"}
            placeholder={"Level 3"}
            value={level3}
            setValue={setLevel3}
          />
        </FieldWrapper>
      </Box>
      <Divider sx={{ my: 1 }} />
      <FormAction handleClose={handleClose} />
    </form>
  );
};

OtherInfo.propTypes = {
  FieldWrapper: PropTypes.elementType.isRequired,
  FieldLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType])
    .isRequired,
  handleClose: PropTypes.func,
};

export default OtherInfo;

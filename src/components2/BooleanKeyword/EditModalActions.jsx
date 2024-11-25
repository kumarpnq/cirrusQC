import { Box, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import { useState } from "react";
import AutoGenerateModal from "./AutoGenerateModal";

// Styled components
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  flexWrap: "wrap",
  justifyContent: "space-between",
}));

const Label = styled(Typography)(({ theme }) => ({
  minWidth: "80px",
  fontSize: "0.875rem",
}));

const StyledTextField = styled(TextField)({
  fontSize: "0.85rem",
});

const StyledButton = styled(Button)({
  minWidth: "100px",
});

const StyledTypography = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

// JSX Component
export const EditModalActions = () => {
  const [company, setCompany] = useState("PNQ DEMO");
  const [language, setLanguage] = useState("");
  const [openAutoGenerate, setOpenAutoGenerate] = useState(false);

  const handleCloseOpenAutoGenerate = () =>
    setOpenAutoGenerate((prev) => !prev);

  const { data: languageData } = useFetchData(`${url}languagelist/`);
  const languageArray = Object.entries(languageData?.data?.languages || {}).map(
    ([language, code]) => ({
      language,
      code,
    })
  );
  return (
    <Container>
      <StyledTypography>
        <Label>Company:</Label>
        <StyledTextField
          type="text"
          aria-readonly
          value={company}
          InputProps={{
            readOnly: true,
            style: {
              height: 25,
              fontSize: "1em",
              width: 250,
            },
          }}
        />
      </StyledTypography>

      <StyledTypography>
        <Label>Language:</Label>
        <CustomSingleSelect
          options={languageArray}
          dropdownToggleWidth={250}
          dropdownWidth={250}
          keyId="code"
          keyName="language"
          setSelectedItem={setLanguage}
          selectedItem={language}
          title="Language"
        />
      </StyledTypography>
      <StyledButton variant="outlined" size="small" type="submit">
        Search
      </StyledButton>

      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => setOpenAutoGenerate(true)}
      >
        Auto Generate
      </Button>
      <AutoGenerateModal
        open={openAutoGenerate}
        handleClose={handleCloseOpenAutoGenerate}
        companyName={company}
      />
    </Container>
  );
};

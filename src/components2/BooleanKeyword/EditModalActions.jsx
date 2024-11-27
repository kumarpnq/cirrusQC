import PropTypes from "prop-types";
import { Box, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import { useState } from "react";
import AutoGenerateModal from "./AutoGenerateModal";
import Client from "../../print-components/dropdowns/Client";

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
export const EditModalActions = ({ language, setLanguage, row, fromWhere }) => {
  const [company, setCompany] = useState("");
  const [openAutoGenerate, setOpenAutoGenerate] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [testCompanies, setTestCompanies] = useState([]);

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
      {fromWhere !== "Add" ? (
        <StyledTypography>
          <Label>Company:</Label>
          <StyledTextField
            type="text"
            aria-readonly
            value={company || row?.companyName}
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
      ) : (
        <div className="flex items-center">
          <Label>Company:</Label>{" "}
          <Client
            label="Client"
            client={selectedClient}
            setClient={setSelectedClient}
            width={200}
            setCompanies={setTestCompanies}
          />
        </div>
      )}

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
        language={language}
        row={row}
      />
    </Container>
  );
};

EditModalActions.propTypes = {
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  row: PropTypes.object,
  fromWhere: PropTypes.string,
};

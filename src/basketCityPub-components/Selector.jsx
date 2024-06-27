import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SelectableList from "../@core/SalactableList";
import axios from "axios";
import { url } from "../constants/baseUrl";
import { arrayToString } from "../utils/arrayToString";

export default function Selector({
  cityData,
  publications,
  companyData,
  clientid,
  companies,
  setCompanies,
}) {
  const [city, setCity] = React.useState([]);
  const [selectedPublications, setSelectedPublications] = React.useState([]);

  const steps = [
    {
      label: "Select Company",
      component: (
        <SelectableList
          data={companyData}
          idKey="companyid"
          nameKey="companyname"
          selectedItems={companies}
          setSelectedItems={setCompanies}
          placeholder={"Select Companies"}
        />
      ),
    },
    {
      label: "Select City",
      component: (
        <SelectableList
          data={cityData}
          idKey="cityid"
          nameKey="cityname"
          selectedItems={city}
          setSelectedItems={setCity}
          placeholder={"Select City"}
        />
      ),
    },
    {
      label: "Select Publication",
      component: (
        <SelectableList
          data={publications}
          idKey="publicationgroupid"
          nameKey="publicationgroupname"
          selectedItems={selectedPublications}
          setSelectedItems={setSelectedPublications}
          placeholder={"Select PublicationGroup"}
        />
      ),
    },
  ];
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //* generating table data
  const generateCBCP = async () => {
    try {
      const userToken = localStorage.getItem("user");
      const selectedCompanies = companies.map((i) => i.companyname);
      const selectedCities = city.map((i) => i.cityid);
      const selectedPublication = selectedPublications.map(
        (i) => i.publicationgroupname
      );
      const request_data = {
        clientid: "INFINIXIN",
        companyid: arrayToString(selectedCompanies),
        cityid: arrayToString(selectedCities),
        pubgroupid: arrayToString(selectedPublication),
      };
      const response = await axios.post(`${url}generateCBCP/`, request_data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log(response.data);
    } catch (error) {
      console.log("test");
      console.log(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <Box sx={{ height: 400, maxWidth: 400, width: "100%", pl: 2 }}>
        {steps[activeStep].component}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
      <Typography component={"div"} textAlign={"center"} mt={3}>
        <Button onClick={generateCBCP}>Generate</Button>
      </Typography>
    </Box>
  );
}

Selector.propTypes = {
  cityData: PropTypes.arrayOf(
    PropTypes.shape({
      cityid: PropTypes.number.isRequired,
      cityname: PropTypes.string.isRequired,
    })
  ).isRequired,
  publications: PropTypes.arrayOf(
    PropTypes.shape({
      publicationgroupid: PropTypes.number.isRequired,
      publicationgroupname: PropTypes.string.isRequired,
    })
  ).isRequired,
  companyData: PropTypes.arrayOf(
    PropTypes.shape({
      companyid: PropTypes.number.isRequired,
      companyname: PropTypes.string.isRequired,
    })
  ).isRequired,
  clientid: PropTypes.string.isRequired,
  companies: PropTypes.array.isRequired,
  setCompanies: PropTypes.func.isRequired,
};

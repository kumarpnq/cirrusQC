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
import { toast } from "react-toastify";
import axiosInstance from "../../axiosConfig";

export default function Selector({
  cityData,
  publications,
  companyData,
  clientId,
  clusterData,
  fetchCBCP,
}) {
  const [companies, setCompanies] = React.useState([]);
  const [city, setCity] = React.useState([]);
  const [selectedPublications, setSelectedPublications] = React.useState([]);
  const [filteredLists, setFilteredLists] = React.useState({
    companies: [],
    cities: [],
    pubGroups: [],
  });

  React.useEffect(() => {
    // * Extracting IDs from clusterData
    const companyIds = clusterData?.companies?.map((i) => i.comapnyId) || [];
    const cityIds = clusterData?.cities?.map((i) => i.cityId) || [];
    const pubIds = clusterData?.pubGroups?.map((i) => i.pubGroupId) || [];

    const sortedCompanies = [...companyData].sort((a, b) => {
      const indexA = companyIds.indexOf(a.companyid);
      const indexB = companyIds.indexOf(b.companyid);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return 0;
    });

    const sortedCities = [...cityData].sort((a, b) => {
      const indexA = cityIds.indexOf(a.cityid);
      const indexB = cityIds.indexOf(b.cityid);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return 0;
    });

    const sortedPublications = [...publications].sort((a, b) => {
      const indexA = pubIds.indexOf(a.publicationgroupid);
      const indexB = pubIds.indexOf(b.publicationgroupid);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return 0;
    });

    setFilteredLists({
      companies: sortedCompanies,
      cities: sortedCities,
      pubGroups: sortedPublications,
    });
    setCompanies([...companyIds]);
    setCity([...cityIds]);
    setSelectedPublications([...pubIds]);
  }, [clusterData, cityData, publications, companyData]);

  const steps = [
    {
      label: "Select Company",
      component: (
        <SelectableList
          data={filteredLists.companies}
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
          data={filteredLists.cities}
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
          data={filteredLists.pubGroups}
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
      if (
        !clientId ||
        !city.length ||
        !companies.length ||
        !selectedPublications.length
      ) {
        toast.warning("All fields are required.");
        return;
      }
      const requestData = {
        clientId,
        companies: companies,
        cities: city,
        pubGroups: selectedPublications,
      };
      const response = await axiosInstance.post(`generateCbcp/`, requestData);

      if (response) {
        toast.success(response.data.data.message);
        fetchCBCP();
      } else {
        toast.warning("Error while generating");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <Box sx={{ height: 400, maxWidth: 400, pl: 2 }}>
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
        <Button onClick={generateCBCP} variant="contained">
          Generate
        </Button>
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
  clientId: PropTypes.string.isRequired,
  clusterData: PropTypes.array,
  fetchCBCP: PropTypes.func,
};

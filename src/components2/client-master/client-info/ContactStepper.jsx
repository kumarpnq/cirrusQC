import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { Person } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";

const CompactStepper = ({ activeStep, setActiveStep }) => {
  // Define your steps with corresponding icons
  const steps = [
    { label: "Client", icon: <BusinessIcon fontSize="large" /> },
    { label: "Delivery", icon: <Person fontSize="large" /> },
  ];

  // Handle icon click to set active step
  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <Box sx={{ maxWidth: 200, margin: "auto" }}>
      <Stepper activeStep={activeStep} orientation="vertical" connector={null}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              icon={step.icon}
              onClick={() => handleStepClick(index)} // Make the icon clickable
              sx={{
                cursor: "pointer", // Show pointer on hover
                "&:hover": {
                  color: "primary.main", // Change color on hover
                  backgroundColor: "lightgray", // Background color on hover
                },
                backgroundColor:
                  activeStep === index ? "lightgray" : "transparent", // Background color for active step
                color: activeStep === index ? "primary.main" : "inherit", // Icon color for active step
                borderRadius: "8px", // Optional: Make the background color have rounded corners
                padding: "4px 8px", // Optional: Add padding around the icon
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CompactStepper;

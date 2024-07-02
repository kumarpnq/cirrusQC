import PropTypes from "prop-types";
import { Box, Tab, Tabs } from "@mui/material";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const NavigateTabs = ({ value, handleChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={value} onChange={handleChange} aria-label="activity logs">
        <Tab label="QC Activity" {...a11yProps(0)} />
        <Tab label="Logs" {...a11yProps(1)} />
        <Tab label="User Efforts" {...a11yProps(2)} />
        <Tab label="Total Efforts" {...a11yProps(3)} />
      </Tabs>
    </Box>
  );
};

NavigateTabs.propTypes = {
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};
export default NavigateTabs;

import { Box, Divider, Tab, Tabs } from "@mui/material";
import CompanySlicingHeader from "../components2/company-online-slicing/CompanySlicingHeader";
import CompanySlicingGrid from "../components2/company-online-slicing/CompanySlicingGrid";
import { useState } from "react";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OnlineCompanySlicing = () => {
  const [value, setValue] = useState("online");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ px: 2 }}>
      <Tabs value={value} onChange={handleChange} aria-label="activity logs">
        <Tab label="Online" {...a11yProps(0)} />
        <Tab label="Print" {...a11yProps(1)} />
      </Tabs>
      <CompanySlicingHeader activeTab={value} />
      <Divider sx={{ my: 1 }} />
      <CompanySlicingGrid activeTab={value} />
    </Box>
  );
};

export default OnlineCompanySlicing;

import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import OnlineCluster from "./OnlineCluster";
import PrintCluster from "./PrintCluster";

const ClusterMaster = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="Print and Online Tabs"
        >
          <Tab label="Online" />
          <Tab label="Print" />
        </Tabs>
      </Box>

      {selectedTab === 0 ? <OnlineCluster /> : <PrintCluster />}
    </Box>
  );
};

export default ClusterMaster;

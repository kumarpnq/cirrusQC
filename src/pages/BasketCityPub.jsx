import PropTypes from "prop-types";
import { useState } from "react";
import { Box } from "@mui/material";
import BasketCityPubPage from "../basketCityPub-components/BasketCityPubPage";
import BasketTabPanel from "../components2/basket/BasketTabPanel";
import CompanyMaster from "../components2/company-master/CompanyMaster";
import PublicationMaster from "../components2/publication-master/PublicationMaster";
import PublicationMasterOnline from "../components2/publication-master-online/PublicationMasterOnline";

const RenderComponent = ({ value }) => {
  switch (value) {
    case 0:
      return <BasketCityPubPage />;
    case 1:
      return <CompanyMaster />;
    case 2:
      return <PublicationMaster />;
    case 3:
      return <PublicationMasterOnline />;
  }
};

RenderComponent.propTypes = {
  value: PropTypes.number,
};
const BasketCityPub = () => {
  const [tabValue, setTabValue] = useState(0);
  return (
    <Box sx={{ px: 2 }}>
      <BasketTabPanel value={tabValue} setValue={setTabValue} />
      <RenderComponent value={tabValue} />
    </Box>
  );
};

export default BasketCityPub;

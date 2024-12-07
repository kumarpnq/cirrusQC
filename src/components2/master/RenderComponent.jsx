import PropTypes from "prop-types";
import CityMaster from "./city-master/CityMaster";
import CompanyMaster from "../company-master/CompanyMaster";
import PublicationGroupMaster from "./publication-group-master/PublicationGroupMaster";
import PublicationMaster from "../publication-master/PublicationMaster";
import PublicationMasterOnline from "../publication-master-online/PublicationMasterOnline";
import StateMaster from "./state-master/StateMaster";
import CountryMaster from "./country-master/CountryMaster";
import UserMaster from "./user-master/UserMaster";
import IndustryMaster from "./industry-master/IndustryMaster";
import ClusterMaster from "./cluster-master/ClusterMaster";
import { useContext } from "react";
import { ResearchContext } from "../../context/ContextProvider";

const RenderComponent = ({ value }) => {
  const { screenPermissions } = useContext(ResearchContext);

  switch (value) {
    case "City Master":
      return screenPermissions?.CityMaster ? <CityMaster /> : null;
    case "Company Master":
      return screenPermissions?.CompanyMaster ? <CompanyMaster /> : null;
    case "Publication Group Master":
      return screenPermissions?.PublicationGroupMaster ? (
        <PublicationGroupMaster />
      ) : null;
    case "Publication Master":
      return screenPermissions?.PublicationMaster ? (
        <PublicationMaster />
      ) : null;
    case "Publication Master Online":
      return screenPermissions?.PublicationMasterOnline ? (
        <PublicationMasterOnline />
      ) : null;
    case "State Master":
      return screenPermissions?.StateMaster ? <StateMaster /> : null;
    case "Country Master":
      return screenPermissions?.CountryMaster ? <CountryMaster /> : null;
    case "User Master":
      return screenPermissions?.UserMaster ? <UserMaster /> : null;
    case "Industry Master":
      return screenPermissions?.IndustryMaster ? <IndustryMaster /> : null;
    case "Cluster Master":
      return <ClusterMaster />;

    default:
      return null;
  }
};

RenderComponent.propTypes = {
  value: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default RenderComponent;

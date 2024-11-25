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
import { useContext } from "react";
import { ResearchContext } from "../../context/ContextProvider";

// Example permission object
const permissions = {
  "City Master": ["Yes"],
  "Company Master": ["Yes"],
  "Publication Group Master": ["Yes"],
  "Publication Master": ["Yes"],
  "Publication Master Online": ["Yes"],
  "State Master": ["Yes"],
  "Country Master": ["Yes"],
  "User Master": ["Yes"],
  "Industry Master": ["Yes"],
};

const RenderComponent = ({ value }) => {
  const { screenPermissions } = useContext(ResearchContext);
  const hasPermission = (requiredRoles) => requiredRoles.includes("");

  switch (value) {
    case "City Master":
      return hasPermission(permissions["City Master"]) ? <CityMaster /> : null;
    case "Company Master":
      return hasPermission(permissions["Company Master"]) ? (
        <CompanyMaster />
      ) : null;
    case "Publication Group Master":
      return hasPermission(permissions["Publication Group Master"]) ? (
        <PublicationGroupMaster />
      ) : null;
    case "Publication Master":
      return hasPermission(permissions["Publication Master"]) ? (
        <PublicationMaster />
      ) : null;
    case "Publication Master Online":
      return hasPermission(permissions["Publication Master Online"]) ? (
        <PublicationMasterOnline />
      ) : null;
    case "State Master":
      return hasPermission(permissions["State Master"]) ? (
        <StateMaster />
      ) : null;
    case "Country Master":
      return hasPermission(permissions["Country Master"]) ? (
        <CountryMaster />
      ) : null;
    case "User Master":
      return hasPermission(permissions["User Master"]) ? <UserMaster /> : null;
    case "Industry Master":
      return hasPermission(permissions["Industry Master"]) ? (
        <IndustryMaster />
      ) : null;

    default:
      return null;
  }
};

RenderComponent.propTypes = {
  value: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default RenderComponent;

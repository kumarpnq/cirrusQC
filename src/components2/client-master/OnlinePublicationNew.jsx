import { Box } from "@mui/material";
import PropTypes from "prop-types";
import CommonGrid from "./CommonGrid";

const OnlinePublicationNew = ({ clientId, setSelectedMainTab }) => {
  return (
    <Box>
      <CommonGrid clientId={clientId} setSelectedMainTab={setSelectedMainTab} />
    </Box>
  );
};

OnlinePublicationNew.propTypes = {
  clientId: PropTypes.string.isRequired,
  setSelectedMainTab: PropTypes.func.isRequired,
};

export default OnlinePublicationNew;

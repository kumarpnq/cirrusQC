import { Box } from "@mui/material";
import PropTypes from "prop-types";
import CommonGrid from "./CommonGrid";

const OnlinePublicationNew = ({ clientId }) => {
  return (
    <Box>
      <CommonGrid clientId={clientId} />
    </Box>
  );
};

OnlinePublicationNew.propTypes = {
  clientId: PropTypes.string.isRequired,
};

export default OnlinePublicationNew;

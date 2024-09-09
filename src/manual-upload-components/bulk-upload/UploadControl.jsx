import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

const UploadControl = ({ onParse, onAdd }) => {
  return (
    <Box sx={{ display: "flex", gap: 0.8 }}>
      <Button
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          if (onParse) onParse();
        }}
        size="small"
      >
        Upload
      </Button>

      <Button
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          if (onAdd) onAdd();
        }}
        size="small"
      >
        Add
      </Button>
      <Button variant="outlined" size="small">
        Check
      </Button>
      <Button variant="contained" color="primary" size="small">
        Process
      </Button>
    </Box>
  );
};

UploadControl.propTypes = {
  onParse: PropTypes.func,
  onAdd: PropTypes.func,
};

export default UploadControl;

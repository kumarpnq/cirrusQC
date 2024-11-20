import { Box, Button, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const FormAction = ({ handleClose, updateLoading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 1,
      }}
    >
      <Button onClick={handleClose} variant="outlined" size="small">
        Close
      </Button>
      <Button
        type="submit"
        variant="contained"
        size="small"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        {updateLoading && <CircularProgress size={"1em"} color="inherit" />}
        update
      </Button>
    </Box>
  );
};

FormAction.propTypes = {
  handleClose: PropTypes.func.isRequired,
  updateLoading: PropTypes.bool.isRequired,
};
export default FormAction;

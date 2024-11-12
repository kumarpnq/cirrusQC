import { Box, Button, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ComponentsHeader = ({ title, onSave = () => {}, loading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          //   fontWeight: "bold",
          fontSize: "1em",
          color: "primary.main",
        }}
      >
        {title}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
        onClick={onSave}
      >
        {loading && <CircularProgress size={"1em"} />}
        Save
      </Button>
    </Box>
  );
};

ComponentsHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ComponentsHeader.defaultProps = {
  loading: false,
};

export default ComponentsHeader;

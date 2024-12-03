import { Box, Button, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ComponentsHeader = ({ title, onSave = () => {}, loading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #ddd", // Initial border color
        p: 1,
        borderRadius: "3px",
        my: 0.5,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        transition: "all 0.3s ease-in-out", // Smooth transition effect
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", // Larger shadow on hover
          borderColor: "primary.main", // Change border color to primary on hover
        },
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

import PropTypes from "prop-types";
import { Tabs, Tab, Box } from "@mui/material";

function ClientDetailTabs({ value, setValue }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="small tabs example"
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ minHeight: 30 }}
      >
        <Tab label="Info" sx={{ fontSize: "0.9rem", minHeight: 30 }} />
        <Tab label="Permission" sx={{ fontSize: "0.9", minHeight: 30 }} />
      </Tabs>
    </Box>
  );
}

ClientDetailTabs.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default ClientDetailTabs;

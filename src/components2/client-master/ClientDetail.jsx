import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import ConfigParameter from "./ConfigParameter";
import MailerColumns from "./MailerColumns";
import MailerConfigure from "./MailerConfigure";
import ClientInfo from "./ClientInfo";
import SectionOrder from "./SectionOrder";
import PropTypes from "prop-types";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EditComponentRender = (value, clientId) => {
  switch (value) {
    case 0:
      return <ClientInfo clientId={clientId} />;
    case 1:
      return <SectionOrder clientId={clientId} />;
    case 2:
      return <ConfigParameter clientId={clientId} />;
    case 3:
      return <MailerColumns clientId={clientId} />;
    case 4:
      return <MailerConfigure clientId={clientId} />;

    default:
      return <Typography>Invalid Tab</Typography>;
  }
};
const ClientDetail = ({ clientId }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="MailerSetting" {...a11yProps(0)} />
            <Tab label="SectionOrder" {...a11yProps(1)} />
            <Tab label="ConfigParameter" {...a11yProps(2)} />
            <Tab label="MailerColumns" {...a11yProps(3)} />
            <Tab label="MailerConfigure" {...a11yProps(4)} />
          </Tabs>
        </Box>
        {EditComponentRender(value, clientId)}
      </form>
    </div>
  );
};

ClientDetail.propTypes = {
  clientId: PropTypes.string.isRequired,
};
export default ClientDetail;

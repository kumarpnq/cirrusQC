import PropTypes from "prop-types";
import { Box, IconButton, Modal, Tab, Tabs, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import ClientInfo from "./ClientInfo";
import MailerConfigure from "./MailerConfigure";
import ConfigParameter from "./ConfigParameter";
import MailerColumns from "./MailerColumns";
import { useState } from "react";

const StyledText = styled(Typography)({
  fontSize: "1em",
  color: "GrayText",
  textWrap: "nowrap",
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EditComponentRender = (value) => {
  switch (value) {
    case 0:
      return <ConfigParameter />;
    case 1:
      return <MailerColumns />;
    case 2:
      return <MailerConfigure />;
    default:
      return <Typography>Invalid Tab</Typography>;
  }
};
const EditAddModal = ({ open, onClose, openFromWhere }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "99vw",
          height: "99vh",
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 1,
          outline: "none",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography component={"h2"} fontSize={"1em"}>
            {openFromWhere === "edit" ? "Edit" : "Add"} Modal
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit}>
          <ClientInfo />
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="ConfigParameter" {...a11yProps(0)} />
              <Tab label="MailerColumns" {...a11yProps(1)} />
              <Tab label="MailerConfigure" {...a11yProps(2)} />
            </Tabs>
          </Box>
          {EditComponentRender(value)}
        </form>
      </Box>
    </Modal>
  );
};

EditAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  openFromWhere: PropTypes.string,
};

export default EditAddModal;

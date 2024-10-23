import { Box, Button, Divider, Tab, Tabs, Typography } from "@mui/material";
import MailerSchedularGrid from "../components2/online-mailer-schedular/MailerSchedularGrid";
import { useState } from "react";
import EditDialog from "../components2/online-mailer-schedular/EditDialog";
import SearchFilters from "../components2/online-mailer-schedular/SearchFilters";
import SendMailGrid from "../components2/online-mailer-schedular/SendMailGrid";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OnlineMailSchedular = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ px: 2 }}>
      <Tabs value={value} onChange={handleChange} aria-label="activity logs">
        <Tab label="Config" {...a11yProps(0)} />
        <Tab label="Send Mail" {...a11yProps(1)} />
      </Tabs>
      <Divider />
      {value ? (
        <SearchFilters />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Typography component={"h1"}>Online Mail Schedule Details</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpen((prev) => !prev)}
          >
            ADD
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 1 }} />
      {value ? <SendMailGrid /> : <MailerSchedularGrid />}

      <EditDialog open={open} setOpen={setOpen} openedFromWhere="add" />
    </Box>
  );
};

export default OnlineMailSchedular;

import { Box, Button, Divider, Tab, Tabs, Typography } from "@mui/material";
import MailerSchedularGrid from "../components2/online-mailer-schedular/MailerSchedularGrid";
import { useEffect, useState } from "react";
import EditDialog from "../components2/online-mailer-schedular/EditDialog";
import SearchFilters from "../components2/online-mailer-schedular/SearchFilters";
import SendMailGrid from "../components2/online-mailer-schedular/SendMailGrid";
import { url_mongo } from "../constants/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OnlineMailSchedular = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("user");
      const response = await axios.get(`${url_mongo}mailerSchedulerData/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeClients = response.data.scheduleData.filter((i) => i.active);
      setScheduleData(activeClients);
    } catch (error) {
      toast.warning(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
      {value ? (
        <SendMailGrid />
      ) : (
        <MailerSchedularGrid
          loading={loading}
          scheduleData={scheduleData}
          setScheduleData={setScheduleData}
          handleFetch={fetchData}
        />
      )}

      <EditDialog
        open={open}
        handleClose={handleClose}
        openedFromWhere="add"
        handleFetch={fetchData}
      />
    </Box>
  );
};

export default OnlineMailSchedular;

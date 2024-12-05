import { Box, Button, Divider, Tab, Tabs, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import MailerSchedularGrid from "../components2/online-mailer-schedular/MailerSchedularGrid";
import EditDialog from "../components2/online-mailer-schedular/EditDialog";
import SearchFilters from "../components2/online-mailer-schedular/SearchFilters";
import SendMailGrid from "../components2/online-mailer-schedular/SendMailGrid";
import axiosInstance from "../../axiosConfig";
import WhatsappContact from "../components2/online-mailer-schedular/WhatsappContact";

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
  const [clientIds, setClientIds] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    setClientIds([]);
    try {
      setLoading(true);
      const response = await axiosInstance.get(`mailerSchedulerData/`);
      const activeClients =
        response.data.scheduleData.filter((i) => i.active) || [];
      const filteredIds = activeClients.map((item) => item.clientId);
      setScheduleData(activeClients);
      setClientIds(filteredIds);
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
        <Tab label="Whatsapp Contact" {...a11yProps(2)} />
      </Tabs>
      <Divider />
      {value === 1 ? (
        <SearchFilters />
      ) : value === 0 ? (
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
      ) : null}

      <Divider sx={{ my: 1 }} />
      {value === 1 ? (
        <SendMailGrid />
      ) : value === 2 ? (
        <WhatsappContact />
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
        clientIds={clientIds}
        row={null}
      />
    </Box>
  );
};

export default OnlineMailSchedular;

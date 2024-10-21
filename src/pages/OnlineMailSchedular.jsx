import { Box, Button, Divider, Typography } from "@mui/material";
import MailerSchedularGrid from "../components2/online-mailer-schedular/MailerSchedularGrid";
import { useState } from "react";
import EditDialog from "../components2/online-mailer-schedular/EditDialog";

const OnlineMailSchedular = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ px: 2 }}>
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
      <Divider sx={{ my: 1 }} />
      <MailerSchedularGrid />
      <EditDialog open={open} setOpen={setOpen} openedFromWhere="add" />
    </Box>
  );
};

export default OnlineMailSchedular;

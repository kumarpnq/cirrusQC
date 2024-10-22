import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import WhatsAppContactGrid from "./WhatsAppContactGrid";
import { useState } from "react";
import WhatsAppEditModal from "./WhatsAppEditModal";

const WhatsAppContact = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  return (
    <Box sx={{ px: 2 }}>
      <Box
        component={Paper}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          mt: 1,
        }}
      >
        <Typography variant="h6" fontSize={"1em"}>
          Bulk Contact Save
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setOpen((prev) => !prev)}
        >
          Add Contacts
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />
      <WhatsAppContactGrid />
      <WhatsAppEditModal
        open={open}
        handleClose={handleClose}
        openedFromWhere="Add"
      />
    </Box>
  );
};

export default WhatsAppContact;

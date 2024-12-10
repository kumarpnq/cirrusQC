import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import WhatsappGrid from "./whatsapp-contact/WhatsAppGrid";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosConfig";
import AddEditModal from "./whatsapp-contact/AddEditModal";

const WhatsappContact = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState([]);

  const fetchWhatsAppSchedularData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`whatsappScheduler/`);
      setWhatsAppData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsAppSchedularData();
  }, []);
  return (
    <Box>
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
      <WhatsappGrid
        whatsAppData={whatsAppData}
        loading={loading}
        fetchMainData={fetchWhatsAppSchedularData}
      />
      <AddEditModal
        open={open}
        handleClose={() => setOpen(false)}
        fromWhere={"Add"}
        row={null}
        fetchMainData={fetchWhatsAppSchedularData}
      />
    </Box>
  );
};

export default WhatsappContact;

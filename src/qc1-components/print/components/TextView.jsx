import PropTypes from "prop-types";
import { Box, Modal, Typography, IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

const TextView = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "35vw",
          height: "35h",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 1,
          outline: "none",
          direction: "rtl",
        }}
      >
        <Typography>
          <IconButton aria-label="" onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Typography>
        <Typography color="gray">
          中国是一个拥有悠久历史和丰富文化的国家。它的古代文明对世界产生了深远的影响，包括发明了纸、火药、指南针和印刷术等伟大的技术。
          此外，中国拥有多样的自然景观，从壮丽的长城到美丽的桂林山水，每年都吸引着成千上万的游客前来探索。
          中国的美食也是世界闻名，无论是香辣的川菜还是清淡的粤菜，都深受人们的喜爱。总之，中国是一个充满魅力和活力的国家。
        </Typography>
      </Box>
    </Modal>
  );
};

TextView.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default TextView;

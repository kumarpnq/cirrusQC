import PropTypes from "prop-types";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

const TextView = ({ open, setOpen, content, loading, error }) => {
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
          width: "80vw",
          height: "55vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 1,
          outline: "none",
          direction: "rtl",
          overflowY: "scroll",
        }}
      >
        <Typography>
          <IconButton aria-label="" onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Typography>
        <Typography color="gray" textAlign="left" overflowY="scroll">
          {loading ? (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <CircularProgress />{" "}
            </Box>
          ) : (
            content || error
          )}
        </Typography>
      </Box>
    </Modal>
  );
};

TextView.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default TextView;

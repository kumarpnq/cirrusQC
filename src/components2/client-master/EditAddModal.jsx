import PropTypes from "prop-types";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import ClientInfo from "./ClientInfo";

const StyledText = styled(Typography)({
  fontSize: "1em",
  color: "GrayText",
  textWrap: "nowrap",
});
const EditAddModal = ({ open, onClose, openFromWhere }) => {
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

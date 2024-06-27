import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const buttonStyle = {
  marginRight: 1,
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  //   padding: 2,
  borderBottom: "1px solid #ccc",
  background: "#fca7b2",
  color: "#fff",
};

const MatchedRowModal = ({ open, setOpen, matchedItems, setMatchedItems }) => {
  const handleClose = () => setOpen(false);
  const handleClearAll = () => {
    setMatchedItems([]);
  };

  const handleRemoveItem = (id) => {
    setMatchedItems(matchedItems.filter((item) => item.id !== id));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box component={Paper} sx={modalStyle}>
        <Typography
          component={"div"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <Button onClick={handleClearAll} sx={buttonStyle}>
            Clear All
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </Typography>
        <Box sx={{ width: "100%", height: 400, overflow: "scroll" }}>
          {matchedItems.map((i) => (
            <Stack spacing={2} key={i.id}>
              <Typography component={Paper} sx={itemStyle} fontSize={"0.9em"}>
                <span className="text-sm">{i.clientname}</span>
                <span className="text-sm">{i.companyname}</span>
                <span className="text-sm">{i.cityname}</span>
                <span className="text-sm">{i.publicationname}</span>
                <IconButton onClick={() => handleRemoveItem(i.id)}>
                  <ClearIcon />
                </IconButton>
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

MatchedRowModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  matchedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      clientname: PropTypes.string.isRequired,
      companyname: PropTypes.string.isRequired,
      cityname: PropTypes.string.isRequired,
      publicationname: PropTypes.string.isRequired,
    })
  ).isRequired,
  setMatchedItems: PropTypes.func.isRequired,
};

export default MatchedRowModal;

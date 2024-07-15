import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import CustomButton from "./CustomButton";

const DeleteConfirmationDialog = ({
  open,
  handleClose,
  password,
  setPassword,
  verificationLoading,
  handleClickRemove,
}) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle fontSize={"1em"}>Enter Password For Confirmation.</DialogTitle>
    <DialogContent>
      <TextField
        type="password"
        sx={{ outline: "none" }}
        size="small"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <CustomButton btnText="Cancel" onClick={handleClose} bg={"bg-primary"} />
      {verificationLoading ? (
        <Box width={130} display={"flex"} justifyContent={"center"}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        <CustomButton
          btnText="Delete"
          onClick={handleClickRemove}
          bg={"bg-red-500"}
        />
      )}
    </DialogActions>
  </Dialog>
);

DeleteConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  verificationLoading: PropTypes.bool.isRequired,
  handleClickRemove: PropTypes.func.isRequired,
};

export default DeleteConfirmationDialog;

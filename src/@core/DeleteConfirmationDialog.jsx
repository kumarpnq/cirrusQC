import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../constants/baseUrl";
import PropTypes from "prop-types";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const DeleteConfirmationDialog = ({ open, onClose, onDelete }) => {
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get user token from localStorage
  const userToken = localStorage.getItem("user");

  const userVerification = async () => {
    try {
      setVerificationLoading(true);
      const headers = { Authorization: `Bearer ${userToken}` };
      const data = { password };
      const response = await axios.post(`${url}isValidUser/`, data, {
        headers,
      });
      setVerificationLoading(false);
      return response.data.valid_user;
    } catch (error) {
      setVerificationLoading(false);
      toast.error("Error: " + error.message);
    }
  };

  const handleDelete = async () => {
    const isValidUser = await userVerification();
    if (isValidUser) {
      onDelete();
      // onClose();
      // toast.success("Deleted successfully!");
    } else {
      toast.error("Invalid password. Please try again.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Please enter your password to confirm:
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}{" "}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          size="small"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          disabled={!password}
          size="small"
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {verificationLoading && <CircularProgress size={"1em"} />}
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default DeleteConfirmationDialog;

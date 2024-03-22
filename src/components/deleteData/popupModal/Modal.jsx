import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { ResearchContext } from "../../../context/ContextProvider";
import PropTypes from "prop-types";

const Modal = ({ setIsPopup, isPopup }) => {
  const { name } = useContext(ResearchContext);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);
  const [loginName, setLoginName] = useState(null);
  const handleClose = () => {
    setIsPopup(!isPopup);
  };
  const handleDelete = () => {
    setShowPasswordInput(!showPasswordInput);
    if (loginName) {
      if (loginName === name) {
        toast.success("Data Deleted SuccessFully");
        setIsPopup(!isPopup);
      } else {
        setIsDeleteDisabled(!isDeleteDisabled);
        toast.error("User name Not match");
      }
    }
  };
  const handleInputChange = (event) => {
    const { value } = event.target;
    setLoginName(value);
    if (value === name) {
      setIsDeleteDisabled(false);
    } else {
      setIsDeleteDisabled(true);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent sx={{ marginTop: "20px", padding: "20px" }}>
        {showPasswordInput ? (
          <TextField
            type="text"
            variant="outlined"
            fullWidth
            placeholder="User Name"
            size="small"
            onChange={handleInputChange}
          />
        ) : (
          <p>Are you sure you want to delete the data?</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          sx={{
            cursor:
              showPasswordInput && isDeleteDisabled ? "not-allowed" : "pointer",
          }}
          onClick={handleDelete}
          color="primary"
          disabled={showPasswordInput && isDeleteDisabled}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
Modal.propTypes = {
  setIsPopup: PropTypes.func.isRequired,
  isPopup: PropTypes.bool.isRequired,
};
export default Modal;

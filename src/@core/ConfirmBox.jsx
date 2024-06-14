import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog({ open, setOpen, setIsProceed }) {
  const handleClose = () => {
    setOpen(false);
    setIsProceed((prev) => !prev);
  };

  const handleAgree = () => {
    setIsProceed((prev) => !prev);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Previous changes will not be saved. To subscribe to this website,
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleAgree}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  setIsProceed: PropTypes.func.isRequired,
};

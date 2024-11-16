import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { format, addYears } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import axiosInstance from "../../../axiosConfigOra";

const useStyles = makeStyles((theme) => ({
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95vw",
    height: "90vh",
    backgroundColor: "white",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    overflow: "scroll",
  },
  table: {
    marginTop: theme.spacing(2),
    overflow: "scroll",
    borderRadius: "3px",
  },
  hoverRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  stripedRow: {
    backgroundColor: theme.palette.action.selected,
  },
  addRowContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
}));

const EmailDetailsAddModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const [saveLoading, setSaveLoading] = useState(false);

  const MAX_ROWS = 15;
  const INITIAL_ROWS = 5;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [rowCount, setRowCount] = useState(INITIAL_ROWS);
  const [rows, setRows] = useState(
    new Array(rowCount).fill(null).map((_, index) => ({
      id: index + 1,
      emailId: "",
      name: "",
      phone: "",
      designation: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
      sortOrder: "",
    }))
  );

  const handleAddRows = () => {
    if (rows.length > MAX_ROWS) {
      return;
    }
    const rowsToAdd = Math.min(parseInt(rowCount, 10), MAX_ROWS - rows.length);

    if (rowsToAdd <= 0) return;

    const nextId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    const newRows = new Array(rowsToAdd).fill(null).map((_, index) => ({
      id: nextId + index,
      emailId: "",
      name: "",
      phone: "",
      designation: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
      sortOrder: "",
    }));

    setRows((prevRows) => [...prevRows, ...newRows]);
  };

  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const validRows = rows
        .filter((row) => row.emailId && emailRegex.test(row.emailId))
        .map((item, index) => ({
          ...item,
          clientId: "DEMC",
          serialNumber: index + 1,
          sortOrder: item.sortOrder || "0",
        }));

      if (validRows.length > 0) {
        const response = await axiosInstance.post(
          "insertclientmasteremaildetails",
          validRows
        );

        if (response.data.updateStatus.success.length) {
          setRows(
            new Array(INITIAL_ROWS).fill(null).map((_, index) => ({
              id: index + 1,
              emailId: "",
              name: "",
              phone: "",
              designation: "",
              startDate: format(new Date(), "yyyy-MM-dd"),
              endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
              sortOrder: "",
            }))
          );
        }
      } else {
        console.log("No valid rows to save.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.modalBox}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="h2">
            Add Email Details
          </Typography>
          <IconButton onClick={() => handleClose(setRowCount(5))}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          component={"div"}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box className={classes.addRowContainer}>
            <TextField
              label="Number of Rows"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              inputProps={{ min: 1 }}
              id="rowsToAdd"
              value={rowCount}
              onChange={(e) => setRowCount(e.target.value)}
            />
            <Button variant="outlined" size="small" onClick={handleAddRows}>
              Add
            </Button>
          </Box>
          <Button variant="outlined" size="small" onClick={handleSave}>
            {saveLoading && <CircularProgress size={"1em"} />}
            Save
          </Button>
        </Typography>
        <Divider sx={{ my: 1 }} />
        <TableContainer className={classes.table}>
          <Table sx={{ overflowY: "scroll" }}>
            <TableHead>
              <TableRow>
                <TableCell>Email ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Sort Order</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  className={
                    index % 2 === 0 ? classes.stripedRow : classes.hoverRow
                  }
                >
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.emailId}
                      onChange={(e) =>
                        handleInputChange(row.id, "emailId", e.target.value)
                      }
                      InputProps={{
                        style: {
                          width: 250,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      type="email"
                      placeholder="my@gmail.com"
                      required
                      error={
                        !emailRegex.test(row.emailId) && row.emailId !== ""
                      }
                      helperText={
                        !emailRegex.test(row.emailId) && row.emailId !== ""
                          ? "Please enter a valid email"
                          : ""
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.name}
                      onChange={(e) =>
                        handleInputChange(row.id, "name", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      size="small"
                      placeholder="Name"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.phone}
                      onChange={(e) =>
                        handleInputChange(row.id, "phone", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder="1234567890"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.designation}
                      onChange={(e) =>
                        handleInputChange(row.id, "designation", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      placeholder="role"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.startDate}
                      onChange={(e) =>
                        handleInputChange(row.id, "startDate", e.target.value)
                      }
                      type="date"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.endDate}
                      onChange={(e) =>
                        handleInputChange(row.id, "endDate", e.target.value)
                      }
                      type="date"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={row.sortOrder}
                      onChange={(e) =>
                        handleInputChange(row.id, "sortOrder", e.target.value)
                      }
                      placeholder="0"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

EmailDetailsAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EmailDetailsAddModal;
